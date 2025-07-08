import { Server } from "socket.io";
import { Database } from "bun:sqlite";

const db = new Database("db.sqlite");

const PORT = 7355;
const io = new Server(PORT, { 
  cors: {
    origin: "*"
  }
 });
console.log(`Started server on port ${PORT}!`);

io.on("connection", (socket) => {
  console.log("Hello socket.io", socket.id)
});