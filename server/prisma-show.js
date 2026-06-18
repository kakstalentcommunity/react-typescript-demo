require("dotenv").config();
const {PrismaClient} = require("@prisma/client");
const {PrismaMariaDb} = require("@prisma/adapter-mariadb");
const prisma = new PrismaClient({ adapter: new PrismaMariaDb(process.env.DATABASE_URL) });
prisma.$queryRaw`SHOW TABLES`.then((r) => { console.log(JSON.stringify(r, null, 2)); return prisma.$disconnect(); }).catch((e) => { console.error(e); return prisma.$disconnect(); });
