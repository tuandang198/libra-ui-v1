export type OpenAIModel = 'gpt-3.5-turbo' | 'gpt-4';

export interface ChatBody {
  inputCode: string;
  model: OpenAIModel;
  apiKey?: string | undefined;
}

export interface BaseResponse<T> {
  result: T;
  statusCode: string;
  message: string;
  timestamp: Date;
}

export interface BaseResponseJwt {
  username: string;
  userId: string;
}

export interface ChatRequest {
  conversationId: string;
  question: string;
  relevant_degree: number;
}

export interface ChatResponse {
  message: {
    id: string;
    conversationId: string;
    content: string;
    bot: boolean;
    createdAt: number;
    references: Reference[];
  };
  replyToId: string;
}

export interface Reference {
  idInMessage: string;
  title: string;
  url: string;
}

export interface LoginRequest {
  username?: string;
  password?: string;
}

export interface LoginResponse {
  access_token: string;
}

export interface SignUpRequest {
  username: string;
  email: string;
  password?: string;
}

export interface SignUpResponse {
  username: string;
  email: string;
  password: string;
}

export interface UserResponse {
  user: {
    username: string;
    fullname: string;
    email: string;
    telephone: string;
    role: string;
    updatedAt: number;
  };
}

export interface MessageResponse {
  id: string;
  title: string;
  updatedAt: number;
  userId: string;
  messages: [
    {
      id: string;
      conversationId: string;
      content: string;
      bot: boolean;
      createdAt: number;
      references: Reference[];
    },
  ];
}

export interface AllChatHistoryResponse {
  conversations: MessageResponse[];
}

export interface AllMessageResponse {
  conversation: MessageResponse;
}

export type ChatGPTAgent = 'user' | 'system' | 'assistant';

export interface ChatGPTMessage {
  role: ChatGPTAgent;
  content: string;
}
