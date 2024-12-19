import React, { useState } from 'react';
import { useRouter } from 'next/router';
import UserService from '@services/UserService';
import Header from '@components/header';
import styles from '@styles/signup.module.css';

const SignupPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('reader');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const userInput = { username, firstName, lastName, email, password, role };

    try {
      const response = await UserService.createUser(userInput);
      if (response.status === 201) {
        router.push('/login');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create user.');
      }
    } catch (err) {
      setError('Failed to create user.');
    }
  };

  return (
    <>
      <Header />
      <main className="p-6 min-h-screen flex flex-col items-center">
        <div className={styles.signupContainer}>
          <h1>Sign Up</h1>
          {error && <div className={styles.errorMessage}>{error}</div>}
          <form onSubmit={handleSubmit} className={styles.signupForm}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label htmlFor="role">Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            >   
              <option value="admin">Admin</option>
              <option value="journalist">Journalist</option>
              <option value="reader">Reader</option>
            </select>
            <button type="submit">Sign Up</button>
          </form>
        </div>
      </main>
    </>
  );
};

export default SignupPage;