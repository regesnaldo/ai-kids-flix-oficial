import axios from "axios";
import "dotenv/config";
import readline from "readline";
import fs from "fs";

const apiKey = process.env.MIMO_API_KEY;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function sendToAPI(messages) {
  try {
    const response = await axios.post(
      "https://api.xiaomimimo.com/v1/chat/completions",
      {
        model: "mimo-v2.5-pro",
        messages: messages
      },
      {
        headers: {
          "api-key": apiKey,
          "Content-Type": "application/json"
        }
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    return "Erro: " + (error.response?.data || error.message);
  }
}

async function chat() {
  const systemMessage = {
    role: "system",
    content: "Você é um mentor especialista em inteligência artificial, que explica tudo de forma simples, como se estivesse ensinando uma criança de 7 anos. Use exemplos do dia a dia, metáforas simples e linguagem clara."
  };
  let messages;
  if (fs.existsSync('chat-history.json')) {
    const data = fs.readFileSync('chat-history.json', 'utf8');
    messages = JSON.parse(data);
  } else {
    messages = [systemMessage];
  }
  console.log("Chat com IA Xiaomi MiMo. Digite 'exit' para sair.");
  while (true) {
    const userInput = await askQuestion("Você: ");
    if (userInput.toLowerCase() === 'exit' || userInput.toLowerCase() === 'quit') {
      rl.close();
      break;
    }
    messages.push({ role: "user", content: userInput });
    const aiResponse = await sendToAPI(messages);
    messages.push({ role: "assistant", content: aiResponse });
    console.log("IA: " + aiResponse);
    fs.writeFileSync('chat-history.json', JSON.stringify(messages, null, 2));
  }
}

chat();