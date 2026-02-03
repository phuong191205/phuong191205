import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const browserDistFolder = join(import.meta.dirname, '../browser');
const usersFile = join(process.cwd(), 'data', 'users.json');

const app = express();
const angularApp = new AngularNodeAppEngine();

// Middleware to parse JSON bodies
app.use(express.json());

/**
 * API Endpoint: Signup
 */
app.post('/api/signup', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ email và mật khẩu' });
  }

  try {
    // Read existing users
    let users = [];
    if (existsSync(usersFile)) {
      const fileData = readFileSync(usersFile, 'utf-8');
      if (fileData) {
        users = JSON.parse(fileData);
      }
    }

    // Check if user already exists
    const userExists = users.find((u: any) => u.email === email);
    if (userExists) {
      return res.status(409).json({ message: 'Tài khoản đã tồn tại' });
    }

    // Add new user
    const newUser = { id: Date.now(), email, password, role: 'user' };
    users.push(newUser);

    // Save to file
    writeFileSync(usersFile, JSON.stringify(users, null, 2));

    return res.status(201).json({ message: 'Đăng ký thành công' });
  } catch (error) {
    console.error('Error saving user:', error);
    return res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
});

/**
 * API Endpoint: Login
 */
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ email và mật khẩu' });
  }

  try {
    let users = [];
    if (existsSync(usersFile)) {
      const fileData = readFileSync(usersFile, 'utf-8');
      if (fileData) {
        users = JSON.parse(fileData);
      }
    }

    const user = users.find((u: any) => u.email === email && u.password === password);

    if (user) {
      // In a real app, you would return a JWT token here
      return res.status(200).json({ message: 'Đăng nhập thành công', user: { email: user.email, id: user.id, role: user.role } });
    } else {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
  }
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
