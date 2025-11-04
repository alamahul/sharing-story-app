import App from './app.js';
import AuthService from './data/auth-service.js';

import '@fortawesome/fontawesome-free/css/all.min.css';
import 'leaflet/dist/leaflet.css';

import '../public/favicon.png'
import '../styles/main.css';
import '../styles/responsive.css';

import './components/AppBar.js';
import './components/FooterBar.js';
import './components/StoryCard.js';


const app = new App({
    authService: AuthService,
});

const contentContainer = document.querySelector('#main-content');
const appBar = document.querySelector('app-bar');

const renderPage = async () => {
    const { page, needsScrollLock, redirect } = await app.getPageAndScrollStatus();

    if (redirect) {
        location.hash = redirect;
        return;
    }
    
    if (!page) {
        console.error('Render dibatalkan: Halaman tidak ditemukan atau tidak ada redirect.');
        return; 
    }

    if (needsScrollLock) {
        document.documentElement.classList.add('no-scroll');
        document.body.classList.add('no-scroll');
    } else {
        document.documentElement.classList.remove('no-scroll');
        document.body.classList.remove('no-scroll');
    }

    if (!document.startViewTransition) {
        contentContainer.innerHTML = `<div class="page-content">${await page.render()}</div>`;
        if (typeof page.afterRender === 'function') {
            await page.afterRender(contentContainer);
        }
        return;
    }

    document.startViewTransition(async () => {
        const pageHtml = await page.render();
        contentContainer.innerHTML = `<div class="page-content">${pageHtml}</div>`;
        
        if (typeof page.afterRender === 'function') {
            await page.afterRender(contentContainer);
        }
    });
};

window.addEventListener('hashchange', () => {
    renderPage();
    appBar.renderNavLinks(); 
});

window.addEventListener('DOMContentLoaded', () => {
    renderPage();
});


document.addEventListener('logout-request', () => {
    AuthService.removeToken();
    location.hash = '/login'; 
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('service-worker.js') // Daftarkan file SW dari 'dist'
            .then((registration) => {
                console.log('Service Worker registered. Scope:', registration.scope);
            })
            .catch((error) => {
                console.error('Service Worker registration failed:', error);
            });
    });

}
