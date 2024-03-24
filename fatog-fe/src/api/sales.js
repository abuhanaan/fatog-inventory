import { headers, isError } from '../utils';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const endpoint = '/sales';
export async function createSales(salesData) {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(salesData)
    });

    const data = await res.json();
    // console.log(data);

    isError(res, data);

    return data;
}

export async function getSales() {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        headers,
    });

    const data = await res.json();

    isError(res, data);

    return data;
}

export async function getSale(saleId) {
    const res = await fetch(`${BASE_URL}${endpoint}/${saleId}`, {
        method: 'GET',
        headers,
    });

    const data = await res.json();

    isError(res, data);

    return data;
}

export async function updateSale(saleId, saleData) {
    const res = await fetch(`${BASE_URL}${endpoint}/${saleId}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(saleData)
    });

    const data = await res.json();

    isError(res, data);

    return data;
}
