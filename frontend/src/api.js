import axios from 'axios';

const BaseUrl = 'https://expense-tracker-backend-6-ttwp.onrender.com/api/v2';

const api = axios.create({baseURL:BaseUrl, timeout:3000});


const fetchExpenses = async ()=>{
    const res = await api.get('/expense');
    return (res.data && res.data.data);
};
const createExpense = async (payload)=>{
    const res = await api.post('/expense', payload);
    return (res.data && res.data.data) || [];
};
const updateExpense = async (id , payload)=>{
    const res = await api.put(`/expense/${id}`,payload);
    return (res.data && res.data.data) || [];
};

const deleteExpense = async (id)=>{
    const res = await api.delete(`/expense/${id}`);
    return (res.data ) || null;
};

export {fetchExpenses,createExpense,updateExpense,deleteExpense};










