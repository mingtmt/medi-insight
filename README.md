# MediInsight

A high-performance clinical data dashboard built with React + TypeScript + Vite. MediInsight visualizes and explores large-scale patient records in real time — supporting **100,000+ records** with smooth filtering, sorting, and heart rate distribution charts, all without blocking the UI thread.

---

## Features

- **Virtualized Patient Table** — Renders massive lists efficiently using `react-window`, keeping the UI fast regardless of data size.
- **Off-thread Filtering & Sorting** — All data processing (filter + sort) runs inside a **Web Worker**, keeping the main thread free and the UI responsive.
- **Heart Rate Distribution Chart** — An interactive bar chart (powered by `recharts`) that updates in sync with the current filtered view.
- **Multi-field Filtering** — Search by patient name (text search), gender, blood group, and clinical status simultaneously.
- **Columnar Sorting** — Click any column header (Name, Age) to toggle ascending/descending sort.
- **Shareable Data Generator** — A standalone script to generate realistic synthetic clinical data using `@faker-js/faker`.

---

## Project Structure

```
medi-insight/
├── public/
│   └── clinical_data.json       # Generated patient data (100k records)
├── scripts/
│   └── generateData.ts          # Data generation script (faker-based)
├── src/
│   ├── components/
│   │   ├── FilterBar.tsx         # Filter controls (name, gender, blood group, status)
│   │   ├── HeartRateChart.tsx    # Heart rate distribution bar chart
│   │   └── RowComponent.tsx      # Virtualized table row
│   ├── hooks/
│   │   └── useHeartRateDistribution.ts  # Aggregation hook for chart data
│   ├── utils/
│   │   └── converters.ts         # Utility helpers
│   ├── workers/
│   │   └── dataWorker.ts         # Web Worker for off-thread data processing
│   ├── types.ts                  # Shared TypeScript types
│   └── App.tsx                   # Root component
├── index.html
├── vite.config.ts
└── package.json
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [pnpm](https://pnpm.io/) (recommended) — or `npm` / `yarn`

### 1. Install dependencies

```bash
pnpm install
```

### 2. Generate sample data

The app requires a `clinical_data.json` file in the `public/` folder. Run the generator script to create **100,000** synthetic patient records:

```bash
pnpm tsx scripts/generateData.ts
```

This will output `./public/clinical_data.json` (~50–60 MB).

> **Note:** You only need to run this once. Re-run it any time you want a fresh dataset.

### 3. Start the development server

```bash
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Running Tests

```bash
pnpm test
```

Tests are written with [Vitest](https://vitest.dev/) and [Testing Library](https://testing-library.com/). Test files live alongside their components (`*.test.tsx`).

---

## 🏗️ Build for Production

```bash
pnpm build
```

Output will be in the `dist/` directory.

To preview the production build locally:

```bash
pnpm preview
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [React 19](https://react.dev/) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Build Tool | [Vite](https://vite.dev/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Charting | [Recharts](https://recharts.org/) |
| List Virtualization | [react-window](https://github.com/bvaughn/react-window) |
| Data Generation | [@faker-js/faker](https://fakerjs.dev/) |
| Testing | [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) |

---

## Architecture Notes

### Web Worker for Data Processing

Filtering and sorting 100k records synchronously on the main thread would cause UI jank. MediInsight offloads this work to a dedicated **Web Worker** (`src/workers/dataWorker.ts`):

1. On startup, the full dataset is sent to the worker via `INIT`.
2. Whenever filters or sort config change, a `PROCESS` message is sent to the worker.
3. The worker responds with a sorted `Int32Array` of matching row indices (transferred via `SharedArrayBuffer`-style zero-copy transfer).
4. The virtualized list re-renders only the visible rows using those indices.

This ensures the UI stays at **60 fps** even while processing large datasets.

---

## License

MIT
