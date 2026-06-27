# Deployment

## Production start command

```bash
gunicorn app:app --bind 0.0.0.0:$PORT
```

The repository already includes a `Procfile` for platforms that detect it automatically.

## Local production-style run

```bash
PORT=5000 gunicorn app:app --bind 0.0.0.0:$PORT
```

Open:

```text
http://127.0.0.1:5000
```

## Public review tunnel

With the app running locally:

```bash
cloudflared tunnel --url http://localhost:5000
```

Cloudflare will return a temporary public review URL.

## Operational expectation

The atlas should serve:

```text
/
/api/kernels
/api/install-proof
```

The endpoints are read-only and return public atlas data.