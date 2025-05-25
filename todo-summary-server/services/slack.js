import fetch from 'node-fetch';
import 'dotenv/config';

const slackUrl = process.env.SLACK_WEBHOOK_URL;

export async function sendToSlack(message) {
  if (!slackUrl) {
    console.warn('⚠️ Slack webhook URL not configured.');
    return false;
  }

  try {
    const res = await fetch(slackUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message }),
      timeout: 2000 ,
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('Slack error:', text);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Slack send error:', error.message);
    return false;
  }
}
