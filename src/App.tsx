import { useState, useEffect, useCallback, useMemo } from "react";
import { getScrollbarSize, List } from "react-window";
import { type PatientRecord } from "./types";
import RowComponent from "./components/RowComponent";
import FilterBar from "./components/FilterBar";

const dataWorker = new Worker(new URL("./workers/dataWoker.ts", import.meta.url));

export default function App() {
  const [size] = useState(getScrollbarSize);
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [isWorkerReady, setIsWorkerReady] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [filters, setFilters] = useState<Pick<PatientRecord, 'patientName' | 'gender' | 'bloodGroup' | 'status'>>({ 
    patientName: '', gender: '', bloodGroup: '', status: '',
  });
  const [sortConfig, setSortConfig] = useState({ key: '', order: 'asc' });
  
  const [displayIndices, setDisplayIndices] = useState<Int32Array | null>(null);

  useEffect(() => {
    fetch("/public/clinical_data.json")
      .then((response) => response.json())
      .then((data) => {
        setPatients(data);
        setDisplayIndices(new Int32Array(data.map((_: any, i: number) => i)));
        
        dataWorker.postMessage({ action: 'INIT', payload: { data } });
      })
      .catch((error) => console.error(error));

    dataWorker.onmessage = (e) => {
      if (e.data.type === 'READY') setIsWorkerReady(true);
      if (e.data.type === 'RESULT') {
        setDisplayIndices(e.data.displayIndices);
        setIsProcessing(false);
      }
    };
  }, []);

  useEffect(() => {
    if (!isWorkerReady || patients.length === 0) return;
    
    setIsProcessing(true);
    dataWorker.postMessage({
      action: 'PROCESS',
      payload: { filters, sortConfig }
    });
  }, [filters, sortConfig, isWorkerReady, patients.length]);

  const handleSort = useCallback((key: string) => {
    setSortConfig(prev => ({
      key,
      order: (prev.key === key && prev.order === 'asc') ? 'desc' : 'asc'
    }));
  }, []);

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const itemData = useMemo(() => ({
    patients,
    displayIndices
  }), [patients, displayIndices]);

  const renderSortIcon = (key: keyof PatientRecord) => {
    if (sortConfig?.key !== key) return "↕️";
    return sortConfig.order === 'asc' ? "🔼" : "🔽";
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <FilterBar filters={filters} setFilters={setFilters} handleFilterChange={handleFilterChange} isProcessing={isProcessing} />

      <div className="flex flex-row bg-teal-700 text-white p-3 pr-2 shadow-md">
        <div className="grow flex flex-row items-center gap-2 font-bold px-4 text-sm">
          
          <button 
            className="flex-1 flex items-center gap-1 hover:bg-teal-600 p-1 rounded transition-colors text-left"
            onClick={() => handleSort('patientName')}
          >
            Name {renderSortIcon('patientName')}
          </button>

          <button 
            className="w-16 flex items-center gap-1 hover:bg-teal-600 p-1 rounded transition-colors text-left"
            onClick={() => handleSort('age')}
          >
            Age {renderSortIcon('age')}
          </button>

          <div className="w-20 text-center">Gender</div>
          <div className="w-24 text-center">Blood Grp</div>
          <div className="w-20 text-center">HR</div> 
          <div className="w-24 text-center">BP</div>
          <div className="w-32 text-center">Temp</div>
          
          <div className="w-32 text-center">Test Date</div>
          <div className="w-24 text-center">Status</div>
          <div className="flex-1">Notes</div>
        </div>
        
        <div className="shrink-0" style={{ width: size }} />
      </div>

      <div className="overflow-hidden">
        {displayIndices && displayIndices.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            No data
          </div>
        ) : (
          <List
            // @ts-ignore
            rowComponent={RowComponent}
            height={800}
            width="100%"
            rowCount={patients.length}
            rowHeight={40}
            rowProps={{ data: itemData }}
          />
        )}
      </div>
    </div>
  )
}