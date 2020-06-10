import fs from 'fs'
import string_similarity from 'string-similarity'
import * as mongoose from 'mongoose'
import * as model from '../../models/cluster.model'
import * as data from '../data.controller'
import { medicines_controller } from './medicines.controller'

const SCHEMA = mongoose.model('Cluster', model.cluster_schema)

export const clusters_controller = {
  all: () => {
    console.log('get clusters')
    return SCHEMA.find({}).lean()
      .then(clusters => clusters)
  },

  create: identifier => {
    return new SCHEMA({
      identifier: identifier,
      certaintyIndex: 0,
    })
  },

  save: cluster => {
    cluster.save(err => {
      err ? console.log(err) : console.log(`saved: ${cluster.identifier}`)
    })
  },

  findById: id => {
    return SCHEMA.findOne({ _id: id }).lean()
      .then(cluster => cluster) 
  },

  findByIdentifier: name => {
    return SCHEMA.findOne({ identifier: name }).lean()
      .then(cluster => cluster)  
  },

  getMedicinesFromCluster: cluster => {
    return cluster.medicines.map(async id => await medicines_controller.findById(id)) 
  },

  getSimilarClusters: cluster => {
    return cluster.similarClusters.map(async id => await clusters_controller.findById(id)) 
  },

  bind: (source_id, target_id) => {
    try {
      console.log(`binding ${source_id} => ${target_id}`)
      
      SCHEMA.findOne({ _id: source_id }, (err, cluster) => {
        cluster.similarClusters.push(target_id)
        cluster.save();
      })
    } catch(err) {
      console.log(err)
    }   
  },

  addMedicine: (cluster_id, medicine_id) => { 
    console.log(`adding ${medicine_id} => ${cluster_id}`)
 
    SCHEMA.update(
      { _id: cluster_id }, 
      { $push: { medicines: medicine_id } },
    )
      .populate('Medicine')
      .then((result) => {
        console.log(result)
      })
  },

  populateBind: id => {
      SCHEMA.findOne({ _id: id })
      .populate('Cluster')
      .then((result) => {
        console.log(result)
      })
      .catch((error) => {
        console.log(error)
    })
  },

  rules: async fullname => {
    const CLUSTER_RULES = JSON.parse(fs.readFileSync('./cluster-rules.json'))

    // take first word
    let identifier = fullname.split(' ')[0]

    CLUSTER_RULES.forEach(rule => {
      rule.subscriptions.forEach(subscription => {
        // look if fullname includes the subscription and overwrite identifier
        if (fullname.includes(subscription)) {
          console.log(`Found rule: ${fullname} -> ${rule.preferredIdentifier} from subscription ${subscription}`)
          identifier = rule.preferredIdentifier  
        }
      })
    })

    return identifier.toLowerCase()
  },

  reset: async medicines => {
    await data.dropCollection('clusters')
  
    let unique_medicine_names = new Set()
  
    const cluster_names = await medicines.map(async medicine => {
      const preferredIdentifier = await clusters_controller.rules(medicine.title)
      await unique_medicine_names.add(preferredIdentifier)  

      return await preferredIdentifier
    })

    const names = [...unique_medicine_names]

    const unique_clusters = await names.map(async uniqueName => {
      const cluster = await clusters_controller.create(uniqueName)
      await clusters_controller.save(cluster)

      return cluster  
    })

    const all_clusters = await clusters_controller.all()

    Promise.all(unique_clusters)
      .then(async () => await medicines.forEach(async medicine => await addMedicineToCluster(medicine, all_clusters)))
      .then(async () => {
        all_clusters.forEach(async cluster => {
          bindSimilarClusters(cluster, names)    
        })
      })
      .then(() => console.log('done'))
      .catch(err => console.log(err))      
  }
}

async function addMedicineToCluster(medicine, all_clusters) {
  // get prefferred title for medicine
  const preferredIdentifier = await clusters_controller.rules(medicine.title)

  const matched_cluster = await all_clusters.filter(cluster => {
    return cluster.identifier === preferredIdentifier
  })[0]

  if (preferredIdentifier == 'strepsils') {
    console.log('med', medicine)
    console.log('m', matched_cluster)
  }
  
  // save medicine to best match
  await clusters_controller.addMedicine(matched_cluster._id, medicine._id)
}

async function bindSimilarClusters(cluster, cluster_names) {
  console.log('binding clusters')

  const clusters_exclude_self = cluster_names.filter(name => name !== cluster.identifier)
  const matches = string_similarity.findBestMatch(cluster.identifier, clusters_exclude_self)

  matches.ratings.forEach(async rating => {
    if(rating.rating >= .60) {      
      const matched_cluster = await clusters_controller.findByIdentifier(rating.target)

      clusters_controller.bind(cluster._id, matched_cluster._id)
      clusters_controller.populateBind(cluster._id)
    }
  })
}