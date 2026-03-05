# Incident Management System

This is a **full-stack Incident Management System** with role-based access (Admin, Engineer, User). It allows reporting, assigning, tracking, and resolving incidents, along with services and notifications management.

## Folder Structure

- `backend/` – Node.js + Express API, MongoDB models, controllers, routes.
- `frontend/` – React.js frontend.
- `postman_collection/` – Postman collection for API testing.
- `.gitignore` – Files to ignore in Git.

## API Documentation

You can import the Postman collection [`Incident Tracking System API.postman_collection`](./postman_collection/Incident%20Tracking%20System%20API.postman_collection) into Postman to test all APIs.

**Steps:**
1. Clone the repository.
2. Open Postman → File → Import → Choose the JSON file from `docs/`.
3. The collection will appear with all endpoints ready to use.

## Getting Started

### Backend
```bash
cd backend
npm install
npm start