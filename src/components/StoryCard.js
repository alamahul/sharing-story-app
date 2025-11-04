class StoryCard extends HTMLElement {
    constructor() {
        super();
        this._story = null;
    }

    set story(value) {
        this._story = value;
        this.render();
    }

    connectedCallback() {
        this.addEventListener('click', this._onClick);
        this.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this._onClick();
            }
        });
    }
    
    _onClick() {
        if (!this._story) return;
        location.hash = `#/story-detail/${this._story.id}`;
    }

    render() {
        if (!this._story) return;

        this.classList.add('story-item', 'card-shadow');
        this.dataset.storyId = this._story.id; 

        this.innerHTML = `
            <img src="${this._story.photoUrl}" alt="Cerita oleh ${this._story.name}">
            <div class="story-item__content">
                <h3 tabindex="0" class="story-item__title">${this._story.name}</h3>
                <p class="story-item__date">${new Date(this._story.createdAt).toLocaleDateString()}</p>
                <p class="story-item__description">${this._story.description.substring(0, 100)}...</p>
            </div>
        `;
    }
    
    disconnectedCallback() {
        this.removeEventListener('click', this._onClick);
    }
}

customElements.define('story-card', StoryCard);