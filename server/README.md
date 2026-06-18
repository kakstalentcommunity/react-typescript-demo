# Server

This Express backend now persists users to a MariaDB-compatible database using Prisma.

## Setup

1. Install dependencies:

```bash
cd server
npm install
```

2. Update `.env`:

```env
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/mydb"
JWT_SECRET="replace-with-a-secret"
PORT=5000
```

3. Generate Prisma client and push the schema:

```bash
npx prisma generate
npx prisma db push
```

4. Start the server:

```bash
npm run dev
```

## Notes

- The React client is already configured to call `http://localhost:5000/api` from `client/src/services/axios.ts`.
- If you use MariaDB, the Prisma `mysql` provider is compatible.
