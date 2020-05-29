import * as mongoose from 'mongoose'
import * as model from '../../models/medicine.model'

const SCHEMA = mongoose.model('Medicine', model.meds_schema)

export const medicine_controller = {
  all: () => {
    return SCHEMA.find({}).lean()
      .then(medicines => medicines)
  },

  findById: id => {
    return SCHEMA.findOne({ _id: id }).lean()
      .then(medicine => medicine) 
  },

  findByRegistrationNumber: regis_number => {
    return SCHEMA.findOne({ registrationNumber: regis_number }).lean()
      .then(medicine => medicine) 
  },

  addConfirmation: regis_number => {
    return SCHEMA.findOneAndUpdate({
      registrationNumber: regis_number
    }, {
      confirmations: this.confirmations += 1
    }).lean()
  },

  create: data => {
    const fullname = data.name.split(',')

    return new SCHEMA({
      _id: data.id,
      // clusterId: findCluster()
      registrationNumber: data.registrationNumber,
      title: fullname[0],
      info: fullname[1],
      activeIngredient: data.activeIngredient,
      confirmations: 0
    })
  },

  save: medicine => {
    medicine.save(err => {
      err ? console.log(err) : console.log(`saved: ${medicine}`)
    })
  }
}