import RegisterPresenter from '../presenters/register-presenter.js';
import StoryApi from '../data/story-api.js';
import Swal from 'sweetalert2';

const RegisterPage = {
    _presenter: null,
    _form: null,

    async render() {
        return `
            <div class="auth-page">
                <div class="auth-card card-shadow">
                    <h2 class="auth-card__title">Register</h2>
                    <p class="auth-card__subtitle">Buat akun baru Anda.</p>
                    
                    <div id="message-container"></div>
                    
                    <form id="registerForm" novalidate>
                        <div class="form-group">
                            <label for="name">Nama</label>
                            <input type="text" id="name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="password" id="password" name="password" minlength="8" required>
                        </div>
                        <button type="submit" class="button button--full-width" id="submitButton">
                            Register
                        </button>
                    </form>
                    
                    <p class="auth-switch">
                        Sudah punya akun? <a href="#/login">Login di sini</a>
                    </p>
                </div>
            </div>
        `;
    },

    async afterRender(container) {
        this._presenter = new RegisterPresenter({
            view: this,
            model: StoryApi,
        });

        this._form = container.querySelector('#registerForm');
        
        this._form.addEventListener('submit', (event) => {
            event.preventDefault();
            
            const name = this._form.elements.name.value;
            const email = this._form.elements.email.value;
            const password = this._form.elements.password.value;
            
            this._presenter.handleRegister(name, email, password);
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
                ? '<span class="loader"></span> Mendaftar...' 
                : 'Register';
        }
    },

    navigateToLogin() {
        location.hash = '/login';
    },

    unmount() {
        this._presenter = null;
        this._form = null;
    },
};

export default RegisterPage;