const HOST: string = process.env.NEXT_PUBLIC_API_URL || '';

export const VERSION = '/v1';
export const BASE = '/api';
export const BASE_URL = HOST + BASE + VERSION;

// Chat-Answer
export const CHAT = '/answer';

// Authentication
export const AUTH = '/auth';
export const LOGIN = AUTH + '/login';
export const SIGNUP = AUTH + '/signup';

// CONVERSATIONS
export const CONVERSATION = `/conversation`;
export const CONVERSATIONS_ALL = CONVERSATION + '/all';

//USER
export const USER = `/user`;
export const ME = USER + `/me`;
