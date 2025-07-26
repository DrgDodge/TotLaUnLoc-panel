// import { json } from '@sveltejs/kit';
// import { io } from 'socket.io-client';

// const socket = io(process.env.BACKEND_URL);

// export async function POST({ request, cookies }) {
//   const { username, password } = await request.json();

//   return new Promise((resolve) => {
//     socket.emit('auth', { username, password }, (res: { authentificated: boolean, isSuperUser: boolean }) => {
//       if (res.authentificated) {
//         cookies.set('isLoggedIn', 'true', { path: '/', httpOnly: true, secure: process.env.NODE_ENV === 'production' });
//         cookies.set('isSuperUser', res.isSuperUser.toString(), { path: '/', httpOnly: true, secure: process.env.NODE_ENV === 'production' });
//         resolve(json({ isSuperUser: res.isSuperUser }));
//       } else {
//         resolve(new Response('Invalid credentials', { status: 401 }));
//       }
//     });
//   });
// }