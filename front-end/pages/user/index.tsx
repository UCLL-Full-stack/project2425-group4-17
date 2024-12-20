import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import UserService from '@services/UserService';
import ArticleService from '@services/ArticleService';
import Header from '@components/header';
import profileStyles from '@styles/profile.module.css';
import homeStyles from '@styles/home.module.css';

const UserInfo: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [articles, setArticles] = useState<any[]>([]);
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

        const articlesResponse = await ArticleService.getAllArticlesProfile();
        const articlesData = await articlesResponse.json();
        const userArticles = articlesData.filter((article: any) => article.user.id === userData.id);
        setArticles(userArticles);
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

  const handleEditArticleClick = (articleId: number) => {
    router.push(`/articles/${articleId}`);
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
      <div className={profileStyles.profileContainer}>
        <h1 className={profileStyles.profileTitle}>User Info</h1>
        <div className={profileStyles.profileDetails}>
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
        <div className={profileStyles.buttonContainer}>
          <button onClick={isEditing ? handleSaveClick : handleEditClick}>
            {isEditing ? 'Save' : 'Edit'}
          </button>
          <button onClick={handleDeleteClick} className={profileStyles.deleteButton}>
            Delete
          </button>
        </div>
      </div>
      <div className={homeStyles.articlesGrid}>
        <br /><br />
        <h3>Your Articles</h3>
        {articles.length === 0 ? (
          <p>No articles found.</p>
        ) : (
          articles.map(article => (
            <div key={article.id} className={homeStyles.articleCard}>
              <h3>{article.title}</h3>
              <p>{article.summary}</p>
              <p><strong>Published at:</strong> {new Date(article.publishedAt).toLocaleDateString()}</p>
              <button onClick={() => handleEditArticleClick(article.id)}>Edit</button>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default UserInfo;