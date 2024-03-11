import React from 'react';
import { Box, Stack, Flex, HStack, Text, Icon, Link, Spacer, Menu, MenuButton, MenuList, MenuItem, MenuDivider } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { links } from '../constants';
import { RiLogoutCircleRLine } from "react-icons/ri";
import { PiUsersFourLight } from "react-icons/pi";
import { LiaUsersSolid } from "react-icons/lia";
import LogoutBtn from './LogoutBtn';

const SideNavLinks = () => {
    return (
        <Stack flex='1' spacing='1' pt='4' borderTopWidth='1px' borderColor='gray.200'>
            {
                links.map(link => {

                    return link.title === 'Users' ?
                        <UsersMenu key={link.title} link={link} /> :
                        <Link
                            key={link.title}
                            as={NavLink}
                            to={link.ref}
                            _hover={{
                                bg: '#BEE3F8', borderLeftWidth: '5px', borderColor: '#2B6CB0', color: '#2B6CB0', fontWeight: 'medium'
                            }}
                            style={({ isActive }) => {
                                return {
                                    backgroundColor: isActive && '#BEE3F8',
                                    borderLeftWidth: isActive && '5px',
                                    borderColor: isActive && '#2B6CB0',
                                    color: isActive && '#2B6CB0',
                                    paddingLeft: '24px',
                                    paddingTop: '16px',
                                    paddingBottom: '16px',
                                    fontWeight: isActive && '500'
                                }
                            }}
                        >
                            <HStack spacing='3'>
                                <Icon
                                    as={link.icon}
                                    fontSize='lg'
                                />
                                <Text>
                                    {link.title}
                                </Text>
                            </HStack>
                        </Link>
                })
            }

            <Spacer />

            {/* Logout */}
            <LogoutBtn display={{ base: 'none', md: 'block' }} />
        </Stack>
    )
}

const UsersMenu = ({ link }) => {
    const menuItems = [
        { title: 'Staff', ref: '/staff', icon: PiUsersFourLight },
        { title: 'Customers', ref: '/customers', icon: LiaUsersSolid },
    ];

    return (
        <Menu>
            <MenuButton
                pl='6'
                py='4'
                _hover={{
                    bg: '#BEE3F8', borderLeftWidth: '5px', borderColor: '#2B6CB0', color: '#2B6CB0', fontWeight: 'medium'
                }}
            >
                <HStack spacing='3'>
                    <Icon
                        as={link.icon}
                        fontSize='lg'
                    />
                    <Text>
                        {link.title}
                    </Text>
                </HStack>
            </MenuButton>

            <MenuList py='0' mr='3'>
                {
                    menuItems.map((item, index) => {
                        return <MenuItem
                            key={index}
                            as={NavLink}
                            to={item.ref}
                            _hover={{
                                bg: '#BEE3F8', borderLeftWidth: '5px', borderBottomWidth: '0', borderColor: '#2B6CB0', color: '#2B6CB0', fontWeight: 'medium'
                            }}
                            style={({ isActive }) => {
                                return {
                                    backgroundColor: isActive && '#BEE3F8',
                                    borderLeftWidth: isActive && '5px',
                                    borderColor: isActive && '#2B6CB0',
                                    color: isActive && '#2B6CB0',
                                    paddingTop: '12px',
                                    paddingBottom: '12px',
                                    fontWeight: isActive && '500'
                                }
                            }}
                            borderBottom={index !== menuItems.length - 1 ? '1px' : '0'}
                            borderColor='gray.200'
                        >
                            <HStack spacing='3'>
                                <Icon
                                    as={item.icon}
                                    fontSize='lg'
                                />
                                <Text>
                                    {item.title}
                                </Text>
                            </HStack>
                        </MenuItem>

                    })
                }
            </MenuList>
        </Menu>
    )
}

export default SideNavLinks;