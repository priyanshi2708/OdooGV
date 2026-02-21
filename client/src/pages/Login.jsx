import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Loader2 } from 'lucide-react';
import { authService } from '../services/api';
import useStore from '../store/useStore';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const setUser = useStore((state) => state.setUser);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data } = await authService.login({ email, password });

            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);

            navigate('/');

        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Login failed. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/10"
            >
                <h1 className="text-3xl font-black text-white mb-6 text-center">
                    FleetFlow Login
                </h1>

                {error && (
                    <div className="bg-red-500/10 text-red-400 p-3 rounded-xl mb-4 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-3 pl-12 pr-4 text-white"
                            required
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full bg-slate-800 border border-slate-700 rounded-2xl py-3 pl-12 pr-4 text-white"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-3 rounded-2xl font-bold"
                    >
                        {loading ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-400">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-indigo-400 font-bold">
                        Sign Up
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;