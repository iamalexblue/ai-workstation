# AI Workstation

Apple Silicon (M4) local AI runtime powered by MLX.

## Setup

```bash
uv sync
```

## Verify

```bash
uv run python -c "import mlx_lm; print('OK')"
uv run mlx_lm.generate --help
```

## Environment

Configured via `~/.zshrc`:
- `HF_HOME` → `~/AI/cache/huggingface`
- `MLX_HOME` → `~/AI/cache/mlx`
- `PIP_CACHE_DIR` → `~/AI/cache/pip`
