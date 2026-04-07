import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import RowComponent from './RowComponent';
import { type PatientRecord } from '../types';

describe('Component: RowComponent', () => {
  const mockPatients: Partial<PatientRecord>[] = [
    { 
      patientName: 'Trần Văn Bảng', 
      age: 45, 
      gender: 'Male',
      bloodGroup: 'O+',
      heartRate: 80,
      bloodPressure: '120/80',
      temperature: 36.5,
      testDate: '2023-10-25',
      status: 'Stable',
      notes: 'Bệnh nhân phục hồi tốt'
    }
  ];

  test('Display correct patient information', () => {
    const mockData = {
      patients: mockPatients as PatientRecord[],
      displayIndices: new Int32Array([0])
    };

    render(
      // @ts-ignore
      <RowComponent 
        index={0} 
        data={mockData} 
        style={{ top: 0, height: 40 }}
      />
    );

    expect(screen.getByText('Trần Văn Bảng')).toBeInTheDocument();
    expect(screen.getByText('45')).toBeInTheDocument();
    expect(screen.getByText('Male')).toBeInTheDocument();
    expect(screen.getByText('Stable')).toBeInTheDocument();
  });

  test('Display loading message when index is out of range', () => {
    const mockData = {
      patients: mockPatients as PatientRecord[],
      displayIndices: new Int32Array([99]) 
    };

    // @ts-ignore
    render(<RowComponent index={0} data={mockData} style={{}} />);

    expect(screen.getByText('Loading ...')).toBeInTheDocument();
    
    expect(screen.queryByText('Trần Văn Bảng')).not.toBeInTheDocument();
  });

  test('Display correct patient information when displayIndices is null', () => {
    const mockData = {
      patients: mockPatients as PatientRecord[],
      displayIndices: null
    };

    // @ts-ignore
    render(<RowComponent index={0} data={mockData} style={{}} />);

    expect(screen.getByText('Trần Văn Bảng')).toBeInTheDocument();
  });
});