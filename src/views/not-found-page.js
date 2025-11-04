const NotFoundPage = {
    async render() {
        return `
            <section class="auth-page">
                <div class="auth-card">
                    <h1 class="not-found__code">404</h1>
                    <p class="not-found__message">Halaman Tidak Ditemukan</p>
                    <p class="auth-switch">
                        Halaman yang Anda cari mungkin telah dihapus atau dipindahkan.
                    </p>
                    <a href="#/" class="button button--full-width" style="margin-top: 2rem;">
                        Kembali ke Beranda
                    </a>
                </div>
            </section>
        `;
    },
};

export default NotFoundPage;