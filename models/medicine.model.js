import mongoose from 'mongoose'

const Schema = mongoose.Schema
mongoose.set("useCreateIndex", true)

const med_schema = new Schema({
  _id: {
    type: Number
  },
  registrationNumber: {
    type: String,
    index: true,
    unique: [true, "This registration number already exists"],
    required: [true, "Field is required"]
  },
  title: {
    type: String,
    required: [true, "Field is required"]
  },
  info: {
    type: String,
  },
  activeIngredient: {
    type: String
  },
  confirmations: {
    type: Number
  },
  cluster: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Medicine'
  }
})

module.exports = mongoose.model('Medicine', med_schema)