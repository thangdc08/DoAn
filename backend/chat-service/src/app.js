import express from "express";
import {
  port,
  connectDB,
  createEurekaClient,
  enableEureka,
} from "./configuration/index.js";
import { chatRoute, conversationRoute } from "./routes/index.js";
import { authMiddleware } from "./middleware/authMiddleWare.js";
import { errorHandler } from "./common/Exception/error-handler.js";
import { initWebSocket } from "./configuration/websocket.js";
import http from "http";
import { connectProducer, connectConsumer } from "./configuration/kafka.js";

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use("/chat", authMiddleware, chatRoute);
app.use("/conversation", authMiddleware, conversationRoute);
app.use(errorHandler);

connectDB();

let eurekaClient = null;
if (enableEureka) {
  eurekaClient = createEurekaClient(port);
  eurekaClient.start((err) => {
    if (err) {
      console.error("Failed to register with Eureka:", err.message || err);
      return;
    }
    console.log("Eureka registered");
  });
} else {
  console.warn("Eureka disabled by ENABLE_EUREKA=false");
}

connectProducer().catch((error) => {
  console.error("Failed to connect Kafka producer:", error);
});

connectConsumer().catch((error) => {
  console.error("Failed to connect Kafka consumer:", error);
});

server.listen(port, () => {
  initWebSocket(server);
  console.log(`Server running on port ${port}`);
});

let shuttingDown = false;
const gracefulShutdown = (signal) => {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`Received ${signal}, shutting down chat-service...`);

  if (!eurekaClient) {
    server.close(() => {
      process.exit(0);
    });
    return;
  }

  eurekaClient.stop(() => {
    server.close(() => {
      process.exit(0);
    });
  });
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
