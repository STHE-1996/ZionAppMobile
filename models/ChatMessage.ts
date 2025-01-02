export interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    message: string;
    timestamp: number;
    status: string;
  }
  export interface SendMessage{
    senderId: string;
    receiverId: string;
    message: string;
  }