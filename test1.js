(function () {
    const template = document.createElement('template');

    template.innerHTML = `
<style>
    span {
        color: red;        
    }
</style>
<h1>Hello World <span></span></h1>
<button increment>Add</button><button decrement>Subtract</button><a href="/">Leave</a>
    `;

    class MyComponent extends HTMLElement {

        constructor() {
            super();

            console.log('*** constructor');

            const shadowRoot = this.attachShadow({ mode: 'open' });
            shadowRoot.appendChild(template.content.cloneNode(true));

            this.span = shadowRoot.querySelector('span');
            this.btnIncrement = shadowRoot.querySelector('[increment]');
            this.btnDecrement = shadowRoot.querySelector('[decrement]');
        }

        connectedCallback() {
            console.log('*** connectedCallback');
            console.log(this.span);

            this.btnIncrement.addEventListener('click', this.inc.bind(this));
            this.btnDecrement.addEventListener('click', this.dec.bind(this));
        }

        static get observedAttributes() {
            return ['value'];
        }

        attributeChangedCallback(name, oldValue, newValue) {
            console.log('*** attributeChangedCallback');
            switch (name) {
                case 'value':
                    console.log(`Value changed from ${oldValue} to ${newValue}`, this.span);
                    this.span.textContent = newValue;
                    break;
            }
        }

        disconnectedCallback() {
            console.log('*** disconnectedCallback');

            this.btnIncrement.removeEventListener('click', this.inc);
            this.btnDecrement.removeEventListener('click', this.dec);
        }

        inc() {
            this.setAttribute('value', +this.getAttribute('value') + 1);
        }

        dec() {
            this.setAttribute('value', +this.getAttribute('value') - 1);
        }

    }

    customElements.define('my-component', MyComponent);
})();