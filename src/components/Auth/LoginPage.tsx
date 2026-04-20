import React, { useState } from 'react';
import {
  Network, Eye, EyeOff, Lock, Mail, AlertCircle,
  ShieldCheck, UserPlus, LogIn, User, ChevronDown, ChevronUp
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { clsx } from 'clsx';

type Tab = 'login' | 'register';

const LoginPage: React.FC = () => {
  const { login, register } = useAuth();
  const [tab, setTab] = useState<Tab>('login');

  // Общие поля
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Только для регистрации
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  // Демо-раздел
  const [demoOpen, setDemoOpen] = useState(false);

  const resetForm = () => {
    setEmail(''); setPassword(''); setName('');
    setConfirmPassword(''); setError(''); setSuccess('');
  };

  const switchTab = (t: Tab) => {
    setTab(t);
    resetForm();
  };

  // ── Вход ──────────────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (!result.success) setError(result.error || 'Ошибка входа');
  };

  // ── Регистрация ───────────────────────────────────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');

    if (!name.trim()) { setError('Введите ваше имя'); return; }
    if (password !== confirmPassword) { setError('Пароли не совпадают'); return; }
    if (password.length < 6) { setError('Пароль должен содержать минимум 6 символов'); return; }

    setLoading(true);
    const result = await register(name, email, password);
    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Ошибка регистрации');
    }
    // При успехе AuthContext автоматически уставновит user → роутер перенаправит
  };

  // ── Быстрый вход (демо) ───────────────────────────────────────────────────
  const handleQuickLogin = async (role: 'admin' | 'user') => {
    const creds = role === 'admin'
      ? { email: 'admin@company.com', password: 'admin123' }
      : { email: 'user@company.com', password: 'user123' };
    setError(''); setSuccess('');
    setLoading(true);
    await login(creds.email, creds.password);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Фоновые блики */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/2 w-72 h-72 bg-cyan-500/5 rounded-full blur-2xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Логотип */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-blue-500/10 border border-blue-500/30 mb-4 relative">
            <Network className="w-10 h-10 text-blue-400" />
            <div className="absolute inset-0 rounded-2xl bg-blue-400/5 blur-sm" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            NetControl <span className="text-blue-400">Pro</span>
          </h1>
          <p className="text-slate-400 mt-2 text-sm">Система мониторинга локальной сети</p>
        </div>

        {/* Карточка */}
        <div className="bg-[#1e293b]/90 backdrop-blur-md border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">

          {/* Переключатель вкладок */}
          <div className="flex border-b border-slate-700/50">
            <button
              onClick={() => switchTab('login')}
              className={clsx(
                "flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all duration-200",
                tab === 'login'
                  ? "text-blue-400 border-b-2 border-blue-400 bg-blue-500/5"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
              )}
            >
              <LogIn className="w-4 h-4" /> Вход
            </button>
            <button
              onClick={() => switchTab('register')}
              className={clsx(
                "flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all duration-200",
                tab === 'register'
                  ? "text-blue-400 border-b-2 border-blue-400 bg-blue-500/5"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
              )}
            >
              <UserPlus className="w-4 h-4" /> Регистрация
            </button>
          </div>

          <div className="p-7">
            {/* ── ФОРМА ВХОДА ─────────────────────────────────────────── */}
            {tab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-5">
                <p className="text-slate-400 text-sm mb-1">
                  Введите ваши данные для входа в систему.
                </p>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Email адрес</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email" required
                      value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="example@company.com"
                      className="w-full bg-slate-900/80 border border-slate-700 text-white text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all placeholder:text-slate-600"
                    />
                  </div>
                </div>

                {/* Пароль */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Пароль</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'} required
                      value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-900/80 border border-slate-700 text-white text-sm rounded-xl pl-10 pr-12 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all placeholder:text-slate-600"
                    />
                    <button type="button" onClick={() => setShowPassword(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Ошибка */}
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                  </div>
                )}

                <button type="submit" disabled={loading}
                  className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 mt-2">
                  {loading
                    ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Вход...</>
                    : <><LogIn className="w-4 h-4" /> Войти в систему</>
                  }
                </button>

                <p className="text-center text-sm text-slate-400">
                  Нет аккаунта?{' '}
                  <button type="button" onClick={() => switchTab('register')}
                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors underline underline-offset-2">
                    Зарегистрироваться
                  </button>
                </p>
              </form>
            )}

            {/* ── ФОРМА РЕГИСТРАЦИИ ────────────────────────────────────── */}
            {tab === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4">
                <p className="text-slate-400 text-sm mb-1">
                  Создайте аккаунт для доступа к системе мониторинга.
                </p>

                {/* Имя */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Полное имя</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text" required
                      value={name} onChange={e => setName(e.target.value)}
                      placeholder="Одилбек Юсупов"
                      className="w-full bg-slate-900/80 border border-slate-700 text-white text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all placeholder:text-slate-600"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Email адрес</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email" required
                      value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="example@company.com"
                      className="w-full bg-slate-900/80 border border-slate-700 text-white text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all placeholder:text-slate-600"
                    />
                  </div>
                </div>

                {/* Пароль */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Пароль</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'} required
                      value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="Минимум 6 символов"
                      className="w-full bg-slate-900/80 border border-slate-700 text-white text-sm rounded-xl pl-10 pr-12 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all placeholder:text-slate-600"
                    />
                    <button type="button" onClick={() => setShowPassword(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {/* Индикатор силы пароля */}
                  {password.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className={clsx(
                          "h-1 flex-1 rounded-full transition-colors duration-300",
                          password.length >= i * 2
                            ? password.length >= 8 ? "bg-green-500" : "bg-yellow-500"
                            : "bg-slate-700"
                        )} />
                      ))}
                    </div>
                  )}
                </div>

                {/* Подтверждение пароля */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Подтвердите пароль</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showConfirm ? 'text' : 'password'} required
                      value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Повторите пароль"
                      className={clsx(
                        "w-full bg-slate-900/80 border text-white text-sm rounded-xl pl-10 pr-12 py-3 focus:outline-none focus:ring-1 transition-all placeholder:text-slate-600",
                        confirmPassword && confirmPassword !== password
                          ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/20"
                          : confirmPassword && confirmPassword === password
                            ? "border-green-500/60 focus:border-green-500 focus:ring-green-500/20"
                            : "border-slate-700 focus:border-blue-500 focus:ring-blue-500/30"
                      )}
                    />
                    <button type="button" onClick={() => setShowConfirm(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Ошибка / Успех */}
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" /> {error}
                  </div>
                )}

                <button type="submit" disabled={loading}
                  className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25">
                  {loading
                    ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Регистрация...</>
                    : <><UserPlus className="w-4 h-4" /> Создать аккаунт</>
                  }
                </button>

                <p className="text-center text-sm text-slate-400">
                  Уже есть аккаунт?{' '}
                  <button type="button" onClick={() => switchTab('login')}
                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors underline underline-offset-2">
                    Войти
                  </button>
                </p>
              </form>
            )}

            {/* ── ДЕМО-РАЗДЕЛ (внизу, сворачиваемый) ─────────────────── */}
            <div className="mt-6 border-t border-slate-700/50 pt-4">
              <button
                type="button"
                onClick={() => setDemoOpen(o => !o)}
                className="w-full flex items-center justify-between text-xs text-slate-500 hover:text-slate-300 transition-colors group"
              >
                <span className="uppercase tracking-wider font-medium">Демо-аккаунты (для проверки)</span>
                {demoOpen
                  ? <ChevronUp className="w-4 h-4 group-hover:text-slate-300 transition-colors" />
                  : <ChevronDown className="w-4 h-4 group-hover:text-slate-300 transition-colors" />
                }
              </button>

              {demoOpen && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('admin')}
                    disabled={loading}
                    className="flex flex-col items-start gap-1 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl hover:bg-blue-500/20 transition-colors text-left group disabled:opacity-50"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-400 text-xs font-semibold">Администратор</span>
                    </div>
                    <span className="text-slate-500 text-xs">admin@company.com</span>
                    <span className="text-slate-600 text-xs">Пароль: admin123</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('user')}
                    disabled={loading}
                    className="flex flex-col items-start gap-1 p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:bg-slate-700/50 transition-colors text-left group disabled:opacity-50"
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-300" />
                      <span className="text-slate-300 text-xs font-semibold">Пользователь</span>
                    </div>
                    <span className="text-slate-500 text-xs">user@company.com</span>
                    <span className="text-slate-600 text-xs">Пароль: user123</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <p className="text-center text-slate-600 text-xs mt-5">
          NetControl Pro v2.1.0 — Дипломный проект по ИТ
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
