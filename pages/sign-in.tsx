'use client';

import { PasswordField } from '@/components/authentication/PasswordField';
import { Logo } from '@/components/icons/Icons';
/*eslint-disable*/

import Link from '@/components/link/Link';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
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
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { login } from './api/authAPI';

export default function Login() {
  const [inputCode, setInputCode] = useState<string>('');
  const passwordRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const router = useRouter();
  const inputColor = useColorModeValue('navy.700', 'white');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      window.location.href = '/';
    }
  }, []);

  const handleSubmit = async (Event: any) => {
    Event.preventDefault();

    const data = {
      username: Event.target.username.value,
      password: passwordRef.current?.value,
    };

    await login(data)
      .then((res) => {
        localStorage.setItem('access_token', res.result.access_token);
        localStorage.setItem('exp', res.timestamp.toString());
        window.location.href = '/';
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
      {/* <Alert status="error">
        <AlertIcon />
        <AlertTitle>Your browser is outdated!</AlertTitle>
      </Alert> */}
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
                  <Input id="username" name="username" color={inputColor} />
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
                  <Link href="sign-up" color="fg.muted">
                    {' '}
                    Don't have an account? Sign up
                  </Link>
                </Text>
              </Stack>
            </form>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}
