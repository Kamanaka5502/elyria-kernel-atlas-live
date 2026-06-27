# Verify

## Run locally

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python app.py
```

Open:

```text
http://127.0.0.1:5000
```

## Check read-only endpoints

```text
/api/kernels
/api/install-proof
```

## Expected posture

The app should load the visual atlas and return JSON summaries from the two endpoints.