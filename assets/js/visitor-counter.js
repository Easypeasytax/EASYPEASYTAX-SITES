(function () {
  // Block common bots & crawlers
  const botPatterns = [
    /bot/i, /crawler/i, /spider/i, /crawling/i,
    /preview/i, /facebookexternalhit/i,
    /whatsapp/i, /slack/i, /telegram/i,
    /headless/i, /lighthouse/i, /pagespeed/i
  ];

  if (botPatterns.some(p => p.test(navigator.userAgent))) return;

  // Count only once per browser session
  const SESSION_KEY = 'ezpztags_site_visited';
  if (sessionStorage.getItem(SESSION_KEY)) return;
  sessionStorage.setItem(SESSION_KEY, '1');

  // Delay ensures real human visit (avoids prefetch)
  setTimeout(() => {
    fetch('https://api.countapi.xyz/hit/ezpztags.com/sitewide', {
      cache: 'no-store',
      keepalive: true
    }).catch(() => {});
  }, 1500);
})();

