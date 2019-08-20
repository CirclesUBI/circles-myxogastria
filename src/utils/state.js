export function ensureSafeAddress(safeState) {
  return safeState.address || safeState.addressPredicted || null;
}
