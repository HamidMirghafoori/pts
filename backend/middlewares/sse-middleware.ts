import { NextFunction, Response } from "express";
import { ReqType } from "../controllers/auth-controller";

declare global {
  namespace Express {
    interface Response {
      sseSetup: () => void;
      sseSend: (event: string, data: any) => void;
    }
  }
}

const clients = new Map<string, Response>();

exports.sseMiddleware = (req: ReqType, res: Response, next: NextFunction) => {
  res.sseSetup = () => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.flushHeaders();
  };

  const clientToken = req.query.token as string; // Use a query parameter for the token

  if (!clientToken || !clients.has(clientToken)) {
    res.status(403).end();
    return;
  }

  clients.set(clientToken, res);

  req.on('close', () => {
    clients.delete(clientToken);
  });

  res.sseSend = (event, data) => {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  next();
};
