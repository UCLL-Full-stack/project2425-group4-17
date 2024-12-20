import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import UserService from '@services/UserService';
import ArticleService from '@services/ArticleService';
import Header from '@components/header';
import profileStyles from '@styles/profile.module.css';
import homeStyles from '@styles/home.module.css';
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps } from 'next';

const UserInfo: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [articles, setArticles] = useState<any[]>([]);
  const router = useRouter();
  const { t } = useTranslation('common');

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
        setError(t('userInfo.errorFetchUser'));
      }
    };

    fetchUser();
  }, [router, t]);

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
        setError(t('userInfo.errorUpdateUser'));
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
        setError(t('userInfo.errorDeleteUser'));
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
    return <div>{t('loading')}</div>;
  }

  return (
    <>
      <Header />
      <div className={profileStyles.profileContainer}>
        <h1 className={profileStyles.profileTitle}>{t('userInfo.title')}</h1>
        <div className={profileStyles.profileDetails}>
          <p><strong>{t('userInfo.username')}:</strong> {user.username}</p>
          <p><strong>{t('userInfo.firstName')}:</strong> {isEditing ? (
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          ) : (
            user.firstName
          )}</p>
          <p><strong>{t('userInfo.lastName')}:</strong> {isEditing ? (
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          ) : (
            user.lastName
          )}</p>
          <p><strong>{t('userInfo.email')}:</strong> {user.email}</p>
          <p><strong>{t('userInfo.role')}:</strong> {user.role}</p>
        </div>
        <div className={profileStyles.buttonContainer}>
          <button onClick={isEditing ? handleSaveClick : handleEditClick}>
            {isEditing ? t('userInfo.save') : t('userInfo.edit')}
          </button>
          <button onClick={handleDeleteClick} className={profileStyles.deleteButton}>
            {t('userInfo.delete')}
          </button>
        </div>
      </div>
      <div className={homeStyles.articlesGrid}>
        <br /><br />
        <h3>{t('userInfo.yourArticles')}</h3>
        {articles.length === 0 ? (
          <p>{t('noArticles')}</p>
        ) : (
          articles.map(article => (
            <div key={article.id} className={homeStyles.articleCard}>
              <h3>{article.title}</h3>
              <p>{article.summary}</p>
              <p><strong>{t('articleOverview.listDate')}:</strong> {new Date(article.publishedAt).toLocaleDateString()}</p>
              <button onClick={() => handleEditArticleClick(article.id)}>{t('userInfo.edit')}</button>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale } = context;

  return {
      props: {
          ...(await serverSideTranslations(locale ?? "en", ["common", "userInfo"])),
      },
  };
};

export default UserInfo;
