import { useMemo } from "react";
import { type PatientRecord } from "../types";

const BIN_SIZE = 10;

export const useHeartRateDistribution = (
  patients: PatientRecord[], 
  displayIndices: Int32Array | null
) => {
  return useMemo(() => {
    if (!patients.length) return [];

    const distribution: Record<string, number> = {};

    const indicesToProcess = displayIndices 
      ? displayIndices 
      : Array.from({ length: patients.length }, (_, i) => i);

    for (let i = 0; i < indicesToProcess.length; i++) {
      const patient = patients[indicesToProcess[i]];
      const hr = patient.heartRate;

      if (typeof hr === 'number') {
        const binStart = Math.floor(hr / BIN_SIZE) * BIN_SIZE;
        const binEnd = binStart + BIN_SIZE;
        const binLabel = `${binStart}-${binEnd}`;

        if (!distribution[binLabel]) {
          distribution[binLabel] = 0;
        }
        distribution[binLabel]++;
      }
    }

    const chartData = Object.keys(distribution).map(key => ({
      range: key,
      count: distribution[key],
      sortKey: parseInt(key.split('-')[0])
    }));

    return chartData.sort((a, b) => a.sortKey - b.sortKey);
  }, [patients, displayIndices]);
};