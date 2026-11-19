#  E-Rickshaw Monitoring and Control Platform

A backend-based E-Rickshaw Monitoring and Control Platform developed using **NestJS, TypeScript, PostgreSQL, and TypeORM**.

The platform is designed to support the digital management of electric rickshaws, vehicle owners, registered users, and operational records through a centralized backend system.

This project was developed as part of the **Advanced Web Technologies** course at **American International University-Bangladesh (AIUB)**.

## 📌 Project Overview

The E-Rickshaw Monitoring and Control Platform aims to improve the management of electric rickshaws by providing a structured and centralized system.

Traditional vehicle management often involves manual recordkeeping, making it difficult to maintain accurate owner details, vehicle registration information, and operational status.

Our system addresses these challenges through a modular backend architecture, database integration, and RESTful APIs.

## 🚀 Core Features

- **Owner Management:** Register, retrieve, update, and manage e-rickshaw owner information.
- **Rickshaw Management:** Maintain vehicle details, registration numbers, chassis numbers, and operational status.
- **User Management:** Manage registered system users.
- **Authentication Module:** Provide a foundation for user authentication and controlled system access.
- **Audit Logs:** Maintain records of important system activities.
- **Database Integration:** Store and manage data using PostgreSQL and TypeORM.
- **RESTful API Architecture:** Enable communication between applications and backend services.
- **Modular Architecture:** Organize backend functionality into independent NestJS modules.

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| NestJS | Backend framework |
| TypeScript | Programming language |
| Node.js | JavaScript runtime |
| PostgreSQL | Relational database |
| TypeORM | Object-relational mapping |
| JWT | Token-based authentication |
| bcrypt | Password hashing |
| Swagger | API documentation |
| Postman | API testing |
| Git & GitHub | Version control and collaboration |
| VS Code | Development environment |

## 🏗️ Project Architecture

The backend follows the modular architecture provided by NestJS.

Each module organizes related controllers, services, and database entities to improve maintainability and scalability.

### Main Modules

1. **Owners Module** — Handles vehicle owner information.
2. **Rickshaws Module** — Handles rickshaw registration and management.
3. **Users Module** — Handles system user records.
4. **Auth Module** — Handles authentication-related operations.
5. **Audit Logs Module** — Records system activities.

## 🗄️ Database Design

The system uses PostgreSQL with TypeORM to manage relational data.

### Entity Relationship

- One owner can register multiple rickshaws.
- Each rickshaw belongs to one owner.
- Owner and rickshaw records are connected through a relational database association.

## 📂 Project Structure

The main backend modules are organized as follows:

```text
E-Rickshaw-Monitoring-and-Control-Platform/
│
├── src/
│   │
│   ├── auth/                         # MEMBER 1
│   │   ├── dto/
│   │   │   └── login.dto.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts
│   │   ├── decorators/
│   │   │   └── roles.decorator.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   │
│   ├── users/                        # MEMBER 1
│   │   ├── dto/
│   │   │   ├── create-user.dto.ts
│   │   │   └── update-user.dto.ts
│   │   ├── entities/
│   │   │   └── user.entity.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   │
│   ├── audit-logs/                   # MEMBER 1
│   │   ├── dto/
│   │   │   └── query-audit-log.dto.ts
│   │   ├── entities/
│   │   │   └── audit-log.entity.ts
│   │   ├── audit-logs.controller.ts
│   │   ├── audit-logs.service.ts
│   │   └── audit-logs.module.ts
│   │
│   ├── owners/                       # MEMBER 2
│   │   ├── dto/
│   │   │   ├── create-owner.dto.ts
│   │   │   └── update-owner.dto.ts
│   │   ├── entities/
│   │   │   └── owner.entity.ts
│   │   ├── owners.controller.ts
│   │   ├── owners.service.ts
│   │   └── owners.module.ts
│   │
│   ├── rickshaws/                    # MEMBER 2
│   │   ├── dto/
│   │   │   ├── create-rickshaw.dto.ts
│   │   │   └── update-rickshaw.dto.ts
│   │   ├── entities/
│   │   │   └── rickshaw.entity.ts
│   │   ├── rickshaws.controller.ts
│   │   ├── rickshaws.service.ts
│   │   └── rickshaws.module.ts
│   │
│   ├── drivers/                      # MEMBER 3
│   │   ├── dto/
│   │   │   ├── create-driver.dto.ts
│   │   │   └── update-driver.dto.ts
│   │   ├── entities/
│   │   │   └── driver.entity.ts
│   │   ├── drivers.controller.ts
│   │   ├── drivers.service.ts
│   │   └── drivers.module.ts
│   │
│   ├── applications/                 # MEMBER 3
│   │   ├── dto/
│   │   │   ├── create-application.dto.ts
│   │   │   └── update-application.dto.ts
│   │   ├── entities/
│   │   │   └── application.entity.ts
│   │   ├── applications.controller.ts
│   │   ├── applications.service.ts
│   │   └── applications.module.ts
│   │
│   ├── documents/                    # MEMBER 3
│   │   ├── dto/
│   │   │   └── upload-document.dto.ts
│   │   ├── entities/
│   │   │   └── document.entity.ts
│   │   ├── documents.controller.ts
│   │   ├── documents.service.ts
│   │   └── documents.module.ts
│   │
│   ├── licenses/                     # MEMBER 4
│   │   ├── dto/
│   │   │   ├── issue-license.dto.ts
│   │   │   └── update-license.dto.ts
│   │   ├── entities/
│   │   │   └── license.entity.ts
│   │   ├── licenses.controller.ts
│   │   ├── licenses.service.ts
│   │   └── licenses.module.ts
│   │
│   ├── verification/                 # MEMBER 4
│   │   ├── dto/
│   │   │   └── verify-license.dto.ts
│   │   ├── entities/
│   │   │   └── verification-log.entity.ts
│   │   ├── verification.controller.ts
│   │   ├── verification.service.ts
│   │   └── verification.module.ts
│   │
│   ├── database/                     # SHARED
│   │   ├── migrations/
│   │   ├── seeds/
│   │   └── data-source.ts
│   │
│   ├── common/                       # SHARED
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── guards/
│   │   └── dto/
│   │
│   ├── app.controller.ts
│   ├── app.service.ts
│   ├── app.module.ts
│   └── main.ts
│
├── test/
├── uploads/
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
├── nest-cli.json
└── README.md
```

## ⚙️ Installation and Setup

### Prerequisites

Ensure the following software is installed:

- Node.js and npm
- PostgreSQL
- Git
- Visual Studio Code (recommended)

### Step 1: Clone the Repository

```bash
git clone https://github.com/Ishtiaque001/E-Rickshaw-Monitoring-and-Control-Platform.git
```

### Step 2: Navigate to the Project Directory

```bash
cd E-Rickshaw-Monitoring-and-Control-Platform
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Configure Environment Variables

Create a `.env` file in the root directory and configure the PostgreSQL connection.

Example:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_database_password
DB_NAME=e_rickshaw_db
```

Add authentication-related environment variables according to the configuration implemented in the project.

**Important:** Never upload the actual `.env` file or secret credentials to GitHub.

### Step 5: Create the Database

Open pgAdmin or PostgreSQL and create a database named:

```sql
CREATE DATABASE e_rickshaw_db;
```

### Step 6: Run the Application

For development:

```bash
npm run start:dev
```

For production mode:

```bash
npm run start:prod
```

The default development server runs at:

```text
http://localhost:3000
```

## 🔗 REST API Endpoints

The following are the main resource endpoints used in the project.

| HTTP Method | Endpoint | Description |
|---|---|---|
| GET | `/owners` | Retrieve all owners |
| GET | `/owners/:id` | Retrieve a specific owner |
| POST | `/owners` | Register a new owner |
| PUT | `/owners/:id` | Update owner information |
| DELETE | `/owners/:id` | Delete an owner |
| GET | `/rickshaws` | Retrieve all rickshaws |
| GET | `/rickshaws/:id` | Retrieve a specific rickshaw |
| POST | `/rickshaws` | Register a new rickshaw |
| PUT | `/rickshaws/:id` | Update rickshaw information |
| DELETE | `/rickshaws/:id` | Delete a rickshaw |

Additional endpoints for authentication, users, and audit logs depend on their respective module implementations.

## 🧪 API Testing

Postman can be used to test the REST APIs.

The testing process includes:

1. Starting the backend application.
2. Connecting the application to PostgreSQL.
3. Sending HTTP requests through Postman.
4. Verifying HTTP response codes and returned data.
5. Checking database changes using pgAdmin.
6. Testing validation and error-handling scenarios.

Where Swagger is configured, interactive API documentation can also be used.

## 🔐 Security Considerations

The system architecture includes support for:

- User authentication.
- Password hashing.
- Role-based authorization.
- Input validation.
- Environment-based configuration.
- Tracking system activities through audit logs.

The enforcement of these security features depends on the corresponding guards, services, and validation rules implemented in the backend.

## 🔄 Development Workflow

The project uses Git and GitHub for collaborative development.

- `main` — Stable project branch.
- `dev` — Shared development and integration branch.

Team members collaborate on the development branch, and tested changes can be merged into the main branch.

## 🎯 Project Objectives

- Digitize e-rickshaw ownership and registration records.
- Improve the accuracy of vehicle information.
- Maintain structured relationships between owners and vehicles.
- Support secure and organized system management.
- Improve operational recordkeeping.
- Provide a scalable foundation for future transportation management features.


## 📚 References

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Node.js Documentation](https://nodejs.org/en/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---

**E-Rickshaw Monitoring and Control Platform**

*Building a more organized and efficient foundation for electric transportation management.*
