import algoliasearch from 'algoliasearch'
import dotenv from 'dotenv'
dotenv.config()

const client = algoliasearch(process.env.ALGOLIA_APPLICATION_ID, process.env.ALGOLIA_KEY)
const index = client.initIndex('dev_MEDICINE')

exports.tesseractSearch = async (req, res) => {
  const suspected_medicines = await index.search(req.body.code).then(({ hits }) => {
    return hits
  });

  res.send(suspected_medicines)
}

exports.overviewSearch = async (req, res, next) => {
  const search_value = await getSearchValue(req.body.multi_search.toLowerCase().trim())

  if(typeof search_value === 'object') {
    req.error = search_value.error_message
    return next()
  }

  const suspected_medicines = await index.search(search_value).then(({ hits }) => {
    return hits
  })

  req.medicines = suspected_medicines
  return next()
}

function getSearchValue(multi_search) {
  try {
    // Search contains RVG/RVH/EU prefix and numbers
    if(multi_search.includes('rvg') || multi_search.includes('rvh') || multi_search.includes('eu')) {
      const code = multi_search.split('rvg')[1] || multi_search.split('rvh')[1] || multi_search.split('eu')[1]
      const trimmed_code = code.trim().replace(/\s/g,'')

      // When trimmed code does not only contain numbers throw error invalid registration number
      if(/^\d+$/.test(trimmed_code) === false) throw 'Valid prefix but no valid registration number'
      return trimmed_code
    }

    // Check if search value contains whitespace
    if(/\s/.test(multi_search)) {
      // If search value contains whitespace remove the whitespace
      const trimmed_value = multi_search.replace(/\s/g,'')

      // Check if the trimmed value only contains numbers and return the trimmed value
      if(/^\d+$/.test(trimmed_value) === true) {
        return trimmed_value
      }

      // If trimmed value is not only numbers we asume its words so just return the value
      return multi_search
    }

    return multi_search
  } 
  catch(error) {
    return {error_message: error}
  }
}
