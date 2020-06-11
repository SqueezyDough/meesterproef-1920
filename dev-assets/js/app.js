const details_checkboxes = document.querySelectorAll('.card__details-checkbox')
console.log(details_checkboxes)

const show_card_details = () => {
  const scroll_y = document.documentElement.style.getPropertyValue('--scroll-y')
  const body = document.body

  body.style.position = 'fixed'
  body.style.top = `-${scroll_y}`
}

const close_card_details = () => {
  const body = document.body
  const scroll_y = body.style.top
  body.style.position = ''
  body.style.top = ''
  window.scrollTo(0, parseInt(scroll_y || '0') * -1)
}

window.addEventListener('scroll', () => {
  document.documentElement.style.setProperty('--scroll-y', `${window.scroll_y}px`)
})

details_checkboxes.forEach(chk => {
  chk.addEventListener('click', () => {
    console.log(chk)
  })
})