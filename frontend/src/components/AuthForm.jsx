import { useState } from 'react';

const AuthForm = ({ onLogin, onRegister, isLoading, error, onClearError }) => {
  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleChange = (field) => (event) => {
    if (onClearError) onClearError();
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (onClearError) onClearError();
    if (mode === 'login') {
      onLogin({ email: formData.email.trim(), password: formData.password });
    } else {
      onRegister({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
    }
  };

  const toggleMode = () => {
    if (onClearError) onClearError();
    setMode((prev) => (prev === 'login' ? 'register' : 'login'));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Expense Tracker</h1>
        <p className="text-center text-gray-500 mb-6">
          {mode === 'login' ? 'Sign in to view your expenses' : 'Create an account to start tracking'}
        </p>
        <form className="space-y-5" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={handleChange('name')}
                placeholder="Your name"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500"
                autoComplete="name"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              placeholder="you@example.com"
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500"
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={handleChange('password')}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
            />
          </div>
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create Account'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          {mode === 'login' ? 'Need an account?' : 'Already have an account?'}{' '}
          <button type="button" onClick={toggleMode} className="text-indigo-600 font-semibold hover:underline">
            {mode === 'login' ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
