const details_checkboxes = document.querySelectorAll('.card__details-checkbox')

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