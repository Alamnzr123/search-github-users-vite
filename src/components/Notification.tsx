import { Alert } from "flowbite-react";

export type Notification = {
  id: string;
  type?: "info" | "success" | "failure";
  title?: string;
  message: string;
};

export default function Notification({ note }: { note?: Notification | null }) {
  if (!note) return null;

  const color = note.type === "success" ? "success" : note.type === "failure" ? "failure" : "info";

  return (
    <div className="fixed top-4 right-4 z-50">
      <Alert color={color as 'info' | 'success' | 'failure'} className="max-w-md">
        <span className="font-semibold">{note.title ?? "Notice"}</span>
        <div className="mt-1">{note.message}</div>
      </Alert>
    </div>
  );
}
