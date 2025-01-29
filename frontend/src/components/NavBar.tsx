import { useRef, useState, useEffect } from "react";
import {
  Flex,
  Spacer,
  IconButton,
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
} from "@chakra-ui/react";
import ColorModeSwitch from "./ColorModeSwitch";
import { FaSignOutAlt, FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const NavBar = () => {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const onCloseLogout = () => setIsLogoutOpen(false);

  const onConfirmLogout = () => {
    onCloseLogout();
    logout();
    navigate("/login");
  };

  const handleLogoutClick = () => setIsLogoutOpen(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <>
      <Flex as="nav" p="4" alignItems="center">
      <Text fontWeight="bold">Workout Buddy</Text>
        <Spacer />
        <ColorModeSwitch />
        {isAuthenticated && (
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<FaBars />}
              variant="outline"
              ml={4}
              aria-label="Options"
            />
            <MenuList>
              <MenuItem icon={<FaSignOutAlt />} onClick={handleLogoutClick}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        )}
      </Flex>

      <AlertDialog
        isOpen={isLogoutOpen}
        leastDestructiveRef={cancelRef}
        onClose={onCloseLogout}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Logout
            </AlertDialogHeader>

            <AlertDialogBody>Are you sure you want to log out?</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onCloseLogout}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={onConfirmLogout} ml={3}>
                Yes
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default NavBar;
