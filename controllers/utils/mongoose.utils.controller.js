import * as mongoose from 'mongoose'
import * as medsModel from '../../models/trained-meds-list.model'

const SCHEMA = mongoose.model('trained_meds_list', medsModel.meds_schema)

exports.getAllMedicines = () => {
  return SCHEMA.find({}).lean()
    .then(medicines => medicines)
}

exports.findById = id => {
	return SCHEMA.findOne({ _id: id }).lean()
		.then(medicine => medicine) 
}

exports.findByRegistrationNumber = regis_number => {
	return SCHEMA.findOne({ registrationNumber: regis_number }).lean()
		.then(medicine => medicine) 
}

exports.updateMatchCount = regis_number => {
  return SCHEMA.findOneAndUpdate({
    registrationNumber: regis_number
  }, {
    confirmations: this.confirmations += 1
  }).lean()
}

exports.createMedicine = data => {
  return new SCHEMA({
    _id: data.id,
    registrationNumber: data.registrationNumber,
    name: data.name,
    activeIngredient: data.activeIngredient,
    confirmations: 0
  })
}

exports.saveMedicine = medicine => {
	medicine.save(err => {
    err ? console.log(err) : console.log(`saved: ${medicine}`)
	})
}
