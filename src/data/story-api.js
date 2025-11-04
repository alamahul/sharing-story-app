import AuthService from './auth-service.js';
import Config from '../config.js';

const StoryApi = {
    BASE_URL: Config.BASE_URL,

    async _fetchWithToken(url, options = {}) {
        const token = AuthService.getToken();
        if (!token) {
            throw new Error('User not authenticated');
        }

        const defaultHeaders = {
            'Authorization': `Bearer ${token}`,
        };

        if (options.body && !(options.body instanceof FormData)) {
            defaultHeaders['Content-Type'] = 'application/json';
       }

       const response = await fetch(url, { 
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        } 
    });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'API request failed');
        }

        return response.json();
    },

    async register(name, email, password) {
        const response = await fetch(`${this.BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Registration failed');
        }

        return response.json();
    },

    async login(email, password) {
        const response = await fetch(`${this.BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed');
        }

        return response.json();
    },

    async getStoriesWithLocation() {
        return this._fetchWithToken(`${this.BASE_URL}/stories?location=1&size=50`);
    },

    async addNewStory(formData) {
        return this._fetchWithToken(`${this.BASE_URL}/stories`, {
            method: 'POST',
            body: formData,
        });
    },

    async getStoryDetail(id) {
        return this._fetchWithToken(`${this.BASE_URL}/stories/${id}`);
    },
    async getAddressFromCoordinates(lat, lon) {
        const url = `https://api.maptiler.com/geocoding/${lon},${lat}.json?key=${Config.MAPTILER_API_KEY}`;
        
        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal melakukan reverse geocoding MapTiler.');
            }
            
            const data = await response.json();
            
            if (data.features && data.features.length > 0) {
                return data.features[0].place_name; 
            } else {
                return 'Nama lokasi tidak ditemukan.';
            }

        } catch (error) {
            console.error('MapTiler Error:', error);
            throw new Error('Gagal terhubung ke layanan geocoding.');
        }
    },
    /**
     * Mengirim subscription ke server API Dicoding
     */
    async subscribePushNotification(subscription) {
        const subscriptionJson = subscription.toJSON();
        const cleanedSubscription = {
            endpoint: subscriptionJson.endpoint,
            keys: {
                p256dh: subscriptionJson.keys.p256dh,
                auth: subscriptionJson.keys.auth,
            }
        };
        const body = JSON.stringify(cleanedSubscription);
        // console.log(body) 
        return this._fetchWithToken(`${this.BASE_URL}/notifications/subscribe`, {
            method: 'POST',
            body: body,
        });
    },

    /**
     * Menghapus subscription dari server API Dicoding
     */
    async unsubscribePushNotification(subscription) {
        const body = JSON.stringify({ endpoint: subscription.endpoint });
        return this._fetchWithToken(`${this.BASE_URL}/notifications/subscribe`, {
            method: 'DELETE',
            body: body,
        });
    },
};

export default StoryApi;