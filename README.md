# 🚀 Nudge — Autonomous AI Gmail Follow-up Agent

[![PyPI Version](https://img.shields.io/pypi/v/nudge-agent?color=cyan&logo=pypi&logoColor=white)](https://pypi.org/project/nudge-agent)
[![Python Version](https://img.shields.io/badge/python-3.9%20%7C%203.10%20%7C%203.11%20%7C%203.12-blue?logo=python&logoColor=white)](https://pypi.org/project/nudge-agent)
[![License](https://img.shields.io/badge/license-MIT-green)](https://github.com/dhruvil-codes/nudge-agent/blob/main/LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/dhruvil-codes/nudge-agent?style=social)](https://github.com/dhruvil-codes/nudge-agent)

**Nudge** is an intelligent, zero-setup CLI agent that audits your sent Gmail threads, identifies unanswered emails, and generates short, natural human follow-up replies using **Groq AI (Llama 3.3 70B)**.

Designed for job hunters, founders, recruiters, and sales teams who want to follow up fast without writing generic AI fluff.

---

![Nudge TUI Interface](assets/nudge_tui.png)

---

## ✨ Features

- 🔑 **0-Setup Google OAuth**: No Google Cloud Console setup or `credentials.json` required! Sign in via Google in 5 seconds.
- 🗄️ **SQLite History Persistence (`~/.nudge/history.db`)**: Remembers drafted and skipped threads so you never get prompted twice for the same email.
- 📧 **Full Email MIME Context**: Reads full thread history instead of short snippets for deeply contextual follow-ups.
- 🎭 **Interactive Multi-Tone AI Generator**:
  - `[1] Check-in`: Quick, warm status update request.
  - `[2] Value-Add`: Shares project accomplishments or progress updates.
  - `[3] Breakup`: Sends a polite final note to give the recipient a low-pressure way to respond.
- 🧠 **Smart Decision Engine**:
  - Skips threads where the recipient already replied.
  - Skips threads sent `< 2 days` ago.
  - Skips threads where you've already sent `2+` follow-ups.
- ⌨️ **Single Keypress CLI Control**: Approve (`[A]`), Edit (`[E]`), Change Tone (`[1]`, `[2]`, `[3]`), Switch Account (`[L]`), Skip (`[S]`), or Quit (`[Q]`).

---

## ⚡ Instant Installation

Install Nudge globally via `pip` or `pipx`:

```bash
pip install nudge-agent
```

Then run `nudge` anywhere in your terminal:

```bash
nudge
```

---

## ⚙️ Environment Configuration

Set your **Groq API Key** in your `.env` file or export it in your terminal environment:

```bash
export GROQ_API_KEY="gsk_your_groq_api_key_here"
```

Nudge also automatically loads configuration from `~/.nudge/.env` if present.

---

## 💻 CLI Usage Options

```bash
nudge [OPTIONS]
```

| Flag | Description |
| :--- | :--- |
| `--limit <N>` | Number of sent Gmail threads to scan (Default: 50) |
| `--dashboard` | Display real-time TUI analytics dashboard & recent activity log |
| `--auto` | Auto-approve mode (creates drafts without interactive prompts) |
| `--login` | Force Google re-authentication to sign in with a new Gmail account |
| `--setup-mcp` | 1-Click Zero-Code MCP Server installer for Claude Desktop |
| `--logout` | Log out of your current Gmail account |
| `-h, --help` | Show command help and options |

---

## 🤖 Model Context Protocol (MCP) Server

Nudge includes a built-in **MCP Server** (`nudge-mcp`) allowing AI clients like **Claude Desktop**, **Cursor**, and **Antigravity IDE** to natively scan your inbox, generate follow-up drafts, and query local analytics!

### ⚡ 1-Click Zero-Code Setup:

Vibe-coders don't need to edit JSON files or touch code! Just run:

```bash
nudge --setup-mcp
```

This automatically detects your Claude Desktop installation and configures the `nudge-mcp` server! Then just restart Claude Desktop.

### Exposed MCP Tools:
- 🔍 `scan_unanswered_emails`: Scans sent Gmail threads for follow-up candidates.
- 🤖 `generate_followup_draft`: Generates multi-tone follow-up drafts (`check_in`, `value_add`, `breakup`).
- ✍️ `create_gmail_draft`: Attaches approved drafts to Gmail threads.
- 📊 `get_nudge_dashboard_stats`: Queries SQLite history metrics & recent log.

---

## 🛠 Architecture

```text
nudge/
├── main.py             # Rich TUI Orchestrator & interactive keypress approval loop
├── mcp_server.py       # FastMCP server exposing 4 AI tools for Claude/Cursor/Antigravity
├── gmail_client.py     # Gmail API authentication, MIME body parser & SQLite history DB
├── followup_agent.py   # Decision engine & Groq Llama 3.3 70B prompt generator
└── pyproject.toml      # Packaging metadata & entrypoints
```

---

## 🔒 Privacy & Security

* **Local Storage**: Your Google token (`token.json`), SQLite database (`history.db`), and local state are stored **100% locally on your computer** inside `~/.nudge/`.
* **Draft Mode Guarantee**: Nudge attaches approved replies as **drafts** inside your Gmail account so you maintain 100% control before sending.
* **Privacy Policy**: Read our complete [Privacy Policy](PRIVACY.md).

---

## 👤 Author & License

Built by [@bydhruvil](https://github.com/dhruvil-codes) ;)

Licensed under the [MIT License](LICENSE).
