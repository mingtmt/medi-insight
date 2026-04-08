import React from "react";
import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from "vitest";
import HeartRateChart from "./HeartRateChart";
import { type PatientRecord } from "../types";

vi.mock('recharts', async (importOriginal) => {
  const OriginalRecharts = await importOriginal<typeof import('recharts')>();
  
  return {
    ...OriginalRecharts,
    ResponsiveContainer: ({ children }: any) => (
      <div style={{ width: 800, height: 600 }}>
        {React.cloneElement(children, { width: 800, height: 600 })}
      </div>
    ),
  };
});

describe('Component: HeartRateChart', () => {
  test('Display No data when patients is empty', () => {
    render(<HeartRateChart patients={[]} displayIndices={null} />);
    
    expect(screen.getByText('No data')).toBeInTheDocument();
    
    expect(screen.queryByText('Heart Rate Distribution')).not.toBeInTheDocument();
  });

  test('Display correct chart when patients is not empty', () => {
    const mockData: Partial<PatientRecord>[] = [
      { patientName: 'A', heartRate: 72 },
      { patientName: 'B', heartRate: 78 },
      { patientName: 'C', heartRate: 95 },
    ];

    render(
      <HeartRateChart 
        patients={mockData as PatientRecord[]} 
        displayIndices={null} 
      />
    );

    expect(screen.getByText('Heart Rate Distribution')).toBeInTheDocument();
    expect(screen.getByText('bpm')).toBeInTheDocument();
    expect(screen.getByText('Number of Patients')).toBeInTheDocument();

    expect(screen.getByText('70-80')).toBeInTheDocument();
    expect(screen.getByText('90-100')).toBeInTheDocument();
  });

  test('Chart update when displayIndices is not null', () => {
    const mockData: Partial<PatientRecord>[] = [
      { patientName: 'A', heartRate: 72 },
      { patientName: 'B', heartRate: 78 },
      { patientName: 'C', heartRate: 95 },
    ];

    const mockDisplayIndices = new Int32Array([0, 1]);

    render(
      <HeartRateChart 
        patients={mockData as PatientRecord[]} 
        displayIndices={mockDisplayIndices} 
      />
    );

    expect(screen.getByText('70-80')).toBeInTheDocument();
    expect(screen.queryByText('90-100')).not.toBeInTheDocument();
  });
});