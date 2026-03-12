/**
 * Valida se uma string é um hexadecimal válido (3 ou 6 dígitos, com #)
 */
export const isValidHex = (color: string): boolean => {
  if (!color) return false;
  return /^#([0-9A-F]{3}){1,2}$/i.test(color);
};

/**
 * Clareia uma cor hexadecimal em uma porcentagem (0-100)
 * Retorna a cor clareada em hexadecimal ou uma cor fallback (#f0f0f0) se inválida.
 */
export const lightenColor = (hex: string, percent: number): string => {
  if (!isValidHex(hex)) return '#f0f0f0';

  // Converte para RGB
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);

  // Clareia
  r = Math.min(255, r + (255 - r) * (percent / 100));
  g = Math.min(255, g + (255 - g) * (percent / 100));
  b = Math.min(255, b + (255 - b) * (percent / 100));

  // Converte de volta para hex
  return `#${((1 << 24) + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b)).toString(16).slice(1)}`;
};

/**
 * Cor primária padrão (azul) usada quando a cor do agente é inválida.
 */
export const DEFAULT_PRIMARY_COLOR = '#3b82f6';
