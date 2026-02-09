import axios from 'axios';

const DEFAULT_BASE_URL = 'http://localhost:3000/api/v2';
const BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) || DEFAULT_BASE_URL;

const api = axios.create({ baseURL: BASE_URL, timeout: 10000 });

const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common.Authorization;
    }
};

api.interceptors.request.use((config) => {
    if (!config.headers.Authorization && typeof window !== 'undefined') {
        const storedToken = window.localStorage.getItem('expense_tracker_token');
        if (storedToken) {
            config.headers.Authorization = `Bearer ${storedToken}`;
        }
    }
    return config;
});

const fetchExpenses = async () => {
    const res = await api.get('/expense');
    return (res.data && res.data.data) || [];
};

const createExpense = async (payload) => {
    const res = await api.post('/expense', payload);
    return (res.data && res.data.data) || [];
};

const updateExpense = async (id, payload) => {
    const res = await api.put(`/expense/${id}`, payload);
    return (res.data && res.data.data) || [];
};

const deleteExpense = async (id) => {
    const res = await api.delete(`/expense/${id}`);
    return res.data || null;
};

const registerUser = async (payload) => {
    const res = await api.post('/auth/register', payload);
    return (res.data && res.data.data) || null;
};

const loginUser = async (payload) => {
    const res = await api.post('/auth/login', payload);
    return (res.data && res.data.data) || null;
};

export {
    fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
    registerUser,
    loginUser,
    setAuthToken,
};










