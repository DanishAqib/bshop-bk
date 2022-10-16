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
      const {
        u_firstname,
        u_lastname,
        u_email,
        u_password,
        u_role,
        b_city,
        b_shop_name,
      } = req.body;
      if (
        !u_firstname ||
        !u_lastname ||
        !u_email ||
        !u_password ||
        (u_role === "barber" && (!b_city || !b_shop_name))
      ) {
        return res.status(400).json("Please provide all fields");
      }
      const emailExists = await srCheckIfEmailExists(u_email);
      if (!emailExists) {
        return res.status(400).json("Email already exists");
      }
      const newUser = await pool.query(
        `INSERT INTO users (u_firstname, u_lastname, u_email, u_password, u_role) VALUES ('${u_firstname}', '${u_lastname}', '${u_email}', '${u_password}', '${u_role}') RETURNING *`
      );
      if (u_role === "barber" && b_city) {
        await pool.query(
          `INSERT INTO barber_info (b_id, b_status, b_city, b_shop_name) VALUES ('${newUser.rows[0].u_id}', 'available', '${b_city}', '${b_shop_name}') RETURNING *`
        );
      }
      res.json(newUser.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  }

  static async getUserInfo(req, res) {
    try {
      const { u_email } = req.params;
      const user = await pool.query(
        `SELECT * FROM users WHERE u_email = '${u_email}'`
      );
      res.json(user.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  }

  static async updateUserInfo(req, res) {
    try {
      const { u_id } = req.params;
      const user = await pool.query(
        `SELECT * FROM users WHERE u_id = '${u_id}'`
      );
      if (user.rows.length === 0) {
        return res.status(400).json("User does not exist");
      }
      const { u_firstname, u_lastname, u_password, b_city } =
        req.body.u_info.u_info;
      await pool.query(
        `UPDATE users SET u_firstname = '${u_firstname}', u_lastname = '${u_lastname}', u_password = '${u_password}' WHERE u_id = '${u_id}'`
      );
      if (user.rows[0].u_role === "barber" && b_city) {
        await pool.query(
          `UPDATE barber_info SET b_city = '${b_city}' WHERE b_id = '${u_id}'`
        );
      }
      res.json(user.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  }

  static async makeAppointmentRequest(req, res) {
    try {
      const { u_id, b_id, uar_time, uar_services, uar_total_price } = req.body;
      const user = await pool.query(
        `SELECT * FROM users WHERE u_id = '${u_id}'`
      );
      if (user.rows.length === 0) {
        return res.status(400).json("User does not exist");
      }
      const barber = await pool.query(
        `SELECT * FROM users WHERE u_id = '${b_id}'`
      );
      if (barber.rows.length === 0) {
        return res.status(400).json("Barber does not exist");
      }
      const newAppointment = await pool.query(
        `INSERT INTO user_appointment_req (u_id, b_id, uar_time, uar_services, uar_total_price) VALUES ('${u_id}', '${b_id}', '${uar_time}', '${uar_services}', '${uar_total_price}') RETURNING *`
      );
      res.json(newAppointment.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  }
}

module.exports = CtUser;
