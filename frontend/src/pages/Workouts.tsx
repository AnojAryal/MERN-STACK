import { useState } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  IconButton,
  useToast,
  useColorModeValue,
  Grid,
  GridItem,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Flex,
} from "@chakra-ui/react";
import { FaEdit, FaTrash } from "react-icons/fa";
import apiClient from "../services/apiClient";
import { useWorkouts, Workout } from "../hooks/useGetWorkouts";

const WorkoutsPage = () => {
  const { workouts, error, isLoading, refetch } = useWorkouts();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [newWorkout, setNewWorkout] = useState({
    title: "",
    reps: "",
    load: "",
  });
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const toast = useToast();
  const {
    isOpen: isEditModalOpen,
    onOpen: onEditModalOpen,
    onClose: onEditModalClose,
  } = useDisclosure();

  const userData = localStorage.getItem("user");
  const userInfo = userData ? JSON.parse(userData) : null;
  const user = userInfo?.username

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Handle the deletion of a workout
  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      const token = localStorage.getItem("accessToken");
      await apiClient.delete(`/api/workouts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast({
        title: "Workout Deleted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      refetch();
    } catch {
      toast({
        title: "Error deleting workout",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsDeleting(null);
    }
  };

  // Handle adding a new workout
  const handleAddWorkout = async () => {
    const reps = parseFloat(newWorkout.reps);
    const load = parseFloat(newWorkout.load);

    if (
      !newWorkout.title ||
      isNaN(reps) ||
      reps <= 0 ||
      isNaN(load) ||
      load <= 0
    ) {
      toast({
        title: "Please fill in all fields correctly",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const userData = localStorage.getItem("user");
      const userInfo = userData ? JSON.parse(userData) : null;
      const user = userInfo?.id;

      if (!user) {
        toast({
          title: "User not authenticated",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      await apiClient.post(
        "/api/workouts",
        { ...newWorkout, user },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast({
        title: "Workout added successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setNewWorkout({ title: "", reps: "", load: "" });
      refetch();
    } catch (err) {
      toast({
        title: "Failed to add workout",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Handle editing a workout
  const handleEditWorkout = async () => {
    if (!editingWorkout) return;

    try {
      const token = localStorage.getItem("accessToken");
      const userData = localStorage.getItem("user");
      const user = userData ? JSON.parse(userData) : null;
      const userId = user?.id;

      if (!userId) {
        toast({
          title: "User not authenticated",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      await apiClient.patch(
        `/api/workouts/${editingWorkout._id}`,
        { ...newWorkout, userId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast({
        title: "Workout updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setEditingWorkout(null);
      setNewWorkout({ title: "", reps: "", load: "" });
      onEditModalClose();
      refetch();
    } catch {
      toast({
        title: "Failed to update workout",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (isLoading) {
    return (
      <Flex
        justify="center"
        align="center"
      >
        <Spinner size="lg" />
      </Flex>
    );
  }
  
  if (error)
    return (
      <Alert status="error">
        <AlertIcon />
        {error.message}
      </Alert>
    );

  return (
    <Grid
      templateColumns={{ base: "1fr", md: "2fr 1fr" }}
      gap={6}
      maxW="1200px"
      mx="auto"
      py={8}
    >
      <GridItem>
        <Heading mb={4}>Workouts of {user}</Heading>
        <VStack spacing={4} align="stretch">
          {workouts?.length ? (
            workouts.map((workout) => (
              <Box
                key={workout._id}
                p={4}
                borderRadius="lg"
                bg={bgColor}
                border="1px solid"
                borderColor={borderColor}
              >
                <HStack justify="space-between">
                  <VStack align="start" spacing={1}>
                    <Heading size="md">{workout.title}</Heading>
                    <Text fontSize="sm">
                      <strong>Reps:</strong> {workout.reps},{" "}
                      <strong>Load:</strong> {workout.load} kg
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      Created: {new Date(workout.createdAt).toLocaleString()}
                    </Text>
                  </VStack>
                  <HStack>
                    <IconButton
                      aria-label="Edit"
                      icon={<FaEdit />}
                      size="sm"
                      colorScheme="blue"
                      onClick={() => {
                        setEditingWorkout(workout);
                        setNewWorkout({
                          title: workout.title,
                          reps: workout.reps.toString(),
                          load: workout.load.toString(),
                        });
                        onEditModalOpen();
                      }}
                    />
                    <IconButton
                      aria-label="Delete"
                      icon={<FaTrash />}
                      size="sm"
                      colorScheme="red"
                      isLoading={isDeleting === workout._id}
                      onClick={() => handleDelete(workout._id)}
                    />
                  </HStack>
                </HStack>
              </Box>
            ))
          ) : (
            <Text>No workouts found.</Text>
          )}
        </VStack>
      </GridItem>

      {/* Right Column: Add Workout Form */}
      <GridItem>
        <Box
          p={4}
          borderRadius="lg"
          bg={bgColor}
          border="1px solid"
          borderColor={borderColor}
        >
          <Heading size="md" mb={4}>
            Add Workout
          </Heading>
          <VStack spacing={3}>
            <Input
              placeholder="Enter Title"
              value={newWorkout.title}
              onChange={(e) =>
                setNewWorkout({ ...newWorkout, title: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="Enter Reps"
              value={newWorkout.reps}
              onChange={(e) =>
                setNewWorkout({ ...newWorkout, reps: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="Enter Load (kg)"
              value={newWorkout.load}
              onChange={(e) =>
                setNewWorkout({ ...newWorkout, load: e.target.value })
              }
            />
            <Button colorScheme="teal" onClick={handleAddWorkout} width="full">
              Add Workout
            </Button>
          </VStack>
        </Box>
      </GridItem>

      {/* Edit Workout Modal */}
      <Modal isOpen={isEditModalOpen} onClose={onEditModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Workout</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={3}>
              <Input
                placeholder="Enter Title"
                value={newWorkout.title}
                onChange={(e) =>
                  setNewWorkout({ ...newWorkout, title: e.target.value })
                }
              />
              <Input
                type="number"
                placeholder="Enter Reps"
                value={newWorkout.reps}
                onChange={(e) =>
                  setNewWorkout({ ...newWorkout, reps: e.target.value })
                }
              />
              <Input
                type="number"
                placeholder="Enter Load (kg)"
                value={newWorkout.load}
                onChange={(e) =>
                  setNewWorkout({ ...newWorkout, load: e.target.value })
                }
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleEditWorkout}>
              Update Workout
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Grid>
  );
};

export default WorkoutsPage;
