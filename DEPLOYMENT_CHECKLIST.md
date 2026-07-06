# DEPLOYMENT CHECKLIST - gulshan_library

- [ ] Set up production server environment.
- [ ] Install Node.js (backend) and a web server (Nginx/Apache for frontend).
- [ ] Configure `backend/.env` with production secrets (`JWT_SECRET`, `MONGO_URI`).
- [ ] Start MongoDB instance.
- [ ] Start backend server (e.g., using PM2 for process management).
- [ ] Serve frontend static files from the root directory.
- [ ] Configure reverse proxy (Nginx) to point `/api` to the backend server and serve frontend at root.
- [ ] Ensure SSL (HTTPS) is enabled, as required for modern web APIs and WhatsApp integration.
- [ ] Perform smoke tests in production environment.
