import L from 'leaflet';
import StoryListPresenter from '../presenters/story-list-presenter.js';
import StoryApi from '../data/story-api.js';
import Swal from 'sweetalert2'

const StoryListPage = {
    _presenter: null,
    _map: null,
    _markers: [], 
    _listContainer: null,

    async render() {
        return `
            <section class="home-container">
                <div class="home-header card-shadow">
                    <h2>Peta Cerita</h2>
                    <div id="story-map"></div>
                </div>
                <div class="home-feed">
                    <h2>Daftar Cerita</h2>

                    <div class="story-controls card-shadow">
                        <input type="search" id="searchOnline" placeholder="Cari cerita...">
                        <select id="sortOnline">
                            <option value="date-desc">Urutkan (Terbaru)</option>
                            <option value="date-asc">Urutkan (Terlama)</option>
                        </select>
                    </div>

                    <div id="story-list-container" class="story-list">
                        <p>Memuat cerita...</p>
                    </div>
                </div>
            </section>
        `;
    },

    async afterRender(container) {
        this._listContainer = container.querySelector('#story-list-container');
        this._initMap(container);
        this._presenter = new StoryListPresenter({
            view: this,
            model: StoryApi,
        });
        this._presenter.initialize();

        await this._presenter.initialize();
        const searchInput = container.querySelector('#searchOnline');
        const sortSelect = container.querySelector('#sortOnline');

        searchInput.addEventListener('input', (event) => {
            this._presenter.handleSearch(event.target.value);
        });

        sortSelect.addEventListener('change', (event) => {
            this._presenter.handleSort(event.target.value);
        });
    },
    
    renderStories(stories) {
        this._listContainer.innerHTML = ''; 
        stories.forEach(story => {
            const cardElement = document.createElement('story-card');
            cardElement.story = story;
            this._listContainer.append(cardElement);
            this._addMarkerToMap(story);
        });
    },
    
    showError(message) {
        Swal.fire({
                    icon:'error',
                    title: "Error",
                    text: message,
                    showConfirmButton: false,
                    timer: 5000
                });
        this._listContainer.innerHTML = `<p class="error-message">${message}</p>`;
    },
    
    // focusMapOnMarker(storyId) {
    //     const marker = this._markers.find(m => m.storyId === storyId);
    //     if (marker) {
    //         this._map.flyTo(marker.getLatLng(), 15);
    //         marker.openPopup();
    //     }
    // },
    
    focusFeedOnCard(storyId) {
        const card = this._listContainer.querySelector(`story-card[data-story-id="${storyId}"]`);
        if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            card.focus();
        }
    },

    _initMap(container) {
        const mapContainer = container.querySelector('#story-map');
        if (!mapContainer) return;

        this._map = L.map(mapContainer).setView([-2.5489, 118.0149], 5);
        const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap'
        });
        const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri'
        });
        
        osmLayer.addTo(this._map);
        L.control.layers({ "Standard": osmLayer, "Satelit": satelliteLayer }).addTo(this._map);

        this._fixLeafletIcons();
    },

    _addMarkerToMap(story) {
        if (!story.lat || !story.lon || !this._map) return;

        const marker = L.marker([story.lat, story.lon]).addTo(this._map);
        marker.bindPopup(`
            <b>${story.name}</b><br>
            <img src="${story.photoUrl}" alt="${story.name}" style="width:100px; margin-top: 5px;"><br>
            ${story.description.substring(0, 50)}...
        `);
        
        marker.storyId = story.id;

        marker.on('click', () => {
            this._presenter.onMarkerClicked(story.id);
        });
        
        this._markers.push(marker);
    },



    _fixLeafletIcons() {
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconUrl: require('leaflet/dist/images/marker-icon.png'),
            iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
            shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
        });
    },

    unmount() {
        if (this._map) {
            this._map.remove();
            this._map = null;
        }
        this._markers = [];
    },
};

export default StoryListPage;