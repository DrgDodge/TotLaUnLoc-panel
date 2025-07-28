import { Server, Socket } from "socket.io";
import PocketBase from 'pocketbase';

const pb = new PocketBase("https://db.totlaunloc.top");

const machineCache = new Map();

const superuser_email = process.env.SUPERUSER_EMAIL
const superuser_pass = process.env.SUPERUSER_PASS

if (!superuser_email || !superuser_pass)
  throw new Error("SUPERUSER_EMAIL or SUPERUSER_PASS environment variables do not exist!");

await pb.collection("_superusers").authWithPassword("api@api.com", "QcLs9Kd9wnApRKW");

let superusers = await pb.collection("_superusers").getList().then(x => {
  return x.items.map(y => y = y.email);
})
console.log(superusers)

const PORT = 7355;
const io = new Server(PORT, {
  cors: {
    origin: (process.env.ALLOWED_ORIGINS || "http://localhost:5573,https://totlaunloc.top").split(","),
    credentials: true
  }
});
console.log(`Started server on port ${PORT}!`);

const adminNamespace = io.of("/admin");

const connectedClients = new Map<string, { status: string }>();

adminNamespace.on("connection", (socket) => {
  console.log("Admin connected");
  socket.emit("existing_clients", Array.from(connectedClients.entries()).map(([socketId, data]) => ({ socketId, ...data })));
});

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);
  connectedClients.set(socket.id, { status: "connected" });

  adminNamespace.emit("client_connected", { socketId: socket.id, status: "connected" });

  socket.on("heartbeat", async data => {
    connectedClients.set(socket.id, { status: "ok" });
    adminNamespace.emit("heartbeat", { socketId: socket.id, status: "ok", machineId: data.machineId, savedLicenseKey: data.savedLicenseKey });
    if (!machineCache.has(data.machineId)) {
      if (data.savedLicenseKey) machineCache.set(data.machineId, data.savedLicenseKey)

      const record = await pb.collection("users").getFullList({
        filter: 'licenses != null'
      })
      record.forEach(async user => {
        const test = user.licenses.find((license: any) => license.apiKey == data.savedLicenseKey)
        // console.log("test", test);
        if (test) {
          const index = user.licenses.indexOf(test)

          const findMachine = user.licenses[index].machines.find((machine: any) => machine.id == data.machineId)
          if (findMachine) return;

          user.licenses[index].machines.push({ name: `Machine-${data.machineId}`, id: data.machineId })

          await pb.collection("users").update(user.id, user)
        }
      })
    }
  });

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

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
    connectedClients.delete(socket.id);
    adminNamespace.emit("disconnect_signal", { socketId: socket.id });
  });

});