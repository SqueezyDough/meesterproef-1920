import * as data from './data.controller'
import { medicines_controller } from './databaseUtils/medicines.controller'
import { clusters_controller } from './databaseUtils/clusters.controller'

exports.index = async (req, res) => {
  // await medicines_controller.reset()
  const medicines = await medicines_controller.all()

  // clusters_controller.reset(medicines)

  res.render('components/overview/index', {
    trained_data: medicines
  })
}
