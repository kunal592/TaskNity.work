// ---------------------------------------------
// TaskNity.Work Prisma Schema
// Database: PostgreSQL (NeonDB)
// ORM: Prisma
// ---------------------------------------------

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ---------------------------------------------
// ENUMS
// ---------------------------------------------
enum Role {
  ADMIN
  MEMBER
  VIEWER
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  DONE
}

enum Priority {
  LOW
  MEDIUM
  HIGH
}

enum SalaryStatus {
  CREDITED
  PENDING
}

enum ExpenseStatus {
  APPROVED
  PENDING
  REJECTED
}

enum InvoiceStatus {
  PAID
  UNPAID
  PENDING
}

// ---------------------------------------------
// MODELS
// ---------------------------------------------

model User {
  id              String         @id @default(uuid())
  name            String
  email           String         @unique
  password        String
  role            Role           @default(MEMBER)
  avatar          String?
  joinDate        DateTime       @default(now())
  salary          Float?         @default(0)
  salaryStatus    SalaryStatus?  @default(PENDING)
  tasksAssigned   Task[]         @relation("TaskAssignees")
  tasksCreated    Task[]         @relation("TaskCreator")
  projects        ProjectMember[]
  attendance      Attendance[]
  notices         Notice[]       @relation("NoticeRecipient")
  comments        Comment[]
  financeRequests Expense[]      @relation("ExpenseRequester")
  warnings        Warning[]      @relation("UserWarnings")
  feedbacks       Feedback[]
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
}

model Project {
  id          String           @id @default(uuid())
  title       String
  description String?
  visibility  Boolean          @default(true)
  progress    Float            @default(0)
  tasks       Task[]
  members     ProjectMember[]
  createdBy   User?            @relation(fields: [createdById], references: [id])
  createdById String?
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt
}

model ProjectMember {
  id         String   @id @default(uuid())
  user       User     @relation(fields: [userId], references: [id])
  userId     String
  project    Project  @relation(fields: [projectId], references: [id])
  projectId  String
  role       Role     @default(MEMBER)
  joinedAt   DateTime @default(now())

  @@unique([userId, projectId])
}

model Task {
  id             String         @id @default(uuid())
  title          String
  description    String?
  status         TaskStatus     @default(TODO)
  priority       Priority       @default(MEDIUM)
  dueDate        DateTime?
  classified     Boolean        @default(false)
  draft          Boolean        @default(false)
  project        Project?       @relation(fields: [projectId], references: [id])
  projectId      String?
  createdBy      User           @relation("TaskCreator", fields: [createdById], references: [id])
  createdById    String
  assignees      User[]         @relation("TaskAssignees")
  comments       Comment[]
  attachments    Attachment[]
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt
}

model Comment {
  id        String   @id @default(uuid())
  content   String
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  task      Task     @relation(fields: [taskId], references: [id])
  taskId    String
  createdAt DateTime @default(now())
}

model Attachment {
  id        String   @id @default(uuid())
  url       String
  fileType  String
  fileSize  Float?
  task      Task     @relation(fields: [taskId], references: [id])
  taskId    String
  uploadedAt DateTime @default(now())
}

// ---------------------------------------------
// ADMIN MODULES
// ---------------------------------------------
model Notice {
  id          String      @id @default(uuid())
  title       String
  message     String
  type        String      // e.g. "Warning", "Assignment", "Update"
  targetUser  User?       @relation("NoticeRecipient", fields: [targetUserId], references: [id])
  targetUserId String?
  feedbacks   Feedback[]
  createdBy   User        @relation(fields: [createdById], references: [id])
  createdById String
  createdAt   DateTime    @default(now())
}

model Feedback {
  id         String   @id @default(uuid())
  message    String
  user       User     @relation(fields: [userId], references: [id])
  userId     String
  notice     Notice   @relation(fields: [noticeId], references: [id])
  noticeId   String
  createdAt  DateTime @default(now())
}

model Warning {
  id         String   @id @default(uuid())
  message    String
  user       User     @relation("UserWarnings", fields: [userId], references: [id])
  userId     String
  createdAt  DateTime @default(now())
}

// ---------------------------------------------
// ATTENDANCE
// ---------------------------------------------
model Attendance {
  id         String   @id @default(uuid())
  date       DateTime @default(now())
  status     String   // "Present", "Remote", "Absent"
  user       User     @relation(fields: [userId], references: [id])
  userId     String
}

// ---------------------------------------------
// FINANCE MODULE
// ---------------------------------------------
model Expense {
  id          String         @id @default(uuid())
  title       String
  description String?
  amount      Float
  status      ExpenseStatus  @default(PENDING)
  requestedBy User           @relation("ExpenseRequester", fields: [requestedById], references: [id])
  requestedById String
  approvedBy  User?          @relation(fields: [approvedById], references: [id])
  approvedById String?
  date        DateTime       @default(now())
}

model Invoice {
  id          String         @id @default(uuid())
  clientName  String
  amount      Float
  status      InvoiceStatus  @default(PENDING)
  issuedDate  DateTime       @default(now())
  paidDate    DateTime?
  createdBy   User?          @relation(fields: [createdById], references: [id])
  createdById String?
}

// ---------------------------------------------
// LEADERBOARD
// ---------------------------------------------
model Leaderboard {
  id        String  @id @default(uuid())
  user      User    @relation(fields: [userId], references: [id])
  userId    String
  score     Int     @default(0)
  rank      Int?
  updatedAt DateTime @updatedAt
}
