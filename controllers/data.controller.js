import * as mongoose from 'mongoose'
import * as api from './api.controller'
import { medicines_controller } from './databaseUtils/medicines.controller'
import { clusters_controller } from './databaseUtils/clusters.controller'
import string_similarity from 'string-similarity'

exports.resetData = async (req, res) => {
  // KEEP UNCOMMENTED UNLESS YOU KNOW WHAT YOU ARE DOING!
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

  const all_best_matches = await req.body.confident_words.map(entry => {
    const {text, confidence} = entry
    const matches = string_similarity.findBestMatch(text, all_cluster_strings)

    return {best_match: matches.bestMatch, matched_on: text}
  })

  const most_likely_clusters = await all_best_matches.map(async match => {
    match.most_likely_cluster = await clusters_controller.findByIdentifier(match.best_match.target)
    return match
  })

  Promise.all(most_likely_clusters)
    .then(async clusters => {
      const highest_rated_cluster = await clusters.reduce(function(prev, current) {
        return (prev.best_match.rating > current.best_match.rating) ? prev : current
      })
      
      const cluster_medicines = await clusters_controller.getMedicinesFromCluster(highest_rated_cluster.most_likely_cluster)

      Promise.all(cluster_medicines)
        .then(values => {
          if(req.body.additional_words.length) {
            const best_matching_medicine = additionalWordsFilter(values, req.body.additional_words)
            res.send(
              {
                medicines: best_matching_medicine.match, 
                matched_on: highest_rated_cluster.matched_on, 
                matched_on_additional: best_matching_medicine.matched_on_additional
              }
            )
          } else {
            res.send({medicines: values, matched_on: highest_rated_cluster.matched_on})
          }
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

function additionalWordsFilter(medicines, additional_words) {
  const medicines_and_matched_rating = medicines.map(medicine => {
    if(additional_words.length > 1) {
      const matches = string_similarity.findBestMatch(medicine.title, additional_words)
      return {medicine: medicine, match: matches.bestMatch}
    } else {
      const matches = string_similarity.compareTwoStrings(medicine.title, additional_words[0])
      return {medicine: medicine, match: matches}
    }
  })

  const highest_rated_medicine = medicines_and_matched_rating.reduce(function(prev, current) {
    return (prev.match.rating > current.match.rating) ? prev : current
  })
  
  return {match: highest_rated_medicine.medicine, matched_on_additional: highest_rated_medicine.match.target}
}
