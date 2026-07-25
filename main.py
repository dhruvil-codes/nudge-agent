from gmail_client import(
    authenticate_gmail,
    get_my_email,
    get_sent_threads,
    get_thread,
    parse_thread,
    create_draft
)

from followup_agent import(
    should_follow_up,
    generate_followup,   
)

def main():
    print("=" * 50)
    print(" 🚀 NUDGE — AI Gmail Follow-up Agent")
    print("=" * 50)

    # 1. CONNECT GMAIL
    service = authenticate_gmail()
    my_email = get_my_email(service)
    print(f"✅ Gmail Connected as{my_email}\n")

    # 2. GET SENT THREADS
    thread_ids = get_sent_threads(service, limit=50)
    print(f"🔍 Scanning last {len(thread_ids)} sent threads...\n")

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

        print("🤖 Generating follow-up with Groq AI...")
        followup_text = generate_followup(thread)

    # 6. DISPLAY & HUMAN APPROVAL

        print("-" * 50)
        print(f"To:      {thread['recipient']}")
        print(f"Subject: {thread['subject']}")
        print("\nProposed Follow-up:")
        print(followup_text)
        print("-" * 50)
        action = input("[A] Approve & Create Draft | [S] Skip: ").strip().lower()
        if action == "a":
            create_draft(
                service=service,
                thread_id=thread["thread_id"],
                recipient=thread["recipient"],
                subject=thread["subject"],
                body=followup_text
            )
            drafts_created += 1
            print("✓ Gmail draft created!\n")
        else:
            print("Skipped.\n")

    # 7. SUMMARY REPORT

    print("=" * 50)
    print("🎉 NUDGE COMPLETE")
    print(f"Threads scanned:   {len(thread_ids)}")
    print(f"Follow-ups needed: {followups_needed}")
    print(f"Drafts created:    {drafts_created}")
    print("=" * 50)
    
if __name__ == "__main__":
    main()
