import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import express, { Request as ExpressRequest } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { initChatSocket } from './modules/chat/chat.socket.js';

import { MONGO_URL, PORT, UPLOAD_FOLDERS } from './utils/constants.js';
import { schema } from './schema.js';
import uploadRoute from './routes/upload.route.js';
import { seedLeadershipGroups } from './modules/leadershipGroup/leadershipGroup.resolvers.js';

import { getAuthContext, AuthContext } from './middleware/auth.js';

dotenv.config();

const ensureUploadDirectories = (): void => {
  const uploadBase = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadBase)) fs.mkdirSync(uploadBase, { recursive: true });
  Object.values(UPLOAD_FOLDERS).forEach(folder => {
    const dir = path.join(uploadBase, folder);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });
  console.log('Upload directories ready');
};

const simpleErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

async function connectToDatabase() {
  try {
    if (!MONGO_URL) {
      throw new Error('MongoDB connection string is not defined. Ensure MONGO_URL is set in the environment.');
    }
    await mongoose.connect(MONGO_URL);
    console.log('Connected to MongoDB successfully');

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    });

    return true;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    return false;
  }
}

async function initServer() {
  ensureUploadDirectories();

  const dbConnected = await connectToDatabase();
  if (!dbConnected) {
    console.warn('MongoDB connection failed, but continuing to start server...');
  } else {
    await seedLeadershipGroups();
  }

  const app = express();

  const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
      callback(null, origin || '*');
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Content-Length', 'X-JSON'],
    maxAge: 86400,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  };

  app.use(cors(corsOptions));

  app.use((req: any, res: any, next: any) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    next();
  });

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  // Serve static uploads
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  // REST upload route (before Apollo)
  app.use('/api/upload', uploadRoute);

  app.use((req: any, res: any, next: any) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
    next();
  });

  const apolloServer = new ApolloServer({
    schema,
    formatError: (error) => {
      console.error('GraphQL Error:', error);
      return {
        message: error.message,
        path: error.path,
        extensions: {
          code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
          ...(process.env.NODE_ENV === 'development' && { stacktrace: error.extensions?.stacktrace }),
        },
      };
    },
  });

  await apolloServer.start();

  app.use(
    '/graphql',
    expressMiddleware(apolloServer, {
      context: async ({ req }: { req: ExpressRequest }) => {
        const authHeader = req.headers.authorization || '';
        try {
          const authContext = await getAuthContext(authHeader);
          return { ...authContext, req };
        } catch (error: any) {
          return { isAuthenticated: false, authError: error.message, req };
        }
      },
    })
  );

  app.get('/', (req: Request, res: Response) => {
    res.json({
      name: 'RENISA API',
      status: 'running',
      graphql: `/graphql`,
      uploads: `/uploads`,
    });
  });

  app.use(simpleErrorHandler);

  const httpServer = createServer(app);

  const io = new SocketServer(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
    },
    path: '/socket.io',
  });

  initChatSocket(io);

  httpServer.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
    console.log(`Upload endpoint: http://localhost:${PORT}/api/upload`);
    console.log(`Socket.io ready on ws://localhost:${PORT}`);
  });
}

initServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
