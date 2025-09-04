# Capstone_Project_Task_Project_Management

A full-stack **Task & Project Management Tool** inspired by Trello.  
This application enables teams to **plan, track, and manage projects** with a Kanban board, drag-and-drop task management, real-time collaboration, and third-party API integrations.

---

## 🚀 Features

- **User Roles & Permissions**
  - **Admin** → Manage users, projects, and global settings  
  - **Project Manager** → Create/manage projects & assign tasks  
  - **Team Member** → Update task statuses & collaborate  
  - **Viewer** → View-only access  

- **Kanban Board** – Visual project tracking (To-Do, In Progress, Done, etc.)  
- **Drag & Drop Tasks** – Move tasks across stages seamlessly  
- **Task Management** – Create, edit, delete, and assign tasks  
- **Team Collaboration** – Comments, mentions, and updates  
- **Notifications** – Real-time updates on assignments & changes  
- **File Uploads** – Attach documents, images, or files to tasks  
- **API Integrations** – Slack, Google Calendar, Jira (extendable)  

---

## 🏗️ Project Structure

Task-Project-Management-Tool/
│── frontend/ # React Frontend
│ ├── src/
│ │ ├── components/ # Reusable UI Components
│ │ ├── pages/ # Page-Level Components
│ │ ├── services/ # API Calls
│ │ ├── redux/ # Redux Toolkit State Management
│ │ ├── App.js
│ │ ├── index.js
│ ├── public/
│ ├── package.json
│ ├── README.md
│
│── backend/ # .NET Core Backend
│ ├── Controllers/ # API Controllers
│ ├── Models/ # Database Models
│ ├── Services/ # Business Logic
│ ├── Data/ # EF Core Database Context
│ ├── Program.cs
│ ├── Startup.cs
│ ├── appsettings.json
│ ├── README.md
│
│── docs/ # Documentation & API Docs
│── tests/ # Unit Tests & API Testing
│── deployment/ # Docker, Azure/AWS deployment
│── .gitignore
│── README.md

markdown
Copy code

---

## ⚙️ Tech Stack

- **Frontend:** React, Redux Toolkit, TailwindCSS  
- **Backend:** .NET Core Web API, Entity Framework Core  
- **Database:** SQL Server / PostgreSQL (configurable)  
- **Auth:** JWT-based authentication  
- **Deployment:** Azure / AWS (Backend), Vercel / Netlify (Frontend)  

---

## 🔑 API Endpoints

### Authentication  
- `POST /api/auth/register` → Register a new user  
- `POST /api/auth/login` → Authenticate & get JWT  

### Project Management  
- `POST /api/projects` → Create project  
- `GET /api/projects` → Get all projects  
- `GET /api/projects/{id}` → Get project details  
- `PUT /api/projects/{id}` → Update project  
- `DELETE /api/projects/{id}` → Delete project  

### Task Management  
- `POST /api/tasks` → Create task  
- `GET /api/tasks/{projectId}` → Get tasks by project  
- `PUT /api/tasks/{id}` → Update task  
- `DELETE /api/tasks/{id}` → Delete task  

### Collaboration  
- `POST /api/comments` → Add comment  
- `GET /api/comments/{taskId}` → Get comments for task  
- `POST /api/notifications` → Trigger notification  

---

## 🛠️ Setup Instructions

### 1. Clone Repository
```bash
git clone https://github.com/charanmailavarapu/Capstone_Project_Task_Project_Management.git
cd Capstone_Project_Task_Project_Management
2. Backend Setup (.NET Core)
bash
Copy code
cd backend
dotnet restore
dotnet ef database update   # Run migrations
dotnet run
Backend runs on http://localhost:5000

3. Frontend Setup (React)
bash
Copy code
cd frontend
npm install
npm start
Frontend runs on http://localhost:3000

🧪 Testing
Unit Tests: Run backend unit tests with

bash
Copy code
dotnet test
API Testing: Import docs/TaskAPI.postman_collection.json into Postman and test all endpoints.

🚀 Deployment
Backend: Deploy to Azure App Service or AWS Elastic Beanstalk

Frontend: Deploy to Vercel or Netlify

Docker: Use deployment/ scripts for containerized deployment

📖 Documentation
API documentation available via Swagger at

bash
Copy code
http://localhost:5000/swagger
Additional docs in the docs/ folder.

👨‍💻 Contributors
Charan Mailavarapu – Developer

yaml
Copy code
