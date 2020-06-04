import { medicines_controller } from './databaseUtils/medicines.controller'


exports.index = async (req, res) => {
  const medicines = await medicines_controller.all()

  res.render('components/overview/index', {
    trained_data: medicines
  })
}
