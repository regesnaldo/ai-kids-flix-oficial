/**
 * Testes unitários do Tree of Thoughts (ToT)
 * Cobrem apenas funções puras — sem chamadas à API.
 */

import { describe, expect, it } from "@jest/globals";
import { selecionarMelhorCaminho, injetarToTNoSystem } from "@/engine/tot";
import type { CaminhoToT, ResultadoToT } from "@/engine/tot";

const CAMINHOS_MOCK: CaminhoToT[] = [
  { tipo: "emocional", raciocinio: "Acolher o medo antes de oferecer solução", confianca: 60 },
  { tipo: "logico",    raciocinio: "Mapear o problema passo a passo",          confianca: 75 },
  { tipo: "criativo",  raciocinio: "Propor analogia inesperada para abrir mente", confianca: 55 },
];

describe("selecionarMelhorCaminho", () => {
  it("prioriza arquétipo do usuário (analitico → logico)", () => {
    const resultado = selecionarMelhorCaminho(CAMINHOS_MOCK, "analitico", "philosophical");
    expect(resultado.tipo).toBe("logico");
  });

  it("prioriza arquétipo do usuário (empatico → emocional)", () => {
    const resultado = selecionarMelhorCaminho(CAMINHOS_MOCK, "empatico", "intellectual");
    expect(resultado.tipo).toBe("emocional");
  });

  it("prioriza arquétipo do usuário (criativo → criativo)", () => {
    const resultado = selecionarMelhorCaminho(CAMINHOS_MOCK, "criativo", "philosophical");
    expect(resultado.tipo).toBe("criativo");
  });

  it("usa dimensão do agente quando não há arquétipo", () => {
    const resultado = selecionarMelhorCaminho(CAMINHOS_MOCK, null, "emotional");
    expect(resultado.tipo).toBe("emocional");
  });

  it("usa maior confiança como fallback final", () => {
    const resultado = selecionarMelhorCaminho(CAMINHOS_MOCK, null, undefined);
    // logico tem confianca 75, maior dos três
    expect(resultado.tipo).toBe("logico");
  });

  it("funciona com arquétipo paralisado → emocional", () => {
    const resultado = selecionarMelhorCaminho(CAMINHOS_MOCK, "paralisado");
    expect(resultado.tipo).toBe("emocional");
  });

  it("funciona com arquétipo rebelde → criativo", () => {
    const resultado = selecionarMelhorCaminho(CAMINHOS_MOCK, "rebelde");
    expect(resultado.tipo).toBe("criativo");
  });
});

describe("injetarToTNoSystem", () => {
  it("injeta bloco antes do system prompt original", () => {
    const resultado: ResultadoToT = {
      caminhoEscolhido: CAMINHOS_MOCK[1],
      todosCaminhos: CAMINHOS_MOCK,
    };
    const systemOriginal = "Você é o agente NEXUS.";
    const systemFinal = injetarToTNoSystem(systemOriginal, resultado);

    expect(systemFinal).toContain("[Raciocínio interno");
    expect(systemFinal).toContain("LOGICO");
    expect(systemFinal).toContain("Mapear o problema passo a passo");
    expect(systemFinal).toContain("NÃO mencione isso ao usuário");
    // System original deve vir logo após o bloco
    expect(systemFinal.endsWith(systemOriginal)).toBe(true);
  });

  it("não duplica o system original", () => {
    const resultado: ResultadoToT = {
      caminhoEscolhido: CAMINHOS_MOCK[0],
      todosCaminhos: CAMINHOS_MOCK,
    };
    const systemOriginal = "Você é o agente VOLT.";
    const systemFinal = injetarToTNoSystem(systemOriginal, resultado);
    const ocorrencias = systemFinal.split(systemOriginal).length - 1;
    expect(ocorrencias).toBe(1);
  });
});
