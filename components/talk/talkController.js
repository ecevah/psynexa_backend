const talkModel = require("./talkModel");
const reservationModule = require("../reservation/reservationModule");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const puppeteer = require("puppeteer");
const fs = require("fs");

function formatTarih(tarihString) {
  const tarih = new Date(tarihString);
  const gun = tarih.getDate();
  const ay = tarih.getMonth() + 1; // JavaScript'te aylar 0'dan başlar, bu nedenle 1 eklenir.
  const yil = tarih.getFullYear();
  const formatliAy = ay < 10 ? `0${ay}` : ay;
  const formatliGun = gun < 10 ? `0${gun}` : gun;
  const formatliTarih = `${formatliGun}.${formatliAy}.${yil}`;
  return formatliTarih;
}

const talkController = {
  createTalk: async (req, res) => {
    try {
      const existingTalk = await talkModel.findOne({
        reservation_id: req.params.id,
      });
      if (existingTalk) {
        return res.json({
          status: false,
          message: "Talk with the same reservation_id already exists.",
        });
      } else {
        const reservation_id = req.params.id;
        const reservation = await reservationModule.findById(reservation_id);

        const disorder_rate_photo = `${reservation_id}_disorder_plot.png`;
        const head_move_photo = `${reservation_id}_head_move_plot.png`;
        const emotion_photo = `${reservation_id}_emotion_plot.png`;
        const htmlContent = fs.readFileSync(
          path.join(__dirname, "template.html"),
          "utf8"
        );

        const filledHtmlContent = htmlContent
          .replace(
            "{{name}}",
            `${reservation.client_id.name} ${reservation.client_id.surName} `
          )
          .replace("{{gender}}", `${reservation.client_id.sex}`)
          .replace("{{birthDate}}", `${reservation.client_id.name}`)
          .replace(
            "{{phoneNumber}}",
            formatTarih(reservation.client_id.dateOfBirth)
          )
          .replace("{{chart1}}", disorder_rate_photo)
          .replace("{{chart2}}", head_move_photo)
          .replace("{{chart3}}", emotion_photo);

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(filledHtmlContent);
        const pdfBuffer = await page.pdf({ format: "A4" });
        await browser.close();

        const pdfPath = path.join(
          __dirname,
          "..",
          "..",
          "public",
          "uploads",
          "pdf",
          `${reservation_id}.pdf`
        );

        if (!fs.existsSync(path.dirname(pdfPath))) {
          fs.mkdirSync(path.dirname(pdfPath), { recursive: true });
        }

        fs.writeFileSync(pdfPath, pdfBuffer);

        const newTalk = await talkModel.create({
          reservation_id: req.params.id,
          disorder_rate: disorder_rate_photo,
          head_move: head_move_photo,
          emotion: emotion_photo,
        });

        res.json({
          status: true,
          message: "Talk created successfully",
          talk: newTalk,
        });
      }
    } catch (err) {
      return res.json({
        status: false,
        message: "Not Added",
        err: err.message,
      });
    }
  },
  getTalkByReservationId: async (req, res) => {
    try {
      const { id } = req.query;
      const talks = await talkModel
        .find({ reservation_id: id })
        .sort({ _id: 1 })
        .populate({
          path: "reservation_id",
          populate: {
            path: "client_id",
          },
        });
      res.json({
        status: true,
        message: "Talks retrieved successfully",
        talks,
      });
    } catch (err) {
      res.json({
        status: false,
        message: "Failed to retrieve talks",
        error: err.message,
      });
    }
  },
  find: async (req, res) => {
    try {
      const talk = await talkModel.findById(req.query.id);
      res.json({
        status: true,
        message: "Find Complated",
        talk,
      });
    } catch (err) {
      res.json({
        status: false,
        message: "Find Not Complated",
        err: err,
      });
    }
  },
  generatePdf: async (req, res) => {
    try {
      const htmlContent = fs.readFileSync(
        path.join(__dirname, "template.html"),
        "utf8"
      );

      // Replace placeholders with actual data
      const filledHtmlContent = htmlContent
        .replace("{{name}}", "userData.name")
        .replace("{{birthDate}}", "userData.birthDate")
        .replace("{{phoneNumber}}", "userData.phoneNumber");

      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setContent(filledHtmlContent);
      const pdfBuffer = await page.pdf({ format: "A4" });
      await browser.close();

      const pdfPath = path.join(
        __dirname,
        "..",
        "..",
        "public",
        "uploads",
        "pdf",
        "123.pdf"
      );

      // Create the necessary directory if it doesn't exist
      if (!fs.existsSync(path.dirname(pdfPath))) {
        fs.mkdirSync(path.dirname(pdfPath), { recursive: true });
      }

      fs.writeFileSync(pdfPath, pdfBuffer);

      res.status(200).json({
        status: true,
        message: "PDF generated successfully",
        pdfPath,
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Failed to generate PDF",
        error: err.message,
      });
    }
  },
};

module.exports = talkController;
