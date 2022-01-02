import React,{useState} from 'react'
import { Box, Button, ButtonGroup, Flex, Heading,HStack } from "@chakra-ui/react";
import NavLink from "next/link";
import { useRouter } from 'next/router'
import {supabaseClient} from "../lib/client"
import {MdOutlineDoneAll} from "react-icons/md";
import Themes from './Themes';
const Navbar = ({onOpen}) => {
    const router=useRouter();
    const [isLogoutLoading, setIsLogoutLoading] = useState(false);
   
    const logoutHandler=async()=>{
        try{
            setIsLogoutLoading(true);
            await supabaseClient.auth.signOut();
            router.push("/signin");
        }
        catch(err)
        {
            router.push("/signin");
        }
        finally{
            setIsLogoutLoading(false);
        }
    }
    return (
        <Box height="100%" p="5" bg="grey.100">
            <Box maxW="6xl" mx="auto">
                <Flex as="nav" aria-label="Site Navigation" align="center" justify="space-between">
                    <NavLink href="/">
                        <HStack m="10" spacing="4" justify="end" cursor={"pointer"}>
                            <Box>   
                                <Heading>
                                <MdOutlineDoneAll color='#FFC900' size="1.25em"/>
                                </Heading>
                            </Box>
                            <Box>
                                <Heading m="4" cursor="pointer" >To-Do List </Heading>
                            </Box>
                        </HStack>
                    </NavLink>
                    <Box>
                        <ButtonGroup spacing="4" ml="6">
                                {router.pathname==="/"?
                                <Button colorScheme="purple">
                                <NavLink href="/profile">Profile</NavLink>
                                </Button>:
                                <Button colorScheme="purple">
                                <NavLink href="/">Home</NavLink>
                                </Button>
                                }
                            {router.pathname==="/" && (
                            <Button colorScheme="green" onClick={onOpen}>Add To-Do</Button>
                            )}
                            <Button colorScheme="yellow" onClick={logoutHandler} isLoading={isLogoutLoading}>Logout</Button>
                            <Themes/>
                        </ButtonGroup>
                    </Box>
                </Flex>
            </Box>
        </Box>
    )
}

export default Navbar
