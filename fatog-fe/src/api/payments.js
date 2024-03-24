import { redirect } from 'react-router-dom';
import { headers, isError } from '../utils';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const endpoint = '/payments';

export async function addPayment(paymentsData) {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(paymentsData)
    });

    const data = await res.json();
    // console.log(data);

    isError(res, data);

    return data;
}

export async function getPayments() {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        headers,
    });

    const data = await res.json();

    isError(res, data);

    return data;
}

export async function getPayment(paymentId) {
    const res = await fetch(`${BASE_URL}${endpoint}/${paymentId}`, {
        method: 'GET',
        headers,
    });

    const data = await res.json();

    isError(res, data);

    return data;
}

export async function updatePayment(paymentId, paymentData) {
    const res = await fetch(`${BASE_URL}${endpoint}/${paymentId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(paymentData)
    });

    const data = await res.json();

    isError(res, data);

    return data;
}

const isUnauthorized = (res, request) => {
    if (res.status === 401) {
        const pathname = new URL(request.url).pathname;
        throw redirect(`/?message=Please log in to continue&redirectTo=${pathname}`);
    }
};
