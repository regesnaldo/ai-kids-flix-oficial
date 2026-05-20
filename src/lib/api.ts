export async function sendMessageToNexus(message: string): Promise<{ response: string }> {
  const res = await fetch("/api/chat", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, agentId: "nexus" }),
  });

  if (!res.ok) {
    throw new Error("Erro ao enviar mensagem para NEXUS");
  }

  return res.json();
}
