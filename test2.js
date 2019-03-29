(function () {
    const template = document.createElement('template');

    template.innerHTML = `
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
<style>
:host {
    display: flex;
    color: white;
    background-color: blue;
    padding: 8px 10px;
    flex-direction: row;
    justify-content: space-between;
    line-height: 24px;
    cursor: default;
    user-select: none;
}

.row {
    display: flex;
    flex-direction: row;
}

[hamburger] {
    margin-right: 10px;
    cursor: pointer;
}

[hamburger].menu-on {
    background-color: rgba(255, 255, 255, 0.3);
}
</style>
<div class="row">
    <i hamburger class="material-icons">menu</i>
    <div brand></div>
</div>
<div>
    PICTURE
</div>
`;

    class MyComponent extends HTMLElement {

        constructor() {
            super();

            const shadowRoot = this.attachShadow({ mode: 'open' });
            shadowRoot.appendChild(template.content.cloneNode(true));

            this.brand = shadowRoot.querySelector('[brand]');
            this.menu = shadowRoot.querySelector('[hamburger]');
        }

        connectedCallback() {
            this.menu.addEventListener('click', this.menuClick.bind(this));
        }

        static get observedAttributes() {
            return ['brand', 'menu-state'];
        }

        attributeChangedCallback(name, oldValue, newValue) {
            console.log(name, oldValue, newValue);
            switch (name) {
                case 'brand':
                    this.brand.textContent = newValue;
                    break;
                
                case 'menu-state':
                    if (newValue==='true')
                        this.menu.classList.add('menu-on');
                    else
                        this.menu.classList.remove('menu-on');
                    break;
            }
        }

        disconnectedCallback() {
            this.btnIncrement.removeEventListener('click', this.inc);
            this.btnDecrement.removeEventListener('click', this.dec);
        }

        menuClick(event) {
            this.dispatchEvent(new CustomEvent('onmenu', { bubbles: true, cancelable: true, composed: true, detail: event }));
        }

    }

    customElements.define('nav-bar', MyComponent);
})();