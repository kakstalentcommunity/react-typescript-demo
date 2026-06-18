const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "dev-only-secret";
const prisma = new PrismaClient({
  adapter: new PrismaMariaDb(process.env.DATABASE_URL),
});

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);
app.use(express.json());

const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const createToken = (user) =>
  jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "7d",
  });

const sendAuthResponse = (res, user) => {
  const token = createToken(user);

  return res.status(200).json({
    user: publicUser(user),
    token,
  });
};

const requireAuth = async (req, res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Authentication required." });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { email: payload.email } });

    if (!user) {
      return res.status(401).json({ message: "Session is no longer valid." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Session is invalid or expired." });
  }
};

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/auth/register", async (req, res) => {
  try {
    console.log('register route called', req.body);
    const { email, name, password } = req.body;

    if (!name || !email || !password) {
      console.log('register missing fields', { name, email, password });
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    if (password.length < 8) {
      console.log('register password too short');
      return res.status(400).json({ message: "Password must be at least 8 characters." });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    console.log('register normalizedEmail', normalizedEmail);

    const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existingUser) {
      console.log('register user exists', normalizedEmail);
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name: String(name).trim(),
        email: normalizedEmail,
        passwordHash,
        role: "admin",
      },
    });

    console.log('register success', user.id);
    return sendAuthResponse(res, user);
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Failed to register.", error: error.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = String(email ?? "").trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const passwordMatches = await bcrypt.compare(String(password ?? ""), user.passwordHash);

  if (!passwordMatches) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  return sendAuthResponse(res, user);
});

app.get("/api/auth/me", requireAuth, (req, res) => {
  return sendAuthResponse(res, req.user);
});

app.get("/api/employees", requireAuth, async (_req, res) => {
  const employees = await prisma.employee.findMany({ orderBy: { createdAt: "desc" } });
  res.json(employees);
});

app.post("/api/employees", requireAuth, async (req, res) => {
  const { name, email, department, role, status } = req.body;

  if (!name || !email || !department || !role || !status) {
    return res.status(400).json({ message: "Missing employee fields." });
  }

  const existingEmployee = await prisma.employee.findUnique({
    where: { email: String(email).trim().toLowerCase() },
  });

  if (existingEmployee) {
    return res.status(409).json({ message: "An employee with this email already exists." });
  }

  const employee = await prisma.employee.create({
    data: {
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      department: String(department).trim(),
      role: String(role).trim(),
      status: String(status).trim(),
    },
  });

  res.status(201).json(employee);
});

app.delete("/api/employees/email/:email", requireAuth, async (req, res) => {
  const email = String(req.params.email).trim().toLowerCase();

  try {
    await prisma.employee.delete({ where: { email } });
    res.status(204).send();
  } catch {
    res.status(404).json({ message: "Employee not found." });
  }
});

app.get("/api/inventory", requireAuth, async (_req, res) => {
  const items = await prisma.inventoryItem.findMany({ orderBy: { createdAt: "desc" } });
  res.json(items);
});

app.post("/api/inventory", requireAuth, async (req, res) => {
  const { sku, item, stock, location, status } = req.body;

  if (!sku || !item || stock == null || !location || !status) {
    return res.status(400).json({ message: "Missing inventory fields." });
  }

  const existingItem = await prisma.inventoryItem.findUnique({
    where: { sku: String(sku).trim().toUpperCase() },
  });

  if (existingItem) {
    return res.status(409).json({ message: "An inventory item with this SKU already exists." });
  }

  const createdItem = await prisma.inventoryItem.create({
    data: {
      sku: String(sku).trim().toUpperCase(),
      item: String(item).trim(),
      stock: Number(stock),
      location: String(location).trim(),
      status: String(status).trim(),
    },
  });

  res.status(201).json(createdItem);
});

app.delete("/api/inventory/sku/:sku", requireAuth, async (req, res) => {
  const sku = String(req.params.sku).trim().toUpperCase();

  try {
    await prisma.inventoryItem.delete({ where: { sku } });
    res.status(204).send();
  } catch {
    res.status(404).json({ message: "Inventory item not found." });
  }
});

app.get("/api/finance", requireAuth, async (_req, res) => {
  const records = await prisma.financeRecord.findMany({ orderBy: { date: "desc" } });
  res.json(records);
});

app.post("/api/finance", requireAuth, async (req, res) => {
  const { vendor, amount, status, date } = req.body;

  if (!vendor || amount == null || !status || !date) {
    return res.status(400).json({ message: "Missing finance fields." });
  }

  const record = await prisma.financeRecord.create({
    data: {
      vendor: String(vendor).trim(),
      amount: Number(amount),
      status: String(status).trim(),
      date: new Date(date),
    },
  });

  res.status(201).json(record);
});

app.delete("/api/finance/:id", requireAuth, async (req, res) => {
  try {
    await prisma.financeRecord.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ message: "Finance record not found." });
  }
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Server error." });
});

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
