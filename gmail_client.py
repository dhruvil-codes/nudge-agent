import base64
from email import generator
import os.path 
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
import base64
from email.message import EmailMessage

SCOPES = ["https://www.googleapis.com/auth/gmail.modify"] 
#TODO: Add more scopes as needed

def authenticate_gmail():
    creds = None
    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file("token.json", SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file("credentials.json", SCOPES)
            creds = flow.run_local_server(port=0)

    with open("token.json", "w") as token:
        token.write(creds.to_json())    
        
    return build("gmail", "v1", credentials=creds)

def get_my_email(service):
    """Fetch the authenticated user's email address"""
    profile = service.users().getProfile(userId = "me").execute()
    return profile["emailAddress"]

def get_sent_threads(service, limit=50):
    """Fetch the last 'limit' thread IDs from Gmail SENT folder"""
    response = service.users().threads().list(userId= "me", q ="in:sent", maxResults = limit).execute()
    threads = response.get("threads", [])
    return [t['id'] for t in threads]

def get_thread(service, thread_id):
    """Fetch all messages inside a single thread by its ID"""
    return service.users().threads().get(userId = "me", id = thread_id, format="full").execute()


# # ✅ THIS IS WHAT GMAIL ACTUALLY RETURNS:
# headers = [
#     {"name": "From", "value": "dhruvilmistry16@gmail.com"},
#     {"name": "To", "value": "ankita@company.com"},
#     {"name": "Subject", "value": "AI Engineer Application"},
#     {"name": "Date", "value": "Thu, 24 Jul 2026 10:00:00 GMT"}
# ]

# thats why we are using this to loop through the string and get the header

def _get_header(headers, name):
    """Helper to find a specific header value like 'Subject' or 'From'."""
    for header in headers:
        if header.get("name","").lower() == name.lower():
            return header.get("value", "")
    return "" #Return empty string if header not found


def parse_thread(thread, my_email):
    """Extract clean thread details: subject, recipient and message history"""
    messages = thread.get("messages", [])
    if not messages:
        return None
    
    #Finds the first message in the conversation.
    #Pulling out the Subject line and the recipient's To email address.
    first_msg_headers = messages[0].get("payload", {}).get("headers", [])
    subject = _get_header(first_msg_headers, "Subject") or "(No Subject)"
    to_add = _get_header(first_msg_headers, "To")

    # Determine who is the recipient (the one who is not me)

    #Loops through all replies (for msg in messages:):
    parse_messages = []
    for msg in messages:
        headers = msg.get("payload", {}).get("headers", [])
        parse_messages.append({
            "sender": _get_header(headers, "From"),
            "date": _get_header(headers, "Date"),
            "snippet": msg.get("snippet", ""),
            "internalDate": int(msg.get("internalDate", 0))  # timestamp in ms
        })

    #Returns a clean, ready-to-use dictionary:
    return {
        "thread_id": thread["id"],
        "subject": subject,
        "recipient": to_add,
        "messages": parse_messages
    }


def create_draft(service, thread_id, recipient, subject, body):
    """Create a draft reply inside an existing Gmail thread"""
    message = EmailMessage()
    message["To"] = recipient

    # Ensure subject starts with "Re:"
    if not subject.lower().startswith("re:"):
        subject = f"Re: {subject}"
    message["Subject"] = subject

    message.set_content(body)

    # Encode message to base64url string
    raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode("utf-8")

    draft_body = {
        "message": {
            "threadId": thread_id,
            "raw": raw_message
        }
    }
    
    try:
        draft = service.users().drafts().create(userId="me", body=draft_body).execute()
        print(f"Draft created for thread {thread_id}")
        return draft
    except Exception as e:
        print(f"Error creating draft: {e}")
        return None    


if __name__ == "__main__":
    service = authenticate_gmail()
    print("Gmail Connected Successfully\n")

    my_email = get_my_email(service)
    threads = get_sent_threads(service, limit=3)

    #     Takes each thread_id from your sent box.
    #     Calls get_thread() to fetch Google's raw data.
    #     Passes raw_thread to parse_thread() to clean it up into data.
    #     Prints:
    #       data['subject']: The subject of the conversation.
    #       data['recipient']: Who you sent it to.
    #       len(data['messages']): How many messages are in the conversation.
    #       data['messages'][-1]['snippet']: [-1] gets the most recent message in the thread and prints its preview snippet!
    for thread_id in threads:
        raw_thread = get_thread(service, thread_id)
        data = parse_thread(raw_thread, my_email)
            
        print(f"Subject: {data['subject']}")
        print(f"To: {data['recipient']}")
        print(f"Message Count: {len(data['messages'])}")
        print(f"Snippet: {data['messages'][-1]['snippet']}")
        print("-" * 40)