import { redirect } from 'react-router-dom';
import { headers } from '../utils';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const endpoint = '/products';

export async function createProduct(productData) {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(productData)
    });

    const data = await res.json();

    isError(res, data);

    return data;
}

export async function updateProduct(productId, productData) {
    console.log(productId);
    console.log(productData);
    const res = await fetch(`${BASE_URL}${endpoint}/${productId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(productData)
    });

    // console.log(res)

    const data = await res.json();

    isError(res, data);

    return data;
}

export async function getProducts() {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        headers,
    });

    const data = await res.json();

    isError(res, data);

    return data;
}

export async function getProduct(productId) {
    const res = await fetch(`${BASE_URL}${endpoint}/${productId}`, {
        method: 'GET',
        headers,
    });

    const data = await res.json();

    isError(res, data);

    return data;
}

export async function deleteProduct(productId) {
    const res = await fetch(`${BASE_URL}${endpoint}/${productId}`, {
        method: 'DELETE',
        headers,
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