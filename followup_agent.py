from googleapiclient import model
from openai.types.conversations import conversation
from openai import api_key
import os 
from dotenv import load_dotenv
from openai import OpenAI
from email import message
import time

load_dotenv()

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

    prompt = f"""You are an email follow-up assistant.
Understand why I originally contacted this person based on the conversation below.
Write a short, natural, and professional follow-up email reply.
Rules:
- Maximum 2-4 sentences.
- Don't repeat the original email word-for-word.
- Don't invent fake facts.
- Keep it casual but professional.
- Don't sound like generic AI.
- Don't say "I know you're busy."
- Don't include a Subject line.
- Output ONLY the email body text.
Subject: {thread.get('subject')}
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