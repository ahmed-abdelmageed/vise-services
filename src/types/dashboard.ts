
export type ClientSection = "dashboard" | "services" | "invoices" | "requests" | "support" | "settings";

export interface UserData {
  name: string;
  email: string;
  phone: string;
  avatar: string;
}
