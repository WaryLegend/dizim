import type { StrapiLogo } from "./global";

export interface ChatRequest {
  chatInput: string;
  session_id?: string | number;
}

export interface ChatResponse {
  bot_response: string;
  image_urls: string[];
  session_id?: string;
}

export interface chatSession {
  session_id: string | number;
  session_name: string;
}

export interface ChatBoxSetting {
  logo: StrapiLogo;
  theme_color: string | null;
  system_instruction: string;
  system_constraints: string;
}

export interface IChatMessage {
  role: 'user' | 'model'; 
  message: string;        
  id?: string | number;   
  createdAt?: string;  
  image_urls?: string[];  
}