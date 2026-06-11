import type { StrapiLogo } from "./global";

export interface ChatRequest {
  message: string;
  mode: string;
  session_id?: number;
}

export interface ChatResponse {
  reply: string;
  mode: string;
  session_id?: number;
}

export interface ChatBoxSetting {
  id: number;
  documentId: string;
  logo: StrapiLogo;
  theme_color: string | null;
  instruction_support: string;
  instruction_product: string;
  system_constraints: string;
}

export interface IChatMessage {
  role: 'user' | 'model'; 
  message: string;        
  id?: string | number;   
  createdAt?: string;    
}