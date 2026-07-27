import json
import sys
from typing import Optional
from mcp.server.fastmcp import FastMCP

from gmail_client import (
    authenticate_gmail,
    get_my_email,
    get_sent_threads,
    get_thread,
    parse_thread,
    create_draft,
    is_thread_processed,
    record_thread_status,
    get_history_stats,
    get_recent_history
)
from followup_agent import (
    should_follow_up,
    generate_followup,
    ensure_groq_api_key
)

# Initialize FastMCP Server for Nudge
mcp = FastMCP("Nudge")


@mcp.tool()
def scan_unanswered_emails(limit: int = 20) -> str:
    """
    Scans recent sent Gmail threads and returns a JSON list of threads needing follow-up replies.
    
    Args:
        limit: Number of sent threads to scan (default 20).
    """
    ensure_groq_api_key()
    service = authenticate_gmail()
    my_email = get_my_email(service)
    thread_ids = get_sent_threads(service, limit=limit)

    unanswered = []

    for thread_id in thread_ids:
        if is_thread_processed(thread_id):
            continue

        raw_thread = get_thread(service, thread_id)
        thread = parse_thread(raw_thread, my_email)

        if not thread:
            continue

        if should_follow_up(thread, my_email):
            unanswered.append({
                "thread_id": thread["thread_id"],
                "subject": thread["subject"],
                "recipient": thread["recipient"],
                "message_count": len(thread["messages"]),
                "last_snippet": thread["messages"][-1]["snippet"] if thread["messages"] else ""
            })

    return json.dumps({
        "account": my_email,
        "scanned_count": len(thread_ids),
        "followup_needed_count": len(unanswered),
        "threads": unanswered
    }, indent=2)


@mcp.tool()
def generate_followup_draft(thread_id: str, tone: str = "check_in") -> str:
    """
    Generates a natural AI follow-up draft for a specific Gmail thread ID.

    Args:
        thread_id: The Gmail thread ID.
        tone: The follow-up tone. Options: 'check_in' (default), 'value_add', 'breakup'.
    """
    ensure_groq_api_key()
    service = authenticate_gmail()
    my_email = get_my_email(service)

    raw_thread = get_thread(service, thread_id)
    thread = parse_thread(raw_thread, my_email)

    if not thread:
        return json.dumps({"error": f"Thread ID {thread_id} not found or invalid."})

    valid_tone = tone.lower() if tone.lower() in ["check_in", "value_add", "breakup"] else "check_in"
    followup_text = generate_followup(thread, goal=valid_tone)

    return json.dumps({
        "thread_id": thread_id,
        "recipient": thread["recipient"],
        "subject": thread["subject"],
        "tone": valid_tone,
        "suggested_body": followup_text
    }, indent=2)


@mcp.tool()
def create_gmail_draft(thread_id: str, recipient: str, subject: str, body: str) -> str:
    """
    Attaches an approved follow-up draft directly to an existing Gmail thread and records it in SQLite history.

    Args:
        thread_id: The Gmail thread ID.
        recipient: The email address of the recipient.
        subject: The subject line for the follow-up email.
        body: The full plain text body of the follow-up draft.
    """
    service = authenticate_gmail()
    draft = create_draft(service, thread_id, recipient, subject, body)

    if not draft:
        return json.dumps({"error": "Failed to create draft in Gmail."})

    record_thread_status(thread_id, "DRAFT_CREATED", recipient, subject)

    return json.dumps({
        "success": True,
        "draft_id": draft.get("id"),
        "thread_id": thread_id,
        "recipient": recipient,
        "subject": subject
    }, indent=2)


@mcp.tool()
def get_nudge_dashboard_stats() -> str:
    """
    Retrieves Nudge SQLite analytics history, total evaluated threads, drafts created, and recent activity log.
    """
    stats = get_history_stats()
    recent = get_recent_history(limit=10)

    recent_logs = []
    for thread_id, status, recipient, subject, updated_at in recent:
        recent_logs.append({
            "thread_id": thread_id,
            "status": status,
            "recipient": recipient,
            "subject": subject,
            "timestamp": str(updated_at)
        })

    return json.dumps({
        "metrics": {
            "total_evaluated": stats["total_processed"],
            "total_drafts_created": stats["total_drafts"],
            "total_skipped": stats["total_skipped"],
            "followup_rate_percent": round((stats["total_drafts"] / stats["total_processed"] * 100), 1) if stats["total_processed"] > 0 else 0.0
        },
        "recent_activity": recent_logs
    }, indent=2)


def main():
    """CLI entrypoint to run Nudge FastMCP server."""
    if "--test" in sys.argv:
        print("Nudge MCP Server initialized successfully!")
        print("Registered MCP Tools:")
        print(" • scan_unanswered_emails")
        print(" • generate_followup_draft")
        print(" • create_gmail_draft")
        print(" • get_nudge_dashboard_stats")
        sys.exit(0)

    mcp.run()


if __name__ == "__main__":
    main()
