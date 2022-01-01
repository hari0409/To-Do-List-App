import {Alert,AlertIcon,Button,ButtonGroup,Center,FormControl,FormHelperText,FormLabel,Input,Modal,ModalBody,ModalCloseButton,ModalContent,ModalFooter,ModalHeader,ModalOverlay,Switch,Text,Textarea,} from "@chakra-ui/react";
import React,{useState,useEffect} from 'react'
import { supabaseClient } from "../lib/client";


const ManageTodo = ({ isOpen, onClose, initialRef, todo, setTodo }) => {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [isComplete, setIsComplete] = useState(false);
    const [isLoading, setIsLoading] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
  
    useEffect(() => {
      if (todo) {
        setTitle(todo.title);
        setDesc(todo.desc);
        setIsComplete(todo.isComplete);
      }
    }, [todo]);
  
    const submitHandler = async (event) => {
      event.preventDefault();
      setErrorMessage("");
      if (desc.length <= 10) {
        setErrorMessage("Description must have more than 10 characters");
        return;
      }
      setIsLoading(true);
      const user = supabaseClient.auth.user();
      let supabaseError;
      if (todo) {
        const { error } = await supabaseClient
          .from("todos")
          .update({ title, desc, isComplete, user_id: user.id })
          .eq("id", todo.id);
        supabaseError = error;
      } else {
        const { error } = await supabaseClient
          .from("todos")
          .insert([{ title, desc, isComplete, user_id: user.id }]);
        supabaseError = error;
      }
  
      setIsLoading(false);
      if (supabaseError) {
        setErrorMessage(supabaseError.message);
      } else {
        closeHandler();
      }
    };
  
    const closeHandler = () => {
      setTitle("");
      setDesc("");
      setIsComplete(false);
      setTodo(null);
      onClose();
    };
  
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        initialFocusRef={initialRef}
      >
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={submitHandler}>
            <ModalHeader>{todo ? "Update Todo" : "Add Todo"}</ModalHeader>
            <ModalCloseButton onClick={closeHandler} />
            <ModalBody pb={6}>
              {errorMessage && (
                <Alert status="error" borderRadius="lg" mb="6">
                  <AlertIcon />
                  <Text textAlign="center">{errorMessage}</Text>
                </Alert>
              )}
              <FormControl isRequired={true}>
                <FormLabel>Title</FormLabel>
                <Input
                  ref={initialRef}
                  placeholder="Add your title here"
                  onChange={(event) => setTitle(event.target.value)}
                  value={title}
                />
              </FormControl>
  
              <FormControl mt={4} isRequired={true}>
                <FormLabel>Description</FormLabel>
                <Textarea
                  placeholder="Add your description here"
                  onChange={(event) => setDesc(event.target.value)}
                  value={desc}
                />
                <FormHelperText>
                  Description must have more than 10 characters.
                </FormHelperText>
              </FormControl>
  
              <FormControl mt={4}>
                <FormLabel>Is Completed?</FormLabel>
                <Switch
                  isChecked={isComplete}
                  id="is-completed"
                  onChange={(event) => setIsComplete(!isComplete)}
                />
              </FormControl>
            </ModalBody>
  
            <ModalFooter>
              <ButtonGroup spacing="3">
                <Button
                  onClick={closeHandler}
                  colorScheme="red"
                  type="reset"
                  isDisabled={isLoading}
                >
                  Cancel
                </Button>
                <Button colorScheme="blue" type="submit" isLoading={isLoading}>
                  {todo ? "Update" : "Save"}
                </Button>
              </ButtonGroup>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    );
  };
  
  export default ManageTodo;