import * as data from './data.controller'
import { medicine_controller } from './databaseUtils/medicines.controller'
import { cluster_controller } from './databaseUtils/clusters.controller'

const mdes = require('./databaseUtils/medicines.controller')

exports.index = async (req, res) => {
  // await data.resetMedicines()
  const medicines = await medicine_controller.all()

  data.resetClusters(medicines)

  res.render('components/overview/index', {
    trained_data: medicines
  })
}
