import * as tsModels from './tesseract-models.controller'
import * as mongooseUtils from './utils/mongoose.utils.controller'

exports.index = async (req, res) => {
  // TODO: Clear db and uncomment if you want to populate new data
  // await tsModels.fetchNewData()
  const trained_data = await mongooseUtils.getAllMedicines()

  res.render('components/overview/index', {
    trained_data: trained_data
  })
}
