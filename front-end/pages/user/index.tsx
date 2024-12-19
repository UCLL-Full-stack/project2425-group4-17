import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import UserService from '@services/UserService';
import Header from '@components/header';
import styles from '@styles/profile.module.css';

const UserInfo: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
      if (!loggedInUser || !loggedInUser.token) {
        router.push('/login');
        return;
      }

      try {
        const response = await UserService.getUserInfo(loggedInUser.token);
        const userData = await response.json();
        setUser(userData);
        setFirstName(userData.firstName);
        setLastName(userData.lastName);
      } catch (err) {
        setError('Failed to fetch user info.');
      }
    };

    fetchUser();
  }, [router]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    if (user) {
      try {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
        const updatedUser = { firstName, lastName };
        await UserService.updateUserInfo(user.id, updatedUser, loggedInUser.token);
        setUser({ ...user, ...updatedUser });
        setIsEditing(false);
      } catch (err) {
        setError('Failed to update user info.');
      }
    }
  };

  const handleDeleteClick = async () => {
    if (user) {
      try {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
        await UserService.deleteUser(user.id, loggedInUser.token);
        localStorage.removeItem('loggedInUser');
        router.push('/login');
      } catch (err) {
        setError('Failed to delete user.');
      }
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <div className={styles.profileContainer}>
        <h1 className={styles.profileTitle}>User Info</h1>
        <div className={styles.profileDetails}>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>First Name:</strong> {isEditing ? (
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          ) : (
            user.firstName
          )}</p>
          <p><strong>Last Name:</strong> {isEditing ? (
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          ) : (
            user.lastName
          )}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
        <div className={styles.buttonContainer}>
          <button onClick={isEditing ? handleSaveClick : handleEditClick}>
            {isEditing ? 'Save' : 'Edit'}
          </button>
          <button onClick={handleDeleteClick} className={styles.deleteButton}>
            Delete
          </button>
        </div>
      </div>
    </>
  );
};

export default UserInfo;