import pino from "pino";
import path from "path";

const logger = pino({
  transport: {
    targets: [
      {
        target: "pino-pretty",
        options: {
          colorize: true,
        },
        level: "info",
      },
      {
        target: "pino/file",
        options: {
          destination: path.join(path.resolve(), "logs.json"),
          mkdir: true,
        },
        level: "info",
      },
    ],
  },
});

export default logger;
