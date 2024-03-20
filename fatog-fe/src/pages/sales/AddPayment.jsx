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
import { addPayment } from '../../api/payments';
import { getSale } from '../../api/sales';
import TextArea from '../../components/form/TextArea';

export async function loader({ params, request }) {
    await requireAuth(request);
    const response = await getSale(request, params.id);

    if (response.error || response.message) {
        return {
            error: response.error,
            message: response.message
        };
    }

    console.log(response)

    const data = {
        id: response.id,
        orderId: response.order.id,
        amountPaid: response.amountPaid,
        amountPayable: response.amountPayable,
        outstandingPayment: response.outStandingPayment,
        paymentStatus: response.paymentStatus,
    };

    return data;
}

const AddPayment = () => {
    const navigate = useNavigate();
    const sale = useLoaderData();
    const [toastState, setToastState] = useToastHook();
    const [error, setError] = useState({
        error: sale.error ?? '',
        message: sale.message ?? ''
    });
    const {
        handleSubmit,
        control,
        formState: { isSubmitting },
        setValue,
    } = useForm();

    const breadcrumbData = [
        { name: 'Home', ref: '/dashboard' },
        { name: 'Sales', ref: '/sales' },
        { name: 'Add Payment', ref: `/sales/${sale.id}/payments/add` },
    ];

    const basicSaleInfo = {
        amountPayable: sale.amountPayable,
        amountPaid: sale.amountPaid,
        outstandingPayment: sale.outstandingPayment,
        paymentStatus: sale.paymentStatus,
    }

    useEffect(() => {
        if (error.error || error.message) {
            setToastState({
                title: error.error,
                description: error.message,
                status: 'error',
                icon: <Icon as={BiError} />
            });
        }
    }, []);

    const submitPayment = async (data) => {
        const paymentData = {
            orderId: sale.orderId,
            salesId: sale.id,
            amountPaid: Number(data.amountPaid),
            date: new Date(data.date).toISOString(),
        };

        console.log(paymentData);

        // TODO: Consume sales create API endpoint
        try {
            const response = await addPayment(paymentData);

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

                return response.error;
            }

            setToastState({
                title: 'Success!',
                description: 'Payment added successfully',
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
            <VStack h='30rem' justifyContent='center'>
                <Heading>{error.error}</Heading>
                <Text>{error.message}</Text>
                <Button colorScheme='blue' onClick={() => window.location.reload()} mt='6'>Refresh</Button>
            </VStack> :
            <Stack spacing='6'>
                <Box>
                    <Breadcrumb linkList={breadcrumbData} />
                </Box>
                <HStack justifyContent='space-between'>
                    <Heading fontSize='3xl' color='blue.700'>Add Payment</Heading>
                </HStack>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing='4' py='6' borderTopWidth='1px'>
                    <Stack>
                        <Heading fontSize='sm' textTransform='uppercase'>
                            Sales Overview
                        </Heading>

                        <GeneralInfo info={basicSaleInfo} />
                    </Stack>

                    <Stack borderLeftWidth='1px' px='4'>
                        <Heading fontSize='sm' textTransform='uppercase'>
                            Payment Form
                        </Heading>
                        <form onSubmit={handleSubmit(submitPayment)}>
                            <Stack spacing='6' p='6' borderWidth='1px' borderColor='gray.200' borderRadius='md'>
                                <TextInput name='amountPaid' label='Amount Paid' control={control} type='number' defaultVal={''} />

                                <TextInput name='date' label='Date' control={control} type='date' />

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
                                    Add Payment
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

export default AddPayment;