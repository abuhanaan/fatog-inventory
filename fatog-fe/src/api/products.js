import { redirect } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const user = JSON.parse(sessionStorage.getItem('user'));
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${user.accessToken}`,
};

export async function createProduct(productData) {
    const res = await fetch(`${BASE_URL}/products`, {
        method: 'POST',
        headers,
        body: JSON.stringify(productData)
    });

    const data = await res.json();

    isUnauthorized(res);
    isError(res);

    return data;
}

export async function updateProduct(productId, productData) {
    const res = await fetch(`${BASE_URL}/products/${productId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(productData)
    });

    const data = await res.json();

    isUnauthorized(res);
    isError(res);

    return data;
}

export async function getProducts(request) {
    const res = await fetch(`${BASE_URL}/products`, {
        method: 'GET',
        headers,
    });

    const data = await res.json();

    isUnauthorized(res);
    isError(res);

    return data;
}

export async function getProduct(productId, request) {
    const res = await fetch(`${BASE_URL}/products/${productId}`, {
        method: 'GET',
        headers,
    });

    const data = await res.json();

    isUnauthorized(res);
    isError(res);

    return data;
}

export async function deleteProduct(productId) {
    const res = await fetch(`https://hospital-scan-arhive-sys.onrender.com/users/delete/${productId}`, {
        method: 'DELETE',
        headers,
    });

    const data = await res.json();

    isUnauthorized(res);
    isError(res);

    return data;
}

const isUnauthorized = (res) => {
    if (res.status === 401) {
        const pathname = new URL(request.url).pathname;
        throw redirect(`/?message=Please log in to continue&redirectTo=${pathname}`);
    }
};

const isError = (res) => {
    if (!res.ok || data.error) {
        return {
            statusCode: data.statusCode,
            message: data.message,
            error: data.error ?? 'Something went wrong',
            path: data.path
        }
    }
};