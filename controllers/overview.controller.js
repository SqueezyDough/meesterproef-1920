import * as data from './data.controller'
import { medicines_controller } from './databaseUtils/medicines.controller'

exports.index = async (req, res) => {
  // await data.resetMedicines()
  const medicines = await medicines_controller.all()

  // data.resetClusters(medicines)

  res.render('components/overview/index', {
    trained_data: medicines
  })
}
