import argparse
import readchar
import sys

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
    parser = argparse.ArgumentParser(description="Nudge — AI Gmail Follow-up Agent")
    parser.add_argument("--auto", action="store_true", help="Auto-approve without keypress prompts")
    parser.add_argument("--limit", type = int, default=50, help="Number of sent threads to scan")
    args = parser.parse_args()
    print("=" * 50)
    print(" 🚀 NUDGE — AI Gmail Follow-up Agent")
    print("=" * 50)

    # 1. CONNECT GMAIL
    service = authenticate_gmail()
    my_email = get_my_email(service)
    print(f"✅ Gmail Connected as{my_email}\n")

    # 2. GET SENT THREADS
    thread_ids = get_sent_threads(service, limit=args.limit)
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

        if args.auto:
            create_draft(
                service=service,
                thread_id=thread["thread_id"],
                recipient=thread["recipient"],
                subject=thread["subject"],
                body=followup_text
            )
            drafts_created += 1
            print("✓ Draft created automatically!\n")
        else:
            print("Press: [A] Approve Draft | [S] Skip | [E] Edit Text | [Q] Quit")
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
                print("✓ Draft created instantly!\n")
            
            elif key == "e":
                print("\n📝 Type your custom follow-up (or press Enter to keep AI text):")

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
                print("✓ Custom draft created!\n")

            elif key == "q":
                print("\nExiting Nudge...")
                break
            else:
                print("Skipped!\n")

    # 7. SUMMARY REPORT

    print("=" * 50)
    print("🎉 NUDGE COMPLETE")
    print(f"Threads scanned:   {len(thread_ids)}")
    print(f"Follow-ups needed: {followups_needed}")
    print(f"Drafts created:    {drafts_created}")
    print("=" * 50)

if __name__ == "__main__":
    main()
