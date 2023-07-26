'use client';
import { PasswordField } from '@/components/authentication/PasswordField';
import { Logo } from '@/components/icons/Icons';
/*eslint-disable*/

import Link from '@/components/link/Link';

import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { signUp } from './api/authAPI';

export default function Login() {
  const [inputCode, setInputCode] = useState<string>('');
  const passwordRef = useRef<HTMLInputElement>(null);
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
      password: passwordRef.current?.value,
      username: Event.target.username.value,
      email: Event.target.email.value,
    };

    await signUp(data)
      .then((res) => {
        router.push('/sign-in');
      })
      .catch((error) => {
        alert(error.response.data.message);
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
            <Heading fontSize={{ base: 'xs', md: 'xl' }}>
              Create your account
            </Heading>
          </Stack>
        </Stack>
        <Box
          px={{ base: '4', sm: '10' }}
          bg={{ base: 'transparent', sm: 'bg.surface' }}
          boxShadow={{ base: 'none', sm: 'md' }}
          borderRadius={{ base: 'none', sm: 'xl' }}
        >
          <form onSubmit={handleSubmit}>
            <Stack spacing="6">
              <Stack spacing="5">
                <FormControl>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    color={inputColor}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Username</FormLabel>
                  <Input id="username" name="username" color={inputColor} />
                </FormControl>
                <PasswordField ref={passwordRef} />
              </Stack>

              <Stack spacing="6">
                <Button variant="primary">Sign up</Button>
                <HStack>
                  <Divider />
                  <Text textStyle="sm" whiteSpace="nowrap" color="fg.muted">
                    <Link href={'/sign-in'} color="fg.muted">
                      {' '}
                      Already have an account? Login
                    </Link>
                  </Text>
                  <Divider />
                </HStack>
                {/* <OAuthButtonGroup /> */}
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Container>
  );
}
