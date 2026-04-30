import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { user, loginUser } = useAuth();
  const navigate = useNavigate();

  // Si déjà connecté, redirige vers le dashboard
  if (user) return <Navigate to="/" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form);
      loginUser(res.data.token, res.data.user);
      toast.success(`Bienvenue ${res.data.user.username} ! 👋`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur de connexion');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-4xl font-bold text-primary">
            Fit<span className="text-secondary">Quest</span>
          </h1>
          <p className="font-body text-text-muted mt-2">
            Track workouts, nutrition and stay motivated
          </p>
        </div>

        {/* Card */}
        <div className="card">
          <h2 className="font-heading text-2xl font-semibold text-text-main mb-6">
            Connexion
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-body text-sm font-medium text-text-muted mb-1 block">
                Email
              </label>
              <input type="email" placeholder="ton@email.com"
                className="input-field"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
              />
            </div>
            <div>
              <label className="font-body text-sm font-medium text-text-muted mb-1 block">
                Mot de passe
              </label>
              <input type="password" placeholder="••••••••"
                className="input-field"
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
              />
            </div>
            <button type="submit" className="btn-primary w-full mt-2">
              Se connecter
            </button>
          </form>
          <p className="font-body text-center text-text-muted mt-6 text-sm">
            Pas de compte ?{' '}
            <Link to="/register" className="text-primary font-medium hover:underline">
              S'inscrire
            </Link>
          </p>
          <p className="font-body text-center text-text-muted mt-2 text-sm">
            <Link to="/home" className="text-text-muted hover:text-primary">
              ← Retour à l'accueil
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}