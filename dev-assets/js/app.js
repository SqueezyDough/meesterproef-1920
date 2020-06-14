const details_checkboxes = document.querySelectorAll('.card__details-checkbox')
const get_storage = collection => localStorage.getItem(collection)

// fix scroll when modal is open
details_checkboxes.forEach(chk => {
  chk.addEventListener('click', () => {
    if (chk.checked) {
      document.body.style.position = 'fixed'
    } else {
      document.body.style.position = ''
    }  
  })
})

if (localStorage) {
  if (get_storage('searched')) {
    const storage_items = [].concat(JSON.parse(get_storage('searched')))
    const item_count = storage_items.length;
    
    notify_user(item_count)
    populate_history_list(storage_items)
  }
}

function notify_user (item_count) {
  const notification_element = document.getElementById('history-notification')
  const item_counter = notification_element.querySelector('#history-count')

  notification_element.classList.remove('is-hidden')
  item_counter.textContent = item_count
}

function populate_history_list(storage_items) {
  console.log('pop')
}