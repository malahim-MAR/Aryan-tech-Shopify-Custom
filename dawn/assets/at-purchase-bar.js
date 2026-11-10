if (!customElements.get('at-purchase-bar')) {
  class PurchaseBar extends HTMLElement {
    connectedCallback() {
      const product = this.closest('product-info');
      if (!product || this.closest('quick-add-modal')) return;
      const submit = product.querySelector('.product-form__submit');
      if (!submit) return;
      const barButton = this.querySelector('button');
      const price = product.querySelector('[id^="price-"]');
      const barPrice = this.querySelector('[data-bar-price]');
      const sync = () => {
        barButton.disabled = submit.disabled || submit.getAttribute('aria-disabled') === 'true';
        barButton.textContent = submit.querySelector('span').textContent.trim();
        const visiblePrice = price?.querySelector('.price--on-sale .price-item--sale, .price:not(.price--on-sale) .price__regular .price-item--regular:not(s)');
        barPrice.textContent = price?.classList.contains('hidden') ? '' : visiblePrice?.textContent.trim() || '';
      };
      this.controller = new AbortController();
      barButton.addEventListener('click', () => submit.click(), { signal: this.controller.signal });
      this.updates = new MutationObserver(sync);
      const options = { subtree: true, childList: true, characterData: true, attributes: true };
      this.updates.observe(submit, options);
      if (price) this.updates.observe(price, options);
      const updateVisibility = () => {
        if (this.frameId) return;
        this.frameId = requestAnimationFrame(() => {
          this.hidden = submit.getBoundingClientRect().bottom > 0;
          this.frameId = null;
        });
      };
      window.addEventListener('scroll', updateVisibility, { passive: true, signal: this.controller.signal });
      window.addEventListener('resize', updateVisibility, { signal: this.controller.signal });
      updateVisibility();
      sync();
    }

    disconnectedCallback() {
      this.updates?.disconnect();
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
      this.controller?.abort();
    }
  }
  customElements.define('at-purchase-bar', PurchaseBar);
}
