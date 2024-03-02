import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { ButtonGroup, Button, } from '@chakra-ui/react';
import { FilterContext } from '../pages/users/Users';

const UsersFilter = () => {
    const { pathname } = useLocation();
    const { userStatusFilter, setFilterParams } = useContext(FilterContext);

    const usersFilterTypes = [
        { title: 'active', isActive: true },
        { title: 'inactive', isActive: false }
    ];

    return (
        <ButtonGroup size='sm' bg='white' isAttached variant='outline'>
            <Button onClick={() => setFilterParams('status', null)} isActive={!userStatusFilter}>All</Button>
            {
                usersFilterTypes.map((type, index) => (
                    <Button key={index} onClick={() => setFilterParams('status', type.title)} isActive={userStatusFilter === type.title} textTransform='capitalize'>{type.title}</Button>
                ))
            }
        </ButtonGroup>
        // <div className="inline-flex overflow-hidden bg-white border divide-x rounded-lg dark:bg-gray-900 rtl:flex-row-reverse dark:border-gray-700 dark:divide-gray-700">
        //     <button onClick={() => setFilterParams('status', null)} className={clsx("px-5 py-2 text-xs font-medium capitalize text-gray-600 transition-colors duration-200 sm:text-sm dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100", { 'bg-gray-100': !userStatusFilter })}>
        //         All
        //     </button>

        //     {
        //         usersFilterTypes.map((type, index) => (
        //             <button key={index} onClick={() => setFilterParams('status', type.title)} className={clsx("px-5 py-2 text-xs font-medium capitalize text-gray-600 transition-colors duration-200 sm:text-sm dark:hover:bg-gray-800 dark:text-gray-300 hover:bg-gray-100", { 'bg-gray-100': userStatusFilter === type.title })}>
        //                 {type.title}
        //             </button>
        //         ))
        //     }
        // </div>
    )
}

export default UsersFilter;