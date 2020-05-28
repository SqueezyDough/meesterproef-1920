import mongoose from 'mongoose'

const Schema = mongoose.Schema
mongoose.set("useCreateIndex", true)

const cluster_schema = new Schema({
  clusterId: {
    type: Number,
  },
  // bucketId: {
  //  type: Number
  //},
  identifier: {
    type: String,
    required: [true, "Field is required"],
    unique: [true, "This cluster already exists"],
  },
  certaintyIndex: {
    type: Number
  },
  medicines: [
    { type: mongoose.Schema.Types.ObjectId, 
      ref: 'Medicine' 
    }
  ],
})

AiSchema.virtual("totalConfirmations")
  .get(function (brandModel) {
    return this.medicines.confirmations.reduce(function(acc, currValue) {
      return acc + currValue
    })
})

module.exports = mongoose.model('Cluster', cluster_schema)