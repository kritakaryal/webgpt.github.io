const apiKey = "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";
const baseUrl = "https://api.openai.com/v1/engines";

let selectedModel = "text-davinci-002";
let selectedTemperature = 0.5;
let selectedMaxTokens = 200;

const history = [];

const promptInput = document.getElementById("prompt-input");
const modelSelect = document.getElementById("model-select");
const temperatureSelect = document.getElementById("temperature-select");
const maxTokensSelect = document.getElementById("max-tokens-select");
const chatHistory = document.getElementById("chat-history");
const copyButton = document.getElementById("copy-button");

modelSelect.addEventListener("change", () => {
  selectedModel = modelSelect.value;
});

temperatureSelect.addEventListener("change", () => {
  selectedTemperature = parseFloat(temperatureSelect.value);
});

maxTokensSelect.addEventListener("change", () => {
  selectedMaxTokens = parseInt(maxTokensSelect.value);
});

const generateResponse = async (prompt) => {
  const url = ${baseUrl}/${selectedModel}/completions;
  const data = {
    prompt,
    max_tokens: selectedMaxTokens,
    temperature: selectedTemperature,
  };
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: Bearer ${apiKey},
    },
    body: JSON.stringify(data),
  });
  const result = await response.json();
  const chatResponse = result.choices[0].text.trim();
  history.push({
    prompt,
    chatResponse,
    selectedModel,
    selectedTemperature,
    selectedMaxTokens,
  });
  chatHistory.innerHTML = "";
  history.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = ${index + 1}. ${item.prompt} - ${item.chatResponse};
    const copyButton = document.createElement("button");
    copyButton.innerHTML = "Copy";
    copyButton.addEventListener("click", () => {
      navigator.clipboard.writeText(item.chatResponse);
    });
    li.appendChild(copyButton);
    chatHistory.appendChild(li);
  });
  return chatResponse;
};

promptInput.addEventListener("keyup", async (e) => {
  if (e.key === "Enter") {
    const prompt = promptInput.value;
    const chatResponse = await generateResponse(prompt);
    promptInput.value = "";
    promptInput.focus();
  }
});

copyButton.addEventListener("click", () => {
  const lastResponse = history[history.length - 1]?.chatResponse;
  if (lastResponse) {
    navigator.clipboard.writeText(lastResponse);
  }
});