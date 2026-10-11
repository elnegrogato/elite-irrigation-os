// src/pages/tech/techAuth.ts
const KEY = "elite.tech.assignedTo";

export function getAssignee(): string | null {
  return localStorage.getItem(KEY);
}
export function setAssignee(v: string) {
  localStorage.setItem(KEY, v);
}
export function clearAssignee() {
  localStorage.removeItem(KEY);
}