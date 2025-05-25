# Todo Summary Assistant

A full-stack application to create, manage, and summarize your pending to-do items using a real Large Language Model (LLM) API, and post the summary to a Slack channel.

---

## Features

- Create, edit, delete personal to-do items.
- Mark todos as completed or pending.
- Generate a meaningful summary of all pending todos using an LLM API (OpenAI/Cohere/etc.).
- Send the generated summary to a Slack channel via Incoming Webhooks.
- View success or failure messages for Slack operations.

---

## Tech Stack

- Frontend: React.js
- Backend: Node.js with Express (or Java Spring Boot)
- Database: Supabase PostgreSQL (or Firebase Firestore)
- External APIs:
  - LLM API (OpenAI, Cohere, Anthropic, etc.)
  - Slack Incoming Webhooks

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- Supabase account (if using Supabase)
- Slack workspace with Incoming Webhook URL
- LLM API key (e.g., OpenAI API key)

---

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/todo-summary-assistant.git
cd todo-summary-assistant
