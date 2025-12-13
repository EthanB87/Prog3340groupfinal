# 📋 TaskFlow - Real-Time Collaborative Kanban Board

## A full-stack task management application featuring a real-time Kanban board, Google Authentication, and live team notifications.

## 🚀 Prerequisites

Before running the project, ensure you have the following installed:

1. **Node.js** (v18 or higher)
2. **DOTNET 8 SDK**

---

## ⚙️ Installation & Setup Guide

You will need two separate terminal windows to run this application (one for the server, one for the client).

### Step 1: Backend Setup (ASP.NET Core)

1. **Navigate to the server directory:**

   ```bash
   cd server
   dotnet run
   ```

   The server will start on https://localhost:7007

2. **Navigate to the client directory:**

```bash
cd client
npm install
npm run dev
```

The server will start on http://localhost:3000

3. **Team Contributions:**

This project was built collaboratively. Below is the breakdown of responsibilities:

👤 Ethan Brockman

Kanban Logic: Implemented the drag-and-drop functionality in KanbanBoard.tsx and state management.

Authentication: Implemented Google OAuth 2.0 flow and Cookie-based session management in Program.cs.

API Integration: Wrote the fetch utilities and auth.ts to handle secure API communication and CORS credentials.

Component Design: Created reusable UI components including Sidebar, Header, TaskCard, and LoginScreen using Tailwind CSS.

👤 Simon Brubacher

Admin Dashboard: Built the AdminDashboard page for managing users and viewing system analytics.

API Architecture: Built the core TasksController and AuthController with Dependency Injection and Repository Pattern.

Database Design: Designed the ERD and implemented Entity Framework Core models (AppUser, Task, Team).

👤 Jack Graul - Real-Time Features

SignalR Implementation: Set up the NotificationHub on the backend and the WebSocket listeners in ToastNotifications.tsx.

Background Services: Implemented the TaskCleanupService to automatically archive old tasks in the background.
