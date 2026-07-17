// Edge/CDN caching for public GET endpoints.
// `s-maxage` lets shared caches (Vercel's edge) serve the response without
// invoking the function; `stale-while-revalidate` serves the stale copy while
// a fresh one is fetched in the background. Browsers are told not to cache
// (max-age=0) so admin edits show up as soon as the edge copy expires.
const edgeCache = (seconds = 300) => (req, res, next) => {
  res.set(
    'Cache-Control',
    `public, max-age=0, s-maxage=${seconds}, stale-while-revalidate=${seconds * 2}`
  );
  next();
};

module.exports = edgeCache;
