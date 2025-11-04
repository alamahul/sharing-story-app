class AddStoryPresenter {
    constructor({ view, model }) {
        this._view = view;
        this._model = model;

        this._cameraStream = null;
        this._currentFacingMode = 'environment';
        this._location = { lat: null, lon: null };
    }

    async handleSubmit() {
        this._view.showMessage('');
        this._view.showLoading(true);

        try {
            const formData = this._view.getFormData();
            const blob = this._view.getCapturedImage();

            
            
            if (blob) {
                formData.set('photo', blob, 'camera-story.jpg');
            }
            
            formData.set('lat', this._location.lat);
            formData.set('lon', this._location.lon);

            if (!this._validateData(formData, blob)) {
                return;
            }

            await this._model.addNewStory(formData);
            this._view.showMessage('Cerita berhasil diunggah!', 'success');

            this._view.showLocalUploadNotification();
            
            this._location = { lat: null, lon: null };
            this._cameraStream = null;
            this._view.resetForm(); 
            
            setTimeout(() => location.hash = '/story-list', 2000); 


        } catch (error) {
            this._view.showMessage(error.message, 'error');
        } finally {
            this._view.showLoading(false);
        }
    }

    _validateData(formData, blob) {
        const description = formData.get('description');
        const photo = formData.get('photo'); 
        const lat = formData.get('lat');

        if (!description) {
            this._view.showMessage('Deskripsi tidak boleh kosong.', 'error');
            return false;
        }
        if (!photo && !blob) {
            this._view.showMessage('Foto cerita tidak boleh kosong.', 'error');
            return false;
        }
        if (!lat || lat === 'null') {
            this._view.showMessage('Silakan pilih lokasi di peta.', 'error');
            return false;
        }
        return true;
    }

    handleMapClick(lat, lon) {
        this._location = { lat, lon };
        this._view.updateMapMarker(lat, lon); 
    }

    async handleCameraButtonClick() {
        try {
            if (this._cameraStream) {
                this._view.stopCamera(this._cameraStream);
                this._cameraStream = null;
            } else {
                this._cameraStream = await this._view.startCamera(this._currentFacingMode);
            }
        } catch (error) {
            this._view.showMessage(`Kamera error: ${error.message}`, 'error');
        }
    }

    async handleSwitchCameraButtonClick() {
        if (!this._cameraStream) return;
        
        this._currentFacingMode = (this._currentFacingMode === 'environment') ? 'user' : 'environment';
        
        try {
            this._view.stopCamera(this._cameraStream);
            this._cameraStream = await this._view.startCamera(this._currentFacingMode);
        } catch (error) {
            this._view.showMessage(`Gagal ganti kamera: ${error.message}`, 'error');
        }
    }

    async handleCaptureButtonClick() {
        if (!this._cameraStream) return;
        try {
            const blob = await this._view.captureImage();
            this._view.setCapturedImage(blob);
            
            this._view.stopCamera(this._cameraStream);
            this._cameraStream = null;
        } catch (error) {
            this._view.showMessage(`Gagal ambil gambar: ${error.message}`, 'error');
        }
    }
    
    handleFileSelected(file) {
        if (file) {
            this._view.setCapturedImage(file);
        }
    }

}

export default AddStoryPresenter;