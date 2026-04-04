// Mock da biblioteca Tone.js para testes Jest
module.exports = {
  getContext: jest.fn(),
  setContext: jest.fn(),
  Synth: jest.fn().mockImplementation(() => ({
    toDestination: jest.fn().mockReturnThis(),
    triggerAttackRelease: jest.fn(),
    release: jest.fn(),
  })),
  Reverb: jest.fn().mockImplementation(() => ({
    toDestination: jest.fn().mockReturnThis(),
    wet: { value: 0.5 },
  })),
  Delay: jest.fn().mockImplementation(() => ({
    toDestination: jest.fn().mockReturnThis(),
    delayTime: { value: 0.5 },
  })),
  Filter: jest.fn().mockImplementation(() => ({
    toDestination: jest.fn().mockReturnThis(),
    frequency: { value: 1000 },
  })),
  Volume: jest.fn().mockImplementation(() => ({
    toDestination: jest.fn().mockReturnThis(),
    volume: { value: -10 },
  })),
  Destination: {
    volume: { value: 0 },
  },
  start: jest.fn(),
};
