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
        cluster.similarClusters.push(target_id);
        cluster.save();
      })
    } catch(err) {
      console.log(err)
    }   
  },

  populate: id => {
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

    return identifier
  },

  reset: async medicines => {
    await data.dropCollection('clusters')
  
    let unique_medicine_names = new Set()
  
    await medicines.forEach(async medicine => {
      const preferredIdentifier = await clusters_controller.rules(medicine.title)
  
      unique_medicine_names.add(preferredIdentifier)   
    })
  
    unique_medicine_names.forEach(uniqueName => {
      const cluster = clusters_controller.create(uniqueName)
      clusters_controller.save(cluster)
    })

    bindSimilarClusters(unique_medicine_names)
  }
}

async function bindSimilarClusters(names) {
  const clusters = await clusters_controller.all()
  const cluster_names = [...names]

  clusters.forEach(cluster => {
    const clusters_exclude_self = cluster_names.filter(name => name !== cluster.identifier)
    const matches = string_similarity.findBestMatch(cluster.identifier, clusters_exclude_self)

    matches.ratings.forEach(async rating => {
      if(rating.rating >= .60) {      
        const matched_cluster = await clusters_controller.findByIdentifier(rating.target)

        clusters_controller.bind(cluster._id, matched_cluster._id)
        clusters_controller.populate(cluster._id)
      
        return rating
      }
    })
  }) 
}