export type LabState = {
  emotional: number
  cognitive: number
  creative: number
  evolution: number
}

export const initialLabState: LabState = {
  emotional: 20,
  cognitive: 20,
  creative: 20,
  evolution: 10
}

export function updateLabState(
  state: LabState,
  updates: Partial<LabState>
): LabState {
  return {
    emotional: updates.emotional ?? state.emotional,
    cognitive: updates.cognitive ?? state.cognitive,
    creative: updates.creative ?? state.creative,
    evolution: updates.evolution ?? state.evolution
  }
}
