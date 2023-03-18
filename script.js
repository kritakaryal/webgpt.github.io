const API_URL = 'https://api.openai.com/v1/engine/davinci-codex/completions';

// Fetch API key from environment secret in GitHub
const API_KEY = process.env.API_KEY;

// Retrieve HTML elements
const promptInput = document.getElementById('prompt-input');
const maxTokensInput = document.getElementById('max-tokens-input');
const temperatureInput = document.getElementById('temperature-input');
const topPInput = document.getElementById('top-p-input');
const submitButton = document.getElementById('submit-button');
const responseContainer = document.getElementById('response-container');
const historyContainer = document.getElementById('history-container');
const copyButton = document.getElementById('copy-button');

// Initialize history array
let history = [];

// Add event listener to submit button
submitButton.addEventListener('click', async () => {
  // Retrieve user input values
  const prompt = promptInput.value;
  const maxTokens = maxTokensInput.value;
  const temperature = temperatureInput.value;
  const topP = topPInput.value;

  // Construct request body
  const requestBody = {
    prompt: prompt,
    max_tokens: maxTokens,
    temperature: temperature,
    top_p: topP
  };

  // Construct request headers
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`
  };

  // Send POST request to OpenAI API
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(requestBody)
  });

  // Parse response body
  const responseBody = await response.json();

  // Display response
  const responseHTML = `<p>${responseBody.choices[0].text}</p>`;
  responseContainer.innerHTML = responseHTML;

  // Add request and response to history array
  const historyItem = { request: requestBody, response: responseBody };
  history.push(historyItem);

  // Update history container
  let historyHTML = '';
  for (let i = 0; i < history.length; i++) {
    historyHTML += `<div><h4>Request ${i + 1}</h4><pre>${JSON.stringify(history[i].request, null, 2)}</pre><h4>Response ${i + 1}</h4><pre>${JSON.stringify(history[i].response, null, 2)}</pre></div>`;
  }
  historyContainer.innerHTML = historyHTML;

  // Enable copy button
  copyButton.disabled = false;
});

// Add event listener to copy button
copyButton.addEventListener('click', () => {
  // Create textarea element
  const textarea = document.createElement('textarea');
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'absolute';
  textarea.style.left = '-9999px';
  textarea.value = JSON.stringify(history, null, 2);
  document.body.appendChild(textarea);

  // Select and copy text
  textarea.select();
  document.execCommand('copy');

  // Remove textarea element
  document.body.removeChild(textarea);
});
