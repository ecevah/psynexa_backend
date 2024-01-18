const commentModel = require("./commentModel");
const mongoose = require("mongoose");

const commentController = {
  add: async (req, res) => {
    try {
      const { psyc, client, comments } = req.body;

      const comment = await commentModel.create({
        psyc_id: psyc,
        client_id: client,
        comments: comments,
      });
      res.json({
        status: true,
        message: "Added",
        value: { comment },
      });
    } catch (err) {
      res.json({
        status: false,
        message: "Not Added",
        err: err,
      });
    }
  },
  delete: async (req, res) => {
    try {
      const comment = await commentModel.findByIdAndDelete(req.params.id);
      res.json({
        status: true,
        message: `${req.body.id} Deleted`,
      });
    } catch (err) {
      res.json({
        status: false,
        err,
      });
    }
  },
  find: async (req, res) => {
    try {
      const {
        psyc_id,
        client_id,
        limit,
        skip,
        sort_by,
        sort_order,
        select_fields,
      } = req.query;

      const comment = await commentModel
        .find({
          $or: [
            {
              client_id,
            },
            { psyc_id },
          ],
        })
        .populate("client_id")
        .populate("psyc_id")
        .limit(Number(limit))
        .skip(Number(skip));
      const commentObjects = comment.map((item) => ({
        _id: item._id,
        comments: item.comments,
        client_id: {
          _id: item.client_id._id,
          name: item.client_id.name,
          surName: item.client_id.surName,
        },
      }));
      if (commentObjects == []) {
        res.json({
          status: false,
          message: "Find Not Complated No Data",
        });
      } else {
        res.json({
          status: true,
          message: "Find Completed",
          total: commentObjects.length,
          commentObjects,
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
  findAnd: async (req, res) => {
    try {
      const { psyc, client } = req.query;

      const comment = await commentModel.find({
        $and: [
          {
            client,
            psyc,
          },
        ],
      });

      res.json({
        status: true,
        message: "Find Completed",
        value: { comment },
      });
    } catch (error) {
      res.json({
        status: false,
        message: "Find Not Completed",
        error: error.message,
      });
    }
  },
  totalComment: async (req, res) => {
    try {
      const result = await commentModel.aggregate([
        {
          $match: {
            psyc_id: new mongoose.Types.ObjectId(req.body.psyc_id),
          },
        },
        {
          $count: "totalComment",
        },
      ]);

      if (result.length === 0) {
        return res.json({
          status: false,
          message: "No comment found",
        });
      }

      const totalComment = result[0].totalComment;

      res.json({
        status: true,
        totalComment: totalComment,
      });
    } catch (err) {
      res.json({
        status: false,
        err: err.message,
      });
    }
  },
};

module.exports = commentController;
