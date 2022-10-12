const pool = require("../../db");

const srCheckIfUserExists = async (u_email, u_password) => {
  try {
    const user = await pool.query(
      `SELECT * FROM users WHERE u_email = '${u_email}' AND u_password ='${u_password}'`
    );
    if (user.rows.length === 0) {
      return false;
    }
    const userRole = user.rows[0].u_role;
    return {
      userRole,
      status: true,
    };
  } catch (err) {
    console.error(err.message);
  }
};

const srCheckIfEmailExists = async (u_email) => {
  try {
    const user = await pool.query(
      `SELECT * FROM users WHERE u_email = '${u_email}'`
    );
    if (user.rows.length === 0) {
      return true;
    }
    return false;
  } catch (err) {
    console.error(err.message);
  }
};

class CtUser {
  static async userlogin(req, res) {
    try {
      const { u_email, u_password } = req.body;
      if (!u_email || !u_password) {
        return res.status(400).json("Please provide an email and password");
      }
      const userExists = await srCheckIfUserExists(u_email, u_password);
      if (userExists.status) {
        return res.status(200).json(userExists.userRole);
      } else {
        return res
          .status(400)
          .json("Invalid email or password. Please try again");
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  static async addUser(req, res) {
    try {
      const { u_firstname, u_lastname, u_email, u_password, u_role } = req.body;
      if (!u_firstname || !u_lastname || !u_email || !u_password) {
        return res.status(400).json("Please provide all fields");
      }
      const emailExists = await srCheckIfEmailExists(u_email);
      if (!emailExists) {
        return res.status(400).json("Email already exists");
      }
      const newUser = await pool.query(
        `INSERT INTO users (u_firstname, u_lastname, u_email, u_password, u_role) VALUES ('${u_firstname}', '${u_lastname}', '${u_email}', '${u_password}', '${u_role}') RETURNING *`
      );
      res.json(newUser.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  }
}

module.exports = CtUser;
