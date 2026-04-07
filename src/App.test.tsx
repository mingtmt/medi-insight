import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest';
import App from './App';

// Mock data
const mockPatients = [
  { patientName: 'Nguyen Van A', age: 30, gender: 'Male', status: 'Stable' },
  { patientName: 'Tran Thi B', age: 25, gender: 'Female', status: 'Critical' }
];

// Mock Web worker
class MockWorker {
  onmessage: any = null;
  postMessage(msg: any) {
    if (msg.action === 'INIT') {
      setTimeout(() => this.onmessage?.({ data: { type: 'READY' } }), 10);
    }
    
    if (msg.action === 'PROCESS') {
      const { filters } = msg.payload;
      
      setTimeout(() => {
        if (filters.patientName === 'Tran') {
          this.onmessage?.({ data: { type: 'RESULT', displayIndices: new Int32Array([1]) } });
        } 
        else {
          this.onmessage?.({ data: { type: 'RESULT', displayIndices: new Int32Array([0, 1]) } });
        }
      }, 10);
    }
  };
  terminate() {
  }
}

describe('Component: App (Integration)', () => {
  
  beforeEach(() => {
    vi.stubGlobal('Worker', MockWorker);
    
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockPatients),
      })
    ) as any;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  test('Display correct data after fetch and worker processing', async () => {
    render(<App />);

    expect(await screen.findByText('Nguyen Van A')).toBeInTheDocument();
    expect(screen.getByText('Tran Thi B')).toBeInTheDocument();
    
    expect(fetch).toHaveBeenCalledWith('/public/clinical_data.json');
  });

  test('When user types on the search input, display correct data', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(await screen.findByText('Nguyen Van A')).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText('Type name...');

    await user.type(searchInput, 'Tran');

    expect(await screen.findByText('Tran Thi B')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.queryByText('Nguyen Van A')).not.toBeInTheDocument();
    });
  });
});