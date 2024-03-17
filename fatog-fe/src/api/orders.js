import { redirect } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const user = JSON.parse(sessionStorage.getItem('user'));
const endpoint = '/orders';
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${user?.accessToken}`,
};

export async function createOrder(orderData) {
    const res = await fetch(`${BASE_URL}/order-lists`, {
        method: 'POST',
        headers,
        body: JSON.stringify(orderData)
    });

    console.log('res', res);
    
    const data = await res.json();
    console.log('data', data);

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

export async function getOrders(request) {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        headers,
    });

    const data = await res.json();

    isUnauthorized(res, request);
    isError(res, data);

    return data;
}

export async function getOrderItem(request, orderId) {
    const res = await fetch(`${BASE_URL}/order-lists/${orderId}`, {
        method: 'GET',
        headers,
    });

    const data = await res.json();

    isUnauthorized(res, request);
    isError(res, data);

    return data;
}

export async function updateOrderItem(orderItemId, orderItemData) {
    const res = await fetch(`${BASE_URL}/order-lists/${orderItemId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(orderItemData)
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

export async function getOrderList(request, orderId) {
    const res = await fetch(`${BASE_URL}${endpoint}/${orderId}`, {
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