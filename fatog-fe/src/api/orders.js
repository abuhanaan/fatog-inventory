import { redirect } from 'react-router-dom';
import { headers } from '../utils';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const endpoint = '/orders';

export async function createOrder(orderData) {
    // console.log(headers);
    // console.log(orderData);
    const res = await fetch(`${BASE_URL}/order-lists`, {
        method: 'POST',
        headers,
        body: JSON.stringify(orderData)
    });
    
    const data = await res.json();

    isError(res, data);

    return data;
}

export async function getOrders() {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        headers,
    });

    // console.log(res);

    const data = await res.json();

    isError(res, data);

    return data;
}

export async function getOrderItem(orderId) {
    const res = await fetch(`${BASE_URL}/order-lists/${orderId}`, {
        method: 'GET',
        headers,
    });

    const data = await res.json();

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

    isError(res, data);

    return data;
}

export async function getOrderList(orderId) {
    const res = await fetch(`${BASE_URL}${endpoint}/${orderId}`, {
        method: 'GET',
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