'use client';
import { BASE_URL, LOGIN } from '@/common/constants/api-const';
import { OAuthButtonGroup } from '@/components/authentication/OAuthButtonGroup';
import { PasswordField } from '@/components/authentication/PasswordField';
import { Logo } from '@/components/icons/Icons';
/*eslint-disable*/

import Link from '@/components/link/Link';
import { BaseResponse, LoginResponse } from '@/types/types';
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { login } from './api/authAPI';

export default function Login() {
  const [inputCode, setInputCode] = useState<string>('');
  const passwordRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const router = useRouter();

  const handleSubmit = async (Event: any) => {
    Event.preventDefault();

    const data = {
      username: Event.target.username.value,
      password: passwordRef.current?.value,
    };

    await login(data)
      .then((res) => {
        localStorage.setItem('access_token', res.result.access_token);
		// console.log(res.timestamp.toString());
		
        localStorage.setItem('exp', res.timestamp.toString());
        router.push('/');
      })
      .catch((error) => {
        console.error('An error occurred:', error);
        if (error.response) {
          alert(error.response.data.message);
          return;
        }
        alert(error.message);
      });
  };

  return (
    <Container
      maxW="lg"
      py={{ base: '12', md: '24' }}
      px={{ base: '0', sm: '8' }}
    >
      <Stack spacing="8">
        <Stack spacing="6">
          <Logo />
          <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
            <Heading fontSize={{ base: 'm', md: 'xl' }}>
              Log in to your account
            </Heading>
          </Stack>
        </Stack>
        <Box
          px={{ base: '4', sm: '10' }}
          bg={{ base: 'transparent', sm: 'bg.surface' }}
          boxShadow={{ base: 'none', sm: 'md' }}
          borderRadius={{ base: 'none', sm: 'xl' }}
        >
          <Stack spacing="6">
            <form onSubmit={handleSubmit}>
              <Stack spacing="5">
                <FormControl>
                  <FormLabel>Username</FormLabel>
                  <Input id="username" name="username" />
                </FormControl>

                <PasswordField ref={passwordRef} />
              </Stack>
              <HStack justify="space-between">
                <Checkbox defaultChecked>Remember me</Checkbox>
                {/* <Button variant="text" size="sm">
                Forgot password?
              </Button> */}
              </HStack>
              <Stack spacing="6">
                <Button variant="primary" type="submit">
                  Sign in
                </Button>
                <Text color="fg.muted">
                  <Link href="/sign-up" color="fg.muted">
                    {' '}
                    Don't have an account? Sign up
                  </Link>
                </Text>
                {/* <HStack>
                <Divider />
                <Text textStyle="sm" whiteSpace="nowrap" color="fg.muted">
                  or continue with
                </Text>
                <Divider />
              </HStack>
              <OAuthButtonGroup /> */}
              </Stack>
            </form>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}
