const pool = require("../../db");

class CtBarber {
  static async getAllBarbers(req, res) {
    try {
      const allBarbers = await pool.query(
        `SELECT u_firstname, u_lastname, bi_id, b_id, b_city, b_status, b_shop_name FROM barber_info JOIN users ON barber_info.b_id = users.u_id`
      );
      res.json(allBarbers.rows);
    } catch (err) {
      console.error(err.message);
    }
  }

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
