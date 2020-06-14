const details_checkboxes = document.querySelectorAll('.card__details-checkbox')
const get_storage = collection => localStorage.getItem(collection)

// template for rendering history component
const template = `
{{#History}}
<li>
  <article class="card -history" data-id="{{id}}">
    <header class="card__header">
      <h2>{{name}}</h2>
      <small>{{registrationNumber}}</small>
    </header>

    <label for="{{id}}_select_med" class="card__details-toggle">
      Meer informatie
    </label>
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
  </article>
</li>
{{/History}}
`

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
  const insertContainer = document.querySelector('.notification__history-container');
  insertContainer.insertAdjacentHTML('beforeend', Mustache.to_html(template, data));
}