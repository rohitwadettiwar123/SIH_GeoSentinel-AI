# Offline Deployment

## Requirement
The system must run in a fully air-gapped environment (no outbound internet at runtime).

## Staging (Online phase)
- Download models via `scripts/stage_offline.py` (e.g., OpenCLIP weights, Ollama LLaVA models).
- Build wheelhouse for python dependencies.
- Download map tiles (MBTiles) and terrain data for the AOI.
- Export Docker images.

## Deployment (Offline phase)
- Set `offline_mode: true` in config.
- Use `scripts/verify_offline.py` which blocks sockets to prove no outbound calls are made.
- Services start via Docker Compose using local volumes for `models/`, `data/`, and `indexes/`.
- Online providers (Gemini, Groq) are automatically disabled.

## Security
- No telemetry.
- Bind to localhost / LAN.
- Optional Disk Encryption.
