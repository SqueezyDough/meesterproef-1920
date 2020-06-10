import * as mongoose from 'mongoose'
import * as api from './api.controller'
import { medicines_controller } from './databaseUtils/medicines.controller'
import { clusters_controller } from './databaseUtils/clusters.controller'
import string_similarity from 'string-similarity'

exports.resetData = async (req, res) => {
  // KEEP UNCOMMENTED ON PROD
  // THIS FUNCTION WILL DROP ALL CLUSTERS ADN POPULATE THEM AGAIN

  // await medicines_controller.reset()
  // const all_medicines = await medicines_controller.all()
  // await clusters_controller.reset(all_medicines)

  res.send('data reset')
}

exports.dropCollection = (collection) => {
  const db = mongoose.default.connections[0].collections

  db[collection].drop( function(err) {
    console.log('collection dropped');
  })
}

exports.databaseSearch = async (req, res) => {
  const all_clusters = await clusters_controller.all()
  const all_cluster_strings = all_clusters.map(cluster => cluster.identifier)

  const all_best_matches = await req.body.map(entry => {
    const {text, confidence} = entry
    const matches = string_similarity.findBestMatch(text, all_cluster_strings)

    return matches.bestMatch
  })

  const most_likely_clusters = await all_best_matches.map(async match => {
    const most_likely_cluster = await clusters_controller.findByIdentifier(match.target)
    return { rating: match.rating, cluster: most_likely_cluster}
  })

  Promise.all(most_likely_clusters)
    .then(async clusters => {
      const highest_rated_cluster = await clusters.reduce(function(prev, current) {
        return (prev.rating > current.rating) ? prev : current
      })

      const cluster_medicines = await clusters_controller.getMedicinesFromCluster(highest_rated_cluster.cluster)
      Promise.all(cluster_medicines)
        .then(medicines => {
          res.send(medicines)
        })
    })
}

// Fetch from API
exports.fetchNewData = async () => {
  const URL = 'https://hva-cmd-meesterproef-ai.now.sh/medicines'
  const medicines = await api.FetchData(URL)

  medicines.forEach(medicine => {
    const scheme_medicine = medicines_controller.create(medicine)
    medicines_controller.save(scheme_medicine)
  })
}
