import { redirect } from 'react-router-dom';
import { headers, isError } from '../utils';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const endpoint = '/payments';

export async function addPayment(paymentsData) {
    const token = JSON.parse(localStorage.getItem('user'))?.accessToken;
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(paymentsData)
    });

    const data = await res.json();

    isError(res, data);

    return data;
}

export async function getPayments() {
    const token = JSON.parse(localStorage.getItem('user'))?.accessToken;
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    const data = await res.json();

    isError(res, data);

    return data;
}

export async function getPayment(paymentId) {
    const token = JSON.parse(localStorage.getItem('user'))?.accessToken;
    const res = await fetch(`${BASE_URL}${endpoint}/${paymentId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    const data = await res.json();

    isError(res, data);

    return data;
}

export async function updatePayment(paymentId, paymentData) {
    const token = JSON.parse(localStorage.getItem('user'))?.accessToken;
    const res = await fetch(`${BASE_URL}${endpoint}/${paymentId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
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
