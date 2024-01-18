const testModel = require("./testModel");
const mongoose = require("mongoose");

const testController = {
  create: async (req, res) => {
    try {
      const { psyc_id, client_id, testName, date } = req.body;
      const time = Date(date);
      const test = await testModel.create({
        psyc_id,
        client_id,
        testName,
        date: time,
      });

      res.json({
        status: true,
        message: "Test created successfully",
        test,
      });
    } catch (err) {
      res.json({
        status: false,
        message: "Failed to create test",
        error: err.message,
      });
    }
  },
  update: async (req, res) => {
    try {
      const { response } = req.body;
      const testId = req.params.testId;

      const test = await testModel.findByIdAndUpdate(
        testId,
        { response, updateAt: Date.now() },
        { new: true }
      );

      if (!test) {
        return res.json({
          status: false,
          message: "Test not found",
        });
      }

      res.json({
        status: true,
        message: "Response updated successfully",
        test,
      });
    } catch (err) {
      res.json({
        status: false,
        message: "Failed to update response",
        error: err.message,
      });
    }
  },
};

module.exports = testController;
