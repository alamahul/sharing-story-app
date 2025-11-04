class SavedStoriesPresenter {
    constructor({ view, model }) {
        this._view = view;
        this._model = model; 
        this._stories = []; 

        this._searchTerm = '';
        this._sortBy = 'date-desc';
    }

    /**
     * Dipanggil oleh View saat halaman dimuat
     */
    async initialize() {
        this._view.showLoading(true);
        try {
            this._stories = await this._model.getAllStories();

            this._renderStories();

        } catch (error) {
            this._view.showError(error.message);
        } finally {
            this._view.showLoading(false);
        }
    }

    /**
     * Helper privat untuk memutuskan apa yang harus ditampilkan
     */
    /**
     * Logika inti:
     * Mengambil daftar lengkap, memfilter, mengurutkan, lalu mengirim ke View.
     */
    _renderStories() {
        let storiesToRender = this._stories;

        if (this._searchTerm) {
            storiesToRender = storiesToRender.filter(story =>
                story.name.toLowerCase().includes(this._searchTerm) ||
                story.description.toLowerCase().includes(this._searchTerm)
            );
        }

        storiesToRender.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            
            if (this._sortBy === 'date-asc') {
                return dateA - dateB; 
            }
            return dateB - dateA;
        });

        if (storiesToRender.length > 0) {
            this._view.displayStories(storiesToRender);
        } else {
            this._view.showEmptyMessage(this._searchTerm);
        }
    }

    /**
     * Dipanggil oleh View saat pengguna mengetik di search bar
     */
    handleSearch(term) {
        this._searchTerm = term.toLowerCase();
        this._renderStories(); // Render ulang dengan filter baru
    }

    /**
     * Dipanggil oleh View saat pengguna mengubah select sort
     */
    handleSort(sortBy) {
        this._sortBy = sortBy;
        this._renderStories(); // Render ulang dengan sort baru
    }
 
}

export default SavedStoriesPresenter;