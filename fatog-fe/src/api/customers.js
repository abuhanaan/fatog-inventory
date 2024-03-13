import { jwtDecode } from 'jwt-decode';
import { redirect } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const user = JSON.parse(sessionStorage.getItem('user'));
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${user?.accessToken}`,
};
const authHeaders = {
    'Content-Type': 'application/json'
};
const endpoint = '/customer';

export async function updateCustomer(customerId, customerData) {
    const res = await fetch(`${BASE_URL}${endpoint}/${customerId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(customerData)
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

export async function getCustomers(request) {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        headers,
    });

    const data = await res.json();

    isUnauthorized(res, request);
    isError(res, data);

    return data;
}

export async function getCustomer(request, customerId) {
    const res = await fetch(`${BASE_URL}${endpoint}/${customerId}`, {
        method: 'GET',
        headers,
    });

    const data = await res.json();

    isUnauthorized(res, request);
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