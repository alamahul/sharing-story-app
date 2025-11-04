import SavedStoriesPresenter from '../presenters/saved-stories-presenter.js';
import IndexedDBHelper from '../data/indexeddb-helper.js';

const SavedStoriesPage = {
    _presenter: null,
    _listContainer: null,

    async render() {
        return `
            <div class="page-content">
                <section class="content-card">
                    <a href="#/story-list" class="button btn-back"><i class="fa-solid fa-arrow-left"></i> Kembali ke daftar cerita</a>
                    <h2><i class="fa-solid fa-bookmark"></i> Cerita Tersimpan</h2>
                    <p>Cerita yang Anda simpan secara offline akan muncul di sini.</p>
                    
                    <div class="story-controls card-shadow" style="margin-top: 2rem;">
                        <input type="search" id="searchSaved" placeholder="Cari cerita tersimpan...">
                        <select id="sortSaved">
                            <option value="date-desc">Urutkan (Terbaru)</option>
                            <option value="date-asc">Urutkan (Terlama)</option>
                        </select>
                    </div>

                    <div id="saved-story-list" class="story-list" style="margin-top: 1.5rem;">
                        <p id="loading-indicator">Memuat cerita tersimpan...</p>
                    </div>
                </section>
            </div>
        `;
    },

    async afterRender(container) {
        this._listContainer = container.querySelector('#saved-story-list');
        
        this._presenter = new SavedStoriesPresenter({
            view: this,
            model: IndexedDBHelper, 
        });

        await this._presenter.initialize();

        const searchInput = container.querySelector('#searchSaved');
        const sortSelect = container.querySelector('#sortSaved');

        searchInput.addEventListener('input', (event) => {
            this._presenter.handleSearch(event.target.value);
        });

        sortSelect.addEventListener('change', (event) => {
            this._presenter.handleSort(event.target.value);
        });
        
    },
    


    displayStories(stories) {
        this._listContainer.innerHTML = '';
        
        if (!stories || stories.length === 0) {
            this.showEmptyMessage();
            return;
        }

        stories.forEach(story => {
            const cardElement = document.createElement('story-card');
            cardElement.story = story;
            this._listContainer.append(cardElement);
        });
    },

    showEmptyMessage() {
        this._listContainer.innerHTML = `
            <p class="empty-message" style="text-align: center; color: var(--secondary-color);">
                Anda belum menyimpan cerita apapun.
            </p>
        `;
    },

    showLoading(isLoading) {
        const loading = document.querySelector('#loading-indicator');
        if (loading) {
            loading.style.display = isLoading ? 'block' : 'none';
        }
    },

    showError(message) {
        this.showEmptyMessage(); 
        Swal.fire('Error', `Gagal memuat data: ${message}`, 'error'); 
    },
    
    unmount() {
        this._presenter = null;
        this._listContainer = null;
    },
};

export default SavedStoriesPage;