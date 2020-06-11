const details_checkboxes = document.querySelectorAll('.card__details-checkbox')

const fix_scroll = () => {
  const scroll_y = document.documentElement.style.getPropertyValue('--scroll-y')
  const body = document.body

  body.style.position = 'fixed'
  body.style.top = `-${scroll_y}`
}

const enable_scroll = () => {
  const body = document.body
  const scroll_y = body.style.top
  body.style.position = ''
  body.style.top = ''
  window.scrollTo(0, parseInt(scroll_y || '0') * -1)
}

window.addEventListener('scroll', () => {
  document.documentElement.style.setProperty('--scroll-y', `${window.scroll_y}px`)
})

// fix scroll when modal is open
details_checkboxes.forEach(chk => {
  chk.addEventListener('click', () => {
    // source: https://css-tricks.com/prevent-page-scrolling-when-a-modal-is-open/
    if (chk.checked) {
      fix_scroll()
    } else {
      enable_scroll()
    }  
  })
})