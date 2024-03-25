import { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate, useLoaderData } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Stack, HStack, VStack, SimpleGrid, Box, Icon, Spinner, Button, Heading, FormLabel, Text, Card, CardBody } from '@chakra-ui/react';
import Breadcrumb from '../../components/Breadcrumb';
import TextInput from '../../components/form/TextInput';
import UserField from '../../components/UserField';
import { requireAuth } from '../../hooks/useAuth';
import { useToastHook } from '../../hooks/useToast';
import { BiError } from "react-icons/bi";
import { FaRegThumbsUp } from "react-icons/fa6";
import { createSales } from '../../api/sales';
import { getOrderList } from '../../api/orders';
import TextArea from '../../components/form/TextArea';
import { isUnauthorized } from '../../utils';
import FetchError from '../../components/FetchError';
import Back from '../../components/Back';

export async function loader({ params, request }) {
    await requireAuth(request);
    const response = await getOrderList(params.id);

    if (response.error || response.message) {
        return {
            error: response.error,
            message: response.message,
            statusCode: response.statusCode,
        };
    }

    // console.log(response)

    const data = {
        id: response.id,
        refId: response.refId,
        totalNoOfBags: response.totalNoOfBags,
        totalWeight: response.totalWeight,
        totalAmount: response.totalAmount,
        customerPhoneNumber: response.phoneNumber,
        shippingAddress: response.shippingAddress,
        paymentStatus: response.paymentStatus,
        amountPaid: response.amountPaid,
        outstandingPayment: response.outStandingPayment,
        deliveryStatus: response.deliveryStatus,
        note: response.note,
        date: response.createdAt,
        orderList: response.orderLists,
        staffId: response.staffId,
        customerId: response.customerId,
        staff: response.staff,

    };

    return data;
}

const SalesCreate = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const orderItem = useLoaderData();
    const { staff, orderList } = orderItem;
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
        { name: 'Create Sales', ref: `/sales/create/${orderItem.id}` },
    ];

    const basicOrderInfo = {
        staff: (staff.firstName && staff.lastName) ? `${staff.firstName} ${staff.lastName}` : 'N/A',
        totalAmount: orderItem.totalAmount,
        totalNoOfBags: orderItem.totalNoOfBags,
        totalWeight: orderItem.totalWeight,
        customerPhoneNumber: orderItem.customerPhoneNumber,
        shippingAddress: orderItem.shippingAddress,
        date: orderItem.date,
        note: orderItem.note,
    }

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

    const submitSales = async (data) => {
        const salesData = {
            orderRefId: orderItem.refId,
            amountPaid: Number(data.amountPaid),
            note: data.note,
        };

        // TODO: Consume sales create API endpoint
        try {
            const response = await createSales(salesData);

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
                description: 'Sales created successfully',
                status: 'success',
                icon: <Icon as={FaRegThumbsUp} />
            });

            setTimeout(() => {
                navigate(`/sales`);
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
                    <Heading fontSize='3xl' color='blue.700'>Create Sales</Heading>
                </HStack>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing='4' py='6' borderTopWidth='1px'>
                    <Stack>
                        <Heading fontSize='sm' textTransform='uppercase'>
                            Order Overview
                        </Heading>

                        <GeneralInfo info={basicOrderInfo} />
                    </Stack>

                    <Stack borderLeftWidth='1px' px='4'>
                        <Heading fontSize='sm' textTransform='uppercase'>
                            Sales Form
                        </Heading>
                        <form onSubmit={handleSubmit(submitSales)}>
                            <Stack spacing='6' p='6' borderWidth='1px' borderColor='gray.200' borderRadius='md'>
                                <TextInput name='amountPaid' label='Amount Paid' control={control} type='number' defaultVal={orderItem.amountPaid ? orderItem.amountPaid : ''} />

                                <TextArea name='note' label='Note' control={control} />

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
                                    Create Sales
                                </Button>
                            </Stack>
                        </form>
                    </Stack>
                </SimpleGrid>
            </Stack>
    )
}

const GeneralInfo = ({ info }) => {
    const getInfoArray = (info) => {
        const infoArray = [];
        for (const [key, value] of Object.entries(info)) {
            infoArray.push({ key, value });
        }

        return infoArray;
    }

    return (
        <Card variant='elevated'>
            <CardBody>
                <SimpleGrid spacing={5}>
                    {
                        getInfoArray(info).map((field, index) => (
                            <UserField key={index} field={field} />
                        ))
                    }
                </SimpleGrid>
            </CardBody>
        </Card>
    )
}

export default SalesCreate;