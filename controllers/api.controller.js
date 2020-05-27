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

exports.FetchData = function(url, range,...params) {
  console.log('Fetching data...')

  if (params) {
    params.forEach(param => {
      url = url += param
    })
  }

  return fetch(url)
      .then(checkStatus)
      .then(data => data.text())
      .then(data => range ? limitResults(JSON.parse(data), range) : JSON.parse(data))
      .catch(err => console.log(err));
}

function limitResults(data, range) {
  return data.reduce(function(accumulator, currentValue, currentIndex) {
    if (currentIndex >= range[0] && currentIndex <= range[1]) {
      accumulator.push(currentValue)
    }
    return accumulator
  }, [])
}
