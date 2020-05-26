import mongoose from 'mongoose'

const Schema = mongoose.Schema
mongoose.set("useCreateIndex", true)

const meds_schema = new Schema({
  _id: {
    type: Number,
    required: [true, "Field is required"],
    index: true,
    unique: [true, "Id already exists"]
  },
  registrationNumber: {
    type: String,
    required: [true, "Field is required"]
  },
  name: {
    type: String,
    required: [true, "Field is required"]
  },
  activeIngredient: {
    type: String
  }
})

module.exports(mongoose.model('trained_meds_list', meds_schema))