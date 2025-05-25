import fetch from 'node-fetch';

const webhookUrl = 'https://hooks.slack.com/services/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';

fetch(webhookUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: 'Test message from Node.js' }),
})
  .then(res => res.text())
  .then(console.log)
  .catch(console.error);
