const mongoose = require("mongoose");
const notificationModel = require("./notificationModel");
const reservationModel = require("../reservation/reservationModule");

const notificationController = {
  create: async (req, res) => {
    try {
      const { psyc_id, client_id, reservation_id, test_id } = req.body;

      // Check if reservation_id is provided
      let validDate;
      if (reservation_id) {
        // Fetch reservation details
        const reservation = await reservationModel.findById(reservation_id);
        if (!reservation) {
          throw new Error("Reservation not found");
        }

        // Extract the day from the date
        const dayFromDate = new Date(reservation.day)
          .toISOString()
          .split("T")[0];
        console.log(dayFromDate);
        // Combine date and time strings and create a Date object
        const combinedDateTimeString = `${dayFromDate}T${reservation.time}:00.000Z`;
        console.log(combinedDateTimeString);
        validDate = Date(combinedDateTimeString);
        console.log(validDate);
      } else {
        // If reservation_id is not provided, calculate 5 days from now
        const currentDate = new Date();
        validDate = new Date(currentDate);
        validDate.setDate(currentDate.getDate() + 5);
      }

      const notif = await notificationModel.create({
        psyc_id,
        client_id,
        reservation_id,
        test_id,
        validDate: validDate,
      });

      res.json({
        status: true,
        message: "Create Completed",
        notif,
      });
    } catch (err) {
      res.json({
        status: false,
        message: "Create Not Completed",
        error: err.message,
      });
    }
  },

  find: async (req, res) => {
    try {
      const {
        psyc_id,
        client_id,
        reservation_id,
        test_id,
        sortByDate,
      } = req.query;

      const query = {};
      if (psyc_id) query.psyc_id = psyc_id;
      if (client_id) query.client_id = client_id;
      if (reservation_id) query.reservation_id = reservation_id;
      if (test_id) query.test_id = test_id;

      let results;
      if (sortByDate) {
        results = await notificationModel
          .find(query)
          .sort({ validDate: sortByDate });
      } else {
        results = await notificationModel.find(query);
      }

      res.json({
        status: true,
        message: "Find Completed",
        results,
      });
    } catch (err) {
      res.json({
        status: false,
        message: "Find Not Completed",
        error: err.message,
      });
    }
  },
};

module.exports = notificationController;
