# Render Production Deployment Requirements

The `gulshan_library` project is structured with a Node.js backend in the `backend/` directory and a static frontend in the root directory. To deploy to Render, follow these steps:

## Render Configuration

1.  **Service Type:** Create a **Web Service** in Render.
2.  **Root Directory:** `backend` (for the server).
3.  **Build Command:** `npm install`
4.  **Start Command:** `npm start`
5.  **Environment Variables:** Add the following under "Environment" in Render:
    - `NODE_ENV`: `production`
    - `MONGO_URI`: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/gulshan_library` (Use MongoDB Atlas)
    - `JWT_SECRET`: `<a-long-random-string>`
    - `PORT`: `5000`

## Important Considerations

- **MongoDB:** MongoDB Atlas is required for a robust production deployment, as Render does not provide persistent MongoDB instances by default.
- **Frontend Serving:** To serve the frontend (root directory) alongside the backend, it is recommended to configure the Express backend (`backend/app.js`) to serve static files from the root.
    ```javascript
    const path = require('path');
    app.use(express.static(path.join(__dirname, '../')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../index.html'));
    });
    ```
- **HTTPS:** Ensure the production domain has SSL enabled, which is standard on Render.

## Summary

ROOT DIRECTORY:
backend

BUILD COMMAND:
npm install

START COMMAND:
npm start

ENVIRONMENT VARIABLES:

MONGO_URI=
JWT_SECRET=

MongoDB Atlas is required. The project is mostly ready, but the Express backend needs the `express.static` configuration (as shown above) to serve the frontend correctly from the same Render Web Service.
