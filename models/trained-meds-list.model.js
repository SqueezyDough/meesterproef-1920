import mongoose from 'mongoose'

const Schema = mongoose.Schema
mongoose.set("useCreateIndex", true)

const meds_schema = new Schema({
  _id: {
    type: Number
  },
  registrationNumber: {
    type: String,
    index: true,
    unique: [true, "This registration number already exists"],
    required: [true, "Field is required"]
  },
  name: {
    type: String,
    required: [true, "Field is required"]
  },
  activeIngredient: {
    type: String
  },
  confirmations: {
    type: Number
  }
})

module.exports = mongoose.model('trained_meds_list', meds_schema)