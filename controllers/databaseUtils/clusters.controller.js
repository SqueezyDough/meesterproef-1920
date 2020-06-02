import fs from 'fs'
import * as mongoose from 'mongoose'
import * as model from '../../models/cluster.model'

const SCHEMA = mongoose.model('Cluster', model.cluster_schema)

export const clusters_controller = {
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
  },

  findByIdentifier: name => {
    return SCHEMA.findOne({ identifier: name }).lean()
      .then(cluster => cluster)  
  },

  rules: async name => {
    const CLUSTER_RULES = JSON.parse(fs.readFileSync('./cluster-rules.json'))

    let identifier = name.split(' ')[0]

    CLUSTER_RULES.forEach(rule => {
      if (rule.subscriptions.includes(identifier)) {
        identifier = rule.preferredIdentifier
      }
    })

    return identifier
  }
}