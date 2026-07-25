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
    create_draft
)

from followup_agent import (
    should_follow_up,
    generate_followup
)


BANNER_ART = r"""
                 _            
                | |           
 _ __  _   _  __| | __ _  ___ 
| '_ \| | | |/ _` |/ _` |/ _ \
| | | | |_| | (_| | (_| |  __/
|_| |_|\__,_|\__,_|\__, |\___|
                    __/ |     
                   |___/      
"""


def main():
    parser = argparse.ArgumentParser(description="Nudge — AI Gmail Follow-up Agent")
    parser.add_argument("--auto", action="store_true", help="Auto-approve without keypress prompts")
    parser.add_argument("--limit", type=int, default=50, help="Number of sent threads to scan")
    args = parser.parse_args()

    mode_text = "[yellow]Batch Auto Mode[/yellow]" if args.auto else "[cyan]Interactive Mode[/cyan]"
    
    console.print(f"[bold cyan]{BANNER_ART}[/bold cyan]")
    console.print(
        Panel.fit(
            f"[bold white]AI Gmail Follow-up Agent[/bold white] | [dim]Mode: {mode_text}[/dim]",
            border_style="cyan"
        )
    )

    # 1. CONNECT GMAIL
    service = authenticate_gmail()
    my_email = get_my_email(service)
    console.print(f"[bold green]✓ Gmail Connected as:[/bold green] [bold yellow]{my_email}[/bold yellow]\n")

    # 2. GET SENT THREADS
    thread_ids = get_sent_threads(service, limit=args.limit)
    console.print(f"[cyan]🔍 Scanning last {len(thread_ids)} sent threads...[/cyan]\n")

    followups_needed = 0
    drafts_created = 0

    # 3. PROCESS EACH THREAD
    for thread_id in thread_ids:
        raw_thread = get_thread(service, thread_id)
        thread = parse_thread(raw_thread, my_email)

        if not thread:
            continue

        # 4. DECISION ENGINE
        if not should_follow_up(thread, my_email):
            continue

        followups_needed += 1

        # 5. AI GENERATION
        console.print("[magenta]🤖 Generating follow-up with Groq AI...[/magenta]")
        followup_text = generate_followup(thread)

        # 6. DISPLAY & HUMAN APPROVAL
        card_content = (
            f"[bold cyan]To:[/bold cyan] {thread['recipient']}\n"
            f"[bold cyan]Subject:[/bold cyan] {thread['subject']}\n\n"
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
            drafts_created += 1
            console.print("[bold green]✓ Draft created automatically![/bold green]\n")
        else:
            console.print("Press: [bold green][A] Approve[/bold green] | [bold yellow][E] Edit[/bold yellow] | [dim][S] Skip[/dim] | [bold red][Q] Quit[/bold red]")
            key = readchar.readkey().lower()

            if key == "a":
                create_draft(
                    service=service,
                    thread_id=thread["thread_id"],
                    recipient=thread["recipient"],
                    subject=thread["subject"],
                    body=followup_text
                )
                drafts_created += 1
                console.print("[bold green]✓ Draft created instantly![/bold green]\n")

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
                drafts_created += 1
                console.print("[bold green]✓ Custom draft created![/bold green]\n")

            elif key == "q":
                console.print("\n[bold red]Exiting Nudge...[/bold red]")
                break
            else:
                console.print("[dim]Skipped![/dim]\n")

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
