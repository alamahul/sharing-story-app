import StoryApi from '../data/story-api.js';
import StoryDetailPresenter from '../presenters/story-detail-presenter.js';
import UrlParser from '../router/url-parser.js';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import L from 'leaflet';
import Swal from 'sweetalert2'; 
import NotificationHelper from '../utils/notification-helper.js';

const StoryDetailPage = {
    _presenter: null,
    _map: null,

    async render() {
        return `
            <div class="page-content">
                <section id="story-detail-container">
                
                    <div class="story-detail-skeleton">
                        <div class="skeleton-text short" style="height: 40px; margin-bottom: 1.5rem;"></div>
                        <div class="skeleton-image"></div>
                        <div class="skeleton-text" style="margin-top: 1.5rem;"></div>
                        <div class="skeleton-text short"></div>
                    </div>
                    
                    <template id="story-detail-template">
                    <a href="#/story-list" class="button btn-back"><i class="fa-solid fa-arrow-left"></i>Kembali ke daftar cerita</a>
                    <button id="saveButton" class="button button--save" aria-label="Simpan cerita offline">
                        <i class="fa-solid fa-bookmark"></i> <span>Simpan</span>
                    </button>
                        <article class="story-detail">
                            
                            <section class="story-detail__header card-shadow">
                                <h2 class="story-detail__title"></h2>
                                
                                <ul>
                                    <li>
                                        <i class="fa-solid fa-user"></i>
                                        <strong>Pembuat:</strong> <span class="story-detail__creator"></span>
                                    </li>
                                    <li>
                                        <i class="fa-solid fa-calendar-alt"></i>
                                        <strong>Tanggal:</strong> <span class="story-detail__date"></span>
                                    </li>
                                    <li>
                                        <i class="fa-solid fa-map-marker-alt"></i>
                                        <strong>Lokasi:</strong> <span id="address-text">Memuat...</span>
                                    </li>
                                    <li>
                                        <i class="fa-solid fa-compass"></i>
                                        <strong>Koordinat:</strong> <span id="coords-text">Tidak ada</span>
                                    </li>
                                </ul>
                            </section>
                            
                            <img src="" alt="" class="story-detail__image card-shadow">
                            
                            <section class="story-detail__content card-shadow">
                                <h3>Deskripsi</h3>
                                <p class="story-detail__description"></p>
                            </section>
                            
                            <section class="story-detail__map-container card-shadow" style="display:none;">
                                <h3>Peta Lokasi</h3>
                                <div id="story-detail-map"></div>
                            </section>

                        </article>
                    </template>
                </section>
            </div>
        `;
    },

    async afterRender(container) {
        this._fixLeafletIcons(); 
        
        const { id } = UrlParser.parseActiveUrl();

        this._presenter = new StoryDetailPresenter({
            view: this,
            model: StoryApi,
        });

        await this._presenter.initialize(id);
    },

    
    displayStory(story) {
        const container = document.querySelector('#story-detail-container');
        const template = document.querySelector('#story-detail-template');
        if (!container || !template) return;

        
        const clone = template.content.cloneNode(true);
        
       
        clone.querySelector('.story-detail__title').textContent = story.name; 
        clone.querySelector('.story-detail__creator').textContent = story.name;
        clone.querySelector('.story-detail__date').textContent = new Date(story.createdAt).toLocaleDateString();
        clone.querySelector('.story-detail__description').textContent = story.description;
        clone.querySelector('.story-detail__image').src = story.photoUrl;
        clone.querySelector('.story-detail__image').alt = `Foto oleh ${story.name}`;

        
        container.innerHTML = '';
        container.appendChild(clone);

        
        if (story.lat && story.lon) {
            const coordsText = document.querySelector('#coords-text');
            const mapContainer = document.querySelector('.story-detail__map-container');

            if (coordsText) {
                coordsText.textContent = `Lat: ${story.lat.toFixed(5)}, Lon: ${story.lon.toFixed(5)}`;
            }
            if (mapContainer) {
                mapContainer.style.display = 'block'; 
                this._initMap(story.lat, story.lon); 
            }
        }
        this._attachSaveButtonListener();
    },
    
    displayAddress(address, type = 'normal') {
        const addressText = document.querySelector('#address-text');
        if (addressText) {
            addressText.textContent = address;
            if (type === 'error') {
                addressText.classList.add('error-message');
                addressText.textContent = 'Gagal memuat nama lokasi.';
            }
        }
    },

    _initMap(lat, lon) {
        try {
            this._map = L.map('story-detail-map').setView([lat, lon], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap'
            }).addTo(this._map);
            L.marker([lat, lon]).addTo(this._map)
                .bindPopup('Lokasi cerita')
                .openPopup();
            
            
        } catch (error) {
            console.error('Error initializing detail map:', error);
            const mapContainer = document.querySelector('#story-detail-map');
            if (mapContainer) mapContainer.innerHTML = '<p class="error-message">Gagal memuat peta.</p>';
        }
    },
    
    _fixLeafletIcons() {
       
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconUrl: iconUrl,
            iconRetinaUrl: iconRetinaUrl,
            shadowUrl: shadowUrl,
        });
    },

    /**
     * Helper untuk memasang listener ke tombol
     */
    _attachSaveButtonListener() {
        const saveButton = document.querySelector('#saveButton');
        if (saveButton) {
            saveButton.addEventListener('click', () => {
                this._presenter.handleSaveOrDeleteToggle();
            });
        }
    },

    /**
     * Dipanggil oleh Presenter untuk update UI tombol
     */
    updateSaveButton(isSaved) {
        const saveButton = document.querySelector('#saveButton');
        if (!saveButton) return;

        const saveButtonText = saveButton.querySelector('span');
        const saveButtonIcon = saveButton.querySelector('i');

        if (isSaved) {
            saveButton.classList.add('button--saved'); // Untuk styling (merah)
            saveButtonText.textContent = 'Tersimpan';
            saveButtonIcon.className = 'fa-solid fa-check'; // Ikon centang
        } else {
            saveButton.classList.remove('button--saved');
            saveButtonText.textContent = 'Simpan Offline';
            saveButtonIcon.className = 'fa-solid fa-bookmark'; // Ikon bookmark
        }
    },

    /**
     * Dipanggil oleh Presenter untuk notifikasi singkat (Sukses/Gagal)
     */
    showSaveFeedback(message, type = 'success') {
        Swal.fire({
            icon: type,
            title: message,
            showConfirmButton: false,
            timer: 1500, 
            toast: true, 
            position: 'top-end',
        });
    },

    showLocalSaveNotification(story) {
        NotificationHelper.showLocalNotification({
            title: 'Cerita Disimpan!',
            body: `"Cerita dari ${story.name}" telah berhasil disimpan offline.`,
            storyId: story.id 
        });
    },

    showError(message) {
        
        Swal.fire({
            icon: 'error',
            title: 'Gagal Memuat',
            text: message,
        });
        const container = document.querySelector('#story-detail-container');
        if (container) {
            container.innerHTML = `<p class="error-message">${message}</p>`;
        }
    },
    
    showLoading(isLoading) {
        
    },

    unmount() {
        this._presenter = null;
        if (this._map) {
            this._map.remove();
            this._map = null;
        }
    },
};

export default StoryDetailPage;