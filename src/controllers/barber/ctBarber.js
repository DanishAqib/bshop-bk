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

  static async getAllAppointmentRequestsForBarber(req, res) {
    try {
      const { u_id, uar_status } = req.params;
      const user = await pool.query(
        `SELECT * FROM users WHERE u_id = '${u_id}'`
      );
      if (user.rows.length === 0) {
        return res.status(400).json("User does not exist");
      }
      const appointments = await pool.query(
        `SELECT * FROM user_appointment_req WHERE b_id = '${u_id}' AND uar_status = '${uar_status}'`
      );
      const userIds = appointments.rows.map((appointment) => appointment.u_id);
      const users = userIds.map(async (userId) => {
        const user = await pool.query(
          `SELECT u_id, u_firstname, u_lastname FROM users WHERE u_id = '${userId}'`
        );
        return user.rows[0];
      });
      const usersData = await Promise.all(users);
      const appointmentsData = appointments.rows.map((appointment) => {
        const users_info = usersData.find(
          (user) => user.u_id === appointment.u_id
        );
        return { ...appointment, users_info };
      });
      res.json(appointmentsData);
    } catch (err) {
      console.error(err.message);
    }
  }

  static async updateAppointmentRequestStatus(req, res) {
    try {
      const { uar_id } = req.params;
      const { uar_status } = req.body;
      const appointment = await pool.query(
        `SELECT * FROM user_appointment_req WHERE uar_id = '${uar_id}'`
      );
      if (appointment.rows.length === 0) {
        return res.status(400).json("Appointment does not exist");
      }
      await pool.query(
        `UPDATE user_appointment_req SET uar_status = '${uar_status}' WHERE uar_id = '${uar_id}'`
      );
      res.json("Appointment status updated");
    } catch (err) {
      console.error(err.message);
    }
  }
}

module.exports = CtBarber;
