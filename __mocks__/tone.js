// Mock do pacote 'tone' para uso em testes Jest (ESM não suportado nativamente)
const mockSynth = {
  triggerAttackRelease: jest.fn(),
  connect: jest.fn(),
  toDestination: jest.fn().mockReturnThis(),
  dispose: jest.fn(),
};

const mockPlayer = {
  start: jest.fn(),
  stop: jest.fn(),
  connect: jest.fn(),
  toDestination: jest.fn().mockReturnThis(),
  dispose: jest.fn(),
  loaded: Promise.resolve(),
};

const mockTransport = {
  start: jest.fn(),
  stop: jest.fn(),
  cancel: jest.fn(),
  schedule: jest.fn(),
  scheduleRepeat: jest.fn(),
  clear: jest.fn(),
  bpm: { value: 120 },
  state: 'stopped',
};

module.exports = {
  Synth: jest.fn().mockImplementation(() => mockSynth),
  Player: jest.fn().mockImplementation(() => mockPlayer),
  Transport: mockTransport,
  getTransport: jest.fn().mockReturnValue(mockTransport),
  getContext: jest.fn().mockReturnValue({ state: 'suspended', resume: jest.fn() }),
  start: jest.fn().mockResolvedValue(undefined),
  now: jest.fn().mockReturnValue(0),
  Oscillator: jest.fn().mockImplementation(() => ({
    start: jest.fn(),
    stop: jest.fn(),
    connect: jest.fn(),
    toDestination: jest.fn().mockReturnThis(),
    frequency: { value: 440 },
    dispose: jest.fn(),
  })),
  Gain: jest.fn().mockImplementation(() => ({
    connect: jest.fn(),
    toDestination: jest.fn().mockReturnThis(),
    gain: { value: 1 },
    dispose: jest.fn(),
  })),
  Reverb: jest.fn().mockImplementation(() => ({
    connect: jest.fn(),
    toDestination: jest.fn().mockReturnThis(),
    dispose: jest.fn(),
  })),
  Filter: jest.fn().mockImplementation(() => ({
    connect: jest.fn(),
    toDestination: jest.fn().mockReturnThis(),
    dispose: jest.fn(),
  })),
  AmplitudeEnvelope: jest.fn().mockImplementation(() => ({
    triggerAttack: jest.fn(),
    triggerRelease: jest.fn(),
    connect: jest.fn(),
    toDestination: jest.fn().mockReturnThis(),
    dispose: jest.fn(),
  })),
};
