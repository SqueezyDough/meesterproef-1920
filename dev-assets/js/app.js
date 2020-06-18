const details_checkboxes = document.querySelectorAll('.card__details-checkbox')
const get_storage = collection => localStorage.getItem(collection)
const notification_container = document.getElementById('notification-container')
const cta_headers = document.querySelectorAll('.cta')
const cta_bottom_header = document.querySelector('.cta-bottom-header')
const online = window.navigator.onLine

// template for rendering history component
const template = `
{{#History}}
<li>
  <article class="card -history" data-id="{{id}}">
    <header class="card__header">
      <h2>{{name}}</h2>
      <small>{{registrationNumber}}</small>
    </header>

    <ul class="card__actions">
      <li class="card__actions__delete"><button class="btn-quartiary">Verwijderen</button></li>
      <li class="card__actions__details">
        <label for="{{id}}_select_med" class="card__details-toggle">Info</label>
        <input id="{{id}}_select_med" class="card__details-checkbox" type="checkbox">

        <div class="card__details">
          <header class="card__details__header">
            <h2>{{name}}</h2>
            <small>{{registrationNumber}}</small>
          </header>

          <div class="card__details__info">
            <h2>Actieve Ingredient(en)</h2>
            {{^activeIngredient}}
              <span>{{activeIngredient}}</span>
              {{else}}
              <span>Geen actieve ingrediënten gevonden</span>
            {{/activeIngredient}}

            <h2>Gevonden bijsluiters</h2>
            <ul class="leaflet-list">
              <li>
                <a href="#">
                  <i class="icon-next"></i>
                  Bijsluiter (PDF)
                </a>
                <small>Gevonden op <a href="https://www.apotheekkennisbank.nl/geneesmiddelen/bijsluiters/zoeken">apotheekkennisbank.nl</a></small>
              </li>
            </ul>

            <label for="{{id}}_select_med" class="card__details-toggle -active">
              Sluit venster
            </label>
          </div>
        </div>
        <div class="filter"></div>
      </li>
    </ul> 
  </article>
</li>
{{/History}}
`

checkNetworkStatus()

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
  const notification_element = document.getElementById('history-notification')

  if (get_storage('searched') && notification_element) {
    const storage_items = [].concat(JSON.parse(get_storage('searched')))
    const item_count = storage_items.length;
    const history_toggle = document.getElementById('show-history')
    
    notify_user(item_count, notification_element)
    populate_history_list(storage_items)

    history_toggle.addEventListener('click', () => {
      const notification_container = document.getElementById('history-notification')
      const history_container = document.querySelector('.notification__history-container')
      notification_container.classList.toggle('-expanded')
      history_container.classList.toggle('is-hidden')

      history_container.classList.contains('is-hidden') 
        ? history_toggle.textContent = 'Toon zoekgeschiedenis'
        : history_toggle.textContent = 'Verberg zoekgeschiedenis'  
    })
  }
}

function notify_user (item_count, notification_element) {  
  const item_counter = notification_element.querySelector('#history-count')

  notification_element.classList.remove('is-hidden')
  item_counter.textContent = item_count
}

function populate_history_list(storage_items) {
  const render_data =  { History: storage_items }

  renderHistoryItems(template, render_data)
}

function renderHistoryItems(template, data) {
  const output = mustache(template, data)

  const insertContainer = document.querySelector('.notification__history-container')
  insertContainer.insertAdjacentHTML('beforeend', output)
}

// check network an display notification when offline
function checkNetworkStatus() { 
  if (online) {
    displayOnline()
  } else {
    displayOffline()
  }
}

function displayOnline() {
  if (cta_headers) cta_headers.forEach(header => header.classList.remove('is-hidden'))
  if (cta_bottom_header) cta_bottom_header.classList.remove('is-hidden')
  if (notification_container) {
    notification_container.classList.add('is-hidden') 
  }
}

function displayOffline() { 
  if (cta_headers) cta_headers.forEach(header => header.classList.add('is-hidden'))
  if (cta_bottom_header) cta_bottom_header.classList.add('is-hidden')
  if (notification_container) {
    const message_element = notification_container.querySelector('span')
    if (message_element) message_element.textContent = 'U bent offline, maar wees gerust u kunt nog wel uw zoekgeschienis bekijken.'

    notification_container.classList.remove('is-hidden') 
  }  
}

window.addEventListener('online', () => {
  displayOnline()
})

window.addEventListener('offline', () => {
  displayOffline()
})