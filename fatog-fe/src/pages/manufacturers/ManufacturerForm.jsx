import { useRef } from 'react';
import { useLocation, useNavigate, useLoaderData } from 'react-router-dom';
import TextInput from '../../components/form/TextInput';
import { useForm } from 'react-hook-form';
import { Stack, HStack, Flex, Icon, Box, Spinner, Button, Heading } from '@chakra-ui/react';
import Breadcrumb from '../../components/Breadcrumb';
import { createManufacturer, updateManufacturer } from '../../api/manufacturers';
import { useToastHook } from '../../hooks/useToast';
import { BiError } from "react-icons/bi";
import { FaRegThumbsUp } from "react-icons/fa6";
import { isUnauthorized } from '../../utils';
import FetchError from '../../components/FetchError';

const breadcrumbData = [
    { name: 'Home', ref: '/dashboard' },
    { name: 'Manufacturers', ref: '/manufacturers' },
    { name: 'Manufacturer Form', ref: '/manufacturers/create' },
];

const ManufacturerForm = () => {
    const { state, pathname } = useLocation();
    const navigate = useNavigate();
    const [toastState, setToastState] = useToastHook();
    const currentManufacturer = state && state.currentManufacturer;
    const submitBtnRef = useRef(null);
    const {
        handleSubmit,
        control,
        formState: { isSubmitting },
    } = useForm();

    const submitManufacturer = async (data) => {
        const manufacturerData = {
            ...data
        };
        const buttonIntent = submitBtnRef.current.getAttribute('data-intent');

        if (buttonIntent === 'add') {
            // TODO: Consume manufacturer create API endpoint
            try {
                const response = await createManufacturer(manufacturerData);

                if (response.error || response.message) {
                    setToastState({
                        title: response.error,
                        description: response.message,
                        status: 'error',
                        icon: <Icon as={BiError} />
                    });

                    setTimeout(() => {
                        isUnauthorized(response, navigate, pathname);
                    }, 6000);

                    return response.error;
                }

                setToastState({
                    title: 'Success!',
                    description: 'Manufacturer added successfully',
                    status: 'success',
                    icon: <Icon as={FaRegThumbsUp} />
                });

                setTimeout(() => {
                    navigate(`/manufacturers`);
                }, 6000);

            } catch (error) {
                return error;
            }
        }

        if (buttonIntent === 'update') {
            const manufacturerId = currentManufacturer.id;
            // TODO: Consume product update API endpoint
            try {
                const response = await updateManufacturer(manufacturerId, manufacturerData);

                if (response.unAuthorize) {
                    sessionStorage.removeItem('user');
                    navigate(`/?message=${response.message}. Please log in to continue&redirectTo=${pathname}`);
                }

                if (response.error || response.message) {
                    setToastState({
                        title: response.error,
                        description: response.message,
                        status: 'error',
                        icon: <Icon as={BiError} />
                    });

                    setTimeout(() => {
                        isUnauthorized(response, navigate, pathname);
                    }, 6000);

                    return response.error;
                }

                setToastState({
                    title: 'Success!',
                    description: 'Manufacturer updated successfully',
                    status: 'success',
                    icon: <Icon as={FaRegThumbsUp} />
                });

                setTimeout(() => {
                    navigate(`/manufacturers`);
                }, 6000);

            } catch (error) {
                return error;
            }
        }
    };

    return (
        <Stack spacing='6'>
            <Box>
                <Breadcrumb linkList={breadcrumbData} />
            </Box>
            <HStack justifyContent='space-between'>
                <Heading fontSize='3xl' color='blue.700'>{currentManufacturer ? `Update ${currentManufacturer.brandName}` : 'Add Manufacturer'}</Heading>
            </HStack>
            <form onSubmit={handleSubmit(submitManufacturer)}>
                <Stack spacing='4' p='6' borderWidth='1px' borderColor='gray.200' borderRadius='md'>
                    <TextInput name='brandName' label='Brand Name' control={control} type='text' defaultVal={currentManufacturer?.brandName} />

                    <TextInput name='repName' label='Representative Name' control={control} type='text' defaultVal={currentManufacturer?.repName} />

                    <TextInput name='repPhoneNumber' label='Representative Phone' control={control} type='text' defaultVal={currentManufacturer?.repPhoneNumber} />

                    <Button
                        type='submit'
                        data-intent={currentManufacturer ? 'update' : 'add'}
                        colorScheme='blue'
                        isLoading={isSubmitting ? true : false}
                        loadingText='Submitting...'
                        spinnerPlacement='end'
                        ref={submitBtnRef}
                        spinner={<Spinner
                            thickness='4px'
                            speed='0.5s'
                            emptyColor='gray.200'
                            color='blue.300'
                            size='md'
                        />}
                    >
                        {
                            currentManufacturer ?
                                'Update Manufacturer' :
                                'Add Manufacturer'
                        }
                    </Button>
                </Stack>
            </form>
        </Stack>
    )
}

export default ManufacturerForm;