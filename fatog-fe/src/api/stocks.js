import { redirect } from 'react-router-dom';
import { isError, headers } from '../utils';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const endpoint = '/stocks';

export async function createStock(stockData) {
    const token = JSON.parse(localStorage.getItem('user'))?.accessToken;
    const res = await fetch(`${BASE_URL}/stock-lists`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(stockData)
    });
    
    const data = await res.json();

    isError(res, data);

    return data;
}

export async function getStocks() {
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

export async function getStockItem(stockId) {
    const token = JSON.parse(localStorage.getItem('user'))?.accessToken;
    const res = await fetch(`${BASE_URL}/stock-lists/${stockId}`, {
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

export async function updateStockItem(stockItemId, stockItemData) {
    const token = JSON.parse(localStorage.getItem('user'))?.accessToken;
    const res = await fetch(`${BASE_URL}/stock-lists/${stockItemId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(stockItemData)
    });

    const data = await res.json();

    isError(res, data);

    return data;
}

export async function getStockList(stockId) {
    const token = JSON.parse(localStorage.getItem('user'))?.accessToken;
    const res = await fetch(`${BASE_URL}${endpoint}/${stockId}`, {
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
