# AI Workstation

Apple Silicon (M4) local AI runtime powered by [MLX](https://github.com/ml-explore/mlx).

## Hardware

- Mac mini M4 / 16 GB RAM / macOS 26

## Quick Start

```bash
# 1. Install dependencies
uv sync

# 2. Deploy config files
cp config/zshrc ~/.zshrc
cp config/models.conf ~/.config/mlx/models.conf
cp config/mlx ~/.local/bin/mlx
cp config/mlx-server-wrapper ~/.local/bin/mlx-server-wrapper
cp config/com.local.mlx-server.plist ~/Library/LaunchAgents/com.local.mlx-server.plist
source ~/.zshrc

# 3. Start the translation service
mlx serve qwen8b
```

## Models

| Name | Model | Size | Memory | Use |
|------|-------|------|--------|-----|
| `qwen8b` | Qwen3-8B-4bit (MLX) | 4.3 GB | ~4.5 GB | Translation (CN/EN/JA/KO/DE/FR) |

### Download a model

```bash
aria2c -x 16 -s 16 -j 3 --continue=true \
  -d ~/AI/models/<model-dir> \
  "https://hf-mirror.com/<user>/<repo>/resolve/main/<file>"
```

### Register & switch

```bash
mlx register <name> ~/AI/models/<model-dir>
mlx restart <name>
```

## Daily Usage

```bash
mlx serve qwen8b     # Start service (auto-start on boot via launchd)
mlx stop             # Stop service
mlx status           # Check status
mlx chat "Translating to English: 你好世界"
mlx log              # Tail server logs
mlx models           # List registered models
```

## API

OpenAI-compatible endpoint at `http://10.10.10.10:8080`:

```bash
curl http://10.10.10.10:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"/Users/alexblue/AI/models/Qwen3-8B-4bit","messages":[{"role":"user","content":"Hello"}],"max_tokens":100,"chat_template_kwargs":{"enable_thinking":false}}'
```

## Proxy

```bash
pon          # Enable Surge (default)
pon mihomo   # Switch to Mihomo
poff         # Disable proxy
pst          # Check status
```

## Directory Layout

```
~/AI/
├── workspace/          # This repo
│   ├── pyproject.toml
│   ├── uv.lock
│   └── config/         # Dotfiles & configs (backup)
├── models/             # Downloaded models (~/AI/models)
├── cache/              # HF / pip / MLX caches
└── scripts/            # Custom scripts (on PATH)
```

## Kiss Translator

See `config/kiss-translator-hooks.js` for the ES5-compatible hooks.

| Setting | Value |
|---------|-------|
| API URL | `http://10.10.10.10:8080/v1/chat/completions` |
| API Key | `local` |
| Model | `/Users/alexblue/AI/models/Qwen3-8B-4bit` |
