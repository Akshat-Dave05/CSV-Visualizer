# CSV Visualizer

A browser-only React application for exploring CSV files and creating charts. CSV files are parsed locally with PapaParse and remain in memory only until the page is refreshed or closed. The app has no backend, database, authentication, or CSV upload endpoint.

## Run locally

```bash
npm install
npm run dev
```

## Production build and preview

```bash
npm run build
npm run preview
```

Deploy the generated `dist` directory to Vercel, Netlify, or GitHub Pages. There is no server configuration or environment variable required.
