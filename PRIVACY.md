# 🔒 Privacy Policy for Nudge

**Effective Date:** July 26, 2026

**Nudge** ("we", "our", or "the application") is an open-source CLI agent designed to help users manage Gmail follow-ups efficiently while respecting user privacy and data security.

---

## 1. Information Collection & Usage

Nudge requests access to your Google account using official Google OAuth 2.0 authentication. The permissions (scopes) requested include:
- `https://www.googleapis.com/auth/gmail.modify` — Used exclusively to scan your sent Gmail threads for unanswered emails and attach follow-up drafts to original email threads.
- `https://www.googleapis.com/auth/gmail.compose` — Used to create draft follow-up messages in your inbox.
- `https://www.googleapis.com/auth/gmail.readonly` — Used to inspect message headers and timestamps to evaluate follow-up rules.

---

## 2. Local Storage & Data Security

- **100% Local Processing**: Nudge runs entirely on your local machine.
- **Tokens & Credentials**: Your OAuth tokens (`token.json`), Groq API key, and SQLite execution history (`history.db`) are stored locally in your home directory (`~/.nudge/`).
- **No External Servers**: We do NOT host central servers, database logs, or analytics tracking. Your email data is never transmitted to any third party other than Google APIs and the Groq AI API (for text generation).

---

## 3. Third-Party Services

Nudge uses **Groq AI** (`llama-3.3-70b-versatile`) to generate email follow-up suggestions based on message context. The context transmitted to Groq is strictly limited to the relevant thread text required to construct the reply.

---

## 4. User Control & Data Deletion

You retain 100% control over your data at all times:
- Nudge creates **drafts only** and will never send an email automatically without your explicit manual review.
- You can revoke Nudge's access at any time via [Google Account Security Settings](https://myaccount.google.com/permissions).
- You can delete your local token and history anytime by removing the `~/.nudge/` folder on your machine or running `nudge --logout`.

---

## 5. Contact & Open Source Transparency

Nudge is open-source under the MIT License. The complete codebase can be inspected on GitHub:
👉 [github.com/dhruvil-codes/nudge-agent](https://github.com/dhruvil-codes/nudge-agent)

For inquiries, feel free to open an issue on GitHub or reach out to [@bydhruvil](https://github.com/dhruvil-codes).
