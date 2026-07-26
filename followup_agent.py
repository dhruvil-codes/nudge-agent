import os 
import time
from dotenv import load_dotenv
from openai import OpenAI

# Load .env from current folder, or fallback to ~/.nudge/.env
load_dotenv()
global_env = os.path.expanduser("~/.nudge/.env")
if os.path.exists(global_env):
    load_dotenv(dotenv_path=global_env)

# Check all messages in the thread. If any message came from someone other than my_email, they replied!

def recipient_has_replied(thread, my_email):
    """Return True if someone other than me have sent a message in thread"""
    for msg in thread.get("messages", []):
        sender = msg.get("sender", "").lower()
        if my_email.lower() not in sender:
            return True
    return False

def days_since_last_sent(thread):
    """Calculate days elapsed since the lasy message was sent"""
    messages = thread.get("messages", [])
    if not messages:
        return 0

    last_msg = messages[-1]

    # internalDate is Unix timestamp in ms
    last_sent_ms = last_msg.get("internalDate", 0)
    current_time = int(time.time() * 1000) 

    diff_ms = current_time - last_sent_ms
    days = diff_ms/ (1000 * 60 * 60 * 24)
    return round(days, 1)

def count_my_followups(thread, my_email):
    """Count the number of follow up messages sent by me in the thread"""
    my_msg_count = 0
    for msg in thread.get("messages", []):
        sender = msg.get("sender", "").lower()
        if my_email.lower() in sender:
            my_msg_count += 1

    # If I sent 1 email, followups = 0. If I sent 2, followups = 1.
    return max(0, my_msg_count - 1)

def should_follow_up(thread, my_email):
    """Determine if a thread requires a follow-up based on the following rules:"""
    if recipient_has_replied(thread, my_email):
        return False

    if days_since_last_sent(thread) <= 3:
        return False

    if count_my_followups(thread, my_email) >=2:
        return False

    return True


def generate_followup(thread):
    """Generate a short follow-up email using Groq"""
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("Please set GROQ_API_KEY in your .env file")

    # groq open ai compatibility endpoint

    client = OpenAI(
        base_url="https://api.groq.com/openai/v1",
        api_key= api_key
    )

    conversation_text = ""
    for msg in  thread.get("messages",[]):
        conversation_text += f"From: {msg['sender']}\nDate: {msg['date']}\nContent: {msg['snippet']}\n---\n"

    prompt = f"""You are an expert at writing concise follow-up emails that sound like they were written by a real human professional.

Your task is to read the email thread, infer the original intent, and write a natural follow-up email reply.

## Few-Shot Examples of Good Follow-ups

Example 1 (Job Application):
"Wanted to check in on the status of my application for the AI Engineer role. Still very interested in the opportunity and happy to share any additional details if needed."

Example 2 (Feedback / Product Discussion):
"Following up on our conversation regarding the search feedback. Let me know if you've had a chance to review it or if you'd like to jump on a quick call."

Example 3 (Casual / Networking):
"Hope you're doing well! Just wanted to re-connect and see if you have some time to chat this week."

## Writing Style & Rhythm

- Write 2-3 short, crisp sentences. Do NOT merge everything into one long run-on sentence.
- Sound natural, warm, and confident—like an experienced human professional, not an AI bot.
- Be politely persistent without sounding pushy or over-explaining.
- Match tone to the thread: Startup founder = concise & direct, Formal = professional, Friendly = casual.

## Hard Constraints

- Maximum 2-3 sentences.
- Do NOT include a subject line or markdown formatting.
- Do NOT repeat wording from previous emails word-for-word.
- Do NOT invent fake facts or commitments.
- Do NOT use AI clichés:
  - "I know you're busy."
  - "Just checking in."
  - "Gentle reminder."
  - "Touching base."

## Output Format

Return ONLY the plain email body text.
No markdown code blocks, no explanations, no labels.

Subject:
{thread.get("subject")}

Conversation History:
{conversation_text}
"""

    response = client.chat.completions.create(
        model = "llama-3.3-70b-versatile",
        messages = [
            {"role": "system", "content": "You are a professional email follow-up writer."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
    )

    return response.choices[0].message.content.strip()