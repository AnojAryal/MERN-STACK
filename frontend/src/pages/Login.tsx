import { useState, ChangeEvent, FormEvent } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  IconButton,
  InputGroup,
  InputRightElement,
  Text,
  Spinner,
  FormErrorMessage,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    showPassword: false,
  });

  const { login, isLoading, authError, formErrors } = useLogin();
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await login(
      { username: formData.username, password: formData.password },
      navigate
    );
  };

  const togglePasswordVisibility = () => {
    setFormData((prevState) => ({
      ...prevState,
      showPassword: !prevState.showPassword,
    }));
  };

  return (
    <Box
      maxWidth="400px"
      width="100%"
      padding="6"
      borderRadius="md"
      boxShadow="lg"
      backgroundColor={useColorModeValue("white", "gray.800")}
      margin="auto"
      marginTop="8"
    >
      <Heading as="h1" size="lg" mb="6" textAlign="center">
        Login
      </Heading>
      <form onSubmit={handleSubmit}>
        <Stack spacing="4">
          {/* Username Input */}
          <FormControl isInvalid={!!formErrors.username}>
            <FormLabel htmlFor="username">Username</FormLabel>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              autoComplete="username"
            />
            {formErrors.username && (
              <FormErrorMessage>{formErrors.username}</FormErrorMessage>
            )}
          </FormControl>

          {/* Password Input */}
          <FormControl isInvalid={!!formErrors.password}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <InputGroup>
              <Input
                id="password"
                name="password"
                type={formData.showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <InputRightElement>
                <IconButton
                  aria-label={
                    formData.showPassword ? "Hide password" : "Show password"
                  }
                  icon={formData.showPassword ? <FaEye /> : <FaEyeSlash />}
                  size="sm"
                  onClick={togglePasswordVisibility}
                />
              </InputRightElement>
            </InputGroup>
            {formErrors.password && (
              <FormErrorMessage>{formErrors.password}</FormErrorMessage>
            )}
          </FormControl>

          {/* Authentication Error Message */}
          {authError && (
            <Text color="red.500" textAlign="center">
              {authError}
            </Text>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            colorScheme="teal"
            width="100%"
            isLoading={isLoading}
            spinner={<Spinner size="sm" />}
          >
            Login
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default Login;
