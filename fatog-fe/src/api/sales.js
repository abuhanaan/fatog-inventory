import { headers, isError } from '../utils';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const endpoint = '/sales';

export async function createSales(salesData) {
    const token = JSON.parse(sessionStorage.getItem('user'))?.accessToken;
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(salesData)
    });

    const data = await res.json();

    isError(res, data);

    return data;
}

export async function getSales() {
    const token = JSON.parse(sessionStorage.getItem('user'))?.accessToken;
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

export async function getSale(saleId) {
    const token = JSON.parse(sessionStorage.getItem('user'))?.accessToken;
    const res = await fetch(`${BASE_URL}${endpoint}/${saleId}`, {
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

export async function updateSale(saleId, saleData) {
    const token = JSON.parse(sessionStorage.getItem('user'))?.accessToken;
    const res = await fetch(`${BASE_URL}${endpoint}/${saleId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(saleData)
    });

    const data = await res.json();

    isError(res, data);

    return data;
}
