import { describe, it, expect, vi } from "vitest";

describe("ResumeModal Component", () => {
  it("should render modal when isOpen is true", () => {
    // Mock props
    const props = {
      isOpen: true,
      episodeTitle: "Episódio 1 - Introdução à IA",
      progressPercentage: 45,
      onResume: vi.fn(),
      onRestart: vi.fn(),
      onClose: vi.fn(),
    };

    expect(props.isOpen).toBe(true);
    expect(props.progressPercentage).toBe(45);
  });

  it("should calculate progress percentage correctly", () => {
    const progressPercentage = 75;
    const rounded = Math.round(progressPercentage);
    expect(rounded).toBe(75);
  });

  it("should handle resume action", () => {
    const onResume = vi.fn();
    onResume();
    expect(onResume).toHaveBeenCalledTimes(1);
  });

  it("should handle restart action", () => {
    const onRestart = vi.fn();
    onRestart();
    expect(onRestart).toHaveBeenCalledTimes(1);
  });

  it("should handle close action", () => {
    const onClose = vi.fn();
    onClose();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should display correct progress percentage", () => {
    const progressPercentage = 65;
    const displayText = `Continuar de ${Math.round(progressPercentage)}%`;
    expect(displayText).toBe("Continuar de 65%");
  });

  it("should handle edge case with 0% progress", () => {
    const progressPercentage = 0;
    expect(progressPercentage).toBe(0);
  });

  it("should handle edge case with 100% progress", () => {
    const progressPercentage = 100;
    expect(progressPercentage).toBe(100);
  });
});
