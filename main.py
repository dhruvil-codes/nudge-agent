import argparse
import sys
import readchar
from rich.console import Console
from rich.panel import Panel
from rich.table import Table

# Ensure UTF-8 output on Windows terminals
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

console = Console()

from gmail_client import (
    authenticate_gmail,
    get_my_email,
    get_sent_threads,
    get_thread,
    parse_thread,
    create_draft,
    is_thread_processed,
    record_thread_status,
    logout_gmail
)

from followup_agent import (
    should_follow_up,
    generate_followup
)


def render_welcome_splash(mode_text):
    """Renders the custom 2-column splash screen with ASCII logo, stars, and features."""
    left_content = (
        "[bold cyan]"
        "                 _            \n"
        "                | |           \n"
        " _ __  _   _  __| | __ _  ___ \n"
        "| '_ \| | | |/ _` |/ _` |/ _ \\\n"
        "| | | | |_| | (_| | (_| |  __/\n"
        "|_| |_|\__,_|\__,_|\__, |\___|\n"
        "                    __/ |     \n"
        "                   |___/      \n"
        "[/bold cyan]\n"
        "[bold white]Autonomous AI Gmail Follow-up Agent[/bold white]  |  [dim]Mode: " + mode_text + "[/dim]\n"
        "[dim cyan]built by @bydhruvil ;)[/dim cyan]\n\n"
        "[bold yellow]✨ What Nudge can do:[/bold yellow]\n"
        "[cyan]•[/cyan] Scans sent Gmail threads for unanswered emails\n"
        "[cyan]•[/cyan] Rule engine + SQLite history: skips replies & processed threads\n"
        "[cyan]•[/cyan] Multi-tone AI generator: [1] Check-in | [2] Value-Add | [3] Breakup\n"
        "[cyan]•[/cyan] Human approval: [bold green][A] Approve[/bold green] | [bold yellow][E] Edit[/bold yellow] | [cyan][L] Switch Account[/cyan] | [dim][S] Skip[/dim] | [bold red][Q] Quit[/bold red]"
    )

    right_content = (
        "\n"
        "  [yellow]✦[/yellow]   .   [bold white]*[/bold white]   [magenta]✧[/magenta]   .   [cyan]✦[/cyan]\n"
        "  .   [cyan]✦[/cyan]   ˚   .   [magenta]✦[/magenta]   [bold white]*[/bold white]\n"
        "  [magenta]✧[/magenta]   .   [bold white]*[/bold white]   [yellow]✦[/yellow]   .   [cyan]˚[/cyan]\n"
        "  [cyan]✦[/cyan]   .   [bold white]*[/bold white]   .   [magenta]✦[/magenta]   [yellow]✦[/yellow]\n"
        "  .   [magenta]✧[/magenta]   [yellow]✦[/yellow]   .   [bold white]*[/bold white]   .   [cyan]✦[/cyan]\n"
        "  [yellow]✦[/yellow]   .   [cyan]˚[/cyan]   .   [magenta]✧[/magenta]   [bold white]*[/bold white]\n"
        "  [bold white]*[/bold white]   .   [magenta]✦[/magenta]   [yellow]✦[/yellow]   .   [cyan]✦[/cyan]\n"
        "  [cyan]✦[/cyan]   .   [bold white]*[/bold white]   .   [yellow]✧[/yellow]   .   [magenta]✦[/magenta]\n"
        "  [yellow]✦[/yellow]   .   [magenta]✧[/magenta]   .   [cyan]✦[/cyan]   [bold white]*[/bold white]\n"
        "  .   [bold white]*[/bold white]   [cyan]✦[/cyan]   ˚   .   [magenta]✦[/magenta]\n"
        "  [magenta]✧[/magenta]   .   [yellow]✦[/yellow]   .   [cyan]˚[/cyan]   .   [magenta]✧[/magenta]\n"
        "  [cyan]✦[/cyan]   .   [bold white]*[/bold white]   .   [magenta]✦[/magenta]   .   [bold white]*[/bold white]"
    )

    grid = Table.grid(expand=True)
    grid.add_column(ratio=2)
    grid.add_column(ratio=1, justify="center")
    grid.add_row(left_content, right_content)

    console.print(Panel(grid, border_style="cyan", title="[bold white]NUDGE AGENT[/bold white]", title_align="left"))


def main():
    parser = argparse.ArgumentParser(description="Nudge — AI Gmail Follow-up Agent")
    parser.add_argument("--auto", action="store_true", help="Auto-approve without keypress prompts")
    parser.add_argument("--limit", type=int, default=50, help="Number of sent threads to scan")
    parser.add_argument("--login", action="store_true", help="Force re-authentication with a new Gmail account")
    parser.add_argument("--logout", action="store_true", help="Log out of current Gmail account")
    args = parser.parse_args()

    if args.logout:
        logout_gmail()
        console.print("[bold green]✓ Logged out successfully![/bold green]")
        return

    mode_text = "[yellow]Batch Auto Mode[/yellow]" if args.auto else "[cyan]Interactive Mode[/cyan]"
    
    render_welcome_splash(mode_text)

    # 1. CONNECT GMAIL
    service = authenticate_gmail(force_reauth=args.login)
    my_email = get_my_email(service)
    console.print(f"[bold green]✓ Gmail Connected as:[/bold green] [bold yellow]{my_email}[/bold yellow]  [dim](Press [bold cyan]L[/bold cyan] anytime to switch accounts)[/dim]\n")

    # 2. GET SENT THREADS
    thread_ids = get_sent_threads(service, limit=args.limit)
    console.print(f"[cyan]🔍 Scanning last {len(thread_ids)} sent threads...[/cyan]\n")

    followups_needed = 0
    drafts_created = 0

    # 3. PROCESS EACH THREAD
    for thread_id in thread_ids:
        # Check SQLite history
        if is_thread_processed(thread_id):
            continue

        raw_thread = get_thread(service, thread_id)
        thread = parse_thread(raw_thread, my_email)

        if not thread:
            continue

        # 4. DECISION ENGINE
        if not should_follow_up(thread, my_email):
            continue

        followups_needed += 1
        current_goal = "check_in"

        # 5. AI GENERATION LOOP (ALLOW REGENERATING TONES)
        while True:
            console.print(f"[magenta]🤖 Generating follow-up ({current_goal.replace('_', ' ').title()})...[/magenta]")
            followup_text = generate_followup(thread, goal=current_goal)

            # 6. DISPLAY CARD
            card_content = (
                f"[bold cyan]To:[/bold cyan] {thread['recipient']}\n"
                f"[bold cyan]Subject:[/bold cyan] {thread['subject']}\n"
                f"[bold cyan]Tone:[/bold cyan] [yellow]{current_goal.replace('_', ' ').title()}[/yellow]\n\n"
                f"[italic white]{followup_text}[/italic white]"
            )
            console.print(Panel(card_content, title="[bold yellow]Proposed Follow-up[/bold yellow]", border_style="yellow"))

            if args.auto:
                create_draft(
                    service=service,
                    thread_id=thread["thread_id"],
                    recipient=thread["recipient"],
                    subject=thread["subject"],
                    body=followup_text
                )
                record_thread_status(thread["thread_id"], "DRAFT_CREATED", thread["recipient"], thread["subject"])
                drafts_created += 1
                console.print("[bold green]✓ Draft created automatically![/bold green]\n")
                break

            console.print("Press: [bold green][A] Approve[/bold green] | [bold yellow][E] Edit[/bold yellow] | Tone: [cyan][1] Check-in[/cyan] [cyan][2] Value-Add[/cyan] [cyan][3] Breakup[/cyan] | [bold cyan][L] Switch Account[/bold cyan] | [dim][S] Skip[/dim] | [bold red][Q] Quit[/bold red]")
            key = readchar.readkey().lower()

            if key == "a":
                create_draft(
                    service=service,
                    thread_id=thread["thread_id"],
                    recipient=thread["recipient"],
                    subject=thread["subject"],
                    body=followup_text
                )
                record_thread_status(thread["thread_id"], "DRAFT_CREATED", thread["recipient"], thread["subject"])
                drafts_created += 1
                console.print("[bold green]✓ Draft created instantly![/bold green]\n")
                break

            elif key == "e":
                console.print("\n[bold yellow]📝 Type your custom follow-up (or press Enter to keep AI text):[/bold yellow]")
                custom_body = input("> ").strip()
                final_body = custom_body if custom_body else followup_text

                create_draft(
                    service=service,
                    thread_id=thread["thread_id"],
                    recipient=thread["recipient"],
                    subject=thread["subject"],
                    body=final_body
                )
                record_thread_status(thread["thread_id"], "DRAFT_CREATED", thread["recipient"], thread["subject"])
                drafts_created += 1
                console.print("[bold green]✓ Custom draft created![/bold green]\n")
                break

            elif key == "1":
                current_goal = "check_in"
                continue
            elif key == "2":
                current_goal = "value_add"
                continue
            elif key == "3":
                current_goal = "breakup"
                continue
            elif key == "l":
                console.print("\n[yellow]🔑 Switching Gmail Account...[/yellow]")
                service = authenticate_gmail(force_reauth=True)
                my_email = get_my_email(service)
                console.print(f"[bold green]✓ Switched account to:[/bold green] [bold yellow]{my_email}[/bold yellow]\n")
                break
            elif key == "q":
                console.print("\n[bold red]Exiting Nudge...[/bold red]")
                return
            else:
                record_thread_status(thread["thread_id"], "SKIPPED", thread["recipient"], thread["subject"])
                console.print("[dim]Skipped![/dim]\n")
                break

    # 7. SUMMARY REPORT
    table = Table(title="🎉 NUDGE SUMMARY REPORT", border_style="magenta")
    table.add_column("Metric", style="cyan", justify="left")
    table.add_column("Count", style="bold green", justify="right")

    table.add_row("Threads Scanned", str(len(thread_ids)))
    table.add_row("Follow-ups Needed", str(followups_needed))
    table.add_row("Drafts Created", str(drafts_created))

    console.print(table)


if __name__ == "__main__":
    main()
