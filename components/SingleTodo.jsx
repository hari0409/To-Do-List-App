import React,{useState} from 'react'
import { Box, Divider, Heading, Text, Tag, Center, Button } from "@chakra-ui/react";
import { supabaseClient } from '../lib/client';

const SingleTodo = ({todo,openHandler,deleteHandler,isDeleteLoading}) => {
    const getDateInMonthDayYear = (date) => {
        const d = new Date(date);
        const options = {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        };
        const n = d.toLocaleDateString("en-US", options);
        const replase = n.replace(new RegExp(",", "g"), " ");
        return replase;
    };
    const [isComplete, setisComplete] = useState(false);
    const completeHandler=async()=>{
      console.log(todo?.isComplete);
      setisComplete(!todo.isComplete);
      const {error}=await supabaseClient.from("todos").update(isComplete);
    }
    return (
        <Box position='relative' maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden" p="4" onClick={()=>openHandler(todo)} cursor="pointer" >
            <Heading size="md" mt="3">{todo.title}</Heading>
            <Tag bg={todo.isComplete?"green.400":"yellow.400"} position="absolute" top="3" right="2" borderRadius="3xl" size='sm'/>
            <Text color="gray.400" mt="1" fontSize="sm">{getDateInMonthDayYear(todo.insertedat)}</Text>
            <Divider my={4}/>
            <Text noOfLines={[1, 2, 3]} color="gray.800">{todo.desc}</Text>
            <Center>
              <Button mt="4" size="sm" colorScheme="red" onClick={(event)=>{event.stopPropagation();deleteHandler(todo.id)}}>Delete</Button>
            </Center>
        </Box>
    )
}

export default SingleTodo;