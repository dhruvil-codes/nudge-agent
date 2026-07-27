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
    logout_gmail,
    get_history_stats,
    get_recent_history
)

from followup_agent import (
    should_follow_up,
    generate_followup,
    ensure_groq_api_key
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
    )

    grid = Table.grid(expand=True)
    grid.add_column(ratio=2)
    grid.add_column(ratio=1, justify="center")
    grid.add_row(left_content, right_content)

    console.print(Panel(grid, border_style="cyan", title="[bold white]NUDGE AGENT[/bold white]", title_align="left"))


def render_dashboard(my_email=None):
    """Renders a rich TUI analytics dashboard showing total processed threads and recent activity."""
    stats = get_history_stats()
    recent_rows = get_recent_history(limit=8)

    total = stats["total_processed"]
    drafts = stats["total_drafts"]
    skipped = stats["total_skipped"]
    rate = round((drafts / total * 100), 1) if total > 0 else 0.0

    account_str = f"Account: [bold yellow]{my_email}[/bold yellow]" if my_email else "Database: [bold yellow]~/.nudge/history.db[/bold yellow]"
    header_panel = Panel(
        f"[bold cyan]📊 NUDGE ANALYTICS DASHBOARD[/bold cyan]  │  {account_str}\n"
        f"[dim]Real-time tracking from SQLite local store[/dim]",
        border_style="cyan"
    )
    console.print(header_panel)

    metrics_table = Table(expand=True, border_style="dim", box=None)
    metrics_table.add_column("Total Evaluated", justify="center", style="bold white")
    metrics_table.add_column("Drafts Created", justify="center", style="bold green")
    metrics_table.add_column("Threads Skipped", justify="center", style="dim yellow")
    metrics_table.add_column("Follow-up Rate", justify="center", style="bold cyan")

    metrics_table.add_row(
        str(total),
        f"✨ {drafts}",
        f"⏭  {skipped}",
        f"📈 {rate}%"
    )
    console.print(Panel(metrics_table, title="[bold white]Overview Metrics[/bold white]", border_style="magenta"))

    act_table = Table(expand=True, border_style="magenta", title="[bold white]Recent Activity Log[/bold white]")
    act_table.add_column("Timestamp", style="dim", width=20)
    act_table.add_column("Status", justify="center", width=16)
    act_table.add_column("Recipient", style="cyan", width=25)
    act_table.add_column("Subject", style="white")

    if not recent_rows:
        act_table.add_row("-", "[dim]No activity recorded yet[/dim]", "-", "-")
    else:
        for thread_id, status, recipient, subject, updated_at in recent_rows:
            status_fmt = "[bold green]DRAFT CREATED[/bold green]" if status == "DRAFT_CREATED" else "[dim yellow]SKIPPED[/dim yellow]"
            rec_clean = (recipient[:22] + "...") if len(recipient) > 25 else recipient
            subj_clean = (subject[:40] + "...") if len(subject) > 43 else subject
            act_table.add_row(str(updated_at)[:19], status_fmt, rec_clean or "-", subj_clean or "-")

    console.print(act_table)


def main():
    parser = argparse.ArgumentParser(description="Nudge — AI Gmail Follow-up Agent")
    parser.add_argument("--auto", action="store_true", help="Auto-approve without keypress prompts")
    parser.add_argument("--limit", type=int, default=50, help="Number of sent threads to scan")
    parser.add_argument("--login", action="store_true", help="Force re-authentication with a new Gmail account")
    parser.add_argument("--logout", action="store_true", help="Log out of current Gmail account")
    parser.add_argument("--dashboard", "--stats", action="store_true", help="Show Nudge analytics dashboard & activity history")
    args = parser.parse_args()

    if args.logout:
        logout_gmail()
        console.print("[bold green]✓ Logged out successfully![/bold green]")
        return

    if args.dashboard:
        try:
            service = authenticate_gmail()
            my_email = get_my_email(service)
        except Exception:
            my_email = None
        render_dashboard(my_email)
        return

    mode_text = "[yellow]Batch Auto Mode[/yellow]" if args.auto else "[cyan]Interactive Mode[/cyan]"
    
    render_welcome_splash(mode_text)

    # 1. ENSURE GROQ API KEY
    ensure_groq_api_key()

    # 2. CONNECT GMAIL
    service = authenticate_gmail(force_reauth=args.login)

    while True:
        my_email = get_my_email(service)
        console.print(f"[bold green]✓ Gmail Connected as:[/bold green] [bold yellow]{my_email}[/bold yellow]  [dim](Press [bold cyan]L[/bold cyan] anytime to switch accounts)[/dim]\n")

        # 3. GET SENT THREADS
        thread_ids = get_sent_threads(service, limit=args.limit)
        console.print(f"[cyan]🔍 Scanning last {len(thread_ids)} sent threads...[/cyan]\n")

        followups_needed = 0
        drafts_created = 0
        user_requested_account_switch = False

        # 4. PROCESS EACH THREAD
        for thread_id in thread_ids:
            # Check SQLite history
            if is_thread_processed(thread_id):
                continue

            raw_thread = get_thread(service, thread_id)
            thread = parse_thread(raw_thread, my_email)

            if not thread:
                continue

            # DECISION ENGINE
            if not should_follow_up(thread, my_email):
                continue

            followups_needed += 1
            current_goal = "check_in"

            # AI GENERATION LOOP (ALLOW REGENERATING TONES)
            while True:
                console.print(f"[magenta]🤖 Generating follow-up ({current_goal.replace('_', ' ').title()})...[/magenta]")
                followup_text = generate_followup(thread, goal=current_goal)

                # DISPLAY CARD
                card_content = (
                    f"[bold cyan]To:[/bold cyan] {thread['recipient']}\n"
                    f"[bold cyan]Subject:[/bold cyan] {thread['subject']}\n"
                    f"[bold cyan]Tone:[/bold cyan] {current_goal.replace('_', ' ').title()}\n\n"
                    f"{followup_text}"
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
                try:
                    key = readchar.readkey().lower()
                except (KeyboardInterrupt, EOFError):
                    console.print("\n[bold red]Exiting Nudge...[/bold red]")
                    return

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
                    logout_gmail()
                    service = authenticate_gmail(force_reauth=True)
                    user_requested_account_switch = True
                    break
                elif key == "q":
                    console.print("\n[bold red]Exiting Nudge...[/bold red]")
                    return
                else:
                    record_thread_status(thread["thread_id"], "SKIPPED", thread["recipient"], thread["subject"])
                    console.print("[dim]Skipped![/dim]\n")
                    break

            if user_requested_account_switch:
                break

        if user_requested_account_switch:
            continue

        # 5. SUMMARY REPORT
        table = Table(title="🎉 NUDGE SUMMARY REPORT", border_style="magenta")
        table.add_column("Metric", style="cyan", justify="left")
        table.add_column("Count", style="bold green", justify="right")

        table.add_row("Threads Scanned", str(len(thread_ids)))
        table.add_row("Follow-ups Needed", str(followups_needed))
        table.add_row("Drafts Created", str(drafts_created))

        console.print(table)

        if args.auto:
            return

        console.print("\nPress: [bold magenta][D] Dashboard[/bold magenta] | [bold cyan][L] Switch Account[/bold cyan] | [bold green][R] Rescan Inbox[/bold green] | [bold red][Q] Quit[/bold red]")
        try:
            post_key = readchar.readkey().lower()
        except (KeyboardInterrupt, EOFError):
            console.print("\n[bold red]Exiting Nudge...[/bold red]")
            return

        if post_key == "d":
            console.print("")
            render_dashboard(my_email)
            console.print("\nPress: [bold cyan][L] Switch Account[/bold cyan] | [bold green][R] Rescan Inbox[/bold green] | [bold red][Q] Quit[/bold red]")
            try:
                post_key2 = readchar.readkey().lower()
            except (KeyboardInterrupt, EOFError):
                console.print("\n[bold red]Exiting Nudge...[/bold red]")
                return
            if post_key2 == "l":
                console.print("\n[yellow]🔑 Switching Gmail Account...[/yellow]")
                logout_gmail()
                service = authenticate_gmail(force_reauth=True)
                continue
            elif post_key2 == "r":
                console.print("\n[cyan]🔄 Rescanning Inbox...[/cyan]\n")
                continue
            else:
                console.print("\n[bold red]Exiting Nudge...[/bold red]")
                return
        elif post_key == "l":
            console.print("\n[yellow]🔑 Switching Gmail Account...[/yellow]")
            logout_gmail()
            service = authenticate_gmail(force_reauth=True)
            continue
        elif post_key == "r":
            console.print("\n[cyan]🔄 Rescanning Inbox...[/cyan]\n")
            continue
        elif post_key == "q":
            console.print("\n[bold red]Exiting Nudge...[/bold red]")
            return
        else:
            console.print("\n[bold red]Exiting Nudge...[/bold red]")
            return


if __name__ == "__main__":
    main()
