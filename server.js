import express from 'express';
import "dotenv/config";
import axios from 'axios';
import fs from 'fs';

const app = express();
app.use(express.json());

const apiKey = process.env.MIMO_API_KEY;
console.log("API KEY loaded:", apiKey ? "YES" : "NO");

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

async function sendToAPI(messages) {
  try {
    console.log("Sending request to MiMo API...");
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
    console.log("API response received:", response.data);
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("API ERROR:", error.response?.data || error.message);
    return "Erro: " + (error.response?.data || error.message);
  }
}

app.post('/chat', async (req, res) => {
  console.log("REQ BODY:", req.body);
  const userMessage = req.body?.message;
  console.log("Mensagem recebida:", userMessage);
  if (!userMessage || userMessage.trim().length === 0) {
    return res.status(400).json({ error: "Mensagem inválida" });
  }
  messages.push({ role: "user", content: userMessage });
  const aiResponse = await sendToAPI(messages);
  messages.push({ role: "assistant", content: aiResponse });
  fs.writeFileSync('chat-history.json', JSON.stringify(messages, null, 2));
  res.json({ reply: aiResponse });
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});