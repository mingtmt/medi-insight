// src/tests/useHeartRateDistribution.test.ts
import { renderHook } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { useHeartRateDistribution } from '../hooks/useHeartRateDistribution';
import { type PatientRecord } from '../types';

describe('Hook: useHeartRateDistribution', () => {
  
  test('Nên gộp đúng số lượng bệnh nhân vào các khoảng nhịp tim (BIN_SIZE = 10)', () => {
    const mockPatients: Partial<PatientRecord>[] = [
      { patientName: 'A', heartRate: 72 },
      { patientName: 'B', heartRate: 78 },
      { patientName: 'C', heartRate: 95 },
    ];

    const { result } = renderHook(() => 
      useHeartRateDistribution(mockPatients as PatientRecord[], null)
    );

    const chartData = result.current;
    
    expect(chartData).toHaveLength(2); 

    expect(chartData[0].range).toBe('70-80');
    expect(chartData[0].count).toBe(2);

    expect(chartData[1].range).toBe('90-100');
    expect(chartData[1].count).toBe(1);
  });

  test('If patients is empty, return empty array', () => {
    const mockPatients: PatientRecord[] = [];

    const { result } = renderHook(() => 
      useHeartRateDistribution(mockPatients, null)
    );

    expect(result.current).toEqual([]);
  });

  test('Just count number of patients in displayIndices', () => {
    const mockPatients: Partial<PatientRecord>[] = [
      { patientName: 'A', heartRate: 72 },
      { patientName: 'B', heartRate: 78 },
      { patientName: 'C', heartRate: 95 },
    ];
    const mockDisplayIndices = new Int32Array([1, 2]); 

    const { result } = renderHook(() => 
      useHeartRateDistribution(mockPatients as PatientRecord[], mockDisplayIndices)
    );

    const chartData = result.current;
    expect(chartData).toHaveLength(2); 
    
    const bin70 = chartData.find(d => d.range === '70-80');
    expect(bin70?.count).toBe(1);
  });
});