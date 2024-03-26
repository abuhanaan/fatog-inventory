import { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate, useLoaderData } from 'react-router-dom';
import TextInput from '../../components/form/TextInput';
import { SizeInput } from '../../components/form/TextInput';
import { useForm } from 'react-hook-form';
import { Stack, HStack, VStack, Flex, Box, Icon, Spinner, Button, Heading, FormLabel, Text } from '@chakra-ui/react';
import Breadcrumb from '../../components/Breadcrumb';
import { requireAuth } from '../../hooks/useAuth';
import { useToastHook } from '../../hooks/useToast';
import { BiError } from "react-icons/bi";
import { FaRegThumbsUp } from "react-icons/fa6";
import { getOrderItem, updateOrderItem } from '../../api/orders';
import { isUnauthorized } from '../../utils';
import FetchError from '../../components/FetchError';
import Back from '../../components/Back';

export async function loader({ params, request }) {
    await requireAuth(request);
    const response = await getOrderItem(params.id);

    if (response.error || response.message) {
        return {
            error: response.error,
            message: response.message,
            statusCode: response.statusCode,
        };
    }

    const data = {
        id: response.id,
        noOfBags: response.noOfBags,
        pricePerBag: response.pricePerBag,
        totalWeight: response.totalWeight,
        totalAmount: response.totalPrice,
        date: response.createdAt,
        product: response.product,
        order: response.order,
    };

    return data;
}

const OrderItemUpdate = () => {
    const navigate = useNavigate();
    const orderItem = useLoaderData();
    const { state, pathname } = useLocation();
    const currentOrderItem = state && state.orderItem;
    const { product, order } = orderItem;
    const [toastState, setToastState] = useToastHook();
    const [error, setError] = useState({
        error: orderItem.error ?? '',
        message: orderItem.message ?? '',
        statusCode: orderItem.statusCode ?? '',
    });
    const {
        handleSubmit,
        control,
        formState: { isSubmitting },
        setValue,
    } = useForm();

    const breadcrumbData = [
        { name: 'Home', ref: '/dashboard' },
        { name: 'Orders', ref: '/orders' },
        { name: 'Order List', ref: `/orders/${order.id}` },
        { name: 'Order Item', ref: `/orders/${order.id}/orderlist/${orderItem.id}` },
        { name: 'Order Update', ref: `/orders/${order.id}/orderlist/${orderItem.id}/edit` },
    ];

    useEffect(() => {
        if (error.error || error.message) {
            setToastState({
                title: error.error,
                description: error.message,
                status: 'error',
                icon: <Icon as={BiError} />
            });

            setTimeout(() => {
                isUnauthorized(error, navigate, pathname);
            }, 6000);
        }
    }, []);

    const orderItemUpdate = async (data) => {
        const orderItemData = {
            productRefId: product.refId,
            noOfBags: Number(data.noOfBags),
            totalWeight: Number(product.weight * data.noOfBags),
            totalPrice: Number(data.noOfBags * product.pricePerBag),
        };

        const orderItemId = orderItem.id;

        // console.log(orderItemData);

        // TODO: Consume stock item update API endpoint
        try {
            const response = await updateOrderItem(orderItemId, orderItemData);

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
                description: 'Order item updated successfully',
                status: 'success',
                icon: <Icon as={FaRegThumbsUp} />
            });

            setTimeout(() => {
                navigate(`/orders/${order.id}/orderlist/${orderItem.id}`);
            }, 6000);

        } catch (error) {
            return error;
        }
    };

    return (
        error.error || error.message ?
            <FetchError error={error} /> :
            <Stack spacing='6'>
                <Stack direction={{base: 'column', sm: 'row'}} justifyContent='space-between' alignItems='center'>
                    <Breadcrumb linkList={breadcrumbData} />
                    <Back />
                </Stack>
                <HStack justifyContent='space-between'>
                    <Heading fontSize='3xl' color='blue.700'>Update Order Item</Heading>
                </HStack>
                <form onSubmit={handleSubmit(orderItemUpdate)}>
                    <Stack spacing='6' p='6' borderWidth='1px' borderColor='gray.200' borderRadius='md'>
                        <TextInput name='noOfBags' label='No of Bags' control={control} type='number' defaultVal={orderItem.noOfBags ?? currentOrderItem.noOfBags} />

                        <Button
                            type='submit'
                            colorScheme='blue'
                            mt='4'
                            isLoading={isSubmitting ? true : false}
                            loadingText='Submitting...'
                            spinnerPlacement='end'
                            spinner={<Spinner
                                thickness='4px'
                                speed='0.5s'
                                emptyColor='gray.200'
                                color='blue.300'
                                size='md'
                            />}
                        >
                            Update Order Item
                        </Button>
                    </Stack>
                </form>
            </Stack>
    )
}

export default OrderItemUpdate;