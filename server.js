
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 10000;
const HOST = "0.0.0.0";

const JWT_SECRET =
  process.env.JWT_SECRET || "CHANGE_THIS_IN_RENDER";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

/*
====================================================
USERS
====================================================
ADMIN:
Username: Vaibhav
Password: Vaibhav@123

Representatives can be added later through
the Admin panel.
*/

const users = [
  {
    id: "ADMIN-001",
    representativeId: "ADMIN-001",
    username: "Vaibhav",
    passwordHash: bcrypt.hashSync("Vaibhav@123", 12),
    role: "ADMIN",
    active: true
  }
];

/*
====================================================
AUTHENTICATION
====================================================
*/

app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required."
      });
    }

    const user = users.find(
      u =>
        u.username.toLowerCase() ===
        String(username).toLowerCase()
    );

    if (!user || !user.active) {
      return res.status(401).json({
        message: "Invalid username or password."
      });
    }

    const passwordValid = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordValid) {
      return res.status(401).json({
        message: "Invalid username or password."
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        representativeId: user.representativeId,
        username: user.username,
        role: user.role
      },
      JWT_SECRET,
      {
        expiresIn: "8h"
      }
    );

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        representativeId: user.representativeId,
        username: user.username,
        role: user.role
      }
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Authentication server error."
    });
  }
});

/*
====================================================
TOKEN AUTHENTICATION
====================================================
*/

function authenticate(req, res, next) {

  const authorization =
    req.headers.authorization || "";

  if (!authorization.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication required."
    });
  }

  const token =
    authorization.substring(7);

  try {

    const decoded =
      jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();

  } catch (error) {

    return res.status(401).json({
      message: "Invalid or expired login session."
    });

  }
}

/*
====================================================
ADMIN ONLY
====================================================
*/

function adminOnly(req, res, next) {

  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required."
    });
  }

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({
      message: "Admin access only."
    });
  }

  next();
}

/*
====================================================
CURRENT USER
====================================================
*/

app.get(
  "/api/auth/me",
  authenticate,
  (req, res) => {

    res.json({
      user: req.user
    });

  }
);

/*
====================================================
ADMIN PROFILE
====================================================
*/

app.get(
  "/api/admin/profile",
  authenticate,
  adminOnly,
  (req, res) => {

    res.json({
      message: "Admin access granted.",
      user: req.user
    });

  }
);

/*
====================================================
REPRESENTATIVE MANAGEMENT
====================================================
*/

const representatives = [];

/*
GET ALL REPRESENTATIVES
ADMIN ONLY
*/

app.get(
  "/api/admin/representatives",
  authenticate,
  adminOnly,
  (req, res) => {

    res.json({
      representatives
    });

  }
);

/*
ADD REPRESENTATIVE
ADMIN ONLY
*/

app.post(
  "/api/admin/representatives",
  authenticate,
  adminOnly,
  async (req, res) => {

    try {

      const {
        representativeId,
        username,
        password,
        name
      } = req.body || {};

      if (
        !representativeId ||
        !username ||
        !password
      ) {
        return res.status(400).json({
          message:
            "Representative ID, username and password are required."
        });
      }

      if (
        representatives.some(
          r =>
            r.representativeId ===
            representativeId
        )
      ) {
        return res.status(409).json({
          message:
            "Representative ID already exists."
        });
      }

      const passwordHash =
        await bcrypt.hash(password, 12);

      const representative = {
        id:
          "REP-" +
          Date.now(),

        representativeId,

        username,

        name:
          name || username,

        passwordHash,

        role: "REPRESENTATIVE",

        active: true
      };

      representatives.push(
        representative
      );

      users.push(
        representative
      );

      res.status(201).json({
        message:
          "Representative created successfully.",

        representative: {
          id: representative.id,
          representativeId:
            representative.representativeId,
          username:
            representative.username,
          name:
            representative.name,
          role:
            representative.role,
          active:
            representative.active
        }
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message:
          "Unable to create representative."
      });

    }

  }
);

/*
====================================================
DOCTORS
====================================================
*/

const doctors = [];

/*
ADMIN CAN VIEW ALL DOCTORS
*/

app.get(
  "/api/admin/doctors",
  authenticate,
  adminOnly,
  (req, res) => {

    res.json({
      doctors
    });

  }
);

/*
ADMIN CAN ADD DOCTOR
*/

app.post(
  "/api/admin/doctors",
  authenticate,
  adminOnly,
  (req, res) => {

    const {
      doctorName,
      specialty,
      clinic,
      city,
      phone
    } = req.body || {};

    if (!doctorName) {
      return res.status(400).json({
        message:
          "Doctor name is required."
      });
    }

    const doctor = {
      id:
        "DR-" +
        Date.now(),

      doctorName,

      specialty:
        specialty || "",

      clinic:
        clinic || "",

      city:
        city || "",

      phone:
        phone || "",

      createdAt:
        new Date().toISOString()
    };

    doctors.push(doctor);

    res.status(201).json({
      message:
        "Doctor added successfully.",

      doctor
    });

  }
);

/*
====================================================
CHEMISTS
====================================================
*/

const chemists = [];

/*
ADMIN CAN VIEW CHEMISTS
*/

app.get(
  "/api/admin/chemists",
  authenticate,
  adminOnly,
  (req, res) => {

    res.json({
      chemists
    });

  }
);

/*
ADMIN CAN ADD CHEMIST
*/

app.post(
  "/api/admin/chemists",
  authenticate,
  adminOnly,
  (req, res) => {

    const {
      chemistName,
      address,
      city,
      phone
    } = req.body || {};

    if (!chemistName) {
      return res.status(400).json({
        message:
          "Chemist name is required."
      });
    }

    const chemist = {

      id:
        "CH-" +
        Date.now(),

      chemistName,

      address:
        address || "",

      city:
        city || "",

      phone:
        phone || "",

      createdAt:
        new Date().toISOString()
    };

    chemists.push(chemist);

    res.status(201).json({
      message:
        "Chemist added successfully.",

      chemist
    });

  }
);

/*
====================================================
DCR REPORTS
====================================================
*/

const dcrReports = [];

/*
SUBMIT DCR

ADMIN CAN SUBMIT ANY DCR.

REPRESENTATIVE CAN ONLY SUBMIT
FOR THEIR OWN REPRESENTATIVE ID.
*/

app.post(
  "/api/dcr",
  authenticate,
  (req, res) => {

    const {

      representativeId,

      date,

      doctorName,

      specialty,

      chemistVisited,

      chemistName,

      samplesGiven,

      giftsDistributed,

      remarks,

      latitude,

      longitude

    } = req.body || {};


    if (
      !representativeId ||
      !date ||
      !doctorName
    ) {

      return res.status(400).json({
        message:
          "Representative ID, date and doctor name are required."
      });

    }


    if (
      req.user.role !== "ADMIN" &&
      req.user.representativeId !==
        representativeId
    ) {

      return res.status(403).json({
        message:
          "You can only submit your own DCR."
      });

    }


    const report = {

      id:
        "DCR-" +
        Date.now(),

      representativeId,

      date,

      doctorName,

      specialty:
        specialty || "",

      chemistVisited:
        chemistVisited || "No",

      chemistName:
        chemistName || "",

      samplesGiven:
        samplesGiven || 0,

      giftsDistributed:
        giftsDistributed || 0,

      remarks:
        remarks || "",

      location:
        latitude && longitude
          ? {
              latitude,
              longitude
            }
          : null,

      createdBy:
        req.user.username,

      createdAt:
        new Date().toISOString()

    };


    dcrReports.push(report);


    res.status(201).json({

      message:
        "DCR submitted successfully.",

      report

    });

  }
);

/*
====================================================
DCR HISTORY
====================================================
*/

app.get(
  "/api/dcr",
  authenticate,
  (req, res) => {

    if (req.user.role === "ADMIN") {

      return res.json({
        reports: dcrReports
      });

    }


    const ownReports =
      dcrReports.filter(
        report =>
          report.representativeId ===
          req.user.representativeId
      );


    res.json({
      reports: ownReports
    });

  }
);

/*
====================================================
LOCATION
====================================================
*/

app.post(
  "/api/location",
  authenticate,
  (req, res) => {

    const {
      latitude,
      longitude
    } = req.body || {};

    if (
      latitude === undefined ||
      longitude === undefined
    ) {

      return res.status(400).json({
        message:
          "Location coordinates are required."
      });

    }


    /*
    Location is accepted only after
    the phone/browser gives permission.
    The server does not bypass device
    location permissions.
    */

    res.json({

      message:
        "Location received.",

      user: {
        representativeId:
          req.user.representativeId,

        role:
          req.user.role
      },

      location: {
        latitude,
        longitude
      }

    });

  }
);

/*
====================================================
ADMIN SETTINGS
====================================================
*/

app.get(
  "/api/admin/settings",
  authenticate,
  adminOnly,
  (req, res) => {

    res.json({

      application:
        "V-CareRx DCR",

      admin:
        "Vaibhav",

      permissions: {

        representatives:
          true,

        doctors:
          true,

        chemists:
          true,

        dcrReports:
          true,

        location:
          true,

        reports:
          true,

        settings:
          true

      }

    });

  }
);

/*
====================================================
HEALTH CHECK
====================================================
*/

app.get(
  "/api/health",
  (req, res) => {

    res.json({

      ok:
        true,

      service:
        "V-CareRx DCR API"

    });

  }
);

/*
====================================================
PAGES
====================================================
*/

app.get(
  "/",
  (req, res) => {

    res.sendFile(
      path.join(
        __dirname,
        "public",
        "index.html"
      )
    );

  }
);

app.get(
  "/dashboard.html",
  (req, res) => {

    res.sendFile(
      path.join(
        __dirname,
        "public",
        "dashboard.html"
      )
    );

  }
);

/*
====================================================
START SERVER
====================================================
*/

app.listen(
  PORT,
  HOST,
  () => {

    console.log(
      `V-CareRx DCR running on ${HOST}:${PORT}`
    );

  }
);
