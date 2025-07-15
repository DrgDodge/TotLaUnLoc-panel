import { Server, Socket } from "socket.io";
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

await pb.collection("_superusers").authWithPassword("mimiionescu07@gmail.com", "Khgprksz2YugCjB")

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