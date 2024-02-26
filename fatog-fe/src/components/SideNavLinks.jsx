import React from 'react';
import { Box, Stack, Flex, HStack, Text, Icon, Link, Spacer } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { links } from '../constants';
import { RiLogoutCircleRLine } from "react-icons/ri";
import LogoutBtn from './LogoutBtn';

const SideNavLinks = () => {
    return (
        <Stack flex='1' pt='4' borderTopWidth='1px' borderColor='gray.200'>
            {
                links.map(link => (
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
                ))
            }

            <Spacer />
            
            {/* Logout */}
            <LogoutBtn display={{ base: 'none', md: 'block' }} />
        </Stack>
    )
}

export default SideNavLinks;