import React from "react";
import { type RowComponentProps } from "react-window";
import { type PatientRecord } from "../types";

interface ItemData {
  patients: PatientRecord[];
  displayIndices: Int32Array | null;
}

const RowComponent = ({
  index,
  data,
  style,
} : RowComponentProps<{data: ItemData}>) => {
  const { patients, displayIndices } = data;

  const actualDataIndex = displayIndices ? displayIndices[index] : index;
  
  const patient = patients[actualDataIndex];

  if (!patient) {
    return (
      <div style={style} className="flex items-center px-4 text-sm text-gray-400">
        Loading ...
      </div>
    );
  }

  return (
    <div 
      className="flex flex-row items-center gap-2 px-4 border-b border-gray-200 hover:bg-gray-50 transition-colors" 
      style={style}
    >
      <div className="flex-1 truncate font-medium text-sm">{patient.patientName}</div>
      <div className="w-16 truncate text-sm">{patient.age}</div>
      
      <div className="w-20 text-xs text-center">{patient.gender}</div>
      <div className="w-24 text-xs text-center">{patient.bloodGroup}</div>
      <div className="w-20 text-xs text-center">{patient.heartRate}</div>
      <div className="w-24 text-xs text-center">{patient.bloodPressure}</div>
      <div className="w-32 text-xs text-center">{patient.temperature}</div>
      
      <div className="w-32 text-xs truncate text-center">{patient.testDate}</div>
      <div className="w-24 text-xs text-center">
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          {patient.status}
        </span>
      </div>
      <div className="flex-1 text-xs truncate text-gray-500">{patient.notes}</div>
    </div>
  );
};

const customAreEqual = (
  prevProps: Readonly<RowComponentProps<{data: ItemData}>>,
  nextProps: Readonly<RowComponentProps<{data: ItemData}>>
) => {
  return (
    prevProps.index === nextProps.index &&
    prevProps.style === nextProps.style &&
    prevProps.data === nextProps.data
  );
};

export default React.memo(RowComponent, customAreEqual);