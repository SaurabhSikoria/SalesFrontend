import React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  useColorModeValue,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    //Making api calls and getting a user in response
    const token = 'osijdf89289fnjsndoshjof928823293982hf92h92';
    localStorage.setItem('token', token);
    navigate('/');
  };

  const formBg = useColorModeValue('white', 'gray.700');
  const pageBg = useColorModeValue('gray.100', 'gray.900');

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      bg={pageBg}
      p={4}
    >
      <Box
        w="100%"
        maxW="md"
        p={8}
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
        bg={formBg}
      >
        <Heading mb={6}>Login</Heading>
        <FormControl mb={4}>
          <FormLabel>Email</FormLabel>
          <Input type="email" placeholder="Enter your email" />
        </FormControl>
        <FormControl mb={6}>
          <FormLabel>Password</FormLabel>
          <Input type="password" placeholder="Enter your password" />
        </FormControl>
        <Button colorScheme="blue" onClick={handleLogin} mt={5} w="full">
          Login
        </Button>
      </Box>
    </Box>
  );
};

export default LoginPage;
