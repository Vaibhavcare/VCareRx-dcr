const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "CHANGE_THIS_SECRET_IN_PRODUCTION";

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const ADMIN = {
  id: "VC-ADMIN-001",
  username: "Vaibhav",
  // Password hash for the supplied password: Vaibhav@123
  passwordHash: bcrypt.hashSync("Vaibhav@123", 12),
  role: "admin"
};

app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  const validUser = username.toLowerCase() === ADMIN.username.toLowerCase();
  const validPassword = await bcrypt.compare(password, ADMIN.passwordHash);

  if (!validUser || !validPassword) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  const token = jwt.sign(
    { sub: ADMIN.id, username: ADMIN.username, role: ADMIN.role },
    JWT_SECRET,
    { expiresIn: "8h" }
  );

  res.json({
    message: "Login successful",
    token,
    user: { id: ADMIN.id, username: ADMIN.username, role: ADMIN.role }
  });
});

function authenticate(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Authentication required." });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

app.get("/api/auth/me", authenticate, (req, res) => {
  res.json({ user: req.user });
});

app.post("/api/auth/logout", authenticate, (req, res) => {
  // JWT is stateless; the client removes its token.
  res.json({ message: "Logged out successfully." });
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "V-CareRx DCR Authentication API" });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`V-CareRx DCR running at http://localhost:${PORT}`);
});
