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
  } 
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

  chk.addEventListener('click', async () => {
    if (chk.checked) {
      const medicine = await fetcher(id)
      const collection = 'seached'

      storage_controller.add(collection, medicine)
    }
  })
})
