(function () {
    const template = document.createElement('template');

    template.innerHTML = `
<style>
    .container {
        width: 100%;
        padding: 20px 5px;
        box-sizing: border-box;
        overflow-x: hidden;
    }

    .track-container {
        position: relative;
        width: 100%;
    }

    .track {
        position: absolute;
        width: 100%;
        background-color: red;
        height: 5px;
    }

    .clickable {
        width: 100%;
        position: relative;
        height: 0px;
    }

    button {
        position: relative;
        transform: translate(-9px, -7px);
        height: 20px;
        width: 20px;
        border-radius: 50%;
        padding: 0;
        border: 1px solid black;
        background-color: rgba(255,255,255,0.9);
    }

    button:focus {
        outline: none;
    }
</style>

<div class="container">
    <div class="track-container">
        <div class="track"></div>
    </div>
    <div class="clickable" style="transform: translateX(0%)">
        <button></button>
    </div>
</div>
`;

    class MyComponent extends HTMLElement {

        constructor() {
            super();

            const shadowRoot = this.attachShadow({ mode: 'open' });
            shadowRoot.appendChild(template.content.cloneNode(true));

            this.position = shadowRoot.querySelector('.clickable');
            this.track = shadowRoot.querySelector('.track');
            this.button = shadowRoot.querySelector('button');
            // this.brand = shadowRoot.querySelector('[brand]');
            // this.menu = shadowRoot.querySelector('[hamburger]');
        }

        connectedCallback() {
            this.track.addEventListener('click', this.trackClick.bind(this));
            this.button.addEventListener('mousedown', this.trackMouseOver.bind(this));
        }

        disconnectedCallback() {
            this.trackClick.removeEventListner('click', this.trackClick);
            this.button.removeEventListner('mousedown', this.trackMouseOver);
        }

        static get observedAttributes() {
            return ['value', 'min', 'max'];
        }

        attributeChangedCallback(name, oldValue, newValue) {
            console.log(name, oldValue, newValue);
            switch (name) {
                case 'value':
                    const min = +this.min || 0;
                    const max = +this.max || 0;
                    const range = max - min;
                    const percentage = (newValue - min) * 100 / range;
                    this.position.setAttribute('style', `transform: translateX(${percentage}%)`)
                    break;

                case 'min':
                    this.min = newValue || 0;
                    break;

                case 'max':
                    this.max = newValue || 100;
                    break;
            }
        }

        trackClick(event) {
            const { left, width } = event.target.getBoundingClientRect();
            const min = +this.min || 0;
            const max = +this.max || 100;
            const value = Math.round(((event.x - left) * (max - min) / width) + min);
            this.dispatchEvent(new CustomEvent('onChange', { detail: { event, value } }));
        }

        trackMouseOver() {
            const originalOnMouseMove = document.body.onmousemove;
            const originalOnMouseUp = document.body.onmouseup;

            document.body.onmousemove = function (mve) {
                const e = mve || window.event;
                let end = 0;
                if (e.pageX)
                    end = e.pageX;
                else if (e.clientX)
                    end = e.clientX;

                const { left, width, right } = this.track.getBoundingClientRect();
                const newX = Math.max(Math.min(end, right), left);
                const min = +this.min || 0;
                const max = +this.max || 100;
                const value = Math.round(((newX - left) * (max - min) / width) + min);
                this.dispatchEvent(new CustomEvent('onChange', { detail: { event, value } }));                    
            }.bind(this);

            document.body.onmouseup = function () {
                document.body.onmousemove = originalOnMouseMove;
                document.body.onmouseup = originalOnMouseUp;
            };
        }

    }

    customElements.define('my-slider', MyComponent);
})();