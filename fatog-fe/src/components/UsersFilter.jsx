import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { ButtonGroup, Button, } from '@chakra-ui/react';
import { FilterContext } from '../pages/users/Users';

const UsersFilter = ({ filterData, buttonState }) => {
    const { pathname } = useLocation();
    // const { userStatusFilter, setFilterParams } = useContext(FilterContext);

    const usersFilterTypes = [
        { title: 'active', isActive: true },
        { title: 'inactive', isActive: false }
    ];

    return (
        <ButtonGroup size='sm' bg='white' isAttached variant='outline'>
            <Button onClick={() => filterData(null)} isActive={!buttonState}>All</Button>
            {
                usersFilterTypes.map((type, index) => (
                    <Button key={index} onClick={() => filterData(type.title)} isActive={buttonState === type.title} textTransform='capitalize'>{type.title}</Button>
                ))
            }
            {/* <Button onClick={() => setFilterParams('status', null)} isActive={!userStatusFilter}>All</Button>
            {
                usersFilterTypes.map((type, index) => (
                    <Button key={index} onClick={() => setFilterParams('status', type.title)} isActive={userStatusFilter === type.title} textTransform='capitalize'>{type.title}</Button>
                ))
            } */}
        </ButtonGroup>
    )
}

export default UsersFilter;