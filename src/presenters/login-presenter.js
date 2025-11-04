import AuthService from '../data/auth-service.js';

class LoginPresenter {
    constructor({ view, model }) {
        this._view = view;
        this._model = model; 
    }


    async handleLogin(email, password, rememberMe = false) {
        this._view.showMessage('');
        if (!email || !password) {
            this._view.showMessage('Email dan password tidak boleh kosong.', 'error');
            return;
        }
        this._view.showLoading(true);

        try {
            const response = await this._model.login(email, password);
            AuthService.setToken(response.loginResult.token, rememberMe);
            this._view.showMessage(`Selamat datang, ${response.loginResult.name}! Anda akan diarahkan...`, 'success');
            setTimeout(() => {
                this._view.navigateToHome();
            }, 2000);

        } catch (error) {
            this._view.showMessage(error.message, 'error');
        } finally {
            this._view.showLoading(false);
        }
    }
}

export default LoginPresenter;