const params = new URLSearchParams(window.location.search);
const state = {
  festival: params.get('festival') === 'newyear' ? 'newyear' : 'diwali',
  from: params.get('from') || 'Someone special',
  to: params.get('to') || 'You',
  lang: params.get('lang') === 'hi' ? 'hi' : 'en',
  theme: ['royal', 'midnight', 'sunset', 'lotus'].includes(params.get('theme')) ? params.get('theme') : 'royal'
};

const copy = {
  diwali: {
    en: { title: 'Happy Diwali,', eyebrow: 'A little light, a lot of love', message: 'May your home glow with happiness, your heart stay peaceful, and every new beginning bring you closer to your dreams.' },
    hi: { title: 'शुभ दीपावली,', eyebrow: 'थोड़ी रोशनी, ढेर सारा प्यार', message: 'आपका घर खुशियों से जगमगाए, दिल शांति से भरा रहे और हर नई शुरुआत आपको आपके सपनों के करीब ले जाए।' }
  },
  newyear: {
    en: { title: 'Happy New Year,', eyebrow: 'New year, fresh energy', message: 'May the year ahead bring you brave beginnings, beautiful moments, and more reasons to smile every day.' },
    hi: { title: 'नव वर्ष की शुभकामनाएं,', eyebrow: 'नई शुरुआत, नई खुशियां', message: 'आने वाला साल आपके लिए नई शुरुआत, खूबसूरत पल और हर दिन मुस्कुराने की कई वजहें लेकर आए।' }
  }
};

const $ = (selector) => document.querySelector(selector);
const heroTitle = $('#headline');
const setFestival = (festival) => {
  state.festival = festival;
  document.body.dataset.festival = festival;
  document.querySelectorAll('.festival-choice').forEach((button) => button.classList.toggle('active', button.dataset.festivalChoice === festival));
  render();
};
const setTheme = (theme) => { state.theme = theme; document.body.dataset.theme = theme; document.querySelectorAll('.theme-choice').forEach((button) => button.classList.toggle('active', button.dataset.themeChoice === theme)); };
const render = () => {
  const text = copy[state.festival][state.lang];
  $('#heroEyebrow').textContent = text.eyebrow;
  heroTitle.innerHTML = `${text.title}<br /><span>${state.to}${state.to === 'You' ? '!' : ''}</span>`;
  $('#fromLine').innerHTML = `${state.lang === 'hi' ? 'शुभकामनाएं' : 'A warm wish from'} <strong>${state.from}</strong>`;
  $('#heroMessage').textContent = text.message;
  $('#signature').textContent = state.from;
  $('#languageInput').value = state.lang;
  document.title = `${text.title.replace(',', '')} ${state.to} — Festive Wishes`;
};

document.querySelectorAll('.festival-choice').forEach((button) => button.addEventListener('click', () => setFestival(button.dataset.festivalChoice)));
document.querySelectorAll('.theme-choice').forEach((button) => button.addEventListener('click', () => setTheme(button.dataset.themeChoice)));
$('#languageInput').addEventListener('change', (event) => { state.lang = event.target.value; render(); });
$('#makeButton').addEventListener('click', () => { $('#fromInput').value = state.to === 'You' ? '' : state.to; document.querySelector('#make').scrollIntoView({ behavior: 'smooth' }); setTimeout(() => $('#toInput').focus(), 500); });
$('#wishForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const from = $('#fromInput').value.trim(); const to = $('#toInput').value.trim();
  if (!from || !to) return;
  const url = new URL(window.location.href); url.search = new URLSearchParams({ from, to, festival: state.festival, lang: state.lang, theme: state.theme }).toString();
  $('#generatedLink').value = url.toString(); $('#whatsappLink').href = `https://wa.me/?text=${encodeURIComponent(`${copy[state.festival][state.lang].title} ${to}! ${url}`)}`; $('#result').hidden = false; $('#result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});
$('#copyButton').addEventListener('click', async () => { await navigator.clipboard.writeText($('#generatedLink').value); $('#copyButton').textContent = 'Copied ✓'; setTimeout(() => { $('#copyButton').textContent = 'Copy'; }, 1800); });
const share = async () => { if (navigator.share) await navigator.share({ title: document.title, text: `${copy[state.festival][state.lang].title} ${state.to}!`, url: window.location.href }); else { await navigator.clipboard.writeText(window.location.href); alert('Wish link copied!'); } };
$('#shareButton').addEventListener('click', share); $('#nativeShareButton').addEventListener('click', share);
$('.lang-button')?.addEventListener('click', () => { state.lang = state.lang === 'en' ? 'hi' : 'en'; render(); });
setTheme(state.theme); render();
