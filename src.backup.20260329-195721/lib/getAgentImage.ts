export const getAgentImage = (name: string): string => {
  return `/agents/${name.toLowerCase()}.png`;
};
