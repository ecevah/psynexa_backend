const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const psycModel = require("../psychologist/psychologistModel");
const clientModel = require("../client/clientModel");


const commentSchema = new Schema({
    psyc_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:psycModel,
        require: true
    },
    client_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:clientModel,
        require: true
    },
    comments:{
        type:String
    }
});


module.exports = mongoose.model('comment', commentSchema);