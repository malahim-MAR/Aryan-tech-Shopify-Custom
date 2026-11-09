if (!customElements.get('hardware-showcase')) {
  customElements.define('hardware-showcase', class extends HTMLElement {
    connectedCallback() {
      this.slides = [...this.querySelectorAll('[data-slide]')];
      this.index = 0;
      const controls = this.querySelector('.tech-controls');
      if (!controls) return;
      controls.hidden = false;
      this.controller = new AbortController();
      const options = { signal: this.controller.signal };
      this.querySelector('[data-prev]').addEventListener('click', () => this.show(this.index - 1), options);
      this.querySelector('[data-next]').addEventListener('click', () => this.show(this.index + 1), options);
      this.addEventListener('shopify:block:select', event => {
        const index = this.slides.indexOf(event.target.closest('[data-slide]'));
        if (index >= 0) this.show(index);
      }, options);
    }

    show(index) {
      this.slides[this.index].hidden = true;
      this.index = (index + this.slides.length) % this.slides.length;
      this.slides[this.index].hidden = false;
      this.querySelector('[data-count]').textContent = this.index + 1;
    }

    disconnectedCallback() {
      this.controller?.abort();
    }
  });
}
