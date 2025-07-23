import { json } from '@sveltejs/kit';
import { io } from 'socket.io-client';

  const socket = io("https://backend:7355", {
    withCredentials: true,
  });

export async function POST({ request }) {
  const { username, password } = await request.json();

  return new Promise((resolve) => {
    socket.emit('register', { username, password }, (res: { success: boolean }, err: any) => {
      if (res.success) {
        resolve(json({ success: true }));
      } else {
        resolve(new Response(err || 'An error occurred during registration.', { status: 400 }));
      }
    });
  });
}