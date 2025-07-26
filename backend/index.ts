import { Server, Socket } from "socket.io";
import PocketBase from 'pocketbase';

const pb = new PocketBase(process.env.DATABASE_URL);

const superuser_email = process.env.SUPERUSER_EMAIL
const superuser_pass = process.env.SUPERUSER_PASS

if (!superuser_email || !superuser_pass) 
  throw new Error("SUPERUSER_EMAIL or SUPERUSER_PASS environment variables do not exist!");

await pb.collection("_superusers").authWithPassword(superuser_email, superuser_pass);

let superusers = await pb.collection("_superusers").getList().then(x => {
  return x.items.map(y => y = y.email);
})


const PORT = 7355;
const io = new Server(PORT, {
  cors: {
    origin: "*"
  }
});
console.log(`Started server on port ${PORT}!`);

io.on("connection", (socket) => {

  socket.on("register", async (data, callback) => {
    try {
      const newUser = {
        "email": data.username,
        "password": data.password,
        "passwordConfirm": data.password,
        "emailVisibility": true,
      };
      await pb.collection('users').create(newUser);
      callback({ success: true });
    } catch (e: any) {
      callback({ success: false, message: e.message });
    }
  });

});