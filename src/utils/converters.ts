const PROXY_RECORD_SIZE = 36;

export function createSortBuffer(patients: any[], key: string): ArrayBuffer {
  const buffer = new ArrayBuffer(patients.length * PROXY_RECORD_SIZE);
  const view = new DataView(buffer);
  const encoder = new TextEncoder();

  for (let i = 0; i < patients.length; i++) {
    const offset = i * PROXY_RECORD_SIZE;
    const p = patients[i];

    // 1. Ghi Index gốc (4 bytes) - Dùng để truy xuất ngược lại Object
    view.setInt32(offset, i, true);

    // 2. Ghi giá trị cần Sort (32 bytes tiếp theo)
    const val = p[key];
    if (typeof val === 'number') {
      // Nếu là số, ghi vào 4 byte đầu của vùng chứa giá trị
      view.setFloat32(offset + 4, val, true);
    } else {
      // Nếu là chuỗi, ghi thẳng Byte (Tối đa 32 ký tự)
      const bytes = encoder.encode(String(val).slice(0, 31));
      new Uint8Array(buffer, offset + 4, bytes.length).set(bytes);
    }
  }
  return buffer;
}