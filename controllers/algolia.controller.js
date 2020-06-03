import algoliasearch from 'algoliasearch'
import dotenv from 'dotenv'
dotenv.config()

exports.search = async (req, res) => {
  console.log(req.body.code)
  const client = algoliasearch(process.env.ALGOLIA_APPLICATION_ID, process.env.ALGOLIA_KEY)
  const index = client.initIndex('dev_MEDICINE')

  const suspected_medicines = await index.search(req.body.code).then(({ hits }) => {
    return hits
  });
  
  res.send(suspected_medicines)
}
