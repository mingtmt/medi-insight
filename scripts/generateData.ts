import { faker } from '@faker-js/faker';
import * as fs from 'fs';
import { PatientRecord, BloodGroup, PatientStatus } from '../src/types';

const generateClinicalData = (numRecords: number): PatientRecord[] => {
  const data: PatientRecord[] = [];
  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const statuses: PatientStatus[] = ['Stable', 'Under Observation', 'Critical', 'Discharged'];

  console.log(`⏳ Đang khởi tạo ${numRecords} bản ghi bằng TypeScript...`);

  for (let i = 0; i < numRecords; i++) {
    const systolic = faker.number.int({ min: 90, max: 180 });
    const diastolic = faker.number.int({ min: 60, max: systolic - 20 });

    data.push({
      id: faker.string.uuid(),
      patientName: faker.person.fullName(),
      age: faker.number.int({ min: 1, max: 95 }),
      gender: faker.person.sex(),
      bloodGroup: faker.helpers.arrayElement(bloodGroups),
      heartRate: faker.number.int({ min: 50, max: 120 }),
      bloodPressure: `${systolic}/${diastolic}`,
      temperature: faker.number.float({ min: 36.1, max: 39.5, fractionDigits: 1 }),
      testDate: faker.date.between({ from: '2024-01-01', to: '2026-03-31' }).toISOString(),
      status: faker.helpers.arrayElement(statuses),
      notes: faker.lorem.sentence(),
    });

    if (i % 25000 === 0 && i !== 0) console.log(`✅ Đã tạo ${i} bản ghi...`);
  }

  return data;
};

const records = generateClinicalData(100000);

// Kiểm tra và tạo thư mục public nếu chưa có
if (!fs.existsSync('./public')) {
  fs.mkdirSync('./public');
}

fs.writeFileSync('./public/clinical_data.json', JSON.stringify(records, null, 2));
console.log('🚀 Xong! File JSON đã sẵn sàng tại ./public/clinical_data.json');