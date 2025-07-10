import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { Database } from "bun:sqlite";
import jwt from "jsonwebtoken";
import { Server as SocketIOServer, Socket } from "socket.io";
import http from "http";

// Initialize the SQLite database
const db = new Database("db.sqlite", { create: true });

// Create the users table if it doesn't exist
db.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  )
`).run();

// Define the port
const PORT = 7355;

// Helper function to convert IncomingMessage to Request for Elysia compatibility
function toRequest(req: http.IncomingMessage): Request {
  // Construct the full URL from the request headers and URL
  const url = `http://${req.headers.host}${req.url}`;

  // Convert headers from IncomingMessage to a Headers object
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value) {
      headers.append(key, value.toString());
    }
  }

  // Create a new Request object
  return new Request(url, {
    method: req.method,
    headers,
    // Include the body only for methods that support it (not GET or HEAD)
    body: req.method !== "GET" && req.method !== "HEAD" ? req : undefined,
  });
}

// Set up the Elysia app with CORS and authentication routes
const app = new Elysia()
  .use(cors()) // Enable CORS for cross-origin requests
  .group("/auth", (app) =>
    app
      // Register a new user
      .post(
        "/register",
        async ({ body, set }) => {
          const { username, password } = body;
          if (!username || !password) {
            set.status = 400;
            return { error: "Username and password are required" };
          }

          try {
            const existingUser = db
              .query("SELECT * FROM users WHERE username = ?")
              .get(username);
            if (existingUser) {
              set.status = 409;
              return { error: "User already exists" };
            }

            db.query("INSERT INTO users (username, password) VALUES (?, ?)")
              .run(username, password);

            return { message: "User created successfully" };
          } catch (error) {
            set.status = 500;
            return { error: "An error occurred while creating the user" };
          }
        },
        {
          body: t.Object({
            username: t.String(),
            password: t.String(),
          }),
        }
      )
      // Login a user and return a JWT token
      .post(
        "/login",
        async ({ body, set }) => {
          const { username, password } = body;
          if (!username || !password) {
            set.status = 400;
            return { error: "Username and password are required" };
          }

          try {
            const user = db
              .query("SELECT * FROM users WHERE username = ? AND password = ?")
              .get(username, password);

            if (!user) {
              set.status = 401;
              return { error: "Invalid credentials" };
            }

            const token = jwt.sign({ id: user.id }, "your-secret-key", {
              expiresIn: "1h",
            });

            return { token };
          } catch (error) {
            set.status = 500;
            return { error: "An error occurred while logging in" };
          }
        },
        {
          body: t.Object({
            username: t.String(),
            password: t.String(),
          }),
        }
      )
      // Check authentication status
      .get("/status", ({ request, set }) => {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader) {
          set.status = 401;
          return { isAuthenticated: false };
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
          set.status = 401;
          return { isAuthenticated: false };
        }

        try {
          jwt.verify(token, "your-secret-key");
          return { isAuthenticated: true };
        } catch (error) {
          set.status = 401;
          return { isAuthenticated: false };
        }
      })
  );

// Create the HTTP server and integrate Elysia
const server = http.createServer(async (req, res) => {
  const request = toRequest(req); // Convert IncomingMessage to Request
  const response = await app.fetch(request); // Process request with Elysia
  res.writeHead(response.status, Object.fromEntries(response.headers));
  res.end(response.body);
});

// Set up Socket.IO on the same HTTP server
const io = new SocketIOServer(server, {
  cors: {
    origin: "*", // Allow all origins (adjust for production)
  },
});

// Handle Socket.IO connections with proper typing
io.on("connection", (socket: Socket) => {
  console.log("Hello socket.io", socket.id); // Log the socket ID on connection
});

// Start the server
server.listen(PORT, () => {
  console.log(`Backend is running at http://localhost:${PORT}`);
});