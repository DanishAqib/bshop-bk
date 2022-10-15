const pool = require("../../db");

class CtBarber {
  static async updateBarberStatus(req, res) {
    try {
      const { u_id } = req.params;
      const { b_status } = req.body;
      const user = await pool.query(
        `SELECT * FROM users WHERE u_id = '${u_id}'`
      );
      if (user.rows.length === 0) {
        return res.status(400).json("User does not exist");
      }
      await pool.query(
        `UPDATE barber_info SET b_status = '${b_status}' WHERE b_id = '${u_id}'`
      );
      res.json("Barber status updated");
    } catch (err) {
      console.error(err.message);
    }
  }

  static async getBarberInfo(req, res) {
    try {
      const { u_email } = req.params;
      const user = await pool.query(
        `SELECT * FROM users WHERE u_email = '${u_email}'`
      );
      if (user.rows.length === 0) {
        return res.status(400).json("User does not exist");
      }
      const barber = await pool.query(
        `SELECT * FROM barber_info WHERE b_id = '${user.rows[0].u_id}'`
      );
      res.json(barber.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  }
}

module.exports = CtBarber;
