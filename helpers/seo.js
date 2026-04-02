function makeMeta(overrides = {}, req) {
  const siteName = process.env.STORE_NAME || 'Mawar Parfume';
  const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
  const canonical = overrides.canonical || `${baseUrl}${req.originalUrl}`;

  return {
    title: overrides.title || `${siteName} | Parfum Poipet`,
    description:
      overrides.description ||
      'Mawar Parfume Poipet - toko parfum online dengan produk pilihan, checkout cepat, dan tampilan profesional.',
    canonical,
    image: overrides.image || `${baseUrl}/public/img/og-default.jpg`,
    siteName
  };
}

module.exports = { makeMeta };
