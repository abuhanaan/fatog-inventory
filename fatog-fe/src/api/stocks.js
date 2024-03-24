import { redirect } from 'react-router-dom';
import { isError, headers } from '../utils';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const endpoint = '/stocks';

export async function createStock(stockData) {
    const res = await fetch(`${BASE_URL}/stock-lists`, {
        method: 'POST',
        headers,
        body: JSON.stringify(stockData)
    });

    // console.log('res', res);
    
    const data = await res.json();

    isError(res, data);

    return data;
}

export async function getStocks() {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        headers,
    });

    const data = await res.json();

    isError(res, data);

    return data;
}

export async function getStockItem(stockId) {
    const res = await fetch(`${BASE_URL}/stock-lists/${stockId}`, {
        method: 'GET',
        headers,
    });

    const data = await res.json();

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

    isError(res, data);

    return data;
}

export async function getStockList(stockId) {
    const res = await fetch(`${BASE_URL}${endpoint}/${stockId}`, {
        method: 'GET',
        headers,
    });

    const data = await res.json();

    isError(res, data);

    return data;
}
