import { redirect } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const token = JSON.parse(localStorage.getItem('user'))?.accessToken;
const endpoint = '/payments';
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
};

export async function addPayment(paymentsData) {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(paymentsData)
    });

    const data = await res.json();
    console.log(data);

    if (res.status === 401) {
        return {
            unAuthorized: true,
            statusCode: data.statusCode,
            message: data.message,
            error: data.error ?? 'Unauthorized',
        }
    }

    isError(res, data);

    return data;
}

export async function getPayments(request) {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        headers,
    });

    const data = await res.json();

    isUnauthorized(res, request);
    isError(res, data);

    return data;
}

export async function getPayment(request, paymentId) {
    const res = await fetch(`${BASE_URL}${endpoint}/${paymentId}`, {
        method: 'GET',
        headers,
    });

    const data = await res.json();

    isUnauthorized(res, request);
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

    if (res.status === 401) {
        return {
            unAuthorized: true,
            statusCode: data.statusCode,
            message: data.message,
            error: data.error ?? 'Unauthorized',
        }
    }

    isError(res, data);

    return data;
}

const isUnauthorized = (res, request) => {
    if (res.status === 401) {
        const pathname = new URL(request.url).pathname;
        throw redirect(`/?message=Please log in to continue&redirectTo=${pathname}`);
    }
};

const isError = (res, data) => {
    if (!res.ok || data.error) {
        return {
            statusCode: data.statusCode,
            message: data.message,
            error: data.error ?? 'Something went wrong',
            path: data.path
        }
    }
};