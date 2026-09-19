import CONFIG from '../config.js';
import AuthModel from '../models/auth-model.js';

// Convert base64 URL to Uint8Array for VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function getServiceWorkerRegistration() {
  if (!('serviceWorker' in navigator)) return null;
  return navigator.serviceWorker.ready;
}

export async function isSubscribed() {
  const registration = await getServiceWorkerRegistration();
  if (!registration) return false;
  const subscription = await registration.pushManager.getSubscription();
  return !!subscription;
}

export async function subscribePushNotification() {
  try {
    const registration = await getServiceWorkerRegistration();
    if (!registration) throw new Error('Service worker not available');

    // Request notification permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      throw new Error('Notification permission denied');
    }

    // Subscribe to push
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(CONFIG.VAPID_PUBLIC_KEY),
    });

    const subscriptionJSON = subscription.toJSON();

    // Send subscription to API
    const response = await fetch(`${CONFIG.BASE_URL}/notifications/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AuthModel.getToken()}`,
      },
      body: JSON.stringify({
        endpoint: subscriptionJSON.endpoint,
        keys: {
          p256dh: subscriptionJSON.keys.p256dh,
          auth: subscriptionJSON.keys.auth,
        },
      }),
    });

    const responseJson = await response.json();
    if (responseJson.error) {
      // Unsubscribe locally if API fails
      await subscription.unsubscribe();
      throw new Error(responseJson.message);
    }

    return true;
  } catch (error) {
    console.error('Subscribe error:', error);
    throw error;
  }
}

export async function unsubscribePushNotification() {
  try {
    const registration = await getServiceWorkerRegistration();
    if (!registration) return false;

    const subscription = await registration.pushManager.getSubscription();
    if (!subscription) return false;

    const subscriptionJSON = subscription.toJSON();

    // Notify API to remove subscription
    await fetch(`${CONFIG.BASE_URL}/notifications/subscribe`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AuthModel.getToken()}`,
      },
      body: JSON.stringify({
        endpoint: subscriptionJSON.endpoint,
      }),
    });

    // Unsubscribe locally
    await subscription.unsubscribe();
    return true;
  } catch (error) {
    console.error('Unsubscribe error:', error);
    throw error;
  }
}
