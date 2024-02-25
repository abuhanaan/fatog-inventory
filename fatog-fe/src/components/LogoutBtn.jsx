import React from 'react';
import { NavLink } from 'react-router-dom';
import {Link, HStack, Icon, Text} from '@chakra-ui/react';
import { RiLogoutCircleRLine } from 'react-icons/ri';

const LogoutBtn = ({...rest}) => {
    return (
        <Link
            as={NavLink}
            to=''
            _hover={{
                bg: '#E53E3E', borderLeftWidth: '5px', borderColor: '#FC8181', color: '#FFF5F5', fontWeight: 'medium'
            }}
            style={() => {
                return {
                    paddingLeft: '24px',
                    paddingTop: '16px',
                    paddingBottom: '16px',
                }
            }}
            {...rest}
        >
            <HStack spacing='3'>
                <Icon
                    as={RiLogoutCircleRLine}
                    fontSize='lg'
                />
                <Text>Logout</Text>

            </HStack>
        </Link>
    )
}

export default LogoutBtn;