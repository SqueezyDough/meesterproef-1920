import * as api from './api.controller'
import * as mongooseUtils from './utils/mongoose.utils.controller'

// TODO: this function isn't needed right now because we load the top 200 from the db. I should be reworked so it adds/removes data to the top 2000
exports.fetchNewData = async () => {
  const url = 'https://hva-cmd-meesterproef-ai.now.sh/medicines'
  const medicines = await api.FetchData(url, [0, 200])

  medicines.forEach(med => {
    const scheme_medicine = mongooseUtils.createMedicine(med)
    mongooseUtils.saveMedicine(scheme_medicine)
  })
}