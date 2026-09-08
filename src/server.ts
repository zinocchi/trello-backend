import app from "./app";
import { env } from "./config/env";
import { prisma } from "./config/prisma";

const server = app.listen(env.PORT, () => {
  console.log(`🚀 Server Trello jalan di: http://localhost:${env.PORT}`);
});

const handleShutdown = async () => {
  server.close(async () => {
    await prisma.$disconnect();
    console.log("🛑 Server dan koneksi Postgres ditutup rapi.");
    process.exit(0);
  });
};

process.on("SIGINT", handleShutdown);
process.on("SIGTERM", handleShutdown);
