// Language: 'en' or 'sw'. Saved in localStorage.
const Lang = {
  current: localStorage.getItem('lang') || 'sw',

  set(code) {
    this.current = code;
    localStorage.setItem('lang', code);
    document.querySelectorAll('.lang-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.lang === code);
    });
    document.dispatchEvent(new Event('langchange'));
  },

  // Get the right string from a bilingual object {en: '...', sw: '...'}
  t(obj) {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[this.current] || obj.en || obj.sw || '';
  },

  init() {
    document.querySelectorAll('.lang-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.lang === this.current);
      b.addEventListener('click', () => this.set(b.dataset.lang));
    });
  }
};
