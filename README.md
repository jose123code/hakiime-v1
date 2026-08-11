# Hakiim v1 — System Runbook

> **Purpose:** This README is the operational guide for developers who need to run **Hakiim v1 locally**.
>
> It focuses on **required services, environment configuration, startup order, verification, and basic troubleshooting** rather than explaining the entire architecture.

---

## 1. What You Need

Hakiim v1 consists of the Node.js application and supporting services.

| Service | Default address / port | Purpose |
|---|---|---|
| **MongoDB** | `127.0.0.1:27017` | Persistent database |
| **Redis** | `127.0.0.1:6379` | Cache / application state |
| **Hakiim API** | `localhost:5000` | Main application |
| **PM2** | Process manager | Runs configured processes |

The repository also contains additional service code under directories such as:

```text
micro-services/
micro-services-backup/
hkmcode.services/
socket/

These should not automatically be treated as part of the core startup sequence.

The root application starts from app.js. For additional processes, check ecosystem.config.js to see what is currently configured to run under PM2.
2. First-Time Setup
Node.js

Check your installed versions:

node --version
npm --version

Install the project dependencies from the repository root:

npm install

Run npm install again whenever package.json or package-lock.json changes.
3. MongoDB

Hakiim expects MongoDB to be available locally.

The local connection uses:

mongodb://127.0.0.1:27017/<database-name>

The actual database name is controlled by MONGO_URI in .env.
Start MongoDB

If MongoDB is managed by systemd:

sudo systemctl start mongodb

To start MongoDB automatically when the machine boots:

sudo systemctl enable mongodb

Check its status:

sudo systemctl status mongodb --no-pager

A healthy service should show:

Active: active (running)

You can also verify that MongoDB is listening:

ss -ltnp | grep 27017

Or test the connection directly:

mongosh

Important

Start MongoDB before starting Hakiim.

If the application starts before MongoDB is accepting connections, you may see:

MongoDB Error: connect ECONNREFUSED 127.0.0.1:27017

4. Redis

Hakiim uses Redis as part of its application state/cache layer.

The default local Redis endpoint is:

127.0.0.1:6379

Start Redis

If Redis is managed by systemd:

sudo systemctl start redis

Check its status:

sudo systemctl status redis --no-pager

Verify that Redis is responding:

redis-cli ping

Expected response:

PONG

If Redis is unavailable, the application may report:

ECONNREFUSED 127.0.0.1:6379

or:

ECONNREFUSED ::1:6379

If your system uses a different Redis service name, find it with:

systemctl list-units --type=service | grep -i redis

5. Environment Configuration

Create your local environment file from the example:

cp .env.example .env

Then edit it:

nano .env

Your local configuration should contain the variables required by the application.

For example:

PORT=5000
NODE_ENV=development

MONGO_URI=mongodb://127.0.0.1:27017/hakiim_v1

REDIS_HOST=127.0.0.1
REDIS_PORT=6379

JWT_SECRET=replace_with_a_strong_local_secret
SECRET_PHRASE=replace_with_a_strong_local_secret

If .env.example contains additional variables, configure those according to your local environment.
Never commit

.env

Never place real production secrets in .env.example.
6. Startup Order

For normal local development, start the services in this order:

1. MongoDB
      ↓
2. Redis
      ↓
3. Hakiim API
      ↓
4. Optional PM2-managed services

The core dependency flow is:

MongoDB ──────┐
              ├──> Hakiim API
Redis ────────┘

Additional project services can be started through the processes configured in ecosystem.config.js.
7. Start Hakiim

From the project root, run:

npm run dev

This starts the application through Nodemon.

A successful startup should look similar to:

[nodemon] starting `node app.js`
Server running on 5000
Redis connected successfully
✅ MongoDB Connected

The exact log messages may change as the application evolves.
Start without Nodemon

To run the application without automatic restarts:

npm start

8. Verify the System

Before starting Hakiim, you can quickly verify the dependencies.
MongoDB

sudo systemctl is-active mongodb

Expected:

active

Redis

redis-cli ping

Expected:

PONG

Hakiim API

If the project exposes the /health endpoint:

curl http://localhost:5000/health

A successful response confirms that the API is reachable.

The basic local system is:

Client
  ↓
Hakiim API
  ↓
MongoDB + Redis

9. PM2

The repository contains:

ecosystem.config.js

This file defines the processes configured to run under PM2.

Install PM2 globally if necessary:

npm install -g pm2

Start the configured processes:

pm2 start ecosystem.config.js

Check running processes:

pm2 list

View logs:

pm2 logs

Restart the configured processes:

pm2 restart ecosystem.config.js

Stop them:

pm2 stop ecosystem.config.js

Remove them from PM2:

pm2 delete ecosystem.config.js

    Important: PM2 does not replace MongoDB or Redis. Those services must be running separately.

Quick Start

Once the machine has been configured, the normal startup routine is:

# Start MongoDB
sudo systemctl start mongodb

# Verify MongoDB
sudo systemctl is-active mongodb

# Start Redis
sudo systemctl start redis

# Verify Redis
redis-cli ping

# Start Hakiim
npm run dev

Expected:

MongoDB → active
Redis   → PONG
Hakiim  → Server running on 5000

Then, if needed, start the PM2-managed processes:

pm2 start ecosystem.config.js

Important

This runbook describes the local development environment.

Do not copy local development secrets or configuration directly into production. Production environments should use appropriate secret management, authentication, access controls, network security, monitoring, logging, and backups.