# OpenTelemetry tracing

This repository sends traces to **Tracepipe**, an OpenTelemetry pipeline with tail-based
sampling: failed and slow requests are always kept, healthy ones are sampled.

## What this pull request changed

- `OPENTELEMETRY.md`: this guide

We could not detect the language of this repository. Follow the zero-code guide for your language at https://opentelemetry.io/docs/zero-code/ and use the variables below.

## What you still need to do

Set these environment variables where the app runs (Render, Vercel, Docker, your shell).
Get the ingest key from the project's **Settings** page in the dashboard. Never commit it.

```
OTEL_EXPORTER_OTLP_ENDPOINT=https://tracepipe-collector.onrender.com
OTEL_EXPORTER_OTLP_HEADERS=x-api-key=<your ingest key from the dashboard>
OTEL_SERVICE_NAME=raw_frontend
OTEL_TRACES_EXPORTER=otlp
OTEL_METRICS_EXPORTER=none
OTEL_LOGS_EXPORTER=none
```

Then deploy. Traces appear in the dashboard a few seconds after the first request.

## Turning it off

Set `OTEL_SDK_DISABLED=true`, or revert this pull request.
