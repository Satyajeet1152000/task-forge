const isDevelopment = process.env.NODE_ENV === "development";

export const loggerConfig = isDevelopment
  ? {
      level: "debug" as const,
      transport: {
        target: "pino-pretty",
        options: {
          ignore: "pid,hostname,reqId,req,res,responseTime",
          colorize: true,
          translateTime: "HH:MM:ss",
          messageFormat: "{msg}",
          customColors: "info:blue,warn:yellow,error:red,debug:green,fatal:magenta",
          customLevels: "info:30,warn:40,error:50,debug:20,fatal:60",
          levelFirst: true,
        },
      },
    }
  : { level: "info" as const };
