# UBT Stage 1 Web PoC

Static web demo for the UBT Stage 1 candidate retrieval pipeline. The application uses mock profiles and a deterministic browser-side engine to demonstrate:

- abbreviation and entity resolution;
- query routing between lexical-only and hybrid retrieval;
- tenant, ACL, active, entity-type, and self-exclusion filters;
- lexical and semantic mock scoring;
- Reciprocal Rank Fusion;
- compact candidate output and request telemetry.

The web demo does not connect to customer data and does not present simulated latency as a production benchmark.

## Run locally

Serve the repository root with any static HTTP server. For example:

```powershell
py -m http.server 4173
```

Then open `http://localhost:4173`.

## Deploy to Vercel

Import this GitHub repository in Vercel and select `Other` as the framework preset. No build command or environment variable is required. The output is served directly from the repository root.

## Production integration

Keep the request and response contract, then replace the mock engine in `app.js` with a server-side Search Gateway that calls Elasticsearch lexical and kNN branches, applies the same hard filters, and returns RRF-fused candidate references.
