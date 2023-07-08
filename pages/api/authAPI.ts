import { BASE_URL, LOGIN, SIGNUP } from '@/common/constants/api-const';
import {
  LoginRequest,
  BaseResponse,
  LoginResponse,
  SignUpResponse,
  SignUpRequest,
} from '@/types/types';
import axios from 'axios';

export const login = async (
  loginForm: LoginRequest,
): Promise<BaseResponse<LoginResponse>> => {
  const response = await axios.post<BaseResponse<LoginResponse>>(
    BASE_URL + LOGIN,
    loginForm,
  );
  return response.data;
};

export const signUp = async (
  signUpForm: SignUpRequest,
): Promise<SignUpResponse> => {
  const response = await axios.post<SignUpResponse>(
    BASE_URL + SIGNUP,
    signUpForm,
  );
  return response.data;
};

const accessToken =
  typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

export const axiosInstance = axios.create({
  baseURL: BASE_URL, // Replace with your API's base URL
  headers: {
    common: {
      Authorization: `Bearer ${accessToken}`, // Set the token in the header
    },
  },
});
