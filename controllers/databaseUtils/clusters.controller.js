import fs from 'fs'
import string_similarity from 'string-similarity'
import * as mongoose from 'mongoose'
import * as model from '../../models/cluster.model'
import * as data from '../data.controller'

const SCHEMA = mongoose.model('Cluster', model.cluster_schema)

export const clusters_controller = {
  all: () => {
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

  findByIdentifier: name => {
    return SCHEMA.findOne({ identifier: name }).lean()
      .then(cluster => cluster)  
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
    try {
      console.log(`adding ${medicine_id} => ${cluster_id}`)
      
      SCHEMA.findOne({ _id: cluster_id }, (err, cluster) => {
        cluster.medicines.push(medicine_id)
        cluster.save();
      })
    } catch(err) {
      console.log(err)
    }   
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

  populateMedicines: id => {
    console.log(`populate cluster: ${id}`)

    SCHEMA.findOne({ _id: `${id}` })
      .populate('Medicine')
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

    return identifier
  },

  reset: async medicines => {
    await data.dropCollection('clusters')
  
    let unique_medicine_names = new Set()
  
    await medicines.forEach(async medicine => {
      const preferredIdentifier = await clusters_controller.rules(medicine.title)
  
      unique_medicine_names.add(preferredIdentifier)   
    })
  
    unique_medicine_names.forEach(async uniqueName => {
      const cluster = await clusters_controller.create(uniqueName)
      clusters_controller.save(cluster)
    })

    populateClusters(unique_medicine_names, medicines)
  }
}

async function populateClusters(names, medicines) {
  const clusters = await clusters_controller.all()
  const cluster_names = [...names]

  await addMedicinesToClusters(cluster_names, medicines)

  clusters.forEach(async cluster => {
    await clusters_controller.populateMedicines(cluster._id)
    bindSimilarClusters(cluster, cluster_names)    
  })
}

async function bindSimilarClusters(cluster, cluster_names) {
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

async function addMedicinesToClusters(cluster_names, medicines) {
  medicines.forEach(async medicine => {
    const preferredIdentifier = await clusters_controller.rules(medicine.title) 
    const compared_names = string_similarity.findBestMatch(preferredIdentifier, cluster_names)
    const best_matched_cluster_name = cluster_names[compared_names.bestMatchIndex]
    const matched_cluster = await clusters_controller.findByIdentifier(best_matched_cluster_name)

    clusters_controller.addMedicine(matched_cluster._id, medicine._id)
  })
}