import { useRef, useState, useEffect } from 'react';
import { useNavigate, useNavigation, Link, useLoaderData, useLocation } from 'react-router-dom';
import ListingsTable from '../../../components/Table';
import { Stack, HStack, VStack, Box, useDisclosure, IconButton, Icon, Button, Heading, Text, Spinner, Menu, MenuButton, MenuList, MenuItem, Badge, Tooltip } from '@chakra-ui/react';
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import { BiError } from "react-icons/bi";
import { FaRegThumbsUp, FaEllipsisVertical, FaUserCheck, FaUserXmark } from "react-icons/fa6";
import Modal from '../../../components/Modal';
import { activateUser, deactivateUser } from '../../../api/users';
import { useToastHook } from '../../../hooks/useToast';
import { isUnauthorized } from '../../../utils';

const StaffActions = ({ row }) => {
    const staff = row.original;
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const closeModalRef = useRef(null);
    const { pathname } = useLocation();
    const [toastState, setToastState] = useToastHook();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isActivating, setIsActivating] = useState(false);

    function viewStaff(e) {
        e.preventDefault();

        const dataStaffId = e.currentTarget.getAttribute('data-staff-id');
        navigate(`./${dataStaffId}`);
    }

    async function staffDelete(e) {
        e.preventDefault();

        setIsDeleting(true);

        // TODO: Consume DELETE staff endpoint
        const response = await deleteStaff(staff.id);

        if (response.error || response.message) {
            setToastState({
                title: response.error,
                description: response.message,
                status: 'error',
                icon: <Icon as={BiError} />
            });

            setIsDeleting(false);
            closeModalRef.current.click();

            setTimeout(() => {
                isUnauthorized(response, navigate, pathname);
            }, 6000);

            return response.error;
        }

        setToastState({
            title: 'Success!',
            description: 'Staff deleted successfully.',
            status: 'success',
            icon: <Icon as={FaRegThumbsUp} />
        });

        setIsDeleting(false);
        closeModalRef.current.click();

        setTimeout(() => {
            navigate(`/staff`);
        }, 6000);

    }

    const staffActivate = async (e) => {
        e.preventDefault();

        setIsActivating(true);

        const staffId = e.currentTarget.getAttribute('data-staff-id');

        const response = await activateUser(staffId);

        if (response.error || response.message) {
            setToastState({
                title: response.error,
                description: response.message,
                status: 'error',
                icon: <Icon as={BiError} />
            });

            setIsActivating(false);

            setTimeout(() => {
                isUnauthorized(response, navigate, pathname);
            }, 6000);

            return response.error;
        }

        setToastState({
            title: 'Success!',
            description: 'Staff activated successfully.',
            status: 'success',
            icon: <Icon as={FaRegThumbsUp} />
        });

        setIsActivating(false);

        setTimeout(() => {
            navigate(`/staff`);
        }, 6000);
    }

    const staffDeactivate = async (e) => {
        e.preventDefault();

        setIsActivating(true);

        const staffId = e.currentTarget.getAttribute('data-staff-id');

        const response = await deactivateUser(staffId);

        if (response.error || response.message) {
            setToastState({
                title: response.error,
                description: response.message,
                status: 'error',
                icon: <Icon as={BiError} />
            });

            setIsActivating(false);

            setTimeout(() => {
                isUnauthorized(response, navigate, pathname);
            }, 6000);

            return response.error;
        }

        setToastState({
            title: 'Success!',
            description: 'Staff deactivated successfully.',
            status: 'success',
            icon: <Icon as={FaRegThumbsUp} />
        });

        setIsActivating(false);

        setTimeout(() => {
            navigate(`/staff`);
        }, 6000);
    }

    const modalButtons =
        <HStack spacing='3'>
            <Button colorScheme='red' ref={closeModalRef} onClick={onClose}>Cancel</Button>
            <Button
                onClick={staffDelete}
                colorScheme='blue'
                isLoading={isDeleting ? true : false}
                loadingText='Deleting...'
                spinnerPlacement='end'
                spinner={<Spinner
                    thickness='4px'
                    speed='0.5s'
                    emptyColor='gray.200'
                    color='blue.300'
                    size='md'
                />}
            >
                Delete
            </Button>
        </HStack>

    return (
        <>
            <Menu>
                <MenuButton
                    as={IconButton}
                    aria-label='Options'
                    icon={<FaEllipsisVertical />}
                    variant='unstyled'
                />
                <MenuList py='0'>
                    <MenuItem icon={<IoEyeOutline />} data-staff-id={staff.id} onClick={viewStaff}>
                        Preview
                    </MenuItem>
                    <MenuItem as={Link} to='/users/create' icon={<MdOutlineEdit />} state={{ currentUser: staff, entity: 'staff' }}>
                        Edit Staff
                    </MenuItem>
                    {
                        staff.active ?
                            <MenuItem
                                as={Button}
                                icon={<FaUserXmark />}
                                data-staff-id={staff.id}
                                onClick={staffDeactivate}
                                size='sm'
                                _hover={{ bg: 'gray.100' }}
                                borderRadius='0'
                                fontWeight='normal'
                                closeOnSelect={false}
                                aria-label='Deactivate staff'
                                isLoading={isActivating}
                                loadingText='Deactivating...'
                                spinnerPlacement='end'
                                spinner={< Spinner
                                    thickness='4px'
                                    speed='0.5s'
                                    emptyColor='gray.200'
                                    color='blue.300'
                                    size='md'
                                />}
                            >
                                Deactivate Staff
                            </MenuItem> :
                            <MenuItem
                                as={Button}
                                icon={<FaUserCheck />}
                                size='sm'
                                data-staff-id={staff.id}
                                onClick={staffActivate}
                                _hover={{ bg: 'gray.100' }}
                                borderRadius='0'
                                fontWeight='normal'
                                closeOnSelect={false}
                                aria-label='Activate staff'
                                isLoading={isActivating ? true : false}
                                loadingText='Activating...'
                                spinnerPlacement='end'
                                spinner={<Spinner
                                    thickness='4px'
                                    speed='0.5s'
                                    emptyColor='gray.200'
                                    color='blue.300'
                                    size='md'
                                />}
                            >
                                Activate Staff
                            </MenuItem>
                    }
                    {/* <MenuItem icon={<MdDeleteOutline />} data-staff-id={staff.id} onClick={onOpen}>
                        Delete Staff
                    </MenuItem> */}
                </MenuList>
            </Menu>

            <Modal isOpen={isOpen} onClose={onClose} footer={modalButtons} title='Delete Staff'>
                <Box>
                    <Text>Proceed to delete staff?</Text>
                </Box>
            </Modal>
        </>
    )
}

export const StaffOrderActions = ({ order, path }) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    function viewOrder(e) {
        e.preventDefault();

        const dataOrderId = e.currentTarget.getAttribute('data-order-id');
        navigate(`${path}/${dataOrderId}`, { state: { from: pathname } });
    }

    return (
        <>
            <Menu>
                <MenuButton
                    as={IconButton}
                    aria-label='Options'
                    icon={<FaEllipsisVertical />}
                    variant='unstyled'
                />
                <MenuList py='0'>
                    <MenuItem icon={<IoEyeOutline />} data-order-id={order.id} onClick={viewOrder}>
                        Preview
                    </MenuItem>

                    {/* {
                        pathname.includes('orders') &&
                        <MenuItem as={RouterLink} to={`/orders/${order.orderId}/orderlist/${order.id}/edit`} icon={<MdOutlineEdit />} state={{ orderItem: order }}>
                            Edit
                        </MenuItem>
                    } */}
                </MenuList>
            </Menu>
        </>
    )
}

export const StaffStockActions = ({ stock, path }) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    function viewStock(e) {
        e.preventDefault();

        const dataStockId = e.currentTarget.getAttribute('data-stock-id');
        navigate(`${path}/${dataStockId}`, { state: { from: pathname } });
    }

    return (
        <>
            <Menu>
                <MenuButton
                    as={IconButton}
                    aria-label='Options'
                    icon={<FaEllipsisVertical />}
                    variant='unstyled'
                />
                <MenuList py='0'>
                    <MenuItem icon={<IoEyeOutline />} data-stock-id={stock.id} onClick={viewStock}>
                        Preview
                    </MenuItem>
                </MenuList>
            </Menu>
        </>
    )
}

export const StaffSaleActions = ({ row }) => {
    const sale = row.original;
    const navigate = useNavigate();

    function viewSale(e) {
        e.preventDefault();

        const dataSaleId = e.currentTarget.getAttribute('data-sale-id');
        navigate(`./${dataSaleId}`);
    }

    return (
        <Menu>
            <MenuButton
                as={IconButton}
                aria-label='Options'
                icon={<FaEllipsisVertical />}
                variant='unstyled'
            />
            <MenuList py='0'>
                <MenuItem icon={<IoEyeOutline />} data-sale-id={sale.id} onClick={viewSale}>
                    Preview
                </MenuItem>

                {/* {
                    sale.outstandingPayment ?
                    <MenuItem as={RouterLink} to={`/sales/${sale.id}/payments/add`} icon={<MdAddCard />}>
                        Add Payment
                    </MenuItem> :
                    null
                } */}
            </MenuList>
        </Menu>
    )
}

export default StaffActions;