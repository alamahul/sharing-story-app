class RegisterPresenter {
    constructor({ view, model }) {
        this._view = view;
        this._model = model;
    }

    async handleRegister(name, email, password) {
        this._view.showMessage('');

        if (!name || !email || !password) {
            this._view.showMessage('Nama, email, dan password tidak boleh kosong.', 'error');
            return;
        }
        if (password.length < 8) {
            this._view.showMessage('Password minimal harus 8 karakter.', 'error');
            return;
        }

        this._view.showLoading(true);

        try {
            await this._model.register(name, email, password);
            
            this._view.showMessage('Akun berhasil dibuat! Silakan login.', 'success');
            
            setTimeout(() => {
                this._view.navigateToLogin();
            }, 2000);

        } catch (error) {
            this._view.showMessage(error.message, 'error');
        } finally {
            this._view.showLoading(false);
        }
    }
}

export default RegisterPresenter;