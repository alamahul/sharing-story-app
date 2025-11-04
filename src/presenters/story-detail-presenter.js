import IndexedDBHelper from '../data/indexeddb-helper.js';

class StoryDetailPresenter {
    constructor({ view, model }) {
        this._view = view;
        this._model = model; 
        this._story = null; 
        this._isSaved = false; 
    }

    async initialize(id) {
        if (!id) {
            this._view.showError('ID Cerita tidak ditemukan.');
            return;
        }

        this._view.showLoading(true);
        
        try {
            const response = await this._model.getStoryDetail(id);
            this._story = response.story; 

            await this._checkSavedStatus(id);

            this._view.displayStory(this._story);
            
            this._view.updateSaveButton(this._isSaved);

            if (this._story.lat && this._story.lon) {
                this._fetchAddress(this._story.lat, this._story.lon);
            }

        } catch (error) {
            this._view.showError(error.message);
        } finally {
            this._view.showLoading(false);
        }
    }

    async _fetchAddress(lat, lon) {
        try {
            const address = await this._model.getAddressFromCoordinates(lat, lon);
            this._view.displayAddress(address); 
        } catch (error) {
            this._view.displayAddress('Gagal memuat nama lokasi.', 'error');
        }
    }

    /**
     * Helper untuk mengecek apakah cerita sudah ada di IndexedDB
     */
    async _checkSavedStatus(id) {
        const savedStory = await IndexedDBHelper.getStory(id);
        this._isSaved = !!savedStory;
    }

    /**
     * Dipanggil oleh View saat tombol Simpan/Hapus diklik
     */
    async handleSaveOrDeleteToggle() {
        if (!this._story) return;

        try {
            if (this._isSaved) {
                await IndexedDBHelper.deleteStory(this._story.id);
                this._isSaved = false;
                this._view.showSaveFeedback('Cerita dihapus dari daftar tersimpan.', 'info');
            } else {
                await IndexedDBHelper.putStory(this._story);
                this._isSaved = true;
                this._view.showSaveFeedback('Cerita berhasil disimpan!', 'success');

                this._view.showLocalSaveNotification(this._story);
            }
            this._view.updateSaveButton(this._isSaved);
        } catch (error) {
            this._view.showSaveFeedback(`Gagal: ${error.message}`, 'error');
        }
    }
}

export default StoryDetailPresenter;