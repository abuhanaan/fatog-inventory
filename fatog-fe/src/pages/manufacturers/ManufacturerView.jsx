import { useRef, useState, useEffect } from 'react';
import { Stack, Box, HStack, VStack, SimpleGrid, Heading, Text, Button, IconButton, Icon, Spinner, Tooltip, useDisclosure } from '@chakra-ui/react';
import Breadcrumb from '../../components/Breadcrumb';
import { HiOutlinePlus } from "react-icons/hi";
import { Link as RouterLink, useLoaderData, useNavigate, useLocation } from 'react-router-dom';
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";
import { BiError } from "react-icons/bi";
import { FaRegThumbsUp } from "react-icons/fa6";
import Modal from '../../components/Modal';
import { requireAuth } from '../../hooks/useAuth';
import { getManufacturer, deleteManufacturer } from '../../api/manufacturers';
import { useToastHook } from '../../hooks/useToast';
import { isUnauthorized } from '../../utils';
import FetchError from '../../components/FetchError';

export async function loader({ params, request }) {
    await requireAuth(request);
    const response = await getManufacturer(params.id);

    if (response.error || response.message) {
        return {
            error: response.error,
            message: response.message,
            statusCode: response.statusCode
        }
    }

    return response;
}

const ManufacturerView = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const manufacturer = useLoaderData();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const closeModalRef = useRef(null);
    const [toastState, setToastState] = useToastHook();
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState({
        error: manufacturer.error ?? '',
        message: manufacturer.message ?? '',
        statusCode: manufacturer.statusCode ?? ''
    });
    const breadcrumbData = [
        { name: 'Home', ref: '/dashboard' },
        { name: 'Manufacturers', ref: '/manufacturers' },
        { name: manufacturer.brandName, ref: `/manufacturers/${manufacturer.id}` },
    ];

    useEffect(() => {
        if (manufacturer.error || manufacturer.message) {
            setToastState({
                title: manufacturer.error,
                description: manufacturer.message,
                status: 'error',
                icon: <Icon as={BiError} />
            });

            setTimeout(() => {
                isUnauthorized(error, navigate, pathname);
            }, 6000);
        }
    }, []);

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
                isUnauthorized(response, navigate, pathname);
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
        error.error || error.message ?
            <FetchError error={error} /> :
            <Stack spacing='6'>
                <Box>
                    <Breadcrumb linkList={breadcrumbData} />
                </Box>
                <HStack justifyContent='space-between'>
                    <Heading fontSize={{ base: '2xl', md: '3xl' }} color='blue.700'>{manufacturer.brandName}</Heading>
                    <HStack spacing='2'>
                        <Tooltip hasArrow label='Add new manufacturer' placement='bottom' borderRadius='md'>
                            <IconButton as={RouterLink} size={{ base: 'sm', md: 'md' }} to='/manufacturers/create' icon={<HiOutlinePlus />} colorScheme='blue' />
                        </Tooltip>

                        <Tooltip hasArrow label='Edit manufacturer' placement='bottom' borderRadius='md'>
                            <IconButton as={RouterLink} size={{ base: 'sm', md: 'md' }} to='/manufacturers/create' state={{ currentManufacturer: manufacturer }} icon={<MdOutlineEdit />} colorScheme='orange' />
                        </Tooltip>

                        <Tooltip hasArrow label='Delete manufacturer' placement='left' borderRadius='md'>
                            <IconButton icon={<MdDeleteOutline />} size={{ base: 'sm', md: 'md' }} data-manufacturer-id={manufacturer.id} onClick={onOpen} colorScheme='red' />
                        </Tooltip>
                    </HStack>

                    <Modal isOpen={isOpen} onClose={onClose} footer={modalButtons} title='Delete Manufacturer'>
                        <Box>
                            <Text>Proceed to delete manufacturer?</Text>
                        </Box>
                    </Modal>
                </HStack>
                <Box marginTop='8'>
                    <Box as='fieldset' boxSize={{ base: 'full', lg: 'full' }} bg='white' p='6' borderWidth='1px' borderColor='gray.300' borderRadius='md'>
                        <Heading as='legend' px='1' fontSize='lg' fontWeight='medium'>General Information</Heading>
                        <GeneralInfo manufacturer={manufacturer} />
                    </Box>
                </Box >
            </Stack >
    )
};

const GeneralInfo = ({ manufacturer }) => {
    return (
        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5}>
            <Stack direction='column'>
                <Heading fontSize='sm' fontWeight='semibold'>ID</Heading>
                <Text>{manufacturer.id}</Text>
            </Stack>
            <Stack direction='column'>
                <Heading fontSize='sm' fontWeight='semibold'>Brand Name</Heading>
                <Text>{manufacturer.brandName}</Text>
            </Stack>
            <Stack direction='column'>
                <Heading fontSize='sm' fontWeight='semibold'>Representative Name</Heading>
                <Text>{manufacturer.repName}</Text>
            </Stack>
            <Stack direction='column'>
                <Heading fontSize='sm' fontWeight='semibold'>Representative Phone</Heading>
                <Text>{manufacturer.repPhoneNumber}</Text>
            </Stack>
        </SimpleGrid>
    )
};

export default ManufacturerView;