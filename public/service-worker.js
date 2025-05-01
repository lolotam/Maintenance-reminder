
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('push', (event) => {
  try {
    let data = {};
    
    if (event.data) {
      try {
        data = event.data.json();
      } catch (e) {
        data = { 
          title: 'Maintenance Notification',
          body: event.data.text()
        };
      }
    }
    
    const title = data.title || 'Maintenance Reminder';
    const options = {
      body: data.body || 'You have a maintenance reminder.',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        url: data.url || '/',
        ...data
      },
      actions: [
        {
          action: 'view',
          title: 'View Details'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  } catch (error) {
    console.error('Error in push event handler:', error);
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const url = event.notification.data?.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      // Check if there is already a window open with the target URL
      for (const client of windowClients) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      
      // If not, open a new window
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Add offline support
const OFFLINE_URL = '/offline.html';
const CACHE_NAME = 'maintenance-app-v1';

// Cache static assets on install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        OFFLINE_URL,
        '/favicon.ico',
      ]);
    })
  );
});

// Network-first strategy with fallback to offline page
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests and non-HTTP/HTTPS requests
  if (
    event.request.method !== 'GET' ||
    !event.request.url.startsWith('http')
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // Return the offline page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL);
            }
            
            return new Response('Network error', { status: 408 });
          });
      })
  );
});
