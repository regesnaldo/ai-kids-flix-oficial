import { describe, it, expect } from "vitest";
import { EPISODES } from "@/data/episodes";

describe("EpisodePlayer", () => {
  it("should have Episode 1 data loaded", () => {
    const episode = EPISODES.episode_1;
    expect(episode).toBeDefined();
    expect(episode.id).toBe("episode_1");
    expect(episode.title).toBe("O Algoritmo Perdido");
    expect(episode.concept).toBe("Qualidade de Dados");
  });

  it("should have complete narrative structure", () => {
    const episode = EPISODES.episode_1;
    expect(episode.introduction).toBeTruthy();
    expect(episode.problem).toBeTruthy();
    expect(episode.decision.question).toBeTruthy();
    expect(episode.decision.optionA).toBeTruthy();
    expect(episode.decision.optionB).toBeTruthy();
    expect(episode.responses.A).toBeTruthy();
    expect(episode.responses.B).toBeTruthy();
    expect(episode.learning).toBeTruthy();
  });

  it("should have proper learning message (1-2 sentences)", () => {
    const episode = EPISODES.episode_1;
    const sentences = episode.learning.split(".").filter((s) => s.trim());
    expect(sentences.length).toBeLessThanOrEqual(2);
  });

  it("should have both decision options", () => {
    const episode = EPISODES.episode_1;
    expect(episode.decision.optionA).not.toBe(episode.decision.optionB);
  });

  it("should have distinct responses for each choice", () => {
    const episode = EPISODES.episode_1;
    expect(episode.responses.A).not.toBe(episode.responses.B);
  });

  it("should have thumbnail path", () => {
    const episode = EPISODES.episode_1;
    expect(episode.thumbnail).toBeTruthy();
    expect(episode.thumbnail).toContain("/");
  });

  it("should not contain technical jargon in introduction", () => {
    const episode = EPISODES.episode_1;
    const technicalTerms = [
      "algoritmo",
      "machine learning",
      "neural",
      "tensor",
      "backpropagation",
    ];
    const intro = episode.introduction.toLowerCase();
    technicalTerms.forEach((term) => {
      expect(intro).not.toContain(term);
    });
  });

  it("should relate learning to user choice", () => {
    const episode = EPISODES.episode_1;
    expect(episode.learning).toContain("escolha");
  });

  it("should follow narrative structure: intro -> problem -> decision -> response -> learning", () => {
    const episode = EPISODES.episode_1;
    // Check that each stage has meaningful content
    expect(episode.introduction.length).toBeGreaterThan(50);
    expect(episode.problem.length).toBeGreaterThan(50);
    expect(episode.decision.question.length).toBeGreaterThan(20);
    expect(episode.responses.A.length).toBeGreaterThan(50);
    expect(episode.responses.B.length).toBeGreaterThan(50);
    expect(episode.learning.length).toBeGreaterThan(50);
  });

  it("should have universal language (accessible to 7+ years)", () => {
    const episode = EPISODES.episode_1;
    const content = `${episode.introduction} ${episode.problem} ${episode.decision.question} ${episode.learning}`;
    // Check for very complex words that might not be accessible
    const complexTerms = ["exponencial", "logarítmico", "derivada", "integral"];
    complexTerms.forEach((term) => {
      expect(content.toLowerCase()).not.toContain(term);
    });
  });
});
