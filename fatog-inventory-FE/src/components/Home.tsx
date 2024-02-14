import { Box, Heading, Button, Flex, FormControl, FormLabel, InputGroup, InputLeftAddon, Input, Icon, Stack, Link } from "@chakra-ui/react";
import { Form } from "react-router-dom";
import bgImage from '../assets/fish-hero3.png';
import bgImage2 from '../assets/inventoryImg.webp';
import { TbPasswordUser, TbUser } from "react-icons/tb";

import Logo from "./Logo";

const Home = () => {
    return (
        <Flex
            fontSize='3xl'
            w='100%'
            justifyContent='center'
            alignItems='center'
            minHeight='100vh'
            bgImage={`linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${bgImage})`}
            backgroundRepeat='no-repeat'
            backgroundSize='cover'
            boxShadow='lg'
        >
            <Flex w={['90%', '90%', '80%', '80%', '60%']} borderRadius='md' overflow='hidden'>
                <Box
                    display={['none', 'none', 'block']} w='55%'
                    bgImage={bgImage2}
                    backgroundRepeat='no-repeat'
                    backgroundSize='cover'
                >
                </Box>

                <Stack w={['100%', '100%', '45%']} bg='whitesmoke' spacing='6' p='6'>
                    <Logo />

                    <Heading fontSize='2xl' >Login</Heading>

                    <Form>
                        <Stack spacing='6'>
                            <FormControl>
                                <FormLabel>Username</FormLabel>
                                <InputGroup>
                                    <InputLeftAddon>
                                        <Icon as={TbUser} />
                                    </InputLeftAddon>
                                    <Input type="text" placeholder="Username" />
                                </InputGroup>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Password</FormLabel>
                                <InputGroup>
                                    <InputLeftAddon>
                                        <Icon as={TbPasswordUser} />
                                    </InputLeftAddon>
                                    <Input type="password" placeholder="Password" />
                                </InputGroup>
                            </FormControl>

                            <Button borderWidth='2px' borderColor='gray.500'>Login</Button>

                            <Link fontSize='sm' alignSelf='end'>Forgot Password?</Link>
                        </Stack>
                    </Form>
                </Stack>
            </Flex>
        </Flex>
    )
}

export default Home;