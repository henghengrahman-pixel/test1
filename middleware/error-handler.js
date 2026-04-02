function notFound(req, res) {
  res.status(404).render('site/message', {
    meta: { title: '404 Not Found', description: 'Page not found.' },
    heading: 'Page not found',
    message: 'Halaman yang kamu cari tidak tersedia.'
  });
}

function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(500).render('site/message', {
    meta: { title: '500 Server Error', description: 'Unexpected server error.' },
    heading: 'Server error',
    message: err.message || 'Terjadi kesalahan pada server.'
  });
}

module.exports = { notFound, errorHandler };
