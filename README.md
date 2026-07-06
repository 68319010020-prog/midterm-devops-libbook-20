# midterm-devops-libbook-68319010020

- ชื่อ: ธเนศพล วารปรีด
- รหัสนักศึกษา: 68319010020
- ระดับชั้น/กลุ่มเรียน: ปวส.2/2
- รายวิชา: DevOps 30901-2008 (Midterm)

Status: ![CI](https://github.com/68319010020-prog/midterm-devops-libbook-20/actions/workflows/ci.yml/badge.svg)

ระบบบันทึกทะเบียนหนังสือห้องสมุด (libbook)

สรุปสั้น ๆ: REST API (Node.js + Express) + PostgreSQL, Frontend HTML/Vanilla JS, Docker, CI

API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | /api/books | List books |
| GET | /api/books/:id | Get book by id |
| POST | /api/books | Create book |
| PUT | /api/books/:id | Update book |
| DELETE | /api/books/:id | Delete book |
| GET | /health | Health check |

Run (dev) with Docker Compose (build):

```bash
cp .env.example .env
docker compose up -d --build
```

Run (prod) pulling images from Docker Hub:

```bash
docker compose -f docker-compose.prod.yml up -d
```

Docker Hub repositories:

- [ponlpon/libbook-api](https://hub.docker.com/r/ponlpon/libbook-api) — tags: `v1.0.0`, `latest`
- [ponlpon/libbook-web](https://hub.docker.com/r/ponlpon/libbook-web) — tags: `v1.0.0`, `latest`

Repository GitHub: [68319010020-prog/midterm-devops-libbook-20](https://github.com/68319010020-prog/midterm-devops-libbook-20)
