

class StoryListPresenter {
    constructor({ view, model }) {
        this._view = view;
        this._model = model;
        this._stories = [];
        
        this._searchTerm = '';
        this._sortBy = 'date-desc';
    }

    async initialize() {
        try {
            const response = await this._model.getStoriesWithLocation();
            this._stories = response.listStory; 
            
            this._renderStories(); 

        } catch (error) {
            this._view.showError(error.message);
        }
    }

    handleSearch(term) {
        this._searchTerm = term.toLowerCase();
        this._renderStories();
    }

    handleSort(sortBy) {
        this._sortBy = sortBy;
        this._renderStories();
    }

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
            this._view.renderStories(storiesToRender);
        } else {
            if (this._stories.length === 0) {
                this._view.showError('Belum ada cerita untuk ditampilkan.');
            } else {
                this._view.showError(`Tidak ada cerita yang cocok dengan "${this._searchTerm}".`);
            }
        }
    }

    onMarkerClicked(storyId) {
        this._view.focusFeedOnCard(storyId);
    }
}

export default StoryListPresenter;