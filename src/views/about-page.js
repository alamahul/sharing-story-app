import NotificationHelper from '../utils/notification-helper.js'; 
import Swal from 'sweetalert2'; 

const AboutPage = {
    _notificationToggle: null, 
    _isSubscribed: false,     

    async render() {
        return `
            <div class="page-content">
                <section class="content-card about-page">
                    
                    <h2>📱 About Sharing Story App</h2>
                    <p>Sharing Story adalah aplikasi yang memungkinkan pengguna untuk membagikan cerita menarik dari kehidupan sehari-hari mereka. Melalui aplikasi ini, pengguna dapat menulis cerita, menambahkan foto langsung dari kamera, serta menandai lokasi cerita di peta.</p>

                    <h3>✨ Fitur Utama:</h3>
                    <ul class="feature-list">
                        <li>📝 Tambah cerita dengan teks dan foto</li>
                        <li>📍 Tandai lokasi di peta</li>
                        <li>📸 Ambil gambar langsung dari kamera</li>
                        <li>🌐 Lihat cerita dari pengguna lain</li>
                    </ul>

                    <h3>🎯 Tujuan Aplikasi:</h3>
                    <p>Aplikasi ini dibuat untuk membantu orang membagikan pengalaman dan momen berharga mereka secara mudah dan interaktif. Dengan fitur peta, setiap cerita memiliki konteks lokasi yang nyata sehingga membuat pengalaman membaca lebih hidup.</p>

                    <h3>👨‍💻 Tentang Pembuat:</h3>
                    <p>Aplikasi ini dikembangkan oleh <strong>Alamahul Bayan</strong>, mahasiswa <strong>Teknik Informatika Institut Teknologi Garut</strong>. Saya membuat aplikasi ini sebagai bagian dari pembelajaran saya di bidang pengembangan aplikasi berbasis web dan mobile. Saya percaya bahwa setiap cerita layak untuk dibagikan.</p>

                    <h3>📬 Hubungi saya:</h3>
                    <ul class="contact-list">
                        <li>Email: bayanalamahul3@gmail.com</li>
                        <li>GitHub: <a href="https://github.com/alamahul" target="_blank" rel="noopener noreferrer">github.com/alamahul</a></li>
                    </ul>
                    
                    <section class="notification-settings card-shadow">
                        <h3><i class="fa-solid fa-bell"></i> Pengaturan Notifikasi</h3>
                        <p>Aktifkan notifikasi untuk mendapatkan pemberitahuan saat ada cerita baru.</p>
                        
                        <div class="notification-toggle">
                            <label class="switch" for="notification-checkbox">
                                <input type="checkbox" id="notification-checkbox">
                                <span class="slider round"></span>
                            </label>
                            <span id="notification-status">Nonaktif</span>
                        </div>
                    </section>

                </section>
            </div>
        `;
    },

    async afterRender(container) {
        this._notificationToggle = container.querySelector('#notification-checkbox');
        
        await this._checkSubscriptionStatus();
        
        this._notificationToggle.addEventListener('change', async (event) => {
            await this._handleToggleChange(event.target.checked);
        });
    },
    
    async _checkSubscriptionStatus() {
        try {
            this._isSubscribed = await NotificationHelper.isSubscribed();
            this._updateToggleUI();
        } catch (error) {
            console.error('Gagal mengecek status langganan:', error);
        }
    },

    async _handleToggleChange(isChecked) {
        this._notificationToggle.disabled = true;

        try {
            if (isChecked) {
                await NotificationHelper.subscribe();
                this._isSubscribed = true;
                Swal.fire('Berhasil!', 'Anda telah berlangganan notifikasi.', 'success');
            } else {
                await NotificationHelper.unsubscribe();
                this._isSubscribed = false;
                Swal.fire('Berhasil!', 'Anda telah berhenti berlangganan.', 'info');
            }
        } catch (error) {
            Swal.fire('Gagal', error.message, 'error');
            this._isSubscribed = !isChecked; 
        }
        
        this._updateToggleUI();
        this._notificationToggle.disabled = false;
    },

    _updateToggleUI() {
        const statusText = document.querySelector('#notification-status');
        
        this._notificationToggle.checked = this._isSubscribed;
        
        if (this._isSubscribed) {
            statusText.textContent = 'Aktif';
            statusText.classList.add('active');
        } else {
            statusText.textContent = 'Nonaktif';
            statusText.classList.remove('active');
        }
    },

    unmount() {
        this._notificationToggle = null;
    },
};

export default AboutPage;