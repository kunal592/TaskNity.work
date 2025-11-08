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
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<Your Clerk Publishable Key>
    CLERK_SECRET_KEY=<Your Clerk Secret Key>

    # Database (NeonDB)
    DATABASE_URL=<Your NeonDB Connection String>
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

    The application should now be running at `http://localhost:9005`.

6.  **VS Code Extensions (Recommended):**

    For an optimal development experience, it is recommended to install the following VS Code extensions:

    *   [Prisma](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma)
    *   [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
    *   [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
