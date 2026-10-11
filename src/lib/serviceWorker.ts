// src/lib/serviceWorker.ts
/**
 * Service Worker registration and management
 */

const SW_URL = '/sw.js';

export interface ServiceWorkerConfig {
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onOffline?: () => void;
  onOnline?: () => void;
}

let isServiceWorkerSupported = 'serviceWorker' in navigator;

/**
 * Register service worker
 */
export function register(config?: ServiceWorkerConfig): void {
  if (isServiceWorkerSupported && process.env.NODE_ENV === 'production') {
    // The URL constructor is available in all browsers that support SW.
    const publicUrl = new URL(process.env.PUBLIC_URL || '', window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      // Our service worker won't work if PUBLIC_URL is on a different origin
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL || ''}${SW_URL}`;

      registerValidSW(swUrl, config);
    });
  }
}

/**
 * Register a valid service worker
 */
function registerValidSW(swUrl: string, config?: ServiceWorkerConfig) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      console.log('[Service Worker] Registered successfully');

      // Check for updates
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }

        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // At this point, the updated precached content has been fetched,
              // but the previous service worker will still serve the older
              // content until all client tabs are closed.
              console.log('[Service Worker] New content is available; please refresh.');

              // Execute callback
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }

              // Show update notification
              showUpdateNotification();
            } else {
              // At this point, everything has been precached.
              console.log('[Service Worker] Content is cached for offline use.');

              // Execute callback
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };

      // Listen for online/offline events
      window.addEventListener('online', () => {
        console.log('[Service Worker] App is online');
        if (config?.onOnline) {
          config.onOnline();
        }
      });

      window.addEventListener('offline', () => {
        console.log('[Service Worker] App is offline');
        if (config?.onOffline) {
          config.onOffline();
        }
      });
    })
    .catch((error) => {
      console.error('[Service Worker] Error during registration:', error);
    });
}

/**
 * Show update notification
 */
function showUpdateNotification() {
  // Implement update notification UI
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Update Available', {
      body: 'A new version is available. Please refresh the page.',
      icon: '/icon-192.png',
    });
  }
}

/**
 * Check if service worker is supported
 */
export function isServiceWorkerSupported(): boolean {
  return isServiceWorkerSupported;
}

/**
 * Unregister service worker
 */
export function unregister(): void {
  if (isServiceWorkerSupported) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
        console.log('[Service Worker] Unregistered successfully');
      })
      .catch((error) => {
        console.error('[Service Worker] Error during unregistration:', error);
      });
  }
}

/**
 * Check for updates
 */
export function checkForUpdates(): void {
  if (isServiceWorkerSupported) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.update();
    });
  }
}

/**
 * Skip waiting for new service worker to activate
 */
export function skipWaiting(): void {
  if (isServiceWorkerSupported) {
    navigator.serviceWorker.ready.then((registration) => {
      // Send message to waiting service worker
      registration.waiting?.postMessage({ type: 'SKIP_WAITING' });

      // Reload page
      window.location.reload();
    });
  }
}

/**
 * Get service worker registration
 */
export function getRegistration(): Promise<ServiceWorkerRegistration | undefined> {
  if (isServiceWorkerSupported) {
    return navigator.serviceWorker.ready;
  }
  return Promise.resolve(undefined);
}

/**
 * Check if app is online
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * Get connection information
 */
export function getConnectionInfo(): any {
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    return {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData,
    };
  }
  return null;
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

/**
 * Show notification
 */
export function showNotification(title: string, options?: NotificationOptions): void {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/icon-192.png',
      badge: '/badge-72.png',
      ...options,
    });
  }
}

/**
 * Clear all caches
 */
export async function clearCaches(): Promise<void> {
  if (!isServiceWorkerSupported) return;

  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.map((cacheName) => caches.delete(cacheName))
  );

  console.log('[Service Worker] All caches cleared');
}

/**
 * Preload resources
 */
export async function preloadResources(urls: string[]): Promise<void> {
  if (!isServiceWorkerSupported) return;

  const cache = await caches.open('preload-cache');
  await cache.addAll(urls);

  console.log('[Service Worker] Preloaded resources:', urls);
}
