# AI Workstation

[![English](https://img.shields.io/badge/English-README-blue)](./README.md)

基于 [MLX](https://github.com/ml-explore/mlx) 的 Apple Silicon (M4) 本地 AI 运行时。

## 硬件

- Mac mini M4 / 16 GB RAM / macOS 26

## 快速开始

```bash
# 1. 安装依赖
uv sync

# 2. 部署配置文件
cp config/zshrc ~/.zshrc
cp config/models.conf ~/.config/mlx/models.conf
cp config/mlx ~/.local/bin/mlx
cp config/mlx-server-wrapper ~/.local/bin/mlx-server-wrapper
cp config/com.local.mlx-server.plist ~/Library/LaunchAgents/com.local.mlx-server.plist
source ~/.zshrc

# 3. 启动翻译服务
mlx serve qwen8b
```

## 模型

| 名称 | 模型 | 大小 | 内存 | 用途 |
|------|------|------|------|------|
| `qwen8b` | Qwen3-8B-4bit (MLX) | 4.3 GB | ~4.5 GB | 翻译 (中/英/日/韩/德/法) |
| `qwen4b` | Qwen3-4B-Instruct-2507-4bit (MLX) | 3.7 GB | ~2.5 GB | 翻译，速度更快 (默认) |

> `qwen4b` 为默认模型。`mlx serve qwen8b` 切回。

### 下载模型

```bash
aria2c -x 16 -s 16 -j 3 --continue=true \
  -d ~/AI/models/<model-dir> \
  "https://hf-mirror.com/<user>/<repo>/resolve/main/<file>"
```

### 注册与切换

```bash
mlx register <name> ~/AI/models/<model-dir>
mlx restart <name>
```

## 常用命令

```bash
mlx serve qwen8b     # 启动服务 (开机自启, 崩溃自愈)
mlx stop             # 停止服务
mlx status           # 查看状态
mlx chat "将以下内容翻译成英文：你好世界"
mlx log              # 查看日志
mlx models           # 列出已注册模型
```

## API

OpenAI 兼容接口，地址 `http://10.10.10.10:8080`：

```bash
curl http://10.10.10.10:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"$HOME/AI/models/Qwen3-8B-4bit","messages":[{"role":"user","content":"Hello"}],"max_tokens":100,"chat_template_kwargs":{"enable_thinking":false}}'
```

## 代理

```bash
pon          # 开启代理 (默认 Surge)
pon mihomo   # 切换到 Mihomo
poff         # 关闭代理
pst          # 查看状态
```

## 目录结构

```
~/AI/
├── workspace/          # 本仓库
│   ├── pyproject.toml
│   ├── uv.lock
│   └── config/         # 配置文件备份
├── models/             # 已下载的模型
├── cache/              # HF / pip / MLX 缓存
└── scripts/            # 自定义脚本 (在 PATH 中)
```

## Kiss Translator 接入

Hook 代码见 `config/kiss-translator-hooks.js`（自动检测模型 ID，不需要填路径）。

| 设置项 | 值 |
|--------|-----|
| API URL | `http://10.10.10.10:8080/v1/chat/completions` |
| API Key | `local` |
| Model | *(任意填，Hook 自动覆盖)* |

## 新机器部署

```bash
# 克隆仓库
git clone https://github.com/iamalexblue/ai-workstation ~/AI/workspace
cd ~/AI/workspace && uv sync

# 替换占位符后部署
sed -i '' "s|__HOME__|$HOME|g" config/com.local.mlx-server.plist
sed -i '' "s|__HOME__|$HOME|g" config/kiss-translator-hooks.js
cp config/zshrc ~/.zshrc && source ~/.zshrc
mkdir -p ~/.config/mlx ~/.local/bin
cp config/models.conf ~/.config/mlx/models.conf
cp config/mlx ~/.local/bin/mlx
cp config/mlx-server-wrapper ~/.local/bin/mlx-server-wrapper
cp config/com.local.mlx-server.plist ~/Library/LaunchAgents/

# 下载模型
aria2c -x 16 -s 16 --continue=true \
  -d ~/AI/models/Qwen3-8B-4bit \
  "https://hf-mirror.com/mlx-community/Qwen3-8B-4bit/resolve/main/model.safetensors"

# 启动
mlx serve qwen8b
```
