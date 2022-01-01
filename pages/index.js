import { useDisclosure } from "@chakra-ui/hooks";
import { Box, Heading, HStack, SimpleGrid, Tag} from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import ManageTodo from "../components/ManageTodo";
import Navbar from "../components/Navbar";
import SingleTodo from "../components/SingleTodo";
import { supabaseClient } from "../lib/client";

const Home = () => {
  const initialRef = useRef();

  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const user = supabaseClient.auth.user();

  const [userName, setUserName] = useState("")
  useEffect(() => {
    if (!user) {
      router.push("/signin");
    }
  }, [user, router]);

  useEffect(() => {
    if (user) {
      supabaseClient
        .from("todos")
        .select("*")
        .eq("user_id", user?.id)
        .order("id", { ascending: false })
        .then(({ data, error }) => {
          if (!error) {
            setTodos(data);
          }
        });
    }
  }, [user,todo]);

  useEffect(() => {
    const todoListener = supabaseClient
      .from("todos")
      .on("*", (payload) => {
        if (payload.eventType !== "DELETE") {
          const newTodo = payload.new;
          setTodos((oldTodos) => {
            const exists = oldTodos.find((todo) => todo.id === newTodo.id);
            let newTodos;
            if (exists) {
              const oldTodoIndex = oldTodos.findIndex(
                (obj) => obj.id === newTodo.id
              );
              oldTodos[oldTodoIndex] = newTodo;
              newTodos = oldTodos;
            } else {
              newTodos = [...oldTodos, newTodo];
            }
            newTodos.sort((a, b) => b.id - a.id);
            return newTodos;
          });
        }
      })
      .subscribe();

    return () => {
      todoListener.unsubscribe();
    };
  }, []);

  const openHandler = (clickedTodo) => {
    setTodo(clickedTodo);
    onOpen();
  };

  const deleteHandler = async (todoId) => {
    setIsDeleteLoading(true);
    const { error } = await supabaseClient
      .from("todos")
      .delete()
      .eq("id", todoId);
    if (!error) {
      setTodos(todos.filter((todo) => todo.id !== todoId));
    }
    setIsDeleteLoading(false);
  };
  useEffect(() => {
    if (user) {
      supabaseClient
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .then(({ data, error }) => {
          if (!error) {
            setUserName(data[0].username || "");
          }
        });
    }
  }, [user]);
  return (
    <div>
      <Head>
        <title>To-Do List</title>
        <meta name="description" content="Personal To-Do App"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
          <Navbar onOpen={onOpen} />
          <ManageTodo isOpen={isOpen} onClose={onClose} initialRef={initialRef}todo={todo} setTodo={setTodo}/>
          <Heading cursor={"pointer"} m="10" spacing="4" size="lg">{userName}'s List</Heading>
        <HStack m="10" spacing="4" justify="end" cursor={"pointer"}>
            <Box>
              <Tag bg="green.500" borderRadius="3xl" size="sm" mt="1" />{" "}Complete
            </Box>
            <Box>
              <Tag bg="yellow.400" borderRadius="3xl" size="sm" mt="1" />{" "}Incomplete
            </Box>
          </HStack>
        <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} gap={{ base: "4", md: "6", lg: "8" }} m="10">
          {todos.map((todo, index) => (
            <SingleTodo todo={todo}key={index}openHandler={openHandler}deleteHandler={deleteHandler} isDeleteLoading={isDeleteLoading}/>
          ))}
        </SimpleGrid>
      </main>
    </div>
  );
};

export default Home;