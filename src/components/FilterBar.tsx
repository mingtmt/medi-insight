import type { PatientRecord } from "../types";

interface FilterBarProps {
  filters: Pick<PatientRecord, 'patientName' | 'gender' | 'bloodGroup' | 'status'>;
  setFilters: any;
  handleFilterChange: any;
  isProcessing: boolean;
}

export default function FilterBar({filters, setFilters, handleFilterChange, isProcessing}: FilterBarProps) {
  return (
    <div className="bg-white p-3 flex flex-wrap items-end gap-4 border-b border-gray-200 shadow-sm z-10">
        {/* Filter by name */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
            Search Patient
          </label>
          <input 
            type="text" 
            placeholder="Type name..." 
            className="border border-gray-300 rounded px-3 py-1.5 text-sm w-64 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
            value={filters.patientName}
            onChange={(e) => handleFilterChange('patientName', e.target.value)}
          />
        </div>

        {/* Filter by gender */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
            Gender
          </label>
          <select 
            className="border border-gray-300 rounded px-3 py-1.5 text-sm w-32 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 bg-white"
            value={filters.gender}
            onChange={(e) => handleFilterChange('gender', e.target.value)}
          >
            <option value="">All</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {/* Filter by blood group */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
            Blood Group
          </label>
          <select 
            className="border border-gray-300 rounded px-3 py-1.5 text-sm w-32 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 bg-white"
            value={filters.bloodGroup}
            onChange={(e) => handleFilterChange('bloodGroup', e.target.value)}
          >
            <option value="">All</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
        </div>

        {/* Filter by status */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
            Status
          </label>
          <select 
            className="border border-gray-300 rounded px-3 py-1.5 text-sm w-40 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 bg-white"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Stable">Stable</option>
            <option value="Under Observation">Under Observation</option>
            <option value="Critical">Critical</option>
            <option value="Discharged">Discharged</option>
          </select>
        </div>

        {/* Nút Reset Filter */}
        <button 
          className="ml-auto text-sm text-teal-700 hover:text-teal-900 font-semibold px-3 py-1.5 rounded hover:bg-teal-50 transition-colors"
          onClick={() => setFilters({ patientName: '', gender: '', bloodGroup: '', status: '' })}
        >
          Reset Filters
        </button>

        {isProcessing && (
          <span className="text-xs text-teal-600 font-bold ml-4 animate-pulse">
            Processing...
          </span>
        )}
      </div>
  )
}
