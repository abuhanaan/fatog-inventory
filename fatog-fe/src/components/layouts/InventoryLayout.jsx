// Layout.js
import React, { useRef } from 'react';
import { Box, Flex, Stack, Spacer, useColorMode, Button, Menu, MenuButton, MenuList, MenuItem, MenuDivider, Avatar, IconButton, Icon, Spinner, useDisclosure } from '@chakra-ui/react';
import { Link, Outlet, useNavigation } from 'react-router-dom';
import SideNavLinks from '../SideNavLinks';
import { HamburgerIcon } from '@chakra-ui/icons';
import SideDrawer from '../SideDrawer';
import Logo from '../Logo';
import useAuth from '../../hooks/useAuth';

const InventoryLayout = () => {
    const { logout } = useAuth();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const drawerBtnRef = React.useRef();
    const { state } = useNavigation();

    return (
        <Box minHeight="100vh">
            <Flex>
                <Flex direction='column' minW="250px" bg='white' borderRightWidth='1px' borderColor='gray.200' display={{ 'base': 'none', 'md': 'flex' }}>
                    {/* Side Navigation */}
                    <Logo />
                    <SideNavLinks />
                    <SideDrawer isOpen={isOpen} onClose={onClose} btnRef={drawerBtnRef} />
                </Flex>
                <Flex direction='column' flex="1" minHeight='100vh'>
                    {/* Main Content */}
                    <Flex p={4} alignItems="center" bg='white' borderBottomWidth='1px' borderColor='gray.200' h='65px'>
                        <Icon as={HamburgerIcon} fontSize='24px' color='gray.800' display={['block', 'block', 'none']} onClick={onOpen} ref={drawerBtnRef} />
                        <Spacer />
                        <Menu>
                            <MenuButton>
                                <Avatar size="sm" />
                            </MenuButton>
                            <MenuList py='0'>
                                <MenuItem as={Link} to='/profile'>Profile</MenuItem>
                                <MenuDivider my='0' />
                                <MenuItem onClick={() => { logout() }}>Logout</MenuItem>
                            </MenuList>
                        </Menu>
                    </Flex>
                    <Stack flex='1' p={6} bg='gray.50'>
                        {
                            state === 'loading' ?
                                <Spinner
                                    thickness='4px'
                                    speed='0.4s'
                                    emptyColor='gray.200'
                                    color='blue.300'
                                    size='xl'
                                    alignSelf='center'
                                /> :
                                <Outlet />
                        }
                    </Stack>
                </Flex>
            </Flex>
        </Box>
    );
};

export default InventoryLayout;
