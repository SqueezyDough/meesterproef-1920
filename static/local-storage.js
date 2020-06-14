const storage_controller = {
  add: (collection, medicine) => {
    storage_controller.get(collection) 
      ? storage_controller.update(collection, medicine) 
      : storage_controller.set(collection, medicine)
  },
  get: (collection) => localStorage.getItem(collection),
  set: (collection, medicine) => localStorage.setItem(collection, JSON.stringify(medicine)),
  update: (collection, medicine) => {  
    const storage_items = [].concat(JSON.parse(storage_controller.get(collection)))

    if (!storage_items.find(m => m.id === medicine.id)) {
      storage_items.push(medicine)
      storage_controller.set(collection, storage_items)
    }
  },
  clear: collection => localStorage.removeItem(collection)
}

const fetcher = id => {
  return fetch(`https://hva-cmd-meesterproef-ai.now.sh/medicines/${id}`)
    .then(res => res.json())
}

const medicine_cards = document.querySelectorAll('.card')

// save medicine to local storage on button click
medicine_cards.forEach(card => {
  const id = card.getAttribute('data-id')
  const chk = card.querySelector('.card__details-checkbox')
  const del = card.querySelector('.card__actions__delete button')

  chk.addEventListener('click', async () => {
    if (chk.checked) {
      const medicine = await fetcher(id)
      const collection = 'searched'

      storage_controller.add(collection, medicine)
    }
  })

  if (del) {
    del.addEventListener('click', () => {
      const collection = 'searched'
      const storage_items = [].concat(JSON.parse(storage_controller.get(collection)))
      const notification_element = document.getElementById('history-notification')  
      const item_counter = notification_element.querySelector('#history-count')
  
      if (storage_items) {
        const new_list = storage_items.filter(medicine => medicine.id != id)
        storage_controller.clear(collection)
  
        new_list.forEach(medicine => {
          storage_controller.add(collection, medicine)
        })  
        
        card.parentElement.remove()
        item_counter.textContent = new_list.length

        if (new_list.length === 0) {
          notification_element.classList.add('is-hidden')
        }
      }
    })
  }
})
