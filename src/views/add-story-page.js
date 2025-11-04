// src/views/add-story-page.js
import L from 'leaflet';
import AddStoryPresenter from '../presenters/add-story-presenter.js';
import StoryApi from '../data/story-api.js';
import Swal from 'sweetalert2'
import NotificationHelper from '../utils/notification-helper.js';

const AddStoryPage = {
    _presenter: null,
    _map: null,
    _mapMarker: null,
    _videoElement: null,
    _canvasElement: null,
    _imagePreview: null,
    _fileInputElement: null,
    _cameraContainer: null,
    _cameraButton: null,
    _form: null,
    _capturedBlob: null,
    _previewURL: null,

    async render() {
        return `
            <div class="content-card"> 
                <section class="add-story-form">
                <a href="#/story-list" class="button btn-back"><i class="fa-solid fa-arrow-left"></i>Kembali ke daftar cerita</a>
                    <h2>Tambah Cerita Baru</h2>
                    <div id="message-container"></div>
                    <form id="addStoryForm" novalidate>
                        <div class="form-group">
                            <label for="storyImage">Foto Cerita</label>
                            <button type="button" id="cameraButton" class="button open-camera"><i class="fa-solid fa-camera"></i> Gunakan Kamera</button>
                            <input type="file" id="storyImage" name="photo" accept="image/*" required>
                            
                            <div id="camera-container" style="display:none; margin-top: 1rem;">
                                <video id="camera-video" playsinline autoplay></video>
                                <canvas id="camera-canvas" style="display:none;"></canvas>
                                <button type="button" id="switchCameraButton" class="button">Ganti Kamera</button>
                                <button type="button" id="captureButton" class="button">Ambil Gambar</button>
                            </div>
                            
                            <img id="image-preview" src="#" alt="Pratinjau Gambar" style="display:none; max-width: 100%; border-radius: 8px; margin-top: 1rem;"/>
                        </div>
                        
                        <div class="form-group">
                            <label for="storyDescription">Deskripsi</label>
                            <textarea id="storyDescription" name="description" rows="5" required></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label>Pilih Lokasi di Peta</label>
                            <div id="map-picker" style="height: 40vh; border-radius: 8px;"></div> 
                            <input type="hidden" id="latitude" name="lat">
                            <input type="hidden" id="longitude" name="lon">
                        </div>
                        
                        <button type="submit" class="button button--full-width" id="submitButton">
                        <i class="fa-solid fa-upload"></i>
                            Unggah Cerita
                        </button>
                    </form>
                </section>
            </div>
        `;
    },

    async afterRender(container) {
        this._presenter = new AddStoryPresenter({
            view: this,
            model: StoryApi,
        });

        this._videoElement = container.querySelector('#camera-video');
        this._canvasElement = container.querySelector('#camera-canvas');
        this._imagePreview = container.querySelector('#image-preview');
        this._fileInputElement = container.querySelector('#storyImage');
        this._cameraContainer = container.querySelector('#camera-container');
        this._cameraButton = container.querySelector('#cameraButton');
        this._form = container.querySelector('#addStoryForm');

        this._initMap(container);
        this._initListeners(container);
    },


    getFormData() {
        return new FormData(this._form);
    },
    
    getCapturedImage() {
        return this._capturedBlob;
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
                ? '<span class="loader"></span> Mengunggah...' 
                : 'Unggah Cerita';
        }
    },

    showLocalUploadNotification() {
        NotificationHelper.showLocalNotification({
            title: 'Unggah Berhasil!',
            body: 'Cerita baru Anda telah berhasil diunggah.'
        });
    },

    navigateToHome() {
        location.hash = '/';
    },
    
    async startCamera(facingMode) {
        if (!('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices)) {
            throw new Error('Kamera tidak didukung oleh browser ini.');
        }
        
        const constraints = { video: { facingMode: facingMode } };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        this._cameraContainer.style.display = 'block';
        this._videoElement.srcObject = stream;
        this._fileInputElement.style.display = 'none';
        this._cameraButton.textContent = 'Tutup Kamera';
        this.setCameraButtonsDisabled(false);
        
        return stream;
    },
    
    stopCamera(stream) {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }

        this._cameraContainer.style.display = 'none';
        this._videoElement.srcObject = null;
        this._fileInputElement.style.display = 'block';
        this._cameraButton.textContent = 'Gunakan Kamera';
    },
    
    async captureImage() {
        this._canvasElement.width = this._videoElement.videoWidth;
        this._canvasElement.height = this._videoElement.videoHeight;
        
        const context = this._canvasElement.getContext('2d');
        context.drawImage(this._videoElement, 0, 0, this._canvasElement.width, this._canvasElement.height);

        return new Promise(resolve => {
            this._canvasElement.toBlob(resolve, 'image/jpeg');
        });
    },

    setCapturedImage(blob) {
        const objectURL = URL.createObjectURL(blob);
        this._imagePreview.src = objectURL;
        this._imagePreview.style.display = 'block';
        
        this._capturedBlob = blob;
        
        if (this._previewURL) {
            URL.revokeObjectURL(this._previewURL);
        }
        this._previewURL = objectURL;
    },
    
    updateMapMarker(lat, lon) {
        if (this._mapMarker) {
            this._mapMarker.setLatLng([lat, lon]);
        } else {
            this._mapMarker = L.marker([lat, lon]).addTo(this._map);
        }
        this._map.flyTo([lat, lon], 15);
        
        document.querySelector('#latitude').value = lat;
        document.querySelector('#longitude').value = lon;
    },

    resetForm() {
        this._form.reset();
        this._imagePreview.style.display = 'none';
        if (this._previewURL) {
            URL.revokeObjectURL(this._previewURL);
        }
        this._previewURL = null;
        this._capturedBlob = null;
        
        if (this._mapMarker) {
            this._mapMarker.remove();
            this._mapMarker = null;
        }
        this._map.setView([-2.5489, 118.0149], 5);
        document.querySelector('#latitude').value = '';
        document.querySelector('#longitude').value = '';
    },

    _initMap(container) {
        const mapContainer = container.querySelector('#map-picker');
        if (!mapContainer) return;
        
        this._map = L.map(mapContainer).setView([-2.5489, 118.0149], 5);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this._map);
        
        this._map.on('click', (e) => {
            const { lat, lng } = e.latlng;
            this._presenter.handleMapClick(lat, lng);
        });
        
        this._fixLeafletIcons();
    },

    _initListeners(container) {
        this._form.addEventListener('submit', (event) => {
            event.preventDefault();
            this._presenter.handleSubmit();
        });

        this._cameraButton.addEventListener('click', () => {
            this._presenter.handleCameraButtonClick();
        });

        container.querySelector('#switchCameraButton').addEventListener('click', () => {
            this._presenter.handleSwitchCameraButtonClick();
        });

        container.querySelector('#captureButton').addEventListener('click', () => {
            this._presenter.handleCaptureButtonClick();
        });
        
        this._fileInputElement.addEventListener('change', (event) => {
            const file = event.target.files[0];
            this._presenter.handleFileSelected(file);
        });
    },

    setCameraButtonsDisabled(isDisabled) {
        document.querySelector('#switchCameraButton').disabled = isDisabled;
        document.querySelector('#captureButton').disabled = isDisabled;
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
        if (this._previewURL) {
            URL.revokeObjectURL(this._previewURL);
        }
    },
};

export default AddStoryPage;