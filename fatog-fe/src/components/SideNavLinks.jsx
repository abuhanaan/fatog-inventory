import React from 'react';
import { Box, Stack, Flex, HStack, Text, Icon, Link } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { links } from '../constants';

const SideNavLinks = () => {
    return (
        <Stack pt='4' borderTopWidth='1px' borderColor='gray.200'>
            {
                links.map(link => (
                    // <Box
                    //     paddingLeft='6'
                    //     paddingY='4'
                    //     _hover={{ bg: 'blue.100', borderLeftWidth: '4px', borderColor: '#1570EF', color: '#1570EF' }}
                    // >
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
                    // </Box>
                ))
            }
        </Stack>
    )
}

export default SideNavLinks;