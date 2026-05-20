'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    setError('');
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      router.push('/');
    } else {
      const data = await res.json();
      setError(data.error || 'Registration failed');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-xl w-80">
        <h1 className="text-2xl mb-6 text-center">📝 Register</h1>
        <input className="w-full mb-3 p-2 rounded bg-gray-700" placeholder="Username"
          value={username} onChange={e => setUsername(e.target.value)} />
        <input className="w-full mb-3 p-2 rounded bg-gray-700" type="password" placeholder="Password"
          value={password} onChange={e => setPassword(e.target.value)} />
        {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
        <button onClick={handleRegister}
          className="w-full bg-green-600 p-2 rounded hover:bg-green-700">Register</button>
        <p className="text-sm mt-3 text-center">
          Already have account? <a href="/" className="text-blue-400">Login</a>
        </p>
      </div>
    </main>
  );
}
