# FilterExcel Client

Frontend application for the FilterExcel project (Final Year Project), built with React + Vite.

## Tech Stack

- React 19
- Vite 6
- Redux Toolkit
- React Router
- Recharts
- Tailwind CSS

## Key Features

- Upload and preview tabular data files.
- Filter, sort, clean, and transform data using UI tools.
- Generate AI-powered dataset summaries.
- Visualize data using line, bar, pie, area, and scatter charts.
- Export summary reports from the Summary page in:
	- PDF (`.pdf`)
	- Word (`.docx`)

## Summary Report Export

From the **Summary** page:

1. Click **Generate AI Summary** (optional but recommended).
2. Click **Download Report ▾**.
3. Choose:
	 - **Download as PDF**
	 - **Download as Word**

The report includes:

- Dataset overview
- Column overview
- Numeric statistics
- Frequent categorical values
- Generated AI summary content

## Environment Setup

Create a `.env` file in `client/` (or use existing project env config):

```env
VITE_API_BASE_URL=http://localhost:5000
```

## Install and Run

```bash
npm install
npm run dev
```

Default Vite dev URL:

```text
http://localhost:5173
```

## Build

```bash
npm run build
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Notes

- Backend server must be running for API-backed features (auth, AI summary, file operations).
- Large production chunk warnings may appear during build; current functionality is unaffected.
