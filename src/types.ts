export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | '';
export type PatientStatus = 'Stable' | 'Under Observation' | 'Critical' | 'Discharged' | '';

export interface PatientRecord {
  id: string;
  patientName: string;
  age: number;
  gender: string;
  bloodGroup: BloodGroup;
  heartRate: number;
  bloodPressure: string;
  temperature: number;
  testDate: string;
  status: PatientStatus;
  notes: string;
}