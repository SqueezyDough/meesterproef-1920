exports.index = async (req, res) => {
  res.render('components/overview/index', {
    error: (req.error !== undefined) ? req.error : '',
    medicines: (req.medicines !== undefined) ? req.medicines : ''
  })
}
