# Hakiim v1 — System Runbook

> **Purpose:** This README is the operational guide for developers who need to run **Hakiim v1 locally**.
>
> It focuses on **required services, environment configuration, startup order, verification, and basic troubleshooting** rather than explaining the entire architecture.

---

## 1. What You Need

Hakiim v1 consists of the Node.js application, background worker, and supporting infrastructure services.

| Service | Default address / port | Purpose |
|---|---|---|
| **MongoDB** | `127.0.0.1:27017` | Persistent database |
| **Redis** | `127.0.0.1:6379` | Cache / application state (via `ioredis`) |
| **RabbitMQ** | `127.0.0.1:5672` (AMQP) / `15672` (UI) | Asynchronous event message broker |
| **Hakiim API** | `localhost:5000` | Main application (`app.js`) |
| **Worker Process** | CLI / Background | Queue consumer (`worker.js`) |
| **PM2** | Process manager | Process management (optional) |

---

## 2. First-Time Setup

Check your installed Node.js versions:

```bash
node --version
npm --version

Install the project dependencies from the repository root:
Bash

npm install

Run npm install whenever package.json or package-lock.json changes.
3. MongoDB

Hakiim expects MongoDB to be available locally.

Default URI format:
Plaintext

mongodb://127.0.0.1:27017/<database-name>

Start MongoDB

If managed by systemd:
Bash

sudo systemctl start mongodb
sudo systemctl enable mongodb

Check status:
Bash

sudo systemctl status mongodb --no-pager

Verify connection:
Bash

mongosh

4. Redis

Hakiim uses Redis as part of its application caching layer via ioredis (factory/connection/redis.js).

Default endpoint:
Plaintext

127.0.0.1:6379

Start Redis

If managed by systemd:
Bash

sudo systemctl start redis

Verify response:
Bash

redis-cli ping

Expected response: PONG
5. RabbitMQ

Hakiim uses RabbitMQ for handling asynchronous event queues (e.g., user_events, client_events).
Start RabbitMQ

If managed by systemd:
Bash

sudo systemctl start rabbitmq-server

Check status:
Bash

sudo systemctl status rabbitmq-server --no-pager

Management UI (if enabled): http://localhost:15672 (default credentials: guest / guest).
6. Environment Configuration

Create your local environment file from the example:
Bash

cp .env.example .env

Edit .env:
Code snippet

PORT=5000
NODE_ENV=development

MONGO_URI=mongodb://127.0.0.1:27017/hakiim_v1

REDIS_HOST=127.0.0.1
REDIS_PORT=6379

RABBITMQ_URI=amqp://localhost:5672

JWT_SECRET=replace_with_a_strong_local_secret
SECRET_PHRASE=replace_with_a_strong_local_secret

7. Startup Order

Start local infrastructure and application processes in this order:

    MongoDB

    Redis

    RabbitMQ

    Hakiim API (app.js)

    Worker Service (worker.js)

8. Start Hakiim & Worker
Main API Server
Bash

npm run dev

A successful startup outputs:
Plaintext

Redis connected successfully
MongoDB Connected
RabbitMQ Connected successfully, running on port 15672
Server running on port 5000

Background Worker Process

In a separate terminal, start the queue worker:
Bash

node worker.js

9. Verification & Health Check

Confirm API status:
Bash

curl http://localhost:5000/health

Expected response:
JSON

{"status":"OK","timestamp":"..."}

10. Process Management (PM2)

To manage both the server and worker together using PM2:
Bash

pm2 start ecosystem.config.js
pm2 list
pm2 logs