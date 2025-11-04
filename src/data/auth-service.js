const AuthService = {
    AUTH_TOKEN_KEY: 'STORY_APP_TOKEN',

    /**
     * Menyimpan token ke storage yang sesuai.
     * @param {string} token - Token otentikasi
     * @param {boolean} rememberMe - Jika true, simpan di localStorage
     */
    setToken(token, rememberMe = false) {
        if (rememberMe) {
            localStorage.setItem(this.AUTH_TOKEN_KEY, token);
        } else {
            sessionStorage.setItem(this.AUTH_TOKEN_KEY, token);
        }
    },

    /**
     * Mengambil token dari storage.
     * Selalu cek localStorage dulu, baru sessionStorage.
     */
    getToken() {
        // Jika tidak, baru cek token sesi (sessionStorage).
        return localStorage.getItem(this.AUTH_TOKEN_KEY) || 
               sessionStorage.getItem(this.AUTH_TOKEN_KEY);
    },

    /**
     * Menghapus token dari KEDUA storage untuk memastikan logout bersih.
     */
    removeToken() {
        localStorage.removeItem(this.AUTH_TOKEN_KEY);
        sessionStorage.removeItem(this.AUTH_TOKEN_KEY);
    },

    /**
     * Mengecek apakah pengguna login (Punya token di salah satu storage).
     * Fungsi ini TIDAK PERLU DIUBAH karena sudah menggunakan getToken().
     */
    isLoggedIn() {
        return !!this.getToken();
    },
};

export default AuthService;