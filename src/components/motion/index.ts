/**
 * ─── MOTION SYSTEM — Barrel Export ────────────────────────────────────────────
 *
 * Phase 4: Purpose-driven motion components for cinematic cognitive UI.
 */

export { QuantumLeap } from "./QuantumLeap";
export { DeepScan } from "./DeepScan";
export { SignalAcquisition } from "./SignalAcquisition";
export { EchoPulse } from "./EchoPulse";
export { MemoryEcho } from "./MemoryEcho";
export { HudMotionWrapper, ScannerRingMotion, ActionNodeMotion, ClassificationTagMotion, SignalBarsMotion, PulseBeaconMotion, GridOverlayMotion } from "./HudMotionWrapper";
export { LabMotionController } from "./LabMotionController";

// Re-export contracts
export {
  QuantumLeapProps,
  DeepScanProps,
  SignalAcquisitionProps,
  EchoPulseProps,
  MemoryEchoProps,
  TRIGGER_TO_MOTION,
  COGNITIVE_PRIORITY,
  PERFORMANCE_RULES,
  QUANTUM_LEAP_TRIGGER,
  DEEP_SCAN_TRIGGER,
  SIGNAL_ACQUISITION_TRIGGER,
  ECHO_PULSE_TRIGGER,
  MEMORY_ECHO_TRIGGER,
  checkPerformanceGate,
  validateMotionProps,
} from "./_motionContracts";
