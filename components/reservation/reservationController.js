const reservationModule = require("./reservationModule");
const { json } = require("express");
const { isObjectIdOrHexString, default: mongoose } = require("mongoose");

const reservationController = {
  add: async (req, res) => {
    try {
      const { psyc, client, day, time } = req.body;
      const date = new Date(day);
      const reservation = await reservationModule.create({
        psyc_id: psyc,
        client_id: client,
        day: date,
        time,
      });
      res.json({
        status: true,
        message: "Added",
        value: { reservation },
      });
    } catch (err) {
      res.json({
        status: false,
        message: "Not Added",
        err: err,
      });
    }
  },
  //rezervasyon id'si ile o rezervasyona ait bilgileri gösteriyor
  find: async (req, res) => {
    try {
      const reservation = await reservationModule.findById(req.params.id);
      res.json({
        status: true,
        message: "Find Complated",
        reservation,
      });
    } catch (err) {
      res.json({
        status: false,
        message: "Find Not Complated",
        err: err,
      });
    }
  },
  //bütün rezervasyonlar içinden verilen id yi içeren rezervasyonları gösteriyor
  match: async (req, res) => {
    try {
      const result = reservationModule.aggregate([
        {
          $match: {
            client_id: new mongoose.Types.ObjectId(req.params.id),
          },
        },
      ]);
      res.json({
        status: true,
        result,
      });
    } catch (err) {
      res.json({
        status: false,
        err,
      });
    }
  },
  // asıl önemli olan işlem bu sakın silme

  lookup: async (req, res) => {
    try {
      reservationModule.aggregate(
        [
          {
            $match: {
              $or: [
                { client_id: new mongoose.Types.ObjectId(req.query.client) },
                { psyc_id: new mongoose.Types.ObjectId(req.query.psyc) },
                {
                  $and: [
                    {
                      client_id: new mongoose.Types.ObjectId(req.query.client),
                    },
                    {
                      day: req.query.day,
                    },
                  ],
                },
                {
                  $and: [
                    {
                      psyc_id: new mongoose.Types.ObjectId(req.query.psyc),
                    },
                    {
                      day: req.query.day,
                    },
                  ],
                },
              ],
            },
          },
          {
            $lookup: {
              from: "clients",
              localField: "client_id",
              foreignField: "_id",
              as: "client",
            },
          },
          {
            $lookup: {
              from: "psychologists",
              localField: "psyc_id",
              foreignField: "_id",
              as: "psyc",
            },
          },
        ],
        (result) => {
          res.json(result);
        }
      );
    } catch (err) {
      res.json(err);
    }
  },
  //doktor id'si ile o id'ye ait bütün rezervasyonları ve doktor bilgilerini  gösteriyor
  lookup_doktor: async (req, res) => {
    try {
      reservationModule.aggregate(
        [
          {
            $match: {
              psyc_id: new mongoose.Types.ObjectId(req.params.id),
              day: new Date(req.body.day),
            },
          },
          {
            $lookup: {
              from: "psyc",
              localField: "psyc_id",
              foreignField: "_id",
              as: "psyc",
            },
          },
        ],
        (err, result) => {
          if (result.length === 0) {
            return res.json({
              status: false,
              message: "No matching data found.",
            });
          }
          res.json({ status: true, result });
        }
      );
    } catch (err) {
      res.json(err);
    }
  },
  findSpecific: async (req, res) => {
    try {
      const {
        day,
        psyc_id,
        client_id,
        limit,
        skip,
        sort_by,
        sort_order,
        select_fields,
      } = req.query;
      const sort = {};
      if (sort_by && sort_order) {
        sort[sort_by] = sort_order === "desc" ? -1 : 1;
      }
      const select = select_fields ? select_fields.split(",").join(" ") : "";
      const reservation = await reservationModule
        .find({
          $or: [
            { $and: [{ psyc_id }, { client_id }] },
            { $and: [{ psyc_id }, { day }] },
            { $and: [{ day }, { client_id }] },
            { $and: [{ day }, { client_id }, { psyc_id }] },
          ],
        })
        .populate("client_id")
        .populate("psyc_id")
        .sort(sort)
        .select(select)
        .limit(Number(limit))
        .skip(Number(skip));
      const reservationObjects = reservation.map((item) => ({
        _id: item._id,
        day: item.day,
        time: item.time,
        psyc_id: {
          _id: item.psyc_id._id,
          unvan: item.psyc_id.unvan,
          name: item.psyc_id.name,
          surName: item.psyc_id.surName,
          tag: item.psyc_id.tag,
        },
        client_id: {
          _id: item.client_id._id,
          name: item.client_id.name,
          surName: item.client_id.surName,
          dateOfBirth: item.client_id.dateOfBirth,
          sex: item.client_id.sex,
          image: item.client_id.image,
        },
      }));
      if (reservationObjects == []) {
        res.json({
          status: false,
          message: "Find Not Complated No Data",
        });
      } else {
        res.json({
          status: true,
          message: "Find Completed",
          reservation: reservationObjects,
        });
      }
    } catch (error) {
      res.json({
        status: false,
        message: "Find Not Completed",
        error: error.message,
      });
    }
  },
  delete: async (req, res) => {
    try {
      const reservation = await reservationModule.findByIdAndDelete(
        req.params.id
      );
      res.json({
        status: true,
        message: `${req.params.id} Deleted`,
      });
    } catch (err) {
      res.json({
        status: false,
        err,
      });
    }
  },
  lastDay: async (req, res) => {
    try {
      const timeChack = (itemTime) => {
        const currentTime = new Date();
        const itemHour = parseInt(itemTime.split(".")[0]);
        const itemMinute = parseInt(itemTime.split(".")[1]);
        const itemDateTime = new Date(
          currentTime.getFullYear(),
          currentTime.getMonth(),
          currentTime.getDate(),
          itemHour,
          itemMinute + 5
        );
        if (itemDateTime > currentTime) {
          return true;
        } else {
          return false;
        }
      };
      const {
        client_id,
        psyc_id,
        limit,
        skip,
        sort_by,
        sort_order,
        select_fields,
      } = req.query;
      const today = new Date();
      const date = new Date(today);
      date.setDate(today.getDate() - 1);
      const sort = {};
      if (sort_by && sort_order) {
        sort[sort_by] = sort_order === "desc" ? -1 : 1;
      } else {
        sort["day"] = 1;
      }
      const select = select_fields ? select_fields.split(",").join(" ") : "";

      const reservation = await reservationModule
        .find({
          $or: [
            { $and: [{ client_id }, { day: { $gte: date } }] },
            {
              $and: [{ psyc_id }, { day: { $gte: date } }],
            },
          ],
        })
        .populate("client_id")
        .populate("psyc_id")
        .sort(sort)
        .select(select)
        .limit(Number(limit))
        .skip(Number(skip));

      const reservationObjects = reservation
        .map((item) =>
          item.day === new Date().toISOString().split("T")[0]
            ? timeChack(item.time)
              ? {
                  _id: item._id,
                  day: item.day,
                  time: item.time,
                  psyc_id: {
                    _id: item.psyc_id._id,
                    unvan: item.psyc_id.unvan,
                    name: item.psyc_id.name,
                    surName: item.psyc_id.surName,
                    tag: item.psyc_id.tag,
                    image: item.psyc_id.image,
                  },
                  client_id: {
                    _id: item.client_id._id,
                    name: item.client_id.name,
                    surName: item.client_id.surName,
                    dateOfBirth: item.client_id.dateOfBirth,
                    sex: item.client_id.sex,
                    image: item.client_id.image,
                  },
                  type: 0,
                }
              : null
            : {
                _id: item._id,
                day: item.day,
                time: item.time,
                psyc_id: {
                  _id: item.psyc_id._id,
                  unvan: item.psyc_id.unvan,
                  name: item.psyc_id.name,
                  surName: item.psyc_id.surName,
                  tag: item.psyc_id.tag,
                  image: item.psyc_id.image,
                },
                client_id: {
                  _id: item.client_id._id,
                  name: item.client_id.name,
                  surName: item.client_id.surName,
                  dateOfBirth: item.client_id.dateOfBirth,
                  sex: item.client_id.sex,
                  image: item.client_id.image,
                },
                type: 0,
              }
        )
        .filter((item) => item !== null);
      const totalCount = reservationObjects.length;

      res.json({
        status: true,
        message: "Find Completed",
        total: totalCount,
        reservation: reservationObjects,
      });
    } catch (error) {
      res.json({
        status: false,
        message: "Find Not Completed",
        error: error.message,
      });
    }
  },
  beforeDay: async (req, res) => {
    try {
      const timeChack = (itemTime) => {
        const currentTime = new Date();
        const itemHour = parseInt(itemTime.split(".")[0]);
        const itemMinute = parseInt(itemTime.split(".")[1]);
        const itemDateTime = new Date(
          currentTime.getFullYear(),
          currentTime.getMonth(),
          currentTime.getDate(),
          itemHour - 3,
          itemMinute
        );
        if (itemDateTime < currentTime) {
          return true;
        } else {
          return false;
        }
      };
      const {
        day,
        client_id,
        psyc_id,
        limit,
        skip,
        sort_by,
        sort_order,
        select_fields,
      } = req.query;
      const date = Date.now();
      const sort = {};
      if (sort_by && sort_order) {
        sort[sort_by] = sort_order === "desc" ? -1 : 1;
      } else {
        sort["day"] = -1;
      }
      const select = select_fields ? select_fields.split(",").join(" ") : "";

      const reservation = await reservationModule
        .find({
          $or: [
            { $and: [{ client_id }, { day: { $lte: date } }] },
            {
              $and: [{ psyc_id }, { day: { $lte: date } }],
            },
          ],
        })
        .populate("client_id")
        .populate("psyc_id")
        .sort(sort)
        .select(select)
        .limit(Number(limit))
        .skip(Number(skip));

      const reservationObjects = reservation
        .map((item) =>
          item.day === new Date().toISOString().split("T")[0]
            ? timeChack(item.time)
              ? {
                  _id: item._id,
                  day: item.day,
                  time: item.time,
                  psyc_id: {
                    _id: item.psyc_id._id,
                    unvan: item.psyc_id.unvan,
                    name: item.psyc_id.name,
                    surName: item.psyc_id.surName,
                    tag: item.psyc_id.tag,
                  },
                  client_id: {
                    _id: item.client_id._id,
                    name: item.client_id.name,
                    surName: item.client_id.surName,
                    dateOfBirth: item.client_id.dateOfBirth,
                    sex: item.client_id.sex,
                    image: item.client_id.image,
                  },
                  type: 0,
                }
              : null
            : {
                _id: item._id,
                day: item.day,
                time: item.time,
                psyc_id: {
                  _id: item.psyc_id._id,
                  unvan: item.psyc_id.unvan,
                  name: item.psyc_id.name,
                  surName: item.psyc_id.surName,
                  tag: item.psyc_id.tag,
                },
                client_id: {
                  _id: item.client_id._id,
                  name: item.client_id.name,
                  surName: item.client_id.surName,
                  dateOfBirth: item.client_id.dateOfBirth,
                  sex: item.client_id.sex,
                  image: item.client_id.image,
                },
                type: 0,
              }
        )
        .filter((item) => item !== null);
      const totalCount = reservationObjects.length;

      res.json({
        status: true,
        message: "Find Completed",
        total: totalCount,
        reservation: reservationObjects,
      });
    } catch (error) {
      res.json({
        status: false,
        message: "Find Not Completed",
        error: error.message,
      });
    }
  },
  findID: async (req, res) => {
    try {
      const {
        day,
        psyc,
        client,
        limit,
        skip,
        sort_by,
        sort_order,
        select_fields,
      } = req.query;
      const sort = {};
      if (sort_by && sort_order) {
        sort[sort_by] = sort_order === "desc" ? -1 : 1;
      } else {
        sort["day"] = -1;
      }
      const select = select_fields ? select_fields.split(",").join(" ") : "";
      const reservation = await reservationModule
        .find({
          $or: [
            {
              psyc_id: psyc,
            },
            {
              client_id: client,
            },
            {
              day,
            },
          ],
        })
        .populate("client_id")
        .populate("psyc_id")
        .sort(sort)
        .select(select)
        .limit(Number(limit))
        .skip(Number(skip));
      /*const reservationObjects = reservation.map((item) => ({
        _id: item._id,
        day: item.day,
        time: item.time,
        psyc_id: {
          _id: item.psyc_id._id,
          unvan: item.psyc_id.unvan,
          name: item.psyc_id.name,
          surName: item.psyc_id.surName,
          tag: item.psyc_id.tag,
        },
        client_id: {
          _id: item.client_id._id,
          name: item.client_id.name,
          surName: item.client_id.surName,
          dateOfBirth: item.client_id.dateOfBirth,
          sex: item.client_id.sex,
          image: item.client_id.image,
        },
      }));
      if (reservationObjects == []) {
        res.json({
          status: false,
          message: "Find Not Complated No Data",
        });
      } else {*/
      res.json({
        status: true,
        message: "Find Completed",
        reservation,
      });
    } catch (error) {
      res.json({
        status: false,
        message: "Find Not Completed",
        error: error.message,
      });
    }
  },
  totalClient: async (req, res) => {
    try {
      const result = await reservationModule.aggregate([
        {
          $group: {
            _id: "$client_id",
          },
        },
        {
          $count: "totalClient",
        },
      ]);

      const totalClients = result[0].totalClient;

      res.json({
        status: true,
        totalClients: totalClients,
      });
    } catch (err) {
      res.json({
        status: false,
        err: err.message,
      });
    }
  },
};

module.exports = reservationController;
