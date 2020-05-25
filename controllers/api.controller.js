const fetch = require('node-fetch')

const checkStatus = response => {
    if (response.ok) {
        return response;
    } else {
        const error = new Error(response.statusText);
        error.response = response;
        throw error;
    }
}

exports.FetchData = function(url, ...params) {
  console.log('Fetch data...')

  if (params) {
    params.map(param => {
      url = url += param
    })
  }

  return fetch(url)
      .then(checkStatus)
      .then(data => data.text())
      .then(data => JSON.parse(data))
      .catch(err => console.log(err));
}
