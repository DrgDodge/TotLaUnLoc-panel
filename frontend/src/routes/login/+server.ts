import { json } from '@sveltejs/kit';
import { io } from 'socket.io-client';

const apiUrl = process.env.API_URL || "https://api.totlaunloc.top";
console.log(`SvelteKit backend connecting to API at: ${apiUrl}`);

const socket = io(apiUrl, {
  withCredentials: true,
  timeout: 5000,
  reconnection: true,
  reconnectionAttempts: 3,
});

socket.on('connect', () => {
  console.log('SvelteKit backend successfully connected to Socket.IO server.');
});

socket.on('connect_error', (err) => {
  console.error(`SvelteKit backend connection error: ${err.message}`, err.stack);
});

socket.on('disconnect', (reason) => {
  console.log(`SvelteKit backend disconnected from Socket.IO server. Reason: ${reason}`);
});

export async function POST({ request, cookies }) {
  const { username, password } = await request.json();

  return new Promise((resolve) => {
    const loginTimeout = setTimeout(() => {
      console.error('Login request timed out after 10 seconds.');
      resolve(new Response('The server took too long to respond. Please try again later.', { status: 504 }));
    }, 10000);

    if (!socket.connected) {
        console.warn('Socket was not connected. Attempting to connect before emitting auth event.');
    }

    socket.emit('auth', { username, password }, (res: { authentificated: boolean, isSuperUser: boolean }) => {
      clearTimeout(loginTimeout);
      
      if (res && res.authentificated) {
        console.log(`Authentication successful for user: ${username}`);
        cookies.set('isLoggedIn', 'true', { path: '/', httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        cookies.set('isSuperUser', res.isSuperUser.toString(), { path: '/', httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        resolve(json({ isSuperUser: res.isSuperUser }));
      } else {
        console.warn(`Authentication failed for user: ${username}`);
        resolve(new Response('Invalid credentials', { status: 401 }));
      }
    });
  });
}
