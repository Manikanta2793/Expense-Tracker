import React from 'react';
import { useState, useEffect } from 'react';
import { IndianRupeeIcon, Plus, ShoppingCart, TrendingUp } from 'lucide-react';
import { Wallet } from 'lucide-react';

import StatCard from './components/StatCard';
import SpendingChart from './components/SpendingChart';
import CategoryChart from './components/CategoryChart';
import TransactionList from './components/TransactionList';
import Model from './components/Models';

import { fetchExpenses, createExpense, updateExpense, deleteExpense } from './api.js';

const App = () => {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All')



  //stats Calculation
  const calculationStats = (expenseList) => {
    const list = expenseList || [];
    const total = list.reduce((sum, e) => sum + Number(e.amount || 0), 0);

    const categoryTotals = list.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + Number(e.amount || 0);
      return acc;
    }, {});
    return {
      total,
      count: list.length,
      avg: list.length > 0 ? total / list.length : 0,
      highest:
        list.length > 0 ? Math.max(...list.map((e) => Number(e.amount) || 0)) : 0,
      categoryTotals,
    };

  };
  const stats = calculationStats(expenses);

  useEffect(() => {
    const load = async () => {
      setLoading(true)

      try {
        const [expData] = await Promise.all([fetchExpenses()]);

        const normalized = (expData || []).map((e) => ({
          ...e, date: e?.date ? String(e.date).split("T")[0] : new Date().toISOString().split("T")[0],
        }));

        setExpenses(normalized);


      } catch (error) {
        console.error("load error:", error);
      } finally {
        setLoading(false)
      }






    };
    load();
  }, []);

  // ADD edit and delete functions

  const handleAddExpenses = async (expenseData) => {
    try {
      const created = await createExpense(expenseData);

      if (!created) throw new Error("No expense Created");
      setExpenses((prev) => [{ ...created, date: created.date.split("T")[0] }, ...prev,]);

      setIsModelOpen(false);


    } catch (error) {
      console.error("CREATE ERROR:", error)
    }

  };

  const onEdit = (expense) => {
    setEditingExpense(expense);
    setIsModelOpen(true);
  }

  const handleSaveEdit = async (payload) => {
    if (!editingExpense) return;


    try {
      const updated = await updateExpense(editingExpense._id, payload);

      setExpenses((prev) => prev.map((e) => e._id === updated._id ? { ...updated, date: updated.date.split('T')[0] } : e));
      setEditingExpense(null);
      setIsModelOpen(false)




    } catch (error) {
      console.error("CREATE ERROR:", error)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this Expense")) return;
    try {

      await deleteExpense(id)
      setExpenses((prev) => prev.filter((e) => e._id !== id));

    } catch (error) {
      console.error("Create error:", error)
    }
  }


  return <div className='min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100'>
    {/* {HEADER} */}
    <div className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-6 lg:py-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-700 lg:text-4xl mb-1">Expense Tracker</h1>
          <p className='text-gray-700'>Manage finance with ease</p>

        </div>
        <div className='flex items-center gap-3'>
          <button className='bg-blue-600 text-white px-4 py-2 rounded-xl shadow-md hover:bg-blue-700 transition flex items-center gap-2'
            onClick={() => { setEditingExpense(null); setIsModelOpen(true) }}><Plus className="w-4 h-4" />Add Expense</button>
        </div>

      </div>
    </div>
    {/*Main Content*/}
    <div className='max-w-7xl mx-auto px-6 py-8'>
      {/* {stats} */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        <StatCard value={` ₹${stats.total.toFixed(2)}`} title="Total Spent"
          icon={Wallet}
          subtitle="This Month"
          bgColor="bg-gradient-to-br from-indigo-500 to-indigo-600"
          iconColor="bg-indigo-700" />
        <StatCard value={`${stats.count}`} title="Expenses"
          icon={ShoppingCart}
          subtitle={`${stats.count} transactions`}
          bgColor="bg-gradient-to-br from-purple-500 to-purple-600"
          iconColor="bg-purple-700" />
        <StatCard value={` ₹${stats.avg.toFixed(2)}`} title="Average"
          icon={TrendingUp}
          subtitle="Per expense"
          bgColor="bg-gradient-to-br from-pink-500 to-pink-600"
          iconColor="bg-pink-700" />
        <StatCard value={` ₹${stats.highest.toFixed(2)}`} title="Highest"
          icon={IndianRupeeIcon}
          subtitle="Single expense"
          bgColor="bg-gradient-to-br from-orange-500 to-orange-600"
          iconColor="bg-orange-700" />

      </div>
      {/* charts */}
      <div className='grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8'>
        <div className='lg:col-span-3'>
          <SpendingChart expenses={expenses} />


        </div>
        <div className="lg:col-span-2">
          <CategoryChart categoryTotal={stats.categoryTotals} />

        </div>

      </div>
      {/* TransactionList */}
      <TransactionList
        expenses={expenses}
        onDelete={handleDelete}
        onEdit={onEdit}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
      />




    </div>
    {/* {Models} */}
    <Model isOpen={isModelOpen} onClose={() => {
      setIsModelOpen(false)
      setEditingExpense(null)
    }}
      onSubmit={editingExpense ? handleSaveEdit : handleAddExpenses}
      intialData={editingExpense}
    />



  </div>



}
export default App;
