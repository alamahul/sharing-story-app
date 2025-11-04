import Config from '../config.js';
import AuthService from '../data/auth-service.js';
import StoryApi from '../data/story-api.js';

const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};

const NotificationHelper = {
    async requestPermission() {
        if (!('Notification' in window)) {
            console.error('Browser ini tidak mendukung notifikasi.');
            throw new Error('Browser ini tidak mendukung notifikasi.');
        }

        const result = await Notification.requestPermission();
        if (result === 'denied') {
            console.error('Izin notifikasi ditolak.');
            throw new Error('Izin notifikasi ditolak.');
        }
        if (result === 'default') {
            console.warn('Izin notifikasi ditutup.');
            throw new Error('Izin notifikasi ditutup.');
        }
        
        console.log('Izin notifikasi diberikan.');
    },

    async isSubscribed() {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        return subscription !== null;
    },

    async subscribe() {
        if (Notification.permission !== 'granted') {
            await this.requestPermission();
        }

        const registration = await navigator.serviceWorker.ready;
        const vapidPublicKey = Config.VAPID_PUBLIC_KEY;
        const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

        try {
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: convertedVapidKey,
            });
            
            console.log('Berhasil berlangganan:', subscription);
            await StoryApi.subscribePushNotification(subscription);
            return subscription;
        } catch (error) {
            console.error('Gagal berlangganan:', error);
            throw new Error('Gagal berlangganan push notification.');
        }
    },

    async unsubscribe() {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        console.log(subscription)
        if (subscription) {
            try {
                await StoryApi.unsubscribePushNotification(subscription);
                const unSubResult = await subscription.unsubscribe();

                console.log('Berhasil berhenti berlangganan:', unSubResult);
                
                return unSubResult;
            } catch (error) {
                console.error('Gagal berhenti berlangganan:', error);
                throw new Error('Gagal berhenti berlangganan.');
            }
        }
        return null;
    },
    /**
     * Menampilkan notifikasi lokal secara langsung
     * menggunakan Service Worker Registration
     */
    async showLocalNotification({ title, body, storyId = null }) {
        if (Notification.permission !== 'granted') {
            console.warn('Izin notifikasi belum diberikan.');
            return;
        }

        const registration = await navigator.serviceWorker.ready;
        
        const notificationOptions = {
            body: body,
            icon: '/images/icons/icon-192x192.png',
            badge: '/images/icons/icon-192x192.png',
            vibrate: [200, 100, 200],
            data: {
            },
            actions: [
                ...(storyId ? [{ action: 'open-story', title: 'Lihat Detail Cerita' }] : [])
            ]
        };

        await registration.showNotification(title, notificationOptions);
    },
};

export default NotificationHelper;