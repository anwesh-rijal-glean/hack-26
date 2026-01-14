import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function formatTimestamp(ts: string): string {
  const date = new Date(ts);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "just now";
}

export function getTasksCompleted(progress: boolean[]): number {
  return progress.filter(Boolean).length;
}

export function getNextMilestone(tasks: { id: number; title: string; locked?: boolean }[], progress: boolean[]): string {
  for (let i = 0; i < progress.length; i++) {
    if (!progress[i]) {
      return tasks[i]?.title || `Task ${i + 1}`;
    }
  }
  return "All tasks completed! 🎉";
}

