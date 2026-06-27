# Architecture

Elyria Kernel Atlas Live is organized around a public map of kernel families.

## Core flow

```text
Motion
  -> Kernel family
  -> Corridor context
  -> Boundary posture
  -> Receipt concept
  -> Replay posture
```

## Main surfaces

- `/` renders the visual atlas.
- `/api/kernels` returns public kernel summaries.
- `/api/install-proof` returns the public installation proof outline.

## Runtime shape

The app is intentionally lightweight:

```text
Flask app
  -> in-memory public kernel registry
  -> HTML visual atlas
  -> read-only JSON endpoints
```

## Design rule

The atlas shows the public system map while keeping implementation details separate.

## Reviewer focus

Reviewers should inspect:

- category coverage
- clarity of the public boundary
- consistency of kernel naming
- local reproducibility
- read-only endpoint behavior