# TaskNity.Work

TaskNity.Work is a full-stack project management application designed to streamline your workflow and enhance productivity. It features a robust backend powered by Prisma and a secure authentication system using Clerk. This document provides a comprehensive guide to setting up and running the project in a VS Code environment.

## Features

*   **Project Management:** Create, manage, and track projects and tasks.
*   **User Roles:** Role-based access control (ADMIN, MEMBER) to manage user permissions.
*   **Real-time Updates:** (To be implemented) Real-time notifications and updates.
*   **File Attachments:** Attach files to tasks.
*   **Leaderboard:** A user ranking system based on completed tasks.
*   **Attendance & Leave Management:** Track employee attendance and manage leave requests.
*   **Finance & Expense Tracking:** Manage company finances, track expenses, and generate invoices.
*   **Admin Notices:** A system for admins to broadcast notices to users.

## API Endpoints

The backend provides the following API endpoints:

*   **Authentication:**
    *   `GET /api/auth/me`: Get the current user.
    *   `POST /api/auth/logout`: Log the user out.
    *   Clerk handles `login` and `register` functionality.
*   **Analytics:**
    *   `GET /api/analytics`: Get application analytics.
*   **Attendance:**
    *   `GET /api/attendance`: Get all attendance records.
    *   `POST /api/attendance`: Mark attendance.
    *   `GET /api/attendance/{userId}`: Get attendance for a specific user.
*   **Expenses:**
    *   `GET /api/expenses`: Get all expenses.
    *   `POST /api/expenses`: Create a new expense.
    *   `PUT /api/expenses/{expenseId}`: Update an expense.
*   **Invoices:**
    *   `GET /api/invoices`: Get all invoices.
    *   `POST /api/invoices/pdf`: Generate a PDF invoice.
*   **Leaves:**
    *   `GET /api/leaves`: Get all leave requests.
    *   `POST /api/leaves`: Create a new leave request.
    *   `PUT /api/leaves/{leaveId}`: Update a leave request.
*   **Notices:**
    *   `GET /api/notices`: Get all notices.
    *   `POST /api/notices`: Create a new notice.
    *   `GET /api/notices/{id}`: Get a specific notice.
    *   `DELETE /api/notices/{id}`: Delete a notice.
*   **Payroll:**
    *   `GET /api/payroll`: Get payroll information.
*   **Projects:**
    *   `GET /api/projects`: Get all projects.
    *   `POST /api/projects`: Create a new project.
    *   `GET /api/projects/{id}`: Get a specific project.
    *   `DELETE /api/projects/{id}`: Delete a project.
    *   `GET /api/projects/{projectId}/tasks`: Get all tasks for a project.
*   **Tasks:**
    *   `GET /api/tasks`: Get all tasks.
    *   `POST /api/tasks`: Create a new task.
    *   `GET /api/tasks/classified`: Get classified tasks.
    *   `GET /api/tasks/{taskId}`: Get a specific task.
    *   `PUT /api/tasks/{taskId}`: Update a task.
    *   `DELETE /api/tasks/{taskId}`: Delete a task.
*   **Users:**
    *   `GET /api/users`: Get all users.
    *   `POST /api/users`: Create a new user.
    *   `GET /api/users/leaderboard`: Get the user leaderboard.
    *   `GET /api/users/payroll`: Get user payroll information.
    *   `GET /api/users/{id}`: Get a specific user.
    *   `PUT /api/users/{id}`: Update a user.
    *   `DELETE /api/users/{id}`: Delete a user.

## Tech Stack

*   **Frontend:** Next.js, React
*   **Backend:** Node.js, Express.js
*   **Database:** PostgreSQL (NeonDB)
*   **ORM:** Prisma
*   **Authentication:** Clerk

## Project Setup in VS Code

These instructions will guide you through setting up the project for development in VS Code.

### Prerequisites

*   [Node.js](https://nodejs.org/en/) (v16 or later)
*   [npm](https://www.npmjs.com/)
*   [VS Code](https://code.visualstudio.com/)
*   A free [NeonDB](https://neon.tech/) account for the PostgreSQL database.
*   A free [Clerk](https://clerk.com/) account for authentication.

### Step-by-Step Instructions

1.  **Clone the Repository:**

    ```bash
    git clone <repository-url>
    cd <repository-folder>
    ```

2.  **Install Dependencies:**

    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**

    Create a `.env.local` file in the root of your project and add the following environment variables. You can get these values from your Clerk and NeonDB dashboards.

    ```
    # Clerk
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
    CLERK_SECRET_KEY=YOUR_SECRET_KEY
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

    # Database (NeonDB)
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
    ```

4.  **Set up Prisma:**

    a.  **Generate Prisma Client:**

        ```bash
        npx prisma generate
        ```

    b.  **Push the database schema:**

        This command will sync your Prisma schema with your NeonDB database.

        ```bash
        npx prisma db push
        ```

5.  **Run the Development Server:**

    ```bash
    npm run dev
    ```

    The application should now be running at `http://localhost:3000`.

6.  **VS Code Extensions (Recommended):**

    For an optimal development experience, it is recommended to install the following VS Code extensions:

    *   [Prisma](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma)
    *   [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
    *   [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
