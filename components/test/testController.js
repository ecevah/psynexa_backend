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
  list: async (req, res) => {
    try {
      const { psyc_id, client_id } = req.query;

      // Filtreleme için boş bir nesne oluştur
      const filter = {};

      // psyc_id veya client_id varsa filtrele
      if (psyc_id) {
        filter.psyc_id = psyc_id;
      }

      if (client_id) {
        filter.client_id = client_id;
      }

      const tests = await testModel
        .find(filter)
        .populate("psyc_id")
        .populate("client_id");

      res.json({
        status: true,
        message: "Tests listed successfully",
        tests,
      });
    } catch (err) {
      res.json({
        status: false,
        message: "Failed to list tests",
        error: err.message,
      });
    }
  },
};

module.exports = testController;
