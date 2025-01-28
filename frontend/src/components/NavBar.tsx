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
} from "@chakra-ui/react";
import ColorModeSwitch from "./ColorModeSwitch";
import { FaSignOutAlt, FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const NavBar = () => {
  const navigate = useNavigate();
  const { logout, token, exp } = useAuth();
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
    if (token && exp * 1000 < Date.now()) {
      logout();
      navigate("/login");
    }
  }, [token, exp, logout, navigate]);

  return (
    <>
      <Flex as="nav" p="4" alignItems="center">
        <Spacer />
        <ColorModeSwitch />
        {token && (
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
