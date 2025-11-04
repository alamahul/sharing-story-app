

import { openDB } from 'idb';

const DATABASE_NAME = 'sharing-story-db';
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = 'saved-stories';

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {

    upgrade(database) {

        database.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'id' });
    },
});

const IndexedDBHelper = {
    /**
     * Mengambil satu cerita berdasarkan ID
     * @param {string} id - ID cerita
     */
    async getStory(id) {
        return (await dbPromise).get(OBJECT_STORE_NAME, id);
    },

    /**
     * Mengambil semua cerita yang tersimpan
     */
    async getAllStories() {
        return (await dbPromise).getAll(OBJECT_STORE_NAME);
    },

    /**
     * Menyimpan atau memperbarui cerita
     * @param {object} story - Objek cerita lengkap
     */
    async putStory(story) {
        if (!story || !story.id) {
            return Promise.reject(new Error('Objek cerita tidak valid'));
        }
        return (await dbPromise).put(OBJECT_STORE_NAME, story);
    },

    /**
     * Menghapus cerita berdasarkan ID
     * @param {string} id - ID cerita
     */
    async deleteStory(id) {
        return (await dbPromise).delete(OBJECT_STORE_NAME, id);
    },
};

export default IndexedDBHelper;