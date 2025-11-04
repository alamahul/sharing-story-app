const HomePage = {
    async render() {
        return `
        <div class="home-container">
            <div class="page-content">
                <section class="welcome-hero card-shadow">
                    <h1>Selamat Datang di Sharing Story App</h1>
                    <p>Bagikan momen berharga Anda dan lihat cerita dari seluruh dunia.</p>
                    <div class="welcome-buttons">
                        <a href="#/story-list" class="button"><i class="fa-solid fa-list"></i>Lihat Daftar Cerita</a>
                        <a href="#/add-story" class="button"><i class="fa-solid fa-plus"></i> Tambah Cerita Baru</a>
                    </div>
                </section>
                
                <section class="welcome-features">
                    <h2>Fitur Unggulan</h2>
                    <div class="features-grid">
                        <div class="feature-item card-shadow">
                            <i class="fa-solid fa-map-location-dot fa-3x"></i>
                            <h3>Peta Interaktif</h3>
                            <p>Lihat cerita berdasarkan lokasi di peta.</p>
                        </div>
                        <div class="feature-item card-shadow">
                            <i class="fa-solid fa-camera-retro fa-3x"></i>
                            <h3>Posting Mudah</h3>
                            <p>Unggah foto dari galeri atau langsung dari kamera.</p>
                        </div>
                        <div class="feature-item card-shadow">
                            <i class="fa-solid fa-bookmark fa-3x"></i>
                            <h3>Simpan Offline</h3>
                            <p>Simpan cerita favorit Anda untuk dibaca kapan saja.</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
        `;
    },

    async afterRender(container) {
       
    },

    unmount() {
        
    },
};

export default HomePage;