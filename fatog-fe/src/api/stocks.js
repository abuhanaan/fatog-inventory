import { redirect } from 'react-router-dom';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const token = JSON.parse(localStorage.getItem('user'))?.accessToken;
const endpoint = '/stocks';
const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
};

export async function createStock(stockData) {
    const res = await fetch(`${BASE_URL}/stock-lists`, {
        method: 'POST',
        headers,
        body: JSON.stringify(stockData)
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

export async function getStocks(request) {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        headers,
    });

    const data = await res.json();

    isUnauthorized(res, request);
    isError(res, data);

    return data;
}

export async function getStockItem(request, stockId) {
    const res = await fetch(`${BASE_URL}/stock-lists/${stockId}`, {
        method: 'GET',
        headers,
    });

    const data = await res.json();

    isUnauthorized(res, request);
    isError(res, data);

    return data;
}

export async function updateStockItem(stockItemId, stockItemData) {
    const res = await fetch(`${BASE_URL}/stock-lists/${stockItemId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(stockItemData)
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

export async function getStockList(request, stockId) {
    const res = await fetch(`${BASE_URL}${endpoint}/${stockId}`, {
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