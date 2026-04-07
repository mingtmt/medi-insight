let rawData: any[] = [];

self.onmessage = (e) => {
  const { action, payload } = e.data;

  if (action === 'INIT') {
    rawData = payload.data;
    self.postMessage({ type: 'READY' });
    return;
  }

  if (action === 'PROCESS') {
    const { filters, sortConfig } = payload;
    const { patientName, gender, bloodGroup, status } = filters;
    
    const lowerSearchName = patientName.toLowerCase();

    const filteredIndices: number[] = [];

    for (let i = 0; i < rawData.length; i++) {
      const p = rawData[i];
      
      if (lowerSearchName && !p.patientName.toLowerCase().includes(lowerSearchName)) continue;
      if (gender && p.gender !== gender) continue;
      if (bloodGroup && p.bloodGroup !== bloodGroup) continue;
      if (status && p.status !== status) continue;

      filteredIndices.push(i);
    }

    if (sortConfig && sortConfig.key) {
      const { key, order } = sortConfig;
      const isAsc = order === 'asc';

      filteredIndices.sort((indexA, indexB) => {
        const valA = rawData[indexA][key];
        const valB = rawData[indexB][key];

        if (typeof valA === 'number' && typeof valB === 'number') {
          return isAsc ? valA - valB : valB - valA;
        }

        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();
        if (strA < strB) return isAsc ? -1 : 1;
        if (strA > strB) return isAsc ? 1 : -1;
        return 0;
      });
    }

    const displayIndices = new Int32Array(filteredIndices);
    
    self.postMessage(
      { type: 'RESULT', displayIndices }, 
      { transfer: [displayIndices.buffer] },
    );
  }
};