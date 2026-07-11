import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

// Middleware de API REST para la base de datos de estudiantes (Backend integrado)
function apiMiddlewarePlugin() {
  const dbPath = path.resolve(__dirname, 'students.json');

  const readDB = () => {
    if (!fs.existsSync(dbPath)) return [];
    try {
      return JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    } catch (e) {
      return [];
    }
  };

  const writeDB = (data: any) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
  };

  return {
    name: 'api-middleware',
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        // Obtener ruta base
        const host = req.headers.host || 'localhost:3000';
        const url = new URL(req.url, `http://${host}`);
        
        if (url.pathname.startsWith('/api/students')) {
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

          if (req.method === 'OPTIONS') {
            res.statusCode = 200;
            res.end();
            return;
          }

          // GET /api/students
          if (req.method === 'GET') {
            const db = readDB();
            res.statusCode = 200;
            res.end(JSON.stringify(db));
            return;
          }

          // POST /api/students
          if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk: any) => { body += chunk; });
            req.on('end', () => {
              const db = readDB();
              try {
                const newStudent = JSON.parse(body);
                newStudent.id = Date.now().toString();
                newStudent.completedMissions = newStudent.completedMissions || {};
                newStudent.score = newStudent.score || 0;
                newStudent.timestamp = new Date().toISOString();
                
                db.push(newStudent);
                writeDB(db);
                
                res.statusCode = 201;
                res.end(JSON.stringify(newStudent));
              } catch (e) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'JSON inválido' }));
              }
            });
            return;
          }

          // PUT /api/students/:id
          if (req.method === 'PUT') {
            const segments = url.pathname.split('/');
            const id = segments[segments.length - 1];
            
            let body = '';
            req.on('data', (chunk: any) => { body += chunk; });
            req.on('end', () => {
              const db = readDB();
              const studentIdx = db.findIndex((s: any) => s.id === id);
              if (studentIdx === -1) {
                res.statusCode = 404;
                res.end(JSON.stringify({ error: 'Estudiante no encontrado' }));
                return;
              }
              try {
                const updates = JSON.parse(body);
                db[studentIdx] = { ...db[studentIdx], ...updates };
                writeDB(db);
                
                res.statusCode = 200;
                res.end(JSON.stringify(db[studentIdx]));
              } catch (e) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'JSON inválido' }));
              }
            });
            return;
          }

          // DELETE /api/students/:id
          if (req.method === 'DELETE') {
            const segments = url.pathname.split('/');
            const id = segments[segments.length - 1];
            
            const db = readDB();
            const filtered = db.filter((s: any) => s.id !== id);
            writeDB(filtered);
            
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true }));
            return;
          }
        }
        
        next();
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiMiddlewarePlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâ€”file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
