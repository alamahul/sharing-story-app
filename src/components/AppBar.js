import AuthService from '../data/auth-service.js';

class AppBar extends HTMLElement {
    constructor() {
        super();
        this._boundRender = this.renderAndSetup.bind(this);
    }

    connectedCallback() {
        this.renderAndSetup();
        window.addEventListener('hashchange', this._boundRender);
    }

    disconnectedCallback() {
        window.removeEventListener('hashchange', this._boundRender);
    }

    renderAndSetup() {
        this.render();
        this._setupListeners();
    }
    
    renderNavLinks() {
        const navMenu = this.querySelector('.app-bar__menu');
        if (navMenu) {
            navMenu.innerHTML = this._getNavLinksHtml();
            this._setupLogoutListener();
            this._setupDropdownListener();
        }
    }

    _setupListeners() {
        const hamburgerButton = this.querySelector('#hamburgerButton');
        const navMenu = this.querySelector('.app-bar__menu');
        
        if (hamburgerButton) {
            hamburgerButton.addEventListener('click', (event) => {
                event.stopPropagation();
                navMenu.classList.toggle('open');
                hamburgerButton.classList.toggle('open');
            });
        }
        
        this._setupLogoutListener();
        this._setupDropdownListener();
        
        document.addEventListener('click', (event) => {
            const openDropdown = this.querySelector('.dropdown.open');
            if (openDropdown && !openDropdown.contains(event.target)) {
                openDropdown.classList.remove('open');
            }
        });
    }

    _setupLogoutListener() {
        const logoutButton = this.querySelector('#logoutButton');
        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                this.dispatchEvent(new CustomEvent('logout-request', {
                    bubbles: true,
                    composed: true,
                }));
            });
        }
    }

    _setupDropdownListener() {
        const dropdownToggle = this.querySelector('.dropdown-toggle');
        if (dropdownToggle) {
            dropdownToggle.addEventListener('click', (event) => {
                event.stopPropagation(); 
                
                this.querySelectorAll('.dropdown.open').forEach(dropdown => {
                    if (dropdown !== event.currentTarget.closest('.dropdown')) {
                        dropdown.classList.remove('open');
                    }
                });
                
                const dropdown = event.currentTarget.closest('.dropdown');
                dropdown.classList.toggle('open');
            });
        }
    }

    _getNavLinksHtml() {
        const currentHash = location.hash; 

        if (AuthService.isLoggedIn()) {
            return `
                <a href="#/" aria-label="Beranda"><i class="fa-solid fa-house"></i> Home</a>
                
                <div class="dropdown">
                    <button class="dropdown-toggle" aria-label="Buka menu cerita" aria-haspopup="true">
                        
                        <span class="dropdown-toggle__label">
                            <i class="fa-solid fa-book-open"></i> Cerita
                        </span>
                        
                        <i class="fa-solid fa-caret-down"></i>
                    </button>
                    <div class="dropdown-menu">
                        <a href="#/story-list" aria-label="Daftar Cerita"><i class="fa-solid fa-list"></i> Daftar Cerita</a>
                        <a href="#/add-story" aria-label="Tambah Cerita Baru"><i class="fa-solid fa-plus"></i> Tambah Cerita</a>
                        <a href="#/saved-stories" aria-label="Cerita Tersimpan"><i class="fa-solid fa-bookmark"></i>Cerita Tersimpan</a>
                    </div>
                </div>
                
                <a href="#/about" aria-label="Tentang Aplikasi"><i class="fa-solid fa-info-circle"></i> About</a>
                <button id="logoutButton" aria-label="Keluar"><i class="fa-solid fa-right-from-bracket"></i> Logout</button>
            `;
        }
        
        return `
            <a href="#/login" aria-label="Masuk"><i class="fa-solid fa-right-to-bracket"></i> Login</a>
            <a href="#/register" aria-label="Daftar"><i class="fa-solid fa-user-plus"></i> Register</a>
        `;
    }

    render() {
        this.innerHTML = `
            <img src="./images/logo.png" alt="Logo" class="app-bar__logo"> 
            <h1 class="app-bar__brand">Berbagi Cerita</h1>
            <button id="hamburgerButton" class="app-bar__toggle" aria-label="Buka menu navigasi">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <nav class="app-bar__menu">
                ${this._getNavLinksHtml()}
            </nav>
        `;
    }
}


customElements.define('app-bar', AppBar);
