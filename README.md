# Home Portal

一个轻量、纯静态的个人服务入口页，用于从统一界面访问 NAS、QQBot、Janken 和 Speed Test。页面由原生 HTML、CSS 与 JavaScript 构建，并通过 nginx 容器提供服务。

## Features

- 深色、简洁且响应式的服务卡片界面
- 桌面、平板、手机和折叠屏自适应布局
- 服务配置集中在一个 JavaScript 数组中，方便扩展
- 内联 SVG 图标，无字体、CDN 或其他外部资源依赖
- 键盘导航、清晰焦点状态和 `prefers-reduced-motion` 支持
- nginx gzip、静态缓存与基础安全响应头
- Docker 镜像轻量，无 Node.js、数据库或常驻后端
- 宿主机端口通过 `.env` 配置

## Architecture

本项目只负责提供 Home Portal 静态页面，不处理 HTTPS，也不代理其他服务。

```text
home.maskpic.com
       ↓ HTTPS
Synology DSM nginx（反向代理 / TLS）
       ↓ HTTP
127.0.0.1:${HOST_PORT}
       ↓
Home Portal nginx 容器（80）
```

外网链路也可以位于更上游，例如：

```text
Internet → VPS Caddy → FRP → NAS → Home Portal 容器
```

FRP、Caddy、证书、密钥、Token 及其他基础设施配置不属于本仓库，也不应提交到本仓库。

## Project Structure

```text
.
├── index.html              # 页面语义结构与本地图标 sprite
├── css/style.css           # 主题、布局、响应式与交互样式
├── js/app.js               # 服务数据和卡片渲染
├── assets/favicon.svg      # 本地站点图标
├── nginx/default.conf      # nginx 静态站点配置
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── .dockerignore
├── .gitignore
└── README.md
```

## Local Development

本项目没有构建步骤。可直接用浏览器打开 `index.html`，但由于资源使用根路径，推荐从项目根目录启动任意静态文件服务器，或直接使用 Docker：

```bash
cp .env.example .env
docker compose up --build
```

打开 `http://localhost:18080`。

## Docker Deployment

```bash
cp .env.example .env
docker compose up -d --build
```

默认映射为：

```text
NAS:18080 → container:80
```

查看状态和日志：

```bash
docker compose ps
docker compose logs -f home
```

停止服务：

```bash
docker compose down
```

## Update / Upgrade

拉取或复制最新代码后重新构建容器：

```bash
docker compose up -d --build
```

若需要清理旧的未使用镜像，可在确认没有其他容器依赖后，由 NAS 管理员自行执行 Docker 镜像清理。

## Configuration

复制示例配置：

```bash
cp .env.example .env
```

在 `.env` 中设置宿主机端口：

```dotenv
HOST_PORT=18080
```

`docker-compose.yml` 使用 `${HOST_PORT:-18080}:80`。修改 `.env` 后重建容器即可更换宿主机端口，无需编辑 Compose 文件：

```bash
docker compose up -d --force-recreate
```

`.env` 已加入 `.gitignore`，不要将本机配置或任何敏感信息提交到 Git。

## Adding a New Service

编辑 `js/app.js` 中的 `services` 数组，新增一个对象：

```js
{
  name: "Example",
  description: "Service description",
  url: "https://example.maskpic.com",
  icon: "server",
},
```

可用图标键为 `server`、`bot`、`game` 和 `speed`。如需新图标，在 `index.html` 的 SVG sprite 中增加一个 `id="icon-名称"` 的 `<symbol>`，并在服务对象中引用该名称。

## Synology NAS Deployment

1. 确保 NAS 已安装 Container Manager（或 Docker / Docker Compose）。
2. 将本仓库复制或克隆到 NAS 上的专用目录。
3. 进入项目目录并创建本地配置：

```bash
cp .env.example .env
```

4. 按需修改 `.env` 中的 `HOST_PORT`，然后启动：

```bash
docker compose up -d --build
```

5. 在 NAS 本机确认 `http://127.0.0.1:18080` 可访问（若更改端口，请使用实际端口）。

## Reverse Proxy Example

在 DSM 的“登录门户 / 高级 / 反向代理”中创建规则：

- 来源协议：`HTTPS`
- 来源主机名：`home.maskpic.com`
- 来源端口：`443`
- 目标协议：`HTTP`
- 目标主机名：`127.0.0.1`
- 目标端口：`.env` 中的 `HOST_PORT`，默认 `18080`

再为 `home.maskpic.com` 绑定已有证书。HTTPS 终止于 DSM nginx；Home Portal 容器内部始终只监听 HTTP 80。

DNS、DSM 证书、防火墙和上游 VPS / FRP（如使用）需要由管理员在仓库外单独配置。不要把私钥、密码、AccessKey 或 Token 写入本项目。
