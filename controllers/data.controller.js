import * as mongoose from 'mongoose'
import * as api from './api.controller'
import { medicines_controller } from './databaseUtils/medicines.controller'
import { clusters_controller } from './databaseUtils/clusters.controller'

exports.resetMedicines = async () => {
  dropCollection('medicines')
  await fetchNewData()
}

exports.resetClusters = medicines => {
  dropCollection('clusters')

  let UniqueMedicineNames = new Set()

  medicines.forEach(medicine => {
    UniqueMedicineNames.add(medicine.title)   
  })

  UniqueMedicineNames.forEach(uniqueName => {
    const cluster = clusters_controller.create(uniqueName)
    clusters_controller.save(cluster)
  })
}

// Fetch from API
const fetchNewData = async () => {
  const URL = 'https://hva-cmd-meesterproef-ai.now.sh/medicines'
  const medicines = await api.FetchData(URL, [0, 200])

  medicines.forEach(medicine => {
    const scheme_medicine = medicines_controller.create(medicine)
    medicines_controller.save(scheme_medicine)
  })
}

const dropCollection = (collection) => {
  const db = mongoose.default.connections[0].collections

  db[collection].drop( function(err) {
    console.log('collection dropped');
  })
}