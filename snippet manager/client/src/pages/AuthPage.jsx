import { useState } from 'react';

function AuthPage({ auth }) {
  const { page, setPage, login, register, error, setError, loading } = auth;

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(loginForm.email, loginForm.password);
    } catch {
      // handled by hook
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await register(
        registerForm.username,
        registerForm.email,
        registerForm.password
      );
    } catch {
      // handled by hook
    }
  };

  return (
    <div className="auth-container">
      <h1>Code Snippet Manager</h1>

      <div className="auth-box">
        {page === 'login' ? (
          <>
            <h2>Login</h2>
            {error && <p className="error">{error}</p>}

            <form onSubmit={handleLoginSubmit}>
              <input
                type="email"
                placeholder="Email"
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, email: e.target.value })
                }
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
                required
              />

              <button type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <p className="switch-auth">
              Don&apos;t have an account?{' '}
              <span onClick={() => setPage('register')}>Register</span>
            </p>
          </>
        ) : (
          <>
            <h2>Register</h2>
            {error && <p className="error">{error}</p>}

            <form onSubmit={handleRegisterSubmit}>
              <input
                type="text"
                placeholder="Username"
                value={registerForm.username}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, username: e.target.value })
                }
                required
              />

              <input
                type="email"
                placeholder="Email"
                value={registerForm.email}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, email: e.target.value })
                }
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={registerForm.password}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, password: e.target.value })
                }
                required
              />

              <button type="submit" disabled={loading}>
                {loading ? 'Creating account...' : 'Register'}
              </button>
            </form>

            <p className="switch-auth">
              Already have an account?{' '}
              <span onClick={() => setPage('login')}>Login</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default AuthPage;