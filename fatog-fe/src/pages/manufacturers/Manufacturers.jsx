import { useRef, useState, useEffect } from 'react';
import { useNavigate, useNavigation, Link, useLoaderData, useLocation } from 'react-router-dom';
import ListingsTable from '../../components/Table';
import { Stack, HStack, VStack, Box, useDisclosure, IconButton, Icon, Button, Heading, Text, Spinner, Tooltip, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import { BiError } from "react-icons/bi";
import { FaRegThumbsUp, FaEllipsisVertical } from "react-icons/fa6";
import Modal from '../../components/Modal';
import Breadcrumb from '../../components/Breadcrumb';
import { EmptySearch } from '../../components/EmptySearch';
import AddButton from '../../components/AddButton';
import { getManufacturers, deleteManufacturer } from '../../api/manufacturers';
import { useToastHook } from '../../hooks/useToast';
import { requireAuth } from '../../hooks/useAuth';
import { isUnauthorized } from '../../utils';
import FetchError from '../../components/FetchError';

const columns = [
    { id: 'S/N', header: 'S/N' },
    { id: 'brandName', header: 'Brand Name' },
    { id: 'repName', header: 'Representative Name' },
    { id: 'repPhoneNumber', header: 'Representative Phone' },
    { id: 'actions', header: '' },
];

export async function loader({ request }) {
    await requireAuth(request);
    const response = await getManufacturers();

    if (response.error || response.message) {
        return {
            error: response.error,
            message: response.message,
            statusCode: response.statusCode
        }
    }

    return response;
}

const Manufacturers = () => {
    const navigate = useNavigate();
    const [toastState, setToastState] = useToastHook();
    const manufacturers = useLoaderData();
    const [error, setError] = useState({
        error: manufacturers.error ?? '',
        message: manufacturers.message ?? '',
        statusCode: manufacturers.statusCode ?? ''
    });
    const breadcrumbData = [
        { name: 'Home', ref: '/dashboard' },
        { name: 'Manufacturers', ref: '/manufacturers' },
    ];

    useEffect(() => {
        if (manufacturers.error || manufacturers.message) {
            setToastState({
                title: manufacturers.error,
                description: manufacturers.message,
                status: 'error',
                icon: <Icon as={BiError} />
            });

            setTimeout(() => {
                isUnauthorized(error, navigate);
            }, 6000);
        }
    }, []);

    return (
        error.error || error.message ?
            <FetchError error={error} /> :
            <Stack spacing='6'>
                <Box>
                    <Breadcrumb linkList={breadcrumbData} />
                </Box>
                <HStack justifyContent='space-between'>
                    <Heading fontSize='3xl' color='blue.700'>Manufacturers</Heading>
                    <AddButton navigateTo='create'>Add Manufacturer</AddButton>
                </HStack>
                <Box marginTop='8'>
                    {
                        manufacturers?.length === 0 ?
                            <EmptySearch headers={['S/N', 'BRAND NAME', 'REPRESENTATIVE NAME', 'REPRESENTATIVE PHONE']} type='manufacturer' /> :
                            <ListingsTable data={manufacturers} columns={columns} fileName='manufacturers-data.csv' render={(manufacturer) => (
                                <ActionButtons manufacturer={manufacturer} />
                            )} />
                    }
                </Box>
            </Stack>
    )
}

const ActionButtons = ({ manufacturer }) => {
    const navigate = useNavigate();
    const { state } = useNavigation();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { pathname } = useLocation();
    const closeModalRef = useRef(null);
    const [toastState, setToastState] = useToastHook();
    const [isDeleting, setIsDeleting] = useState(false);

    function viewManufacturer(e) {
        e.preventDefault();

        const dataManufacturerId = e.currentTarget.getAttribute('data-manufacturer-id');
        navigate(`./${dataManufacturerId}`);
    }

    async function manufacturerDelete(e) {
        e.preventDefault();

        setIsDeleting(true);

        // TODO: Consume DELETE manufacturer endpoint
        const response = await deleteManufacturer(manufacturer.id);

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
                isUnauthorized(response, navigate);
            }, 6000);

            return response.error;
        }

        setToastState({
            title: 'Success!',
            description: 'Manufacturer deleted successfully.',
            status: 'success',
            icon: <Icon as={FaRegThumbsUp} />
        });

        setIsDeleting(false);
        closeModalRef.current.click();

        setTimeout(() => {
            navigate(`/manufacturers`);
        }, 6000);

    }

    const modalButtons =
        <HStack spacing='3'>
            <Button colorScheme='red' ref={closeModalRef} onClick={onClose}>Cancel</Button>
            <Button
                onClick={manufacturerDelete}
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
            {/* <HStack spacing='1'>
                <Tooltip hasArrow label='Preview manufacturer' placement='bottom' borderRadius='md'>
                    <IconButton icon={<IoEyeOutline />} colorScheme='purple' size='sm' data-manufacturer-id={manufacturer.id} onClick={viewManufacturer} />
                </Tooltip>

                <Tooltip hasArrow label='Edit manufacturer' placement='bottom' borderRadius='md'>
                    <IconButton as={Link} to='create' icon={<MdOutlineEdit />} colorScheme='blue' size='sm' state={{ currentManufacturer: manufacturer }} />
                </Tooltip>

                <Tooltip hasArrow label='Delete manufacturer' placement='left' borderRadius='md'>
                    <IconButton icon={<MdDeleteOutline />} colorScheme='red' size='sm' data-manufacturer-id={manufacturer.id} onClick={onOpen} />
                </Tooltip>
            </HStack> */}

            <Menu>
                <MenuButton
                    as={IconButton}
                    aria-label='Options'
                    icon={<FaEllipsisVertical />}
                    variant='unstyled'
                />
                <MenuList py='0'>
                    <MenuItem icon={<IoEyeOutline />} data-manufacturer-id={manufacturer.id} onClick={viewManufacturer}>
                        Preview
                    </MenuItem>

                    <MenuItem as={Link} to='create' icon={<MdOutlineEdit />} state={{ currentManufacturer: manufacturer }}>
                        Edit Manufacturer
                    </MenuItem>

                    <MenuItem icon={<MdDeleteOutline />} data-manufacturer-id={manufacturer.id} onClick={onOpen}>
                        Delete Manufacturer
                    </MenuItem>
                </MenuList>
            </Menu>

            <Modal isOpen={isOpen} onClose={onClose} footer={modalButtons} title='Delete Manufacturer'>
                <Box>
                    <Text>Proceed to delete manufacturer?</Text>
                </Box>
            </Modal>
        </>
    )
}

export default Manufacturers;