# Auction Platform Backend

A Node.js backend application for an auction platform using Express and Prisma
with MySQL database.

## Prerequisites

- Node.js (v18 or later)

- Docker and Docker Compose

- MySQL (if running without Docker)

## Environment Setup

Create an `.env` file with these contents:

```bash
APP_PORT=3000
MYSQL_ROOT_PASSWORD=YOUR_PASSWORD
MYSQL_DATABASE=AUCTION_APP
DATABASE_URL="mysql://{YOUR_USERNAME}:${MYSQL_ROOT_PASSWORD}@db:3306/${MYSQL_DATABASE}"
```

## Running with Docker

1. Start the application using Docker Compose:

```bash
docker compose up --build
```

This will

- Build and start the Node.js application

- Start MySQL database

- Run Prisma migrations

- Start the server in development mode

The application will be available at `http://localhost:3000`

After the application started successfully, add Database Data:

```bash
docker exec -i auction_db_mysql mysql --default-character-set=utf8mb4 -u root -p[MẬT_KHẨU_CỦA_BẠN] AUCTION_APP < ./init_sql/auction_data.sql
```

Run migration (If there is any update relating to your sql):

```bash
docker-compose exec app npx prisma migrate dev --name [name]
```

Run generate (If there is any update relating to your sql) to generate code:

```bash
docker-compose exec app npx prisma db pull
docker-compose exec app npx prisma generate
```

Run prisma studio:

```bash
docker-compose run --rm -p 5555:5555 app npm run studio
```

Reset Database:

```bash
docker-compose exec app npx prisma migrate reset
```

## Running locally if you do not have Docker

Install Dependencies

```bash
npm install or npm i
```

Generate Prisma client

```bash
npx prisma generate
```

Run database migrations

```bash
npm run migrate
```

Start the development server

```bash
npm run dev
```

## Available Scripts:

`npm start`: Start the production server

`npm run dev`: Start the development server with hot-reload

`npm run migrate`: Run Prisma migrations

`npm run studio`: Open Prisma Studio to manage database

## Database Management

- Access Prisma Studio: `npm run studio`

- View database schema: Check `schema.prisma`

- Initial SQL setup: See `auction_sql.sql`

## Project Structure

```bash
backend/
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── migrations/      # Database migrations
├── init_sql/
│   └── auction_sql.sql  # Initial SQL setup
├── server.js           # Main application file
├── Dockerfile          # Docker configuration
├── docker-compose.yml  # Docker Compose configuration
└── package.json        # Project dependencies
```
