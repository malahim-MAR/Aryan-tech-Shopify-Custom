if (!customElements.get('at-campaign')) {
  customElements.define('at-campaign', class extends HTMLElement {
    connectedCallback() {
      this.panels = [...this.querySelectorAll('[data-panel]')];
      this.buttons = [...this.querySelectorAll('.at-dots button')];
      if (!this.buttons.length) return;
      this.abort = new AbortController();
      const options = { signal: this.abort.signal };
      this.querySelector('.at-dots').hidden = false;
      this.querySelector('.at-arrows').hidden = false;
      this.querySelectorAll('[data-step]').forEach(button => {
        button.addEventListener('click', () => {
          const index = this.panels.findIndex(panel => !panel.hidden);
          this.select((index + Number(button.dataset.step) + this.panels.length) % this.panels.length);
        }, options);
      });
      this.buttons.forEach((button, i) => button.addEventListener('click', () => this.select(i), options));
      this.addEventListener('shopify:block:select', event => {
        const index = this.panels.indexOf(event.target.closest('[data-panel]'));
        if (index >= 0) this.select(index);
      }, options);
      let start;
      this.addEventListener('touchstart', e => { start = e.touches[0].clientX; }, { ...options, passive: true });
      this.addEventListener('touchend', e => {
        const distance = e.changedTouches[0].clientX - start;
        if (Math.abs(distance) > 50) {
          const current = this.panels.findIndex(panel => !panel.hidden);
          this.select((current + (distance < 0 ? 1 : -1) + this.panels.length) % this.panels.length);
        }
      }, options);
    }
    select(index) {
      this.panels.forEach((panel, i) => {
        panel.hidden = i !== index;
        this.buttons[i].setAttribute('aria-pressed', String(i === index));
      });
    }
    disconnectedCallback() { this.abort?.abort(); }
  });
}
