const ClientModel = require("./clientModel.js");
const { json } = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const clientModel = require("./clientModel.js");
const nodemailer = require("nodemailer");
const psycModel = require("../psychologist/psychologistModel.js");
const path = require("path");

require("dotenv").config();

const clientController = {
  login: async (req, res) => {
    try {
      const client = await ClientModel.findOne({ eMail: req.body.email });
      let compare = bcrypt.compareSync(req.body.pass, client.pass);
      if (compare) {
        const token = jwt.sign(
          {
            client,
          },
          process.env.SECRET_KEY_LOGER,
          { expiresIn: "6h" }
        );
        res.json({
          status: true,
          message: "Login Succesful",
          token: token,
          client,
        });
      } else {
        res.status(400).json({
          status: false,
          message: "Login Wrong Data",
        });
      }
    } catch (err) {
      res.status(400).json({
        status: false,
        message: "Login UnSuccesful",
        err: err,
      });
    }
  },
  find: async (req, res) => {
    try {
      const client = await ClientModel.findById(req.params.id);
      res.json({
        status: true,
        message: "Find Complated",
        value: { client },
      });
    } catch (err) {
      res.json({
        status: false,
        message: "Find Not Complated",
        err: err,
      });
    }
  },
  findSpecific: async (req, res) => {
    try {
      let { name, surname, email, birth, limit, skip, sort } = req.query;
      let func = 1;
      if (sort == "asc") {
        func = 1; // Change this to 1 for ascending order
      } else if (sort == "desc") {
        func = -1; // -1 for descending order
      }

      const client = await ClientModel.find({
        $or: [
          { name: name },
          { surName: surname }, // Check if your actual field is surName or surname
          { eMail: email }, // Check if your actual field is eMail or email
          { dateOfBirth: birth },
        ],
      })
        .limit(parseInt(limit)) // Convert to integer
        .skip(parseInt(skip)); // Convert to integer

      res.json({
        status: true,
        message: "Find Completed",
        value: { client },
      });
    } catch (err) {
      res.json({
        status: false,
        message: "Find Not Completed",
        err: err,
      });
    }
  },
  all: async (req, res) => {
    try {
      const clients = await ClientModel.find({});
      res.json({
        status: true,
        message: "Find Complated",
        value: { clients },
      });
    } catch (err) {
      res.json({
        status: false,
        message: "Find Not Complated",
        err: err,
      });
    }
  },
  create: async (req, res) => {
    try {
      const { name, birth, surname, pass, email, sex, number } = req.body;
      console.log(req.body);
      let passHash = await bcrypt.hash(pass, 8);
      const date = new Date(birth);
      const client = await ClientModel.create({
        name,
        surName: surname,
        pass: passHash,
        eMail: email,
        sex,
        number,
        date,
      });

      res.json({
        status: true,
        message: "Added",
        client,
      });
    } catch (err) {
      res.json({
        status: false,
        message: "Not Added",
        err: err.message,
      });
    }
  },
  delete: async (req, res) => {
    try {
      const client = await ClientModel.findByIdAndDelete(req.params.id);
      res.json({
        status: true,
        message: `${req.body.id} Deleted`,
      });
    } catch (err) {
      res.json({
        status: true,
        message: `${req.body.id}`,
        err: err,
      });
    }
  },
  update: async (req, res) => {
    try {
      const client = await ClientModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.json({
        status: true,
        message: `${req.params.id} Updated`,
        value: { client },
      });
    } catch (err) {
      res.json({
        status: false,
        message: "Data not update",
        err: err,
      });
    }
  },
  passUpdate: async (req, res) => {
    try {
      const decoded = jwt.verify(req.body.token, process.env.SECRET_KEY_LOGER);
      let passHash = await bcrypt.hash(req.body.pass, 8);
      const client = await clientModel.findByIdAndUpdate(
        decoded.client[0]._id,
        { pass: passHash },
        { new: true }
      );
      if (client == {}) {
        res.json({
          status: false,
          message: "Pass Update",
          client,
        });
      }
      res.json({
        status: true,
        message: "Pass Update",
        client,
      });
    } catch (err) {
      res.json({
        status: false,
        message: "Pass Not Updated",
        err,
      });
    }
  },
  favoricreate: async (req, res) => {
    try {
      const client = await clientModel.findByIdAndUpdate(
        req.body.id,
        { $push: { favorites: req.body.favorites } },
        { new: true }
      );

      res.json({
        status: true,
        message: "Add",
      });
    } catch (err) {
      res.json({
        status: false,
        message: "Not Added",
        err: err,
      });
    }
  },
  lookup_favori: async (req, res) => {
    try {
      const client = await ClientModel.findById(req.params.id);
      res.json({
        status: true,
        message: "Find Complated",
        value: client.favorites,
      });
    } catch (err) {
      res.json({
        status: false,
        message: "Find Not Complated",
        err: err,
      });
    }
  },
  favoridelete: async (req, res) => {
    try {
      const client = await clientModel.findByIdAndUpdate(
        req.body.id,
        { $pull: { favorites: req.body.favorites } },
        { new: true }
      );

      res.json({
        status: true,
        message: "Add",
      });
    } catch (err) {
      res.json({
        status: false,
        message: "Not Added",
        err: err,
      });
    }
  },
};

module.exports = clientController;
