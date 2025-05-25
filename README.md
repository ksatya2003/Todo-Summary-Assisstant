
# Todo Summary Assistant

Todo Summary Assistant is a full-stack application that allows users to create and manage personal to-do items, summarize all pending to-dos using a real Large Language Model (LLM) API, and send the generated summary to a Slack channel. This app showcases integration with an actual LLM and Slack Incoming Webhooks, providing an end-to-end functional experience.

---

## Features

- Create, edit, delete personal to-do items.
- Mark todos as completed or pending.
- Generate a meaningful summary of all pending todos using an LLM API Cohere
- Send the generated summary to a Slack channel via Incoming Webhooks.
- View success or failure messages for Slack operations.

---

## Tech Stack

- Frontend: React.js
- Backend: Node.js with Express (or Java Spring Boot)
- Database: PostgreSQL 
- External APIs:
 LLM API: OpenAI / Cohere / Anthropic / Mistral (real API integration)
 Messaging: Slack Incoming Webhooks

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- Slack workspace with Incoming Webhook URL
- LLM API key (e.g., Cohere API key)

---
**#Environment Variables**
Create a .env file in the backend folder based on .env.example:
# LLM API settings
COHERE_API_KEY:your_Cohere_api_endpoint_here

# Slack Incoming Webhook URL
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/your/slack/webhook

# Database configuration
DATABASE_URL=your_database_connection_url
## Usage
Add, edit, and delete to-do items in the UI.
Click the "Summarize Todos" button to generate a summary using the LLM.
The summary will display automatically, and the summary will be sent to your configured Slack channel.
Success or failure notifications for the Slack message will appear.

**Slack Integration Setup**
Go to your Slack workspace.
Create a new Incoming Webhook:
Navigate to Settings & administration > Manage apps.
Search for Incoming Webhooks and add a new webhook to your channel.
Copy the webhook URL and add it to your backend .env file as SLACK_WEBHOOK_URL.
Your backend will POST the summary to this webhook URL.

LLM Integration Setup (Cohere)
Sign up for an account at https://cohere.ai/.
Go to your dashboard and generate an API key.
Copy the API key.
Add it to your backend .env file as COHERE_API_KEY.
The backend uses this key to call Cohere's API to generate meaningful summaries of your to-do items.

### Installation
```bash
git clone https://github.com/your-username/todo-summary-assistant.git
=====Frontend
cd todo
cd todo
npm run dev
=======Backend
cd todo
cd todo
cd todo-summary-server
node index.js



