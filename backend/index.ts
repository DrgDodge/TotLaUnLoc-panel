import { Server, Socket } from "socket.io";
import PocketBase from 'pocketbase';

const pb = new PocketBase("http://127.0.0.1:8090");

const superuser_email = process.env.SUPERUSER_EMAIL
const superuser_pass = process.env.SUPERUSER_PASS

if (!superuser_email || !superuser_pass) 
  throw new Error("SUPERUSER_EMAIL or SUPERUSER_PASS environment variables do not exist!");

await pb.collection("_superusers").authWithPassword("mimiionescu07@gmail.com", "2$XuNkT!84h@!3GbNqFM");

let superusers = await pb.collection("_superusers").getList().then(x => {
  return x.items.map(y => y = y.email);
})
console.log(superusers)

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

  socket.on("auth", async (data, callback) => {

    console.log(data)

    let userAuth = {
      authentificated: false,
      isSuperUser: false
    }

    if (superusers.find(email => email == data.username)) {

      const authData = await pb.collection("_superusers").authWithPassword(data.username, data.password)
        .then(() => { return true })
        .catch(() => { return false })

      if (!authData) return callback(userAuth);

      userAuth.authentificated = true
      userAuth.isSuperUser = true

      return callback(userAuth);
    }

    const authData = await pb.collection("users").authWithPassword(data.username, data.password)
      .then(() => { return true })
      .catch(() => { return false })

    if (!authData) return callback(userAuth);

    userAuth.authentificated = true

    return callback(userAuth);

  })

});