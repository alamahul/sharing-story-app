class FooterBar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <p>Sharing Story App &copy; 2025</p>
        `;
    }
}

customElements.define('footer-bar', FooterBar);