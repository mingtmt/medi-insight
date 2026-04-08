import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import FilterBar from './FilterBar';
import { type PatientRecord } from '../types';

describe('Component: FilterBar', () => {
  const defaultFilters: Pick<PatientRecord, 'patientName' | 'gender' | 'bloodGroup' | 'status'> = { 
    patientName: '', 
    gender: '', 
    bloodGroup: '', 
    status: '',
  };
  
  let mockSetFilters: any;
  let mockHandleFilterChange: any;

  beforeEach(() => {
    mockSetFilters = vi.fn();
    mockHandleFilterChange = vi.fn();
  });

  test('Render correctly', () => {
    render(
      <FilterBar 
        filters={defaultFilters} 
        setFilters={mockSetFilters} 
        handleFilterChange={mockHandleFilterChange} 
        isProcessing={false} 
      />
    );

    expect(screen.getByPlaceholderText('Type name...')).toBeInTheDocument();
    
    const selectBoxes = screen.getAllByRole('combobox');
    expect(selectBoxes).toHaveLength(3);

    expect(screen.getByRole('button', { name: /reset filters/i })).toBeInTheDocument();
    
    expect(screen.queryByText('Processing...')).not.toBeInTheDocument();
  });

  test('Call handleFilterChange when input changes', async () => {
    const user = userEvent.setup();
    render(
      <FilterBar 
        filters={defaultFilters} 
        setFilters={mockSetFilters} 
        handleFilterChange={mockHandleFilterChange} 
        isProcessing={false} 
      />
    );

    const searchInput = screen.getByPlaceholderText('Type name...');
    
    await user.type(searchInput, 'A');

    expect(mockHandleFilterChange).toHaveBeenCalledWith('patientName', 'A');
  });

  test('Call handleFilterChange when select changes', async () => {
    const user = userEvent.setup();
    render(
      <FilterBar 
        filters={defaultFilters} 
        setFilters={mockSetFilters} 
        handleFilterChange={mockHandleFilterChange} 
        isProcessing={false} 
      />
    );

    const selectBoxes = screen.getAllByRole('combobox');
    const statusSelect = selectBoxes[2];

    await user.selectOptions(statusSelect, 'Critical');

    expect(mockHandleFilterChange).toHaveBeenCalledWith('status', 'Critical');
  });

  test('Call setFilters with empty object when reset button is clicked', async () => {
    const user = userEvent.setup();
    
    const activeFilters: Pick<PatientRecord, 'patientName' | 'gender' | 'bloodGroup' | 'status'> = { 
      patientName: 'John',
      gender: 'male',
      bloodGroup: '',
      status: '',
    };
    
    render(
      <FilterBar 
        filters={activeFilters} 
        setFilters={mockSetFilters} 
        handleFilterChange={mockHandleFilterChange} 
        isProcessing={false} 
      />
    );

    const resetBtn = screen.getByRole('button', { name: /reset filters/i });
    await user.click(resetBtn);

    expect(mockSetFilters).toHaveBeenCalledWith({ 
      patientName: '', 
      gender: '', 
      bloodGroup: '', 
      status: '' 
    });
  });

  test('Display "Processing..." when isProcessing is true', () => {
    render(
      <FilterBar 
        filters={defaultFilters} 
        setFilters={mockSetFilters} 
        handleFilterChange={mockHandleFilterChange} 
        isProcessing={true}
      />
    );

    expect(screen.getByText('Processing...')).toBeInTheDocument();
  });
});