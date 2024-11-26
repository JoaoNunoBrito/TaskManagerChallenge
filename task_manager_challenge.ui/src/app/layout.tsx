import type { Metadata } from "next";
import "./globals.css";
import { TaskProvider } from "@/context/TaskContext";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Task Manager Challenge",
  description: "Task Manager Challenge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
          <AuthProvider>
            <TaskProvider>
              {children}
            </TaskProvider>
          </AuthProvider>
      </body>
    </html>
  );
}
