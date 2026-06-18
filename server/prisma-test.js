require("dotenv").config();
const {PrismaClient} = require("@prisma/client");
const {PrismaMariaDb} = require("@prisma/adapter-mariadb");
const prisma = new PrismaClient({ adapter: new PrismaMariaDb(process.env.DATABASE_URL) });
prisma.user.create({ data: { name: "TestDirect", email: "directtest@example.com", passwordHash: "hash", role: "admin" } })
  .then((r) => { console.log("created", r.id); return prisma.$disconnect(); })
  .catch((e) => { console.error("create error", e); return prisma.$disconnect(); });
