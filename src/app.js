const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const CtUser = require("./controllers/user/ctUser");
const CtBarber = require("./controllers/barber/ctBarber");

const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  }
  client.query("SELECT NOW()", (err, result) => {
    release();
    if (err) {
      return console.error("Error executing query", err.stack);
    }
    console.log("Connected to database");
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/users", async (req, res) => {
  try {
    const allUsers = await pool.query("SELECT * FROM users");
    res.json(allUsers.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.post("/api/user", CtUser.userlogin);
app.post("/api/user/add_user", CtUser.addUser);

app.get("/api/user/get_user_info/:u_email", CtUser.getUserInfo);
app.get("/api/barber/get_barber_info/:u_email", CtBarber.getBarberInfo);

app.put("/api/barber/update_status/:u_id", CtBarber.updateBarberStatus);
app.put("/api/user/update_user_info/:u_id", CtUser.updateUserInfo);
