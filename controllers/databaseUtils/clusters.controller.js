import * as mongoose from 'mongoose'
import * as model from '../../models/cluster.model'

const SCHEMA = mongoose.model('Cluster', model.cluster_schema)

export const cluster_controller = {
  create: identifier => {
    return new SCHEMA({
      identifier: identifier,
      certaintyIndex: 0,
    })
  },

  save: cluster => {
    cluster.save(err => {
      err ? console.log(err) : console.log(`saved: ${cluster}`)
    })
  }
}