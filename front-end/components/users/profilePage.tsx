import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '@components/header';
import UserService from '../../services/UserService';
import { UserInput } from '../../types';

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<UserInput | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('loggedInUser')
          ? JSON.parse(localStorage.getItem('loggedInUser') || '{}').token
          : null;

        if (!token) {
          setError('User not logged in.');
          return;
        }
        
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString('utf-8'));
        const username = payload.username;
        const profile = await UserService.getUserByUsername(username);
        setUser(profile);

      } catch (err) {
        setError('Failed to fetch user data.');
      }
    };

    fetchUserProfile();
  }, []);

  if (error) {
    return <div className="text-red-500">Error loading profile: {error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>User Profile</title>
      </Head>
      <Header />
      <main>
        <section className="p-6 min-h-screen flex flex-col items-center">
          <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
            <h1 className="text-xl font-bold mb-4">User Profile</h1>
            <p>
              <strong>Username:</strong> {user.username}
            </p>
            <p>
              <strong>Full Name:</strong> {user.firstName} {user.lastName}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Role:</strong> {user.role}
            </p>
          </div>
        </section>
      </main>
    </>
  );
};

export default ProfilePage;
