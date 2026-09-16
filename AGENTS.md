# Repository maintenance notes

- `Dockerfile` contains an integer `LABEL version="N"` project revision counter.
- Increment `N` by exactly 1 for every completed project change, once per task.
- Keep the version increment in the same commit as the corresponding change.
- Never reset or decrement the version counter.
