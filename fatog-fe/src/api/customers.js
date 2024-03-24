import { jwtDecode } from 'jwt-decode';
import { redirect } from 'react-router-dom';
import { headers } from '../utils';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const endpoint = '/customer';

export async function updateCustomer(customerData) {
    const res = await fetch(`${BASE_URL}${endpoint}/profile-update`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(customerData)
    });

    const data = await res.json();

    isError(res, data);

    return data;
}

export async function getCustomers() {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        headers,
    });

    const data = await res.json();

    // if (res.status === 401) {
    //     const pathname = new URL(request.url).pathname;
    //     throw redirect(`/?message=Please log in to continue&redirectTo=${pathname}`);
    // }
    
    isError(res, data);

    return data;
}

export async function getCustomer() {
    const res = await fetch(`${BASE_URL}${endpoint}/profile`, {
        method: 'GET',
        headers,
    });

    const data = await res.json();

    // isUnauthorized(res, request);
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