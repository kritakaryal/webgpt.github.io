const message = document.getElementById('message');
const historyList = document.getElementById('history-list');
const copyBtn = document.getElementById('copy-btn');

const API_KEY = process.env.API_KEY;

const GPT_API_URL = 'https://api.openai.com/v1/engine/davinci-codex/completions';

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${process.env.API_KEY}`,
};

const prompt = {
  prompt: 'Hello, how are you?',
  temperature: 0.7,
  max_tokens: 300,
  n: 1,
  stream: false,
  stop: '\n',
};

message.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    getResponse();
  }
});

async function getResponse() {
  const input = message.value.trim();

  if (!input) {
    return;
  }

  message.value = '';
  message.focus();

  const data = {
    ...prompt,
    prompt: `${prompt.prompt} ${input}`,
  };

  const response = await axios.post(GPT_API_URL, data, { headers });

  const answer = response.data.choices[0].text.trim();

  const historyItem = document.createElement('li');
  historyItem.innerHTML = `
    <span>${input}</span>
    <i class="fas fa-long-arrow-alt-right"></i>
    <span>${answer}</span>
    <button class="copy-btn" data-answer="${answer}">Copy</button>
  `;
  historyList.insertBefore(historyItem, historyList.firstChild);

  copyBtn.disabled = false;

  copyBtn.addEventListener('click', () => {
    const text = historyItem.querySelector('span:last-child').innerText;
    navigator.clipboard.writeText(text);
    copyBtn.innerText = 'Copied!';
  });
}
