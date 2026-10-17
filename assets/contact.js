/* Форма связи (Web3Forms): отправка через fetch, без перехода на сторонний сайт.
   Событие contact_submit в PostHog по образцу cta_click из analytics.js — только lang и result. */
(function () {
  var STRINGS = {
    en: {
      sending: 'Sending…',
      send: 'Send',
      success: "Sent. I'll get back to you soon.",
      error: 'Something went wrong. Try again, or message @PokerDealerAppBot on Telegram.',
    },
    ru: {
      sending: 'Отправляется…',
      send: 'Отправить',
      success: 'Отправлено. Скоро отвечу.',
      error: 'Не получилось отправить. Попробуйте ещё раз или напишите боту @PokerDealerAppBot в Telegram.',
    },
  };

  function track(lang, result) {
    try {
      var id = (crypto.randomUUID ? crypto.randomUUID() : 'anon-' + Math.random().toString(36).slice(2) + Date.now());
      var payload = {
        api_key: 'phc_rDR9qcCQBfLa2HobCuXHeYKGAoSgr5sSjQmptjsccc7S',
        event: 'contact_submit',
        distinct_id: id,
        properties: { lang: lang, result: result, $process_person_profile: false },
      };
      var blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon('https://eu.i.posthog.com/i/v0/e/', blob);
    } catch (e) {}
  }

  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('contact-form');
    if (!form) return;

    var lang = document.documentElement.lang === 'ru' ? 'ru' : 'en';
    var t = STRINGS[lang];
    var button = form.querySelector('button[type="submit"]');
    var status = form.querySelector('.form-status');
    var botcheck = form.querySelector('input[name="botcheck"]');

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      if (botcheck && botcheck.checked) {
        status.textContent = t.success;
        form.reset();
        return;
      }

      var data = {
        access_key: form.querySelector('input[name="access_key"]').value,
        subject: form.querySelector('input[name="subject"]').value,
        name: form.querySelector('#contact-name').value,
        email: form.querySelector('#contact-email').value,
        message: form.querySelector('#contact-message').value,
      };

      button.disabled = true;
      button.textContent = t.sending;
      status.textContent = '';

      fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data),
      })
        .then(function (response) { return response.json().then(function (result) { return { ok: response.ok, result: result }; }); })
        .then(function (data) {
          var result = data.result;
          if (data.ok && result && result.success) {
            status.textContent = t.success;
            form.reset();
            track(lang, 'success');
          } else {
            status.textContent = t.error;
            track(lang, 'error');
          }
        })
        .catch(function () {
          status.textContent = t.error;
          track(lang, 'error');
        })
        .then(function () {
          button.disabled = false;
          button.textContent = t.send;
        });
    });
  });
})();
