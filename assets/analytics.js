/* PostHog JS, EU-хост, без cookies: persistence в памяти вкладки, без автозахвата и записи сессий.
   Сайт шлёт $pageview и cta_click {lang, block}; переходы по кнопкам считает go_redirect на /go/<источник>/. */
(function () {
  !function(t,e){var o,n,p,r;e.__SV||(window.posthog && window.posthog.__loaded)||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}p||((p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",p.onerror=function(){p=null},(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r));var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],Object.defineProperty(u,"toString",{configurable:!0,enumerable:!0,writable:!0,value:function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e}}),Object.defineProperty(u.people,"toString",{configurable:!0,enumerable:!0,writable:!0,value:function(){return u.toString(1)+".people (stub)"}}),o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagResult isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);

  posthog.init('phc_rDR9qcCQBfLa2HobCuXHeYKGAoSgr5sSjQmptjsccc7S', {
    api_host: 'https://eu.i.posthog.com',
    defaults: '2026-05-30',
    persistence: 'memory',
    autocapture: false,
    disable_session_recording: true,
    capture_pageview: false,
    person_profiles: 'identified_only',
  });

  posthog.capture('$pageview');

  // Пришли по короткой ссылке на лендинг (/go/linkedin/ → ?src=linkedin): метка едет дальше в кнопки (/go/site-ru/?from=linkedin),
  // и приложение узнаёт исходный источник, а не просто «с сайта».
  var src = new URLSearchParams(location.search).get('src');
  if (/^[a-z0-9][a-z0-9-]{0,63}$/.test(src || '')) {
    document.querySelectorAll('a[data-cta-block][href*="go/site-"]').forEach(function (a) {
      a.setAttribute('href', a.getAttribute('href') + '?from=' + src);
    });
  }

  document.addEventListener('click', function (event) {
    var el = event.target.closest('[data-cta-block]');
    if (!el) return;
    try {
      var id = (crypto.randomUUID ? crypto.randomUUID() : 'anon-' + Math.random().toString(36).slice(2) + Date.now());
      var payload = {
        api_key: 'phc_rDR9qcCQBfLa2HobCuXHeYKGAoSgr5sSjQmptjsccc7S',
        event: 'cta_click',
        distinct_id: id,
        properties: { lang: document.documentElement.lang, block: el.getAttribute('data-cta-block'), $process_person_profile: false },
      };
      var blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon('https://eu.i.posthog.com/i/v0/e/', blob);
    } catch (e) {}
  });
})();
