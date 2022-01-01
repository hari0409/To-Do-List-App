import {Alert,AlertIcon,Box,Button,chakra,FormControl,FormLabel,Heading,Input,setScript,Stack,Text,} from "@chakra-ui/react";
import {supabaseClient} from "../lib/client"
import React, { useState } from 'react'

const signin = () => {
    const [email, setemail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const submitHandler=async ()=>{
        event.preventDefault();
        setError(null);
        setIsLoading(true);
        try{
            const {error}=await supabaseClient.auth.signIn({email});
            if (error){
                setError(error.message)
            }
            else{
                setIsSubmitted(true)
            }
        }
        catch(err){
            setIsLoading(false)
        }
    }
    const changeHandler=(event)=>{
        setemail(event.target.value)
    }
    console.log(email);
    return (
        <Box minH="100vh" py="12" px={{base:"4",lg:"8"}} bg="#1a202c">
            <Box maxW="md" mx="auto">
                <Heading textAlign="center" m="6" color="#79018C">To-Do List</Heading>
                {error && (
                    <Alert>
                        <AlertIcon/>
                        <Text textAlign="center">{error}</Text>
                    </Alert>
                )}
                <Box py="8" px={{base:"4",md:"10"}} shadow="base" rounded={{sm:"lg"}} bg="#9A0680">
                    {isSubmitted ? (<p>Please check {email} for log in link</p>):(
                            <chakra.form onSubmit={submitHandler}>
                                <Stack spacing="6">
                                    <FormControl id="email">
                                        <FormLabel color={"black"}>Email Address</FormLabel>
                                        <Input name="email" type="email" autoComplete="false" required value={email} onChange={changeHandler} borderColor="#160040" border="2px"/>
                                    </FormControl>
                                    <Button type="submit" colorScheme="orange" size="lg" fontSize="md" isLoading={isLoading}>Sign In</Button>
                                </Stack>
                            </chakra.form>
                        )
                    }
                </Box>
            </Box>
        </Box>
    )
}

export default signin
