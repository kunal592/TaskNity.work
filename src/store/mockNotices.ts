export interface Notice {
  id: number;
  title: string;
  message: string;
  type: "warning" | "assignment";
  scope: "global" | "member";
  member?: string;
  date: string;
  status: "pending" | "responded";
  feedback?: string;
}

export let notices: Notice[] = [
  {
    id: 1,
    title: "Late Task Submission",
    message: "Design documentation was submitted late.",
    type: "warning",
    scope: "member",
    member: "Kunal Daharwal",
    date: "2025-11-01",
    status: "responded",
    feedback: "Understood",
  },
  {
    id: 2,
    title: "New Assignment: UI Polish",
    message: "Refine the dashboard layout and improve chart visuals.",
    type: "assignment",
    scope: "global",
    date: "2025-11-02",
    status: "pending",
  },
];
