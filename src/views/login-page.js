import LoginPresenter from '../presenters/login-presenter.js';
import StoryApi from '../data/story-api.js';
import Swal from 'sweetalert2';

const LoginPage = {
    _presenter: null,
    _form: null,

    async render() {
        return `
            <div class="auth-page">
                <div class="auth-card card-shadow">
                    <h2 class="auth-card__title">Login</h2>
                    <p class="auth-card__subtitle">Masuk untuk berbagi cerita Anda.</p>
                    
                    <div id="message-container"></div>
                    
                    <form id="loginForm" novalidate>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="password" id="password" name="password" required>
                        </div>
                        <div class="form-group form-check">
                        <label for="rememberMe">Ingat saya</label>
                        <input type="checkbox" id="rememberMe" name="rememberMe">
                        </div>
                        <button type="submit" class="button button--full-width" id="submitButton">
                            Login
                        </button>
                    </form>
                    
                    <p class="auth-switch">
                        Belum punya akun? <a href="#/register">Daftar di sini</a>
                    </p>
                </div>
            </div>
        `;
    },

    async afterRender(container) {
        this._presenter = new LoginPresenter({
            view: this,
            model: StoryApi, 
        });

        this._form = container.querySelector('#loginForm');
        
        this._form.addEventListener('submit', (event) => {
            event.preventDefault();
            
           const email = this._form.elements.email.value;
           const password = this._form.elements.password.value;
           const rememberMe = this._form.elements.rememberMe.checked; 
           
           this._presenter.handleLogin(email, password, rememberMe);
        });
    },


    showMessage(message, type) {
        if (type == undefined) {
            return;
        }
        Swal.fire({
            icon: type,
            title: type === 'success' ? 'Berhasil!' : 'Oops...',
            text: message,
            showConfirmButton: false,
            timer: 2000
        });
    },

    showLoading(isLoading) {
        const button = document.querySelector('#submitButton');
        if (button) {
            button.disabled = isLoading;
            button.innerHTML = isLoading 
                ? '<span class="loader"></span> Memproses...' 
                : 'Login';
        }
    },

    navigateToHome() {
        location.hash = '/';
    },

    unmount() {
        this._presenter = null;
        this._form = null;
    },
};

export default LoginPage;