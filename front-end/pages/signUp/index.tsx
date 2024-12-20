import React, { useState } from 'react';
import { useRouter } from 'next/router';
import UserService from '@services/UserService';
import Header from '@components/header';
import styles from '@styles/signup.module.css';
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps } from 'next';

const SignupPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('reader');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { t } = useTranslation('common');

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
        setError(errorData.message || t('Signup.error'));
      }
    } catch (err) {
      setError(t('Signup.errorMessage'));
    }
  };

  return (
    <>
      <Header />
      <main className="p-6 min-h-screen flex flex-col items-center">
        <div className={styles.signupContainer}>
          <h1>{t('Signup.title')}</h1>
          {error && <div className={styles.errorMessage}>{error}</div>}
          <form onSubmit={handleSubmit} className={styles.signupForm}>
            <label htmlFor="username">{t('Signup.username')}</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label htmlFor="firstName">{t('Signup.firstName')}</label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <label htmlFor="lastName">{t('Signup.lastName')}</label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            <label htmlFor="email">{t('Signup.email')}</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="password">{t('Signup.password')}</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label htmlFor="role">{t('Signup.role')}</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            >
              <option value="admin">{t('Signup.admin')}</option>
              <option value="journalist">{t('Signup.journalist')}</option>
              <option value="reader">{t('Signup.reader')}</option>
            </select>
            <button type="submit">{t('Signup.submit')}</button>
          </form>
        </div>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context;

  return {
      props: {
          ...(await serverSideTranslations(locale ?? "en", ["common", "Signup"])),
      },
  };
};

export default SignupPage;
