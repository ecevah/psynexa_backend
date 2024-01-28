const psychologistModel = require("./psychologistModel");
const { json } = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
require("dotenv").config();
const path = require("path");
const { decode } = require("punycode");

const psychologistController = {
  login: async (req, res) => {
    try {
      const psychologist = await psychologistModel.findOne({
        eMail: req.body.email,
      });

      let compare = bcrypt.compareSync(req.body.pass, psychologist.pass);

      if (compare) {
        if (psychologist.accActive) {
          const token = jwt.sign(
            {
              psychologist,
            },
            process.env.SECRET_KEY_LOGER,
            {}
          );

          res.json({
            status: true,
            active: true,
            message: "Login Succesful",
            token: token,
            psychologist,
          });
        } else {
          res.json({
            status: true,
            active: false,
            message: "Login Unsuccessful",
          });
        }
      } else {
        res.json({
          status: false,
          message: "Login Wrong Data",
        });
      }
    } catch (err) {
      res.json({
        status: false,
        message: "Login UnSuccesful",
        err: err,
      });
    }
  },
  find: async (req, res) => {
    try {
      const { skip, limit } = req.query;
      const psychologist = await psychologistModel
        .findById(req.params.id)
        .limit(limit)
        .skip(skip);
      res.json({
        status: true,
        message: "Find Complated",
        value: { psychologist },
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
      let {
        name,
        surname,
        email,
        identity,
        psikolog,
        klinik_psikolog,
        aile_danismani,
        cift_terapisti,
        cinsel_terapist,
        psikolojik_danisman,
        çoçuk_gelişimci,
        uzman_psikolog,
        uzman_psikolojik_danisman,
        dr_ozel_egitim_uzmani,
        uzman_noropsikolog,
        limit,
        skip,
      } = req.query;
      const psyc = await psychologistModel
        .find({
          $or: [
            { name: name },
            { surName: surname },
            { eMail: email },
            { identityNumber: identity },
            { psikolog },
            { klinik_psikolog },
            { aile_danismani },
            { cift_terapisti },
            { cinsel_terapist },
            { psikolojik_danisman },
            { çoçuk_gelişimci },
            { uzman_psikolog },
            { uzman_psikolojik_danisman },
            { dr_ozel_egitim_uzmani },
            { uzman_noropsikolog },
          ],
        })
        .limit(limit)
        .skip(skip);
      res.json({
        status: true,
        message: "Find Complated",
        value: { psyc },
      });
    } catch (err) {
      res.json({
        status: false,
        message: "Find Not Complated",
        err: err,
      });
    }
  },
  all: async (req, res) => {
    try {
      const psychologists = await psychologistModel.find({});
      res.json({
        status: true,
        message: "Find Complated",
        psychologists,
      });
    } catch (err) {
      res.json({
        status: false,
        message: "Find Not Complated",
        err,
      });
    }
  },
  create: async (req, res) => {
    try {
      const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, "public/uploads/");
        },
        filename: function (req, file, cb) {
          cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
          );
        },
      });

      const fileFilter = (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
          cb(null, true);
        } else {
          cb(new Error("Sadece resim dosyaları yüklenebilir."), false);
        }
      };

      const upload = multer({
        storage: storage,
        fileFilter: fileFilter,
      }).single("image");

      upload(req, res, async (err) => {
        if (err) {
          return res.json({
            status: false,
            message: "Not Added",
            error: err,
          });
        } else {
          const { name, surname, pass, email, unvan, tag } = req.body;
          const str = tag;
          const arr = str.split(",");
          const image = req.file.filename;
          tag;
          let passHash = await bcrypt.hash(pass, 8);
          const psychologist = await psychologistModel.create({
            name,
            surName: surname,
            pass: passHash,
            eMail: email,
            unvan: unvan,
            tag: arr,
            image: image,
          });
          return res.json({
            status: true,
            message: "Added",
            psychologist,
          });
        }
      });
    } catch (err) {
      return res.json({
        status: false,
        message: "Not Added",
        err: err.message,
      });
    }
  },

  delete: async (req, res) => {
    try {
      const psychologist = await psychologistModel.findByIdAndDelete(
        req.params.id
      );
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
      const psychologist = await psychologistModel.findByIdAndUpdate(
        req.body.id,
        req.body,
        { new: true }
      );
      res.json({
        status: true,
        message: `${req.body.id} Updated`,
        value: { psychologist },
      });
    } catch (err) {
      res.json({
        status: false,
        message: "Data not update",
        err: err,
      });
    }
  },
  findMail: async (req, res) => {
    try {
      const psyc = await psychologistModel.aggregate([
        {
          $match: {
            eMail: req.query.email,
          },
        },
        {
          $project: {
            _id: 1,
            pass: 1,
          },
        },
      ]);
      const token = jwt.sign(
        {
          psyc,
        },
        process.env.SECRET_KEY_LOGER,
        { expiresIn: "6h" }
      );

      if (psyc == "") {
        res.json({
          status: false,
        });
      } else {
        res.json({
          status: true,
          psyc,
          token,
        });
      }
    } catch (err) {
      res.json({
        status: false,
        err,
      });
    }
  },
  /*passUpdate: async(req,res) => {
        try{
            const decoded = jwt.verify(req.body.token, process.env.SECRET_KEY_LOGER);
            console.log(decoded)
            let compare = bcrypt.compareSync(req.body.passold, psychologist.pass);
            console.log(compare)
            if(compare){
                const pass = req.body.pass
                let passHash = await bcrypt.hash(pass, 8);
                const psyc = await psychologistModel.findByIdAndUpdate(decoded.psychologist._id, {pass:passHash}, {new:true})

                res.json({
                    status: true,
                    message: "Pass Update",
                    psyc
                })
            }else{
                res.json({
                    status: false,
                    message: 'Pass Not Update Wrong Data'
                })
            }
            
        }catch(err){
            res.json({
                status: false,
                message: "Pass Not Updated",
                decoded,
                err
            })
        }
    },*/
  passUpdate: async (req, res) => {
    try {
      const decoded = jwt.verify(req.body.token, process.env.SECRET_KEY_LOGER);
      console.log(decoded);
      const psychologist = await psychologistModel.findById(
        decoded.psychologist._id
      );
      let compare = bcrypt.compareSync(req.body.passold, psychologist.pass);
      console.log(compare);
      if (compare) {
        const pass = req.body.pass;
        let passHash = await bcrypt.hash(pass, 8);
        const psyc = await psychologistModel.findByIdAndUpdate(
          decoded.psychologist._id,
          { pass: passHash },
          { new: true }
        );

        res.json({
          status: true,
          message: "Pass Update",
          psyc,
        });
      } else {
        res.json({
          status: false,
          message: "Pass Not Update Wrong Data",
        });
      }
    } catch (err) {
      res.json({
        status: false,
        message: "Pass Not Updated",
        err,
      });
    }
  },

  passReset: async (req, res) => {
    try {
      const decoded = jwt.verify(req.body.token, process.env.SECRET_KEY_LOGER);
      console.log(decoded.psyc[0]);

      const psychologist = await psychologistModel.findById(
        decoded.psyc[0]._id
      );

      const pass = req.body.pass;
      let passHash = await bcrypt.hash(pass, 8);
      const psyc = await psychologistModel.findByIdAndUpdate(
        decoded.psyc[0]._id,
        { pass: passHash },
        { new: true }
      );

      res.json({
        status: true,
        message: "Pass Update",
        psyc,
      });
    } catch (err) {
      res.json({
        status: false,
        message: "Pass Not Updated",
        err: err.message,
      });
    }
  },

  test: async (req, res) => {
    try {
      upload(req, res, (err) => {
        console.log("buraya geldim");
        if (err) {
          console.log(err);
        } else {
          const image = psychologistModel.create({
            name: req.body.name,
            image: {
              data: req.file.filename,
              contentType: "image/png",
            },
          });
          res.json({
            status: true,
            image,
          });
        }
      });
    } catch (err) {
      res.json({
        status: false,
        message: "Pass Not Updated",
        err,
      });
    }
  },
  createStar: async (req, res) => {
    try {
      const psyc = await psychologistModel.findById(req.body.psyc);

      if (!psyc) {
        return res.json({
          status: false,
          message: "Psychologist not found",
        });
      }

      if (!psyc.star) {
        psyc.star = [];
      }
      psyc.star.push(req.body.star);
      const starAvg = (
        psyc.star.reduce((acc, curr) => acc + curr, 0) / psyc.star.length
      )
        .toFixed(1)
        .toString();
      if (!psyc.starAvg) {
        psyc.starAvg = [];
        psyc.starAvg.set(starAvg);
      } else {
        psyc.starAvg = starAvg;
      }
      const result = await psyc.save();
      res.json({
        status: true,
        message: "Add",
        psyc: result,
      });
    } catch (err) {
      res.json({
        status: false,
        message: "Not Added",
        err: err.message,
      });
    }
  },

  siraStarAvg: async (req, res) => {
    try {
      const result = await psychologistModel.aggregate([
        {
          $sort: { starAvg: -1 },
        },
      ]);

      const totalPsychologists = result.length; // Sıralama sonrası elde edilen psikologların toplam sayısı

      res.json({
        status: true,
        result: result,
      });
    } catch (err) {
      res.json({
        status: false,
        err: err.message,
      });
    }
  },
  activeFind: async (req, res) => {
    try {
      const psychologist = await psychologistModel.find({ active: true });
      res.json({
        status: true,
        message: "Find Complated",
        psychologist,
      });
    } catch (err) {
      res.json({
        status: false,
        err: err.message,
      });
    }
  },
  activeUpdate: async (req, res) => {
    try {
      const psychologist = await psychologistModel.findById(req.query.id);
      if (!psychologist) {
        return res.status.json({
          status: false,
          message: `${req.query.id} not found`,
        });
      }
      if (req.query.active === "spes") {
        psychologist.active = !psychologist.active;
        await psychologist.save();
        res.json({
          status: true,
          message: `${req.query.id} Active Updated`,
          psychologist,
        });
      } else {
        psychologist.active = req.query.active;
        await psychologist.save();
        res.json({
          status: true,
          message: `${req.query.id} Active Updated`,
          psychologist,
        });
      }
    } catch (err) {
      console.error(err);
      res.status.json({
        status: false,
        message: `${req.query.id} Active Not Updated`,
        error: err.message,
      });
    }
  },
  deneme: async (req, res) => {
    try {
      /*const { name, surname, pass, email, tecrube, unvan, tag, image} = req.body;
        let passHash = await bcrypt.hash(pass, 8);

        // Dosya yükleme
        upload.single(Image)(req, res, async function (err) {
        if (err) {
            return res.json({
            status: false,
            message: 'Not Added',
            err
            });
        }

        const psychologist = await psychologistModel.create({
            name,
            surName: surname,
            pass: passHash,
            eMail: email,
            tecrube,
            unvan,
            image: req.file.filename, // Dosya ismi burada veri tabanına kaydediliyor
            tag
        });

        const token = jwt.sign({
            psychologist,
            hasta: true,
        }, process.env.SECRET_KEY_LOGER, {});

        res.json({
            status: true,
            message: 'Added',
            token
        });
        });*/
      const file = req.file;
      console.log("hata yok");
      if (!file) {
        const error = new Error("Lütfen bir dosya seçin");
        error.httpStatusCode = 400;
        return next(error);
      }

      res.json({
        status: true,
      });
    } catch (err) {
      res.json({
        status: false,
        message: "Not Added",
        err,
      });
    }
  },
  adminupdate: async (req, res) => {
    try {
      const psyc = await psychologistModel.findByIdAndUpdate(
        req.params.id,
        { accActive: true },
        { new: true }
      );
      res.json({
        status: true,
        message: `${req.params.id} Updated`,
        value: { psyc },
      });
    } catch (err) {
      res.json({
        status: false,
        message: "Data not update",
        err: err,
      });
    }
  },
};

module.exports = psychologistController;
