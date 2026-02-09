import React, { useState, useEffect, useCallback } from 'react';
import { IndianRupeeIcon, Plus, ShoppingCart, TrendingUp, LogOut } from 'lucide-react';
import { Wallet } from 'lucide-react';

import StatCard from './components/StatCard';
import SpendingChart from './components/SpendingChart';
import CategoryChart from './components/CategoryChart';
import TransactionList from './components/TransactionList';
import Model from './components/Models';
import AuthForm from './components/AuthForm';

import {
  fetchExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  registerUser,
  loginUser,
  setAuthToken,
} from './api.js';

const TOKEN_STORAGE_KEY = 'expense_tracker_token';
const USER_STORAGE_KEY = 'expense_tracker_user';

const extractErrorMessage = (error, fallback) => {
  if (error?.code === 'ECONNABORTED') {
    return 'Request timed out. Please try again.';
  }
  return error?.response?.data?.message || error?.message || fallback;
};

const App = () => {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const persistAuth = useCallback((tokenValue, userValue) => {
    setToken(tokenValue);
    setUser(userValue);
    setAuthToken(tokenValue);

    if (typeof window !== 'undefined') {
      if (tokenValue) {
        window.localStorage.setItem(TOKEN_STORAGE_KEY, tokenValue);
      }
      if (userValue) {
        window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userValue));
      }
    }
  }, []);

  const handleLogout = useCallback(() => {
    setToken(null);
    setUser(null);
    setAuthToken(null);
    setExpenses([]);

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
      window.localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedToken = window.localStorage.getItem(TOKEN_STORAGE_KEY);
    const storedUser = window.localStorage.getItem(USER_STORAGE_KEY);

    if (storedToken) {
      setToken(storedToken);
      setAuthToken(storedToken);
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        window.localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    if (!token) {
      setExpenses([]);
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        const expData = await fetchExpenses();
        const normalized = (expData || []).map((expense) => ({
          ...expense,
          date: expense?.date ? String(expense.date).split('T')[0] : new Date().toISOString().split('T')[0],
        }));
        setExpenses(normalized);
      } catch (error) {
        console.error('load error:', error);
        if (error?.response?.status === 401) {
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token, handleLogout]);

  const calculationStats = (expenseList) => {
    const list = expenseList || [];
    const total = list.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);

    const categoryTotals = list.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + Number(expense.amount || 0);
      return acc;
    }, {});

    return {
      total,
      count: list.length,
      avg: list.length > 0 ? total / list.length : 0,
      highest: list.length > 0 ? Math.max(...list.map((expense) => Number(expense.amount) || 0)) : 0,
      categoryTotals,
    };
  };

  const stats = calculationStats(expenses);

  const handleLogin = async (credentials) => {
    setAuthLoading(true);
    setAuthError('');
    try {
      const data = await loginUser(credentials);
      if (!data?.token) throw new Error('Login failed');
      persistAuth(data.token, data.user);
    } catch (error) {
      setAuthError(extractErrorMessage(error, 'Login failed'));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (payload) => {
    setAuthLoading(true);
    setAuthError('');
    try {
      const data = await registerUser(payload);
      if (!data?.token) throw new Error('Registration failed');
      persistAuth(data.token, data.user);
    } catch (error) {
      setAuthError(extractErrorMessage(error, 'Registration failed'));
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAddExpenses = async (expenseData) => {
    try {
      const created = await createExpense(expenseData);
      if (!created) throw new Error('No expense created');
      setExpenses((prev) => [{ ...created, date: created.date.split('T')[0] }, ...prev]);
      setIsModelOpen(false);
    } catch (error) {
      console.error('CREATE ERROR:', error);
      if (error?.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const onEdit = (expense) => {
    setEditingExpense(expense);
    setIsModelOpen(true);
  };

  const handleSaveEdit = async (payload) => {
    if (!editingExpense) return;

    try {
      const updated = await updateExpense(editingExpense._id, payload);
      setExpenses((prev) =>
        prev.map((expense) =>
          expense._id === updated._id ? { ...updated, date: updated.date.split('T')[0] } : expense
        )
      );
      setEditingExpense(null);
      setIsModelOpen(false);
    } catch (error) {
      console.error('UPDATE ERROR:', error);
      if (error?.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this Expense')) return;
    try {
      await deleteExpense(id);
      setExpenses((prev) => prev.filter((expense) => expense._id !== id));
    } catch (error) {
      console.error('DELETE ERROR:', error);
      if (error?.response?.status === 401) {
        handleLogout();
      }
    }
  };

  if (!token) {
    return (
      <AuthForm
        onLogin={handleLogin}
        onRegister={handleRegister}
        isLoading={authLoading}
        error={authError}
        onClearError={() => setAuthError('')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6 lg:py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-700 lg:text-4xl mb-1">Expense Tracker</h1>
            <p className="text-gray-700">Manage finance with ease</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end text-right">
              <span className="text-sm font-semibold text-gray-700">{user?.name || user?.email}</span>
              <span className="text-xs text-gray-500">{user?.email}</span>
            </div>
            <button
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl shadow-md hover:bg-gray-200 transition flex items-center gap-2"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />Logout
            </button>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow-md hover:bg-blue-700 transition flex items-center gap-2"
              onClick={() => {
                setEditingExpense(null);
                setIsModelOpen(true);
              }}
            >
              <Plus className="w-4 h-4" />Add Expense
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {isLoading && (
          <div className="mb-4 text-sm text-gray-500">Loading your expenses...</div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            value={` ₹${stats.total.toFixed(2)}`}
            title="Total Spent"
            icon={Wallet}
            subtitle="This Month"
            bgColor="bg-gradient-to-br from-indigo-500 to-indigo-600"
            iconColor="bg-indigo-700"
          />
          <StatCard
            value={`${stats.count}`}
            title="Expenses"
            icon={ShoppingCart}
            subtitle={`${stats.count} transactions`}
            bgColor="bg-gradient-to-br from-purple-500 to-purple-600"
            iconColor="bg-purple-700"
          />
          <StatCard
            value={` ₹${stats.avg.toFixed(2)}`}
            title="Average"
            icon={TrendingUp}
            subtitle="Per expense"
            bgColor="bg-gradient-to-br from-pink-500 to-pink-600"
            iconColor="bg-pink-700"
          />
          <StatCard
            value={` ₹${stats.highest.toFixed(2)}`}
            title="Highest"
            icon={IndianRupeeIcon}
            subtitle="Single expense"
            bgColor="bg-gradient-to-br from-orange-500 to-orange-600"
            iconColor="bg-orange-700"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
          <div className="lg:col-span-3">
            <SpendingChart expenses={expenses} />
          </div>
          <div className="lg:col-span-2">
            <CategoryChart categoryTotal={stats.categoryTotals} />
          </div>
        </div>

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

      <Model
        isOpen={isModelOpen}
        onClose={() => {
          setIsModelOpen(false);
          setEditingExpense(null);
        }}
        onSubmit={editingExpense ? handleSaveEdit : handleAddExpenses}
        intialData={editingExpense}
      />
    </div>
  );
};

export default App;
