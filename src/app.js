// src/app.js
import UrlParser from './router/url-parser.js';
import routes from './router/routes.js';

class App {
    constructor({ authService }) {
        this._authService = authService;
        this._currentView = null;
    }

    async getPageAndScrollStatus() {
        const isLoggedIn = this._authService.isLoggedIn();
        
        const parsedUrl = UrlParser.parseActiveUrl();

        const path = parsedUrl.id ? `/${parsedUrl.resource}/:id` : `/${parsedUrl.resource || ''}`;
        
        let page = routes[path] || routes['/404'];
        let needsScrollLock = false;
        
        if (path === '/login' || path === '/register') {
            if (isLoggedIn) {
                return { page: null, needsScrollLock: false, redirect: '/' };
            }
            needsScrollLock = true;
        } else {
            if (!isLoggedIn) {
                return { page: null, needsScrollLock: true, redirect: '/login' };
            }
        }
        
        if (this._currentView && typeof this._currentView.unmount === 'function') {
            this._currentView.unmount();
        }
        this._currentView = page;
        
        return { page, needsScrollLock, redirect: null };
    }
}

export default App;