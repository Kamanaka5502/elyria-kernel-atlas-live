# Elyria Kernel Atlas

Prepared by **Samantha Revita / Elyria Systems**.

Public visual atlas of Elyria kernel families, consequence corridors, deterministic receipt concepts, custody evidence concepts, and public-safe boundary language.

This repository is a visual product surface. It is not the full implementation layer.

## Start here

- [START_HERE.md](START_HERE.md)
- [ARCHITECTURE.md](ARCHITECTURE.md)
- [PUBLIC_BOUNDARY.md](PUBLIC_BOUNDARY.md)
- [VERIFY.md](VERIFY.md)
- [DEPLOYMENT.md](DEPLOYMENT.md)
- [FAQ.md](FAQ.md)

## What it shows

- Moving kernel orbit
- Animated consequence field
- Interactive kernel cards
- Live kernel detail panel
- Animated receipt pulses
- Public-safe kernel summaries
- Corridor-family taxonomy
- Samantha Revita attribution

## Local run

```bash
pip install -r requirements.txt
python app.py
```

Open:

```text
http://127.0.0.1:5000
```

## Read-only endpoints

```text
/api/kernels
/api/install-proof
```

## Production-style start

```bash
gunicorn app:app --bind 0.0.0.0:$PORT
```

A `Procfile` is included for compatible deployment platforms.

## Deploy

1. Push this folder to GitHub.
2. Connect the repository to your deployment platform.
3. Use the included Python app configuration.
4. Use the configured production start command.

## Boundary

The atlas shows the public map of Elyria kernel categories while keeping the implementation layer separate.