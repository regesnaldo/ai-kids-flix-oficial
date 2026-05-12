export async function sendMessageToNexus(message: string) {
  const res = await fetch("http://localhost:3000/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message })
  });

  if (!res.ok) {
    throw new Error("Request failed");
  }

  return res.json();
}