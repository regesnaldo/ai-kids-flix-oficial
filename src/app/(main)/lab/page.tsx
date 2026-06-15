import { Inter } from "next/font/google";
import { getAgents } from "@/services/agent.service";
import { getTopics } from "@/services/topic.service";
import { LabPageClient } from "./LabPageClient";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function LabPage() {
  const agents = getAgents();
  const topics = getTopics();

  return (
    <div className={`${inter.variable}`} style={{ fontFamily: "var(--font-inter)" }}>
      <LabPageClient agents={agents} topics={topics} />
    </div>
  );
}
