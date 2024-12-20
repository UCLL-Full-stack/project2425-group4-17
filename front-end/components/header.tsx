import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Language from "../components/language/language";
import { useTranslation } from "next-i18next";

const Header: React.FC = () => {
  const [loggedInUser, setLoggedInUser] = useState<{ username: string; role: string } | null>(null);
  const router = useRouter();
  const { t } = useTranslation('common');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
    if (user) {
      setLoggedInUser({ username: user.username, role: user.role });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    setLoggedInUser(null);
    router.push('/login');
  };

  return (
    <header className="p-3 mb-3 border-bottom bg-dark bg-gradient">
      <a className="fs-2 d-flex justify-content-center mb-2 mb-lg-0 text-white-50 text-decoration-none">
        The Voyager
      </a>
      <nav className="nav justify-content-center">
        {loggedInUser ? (
          <>
            <Link href="/" className="nav-link px-4 fs-5 text-white">
              {t('header.home')}
            </Link>
            {loggedInUser.role === 'admin' && (
              <Link href="/articles" className="nav-link px-4 fs-5 text-white">
                {t('header.articles')}
              </Link>
            )}
            {(loggedInUser.role === 'admin' || loggedInUser.role === 'journalist') && (
              <Link href="/articles/createArticle" className="nav-link px-4 fs-5 text-white">
                {t('header.createArticle')}
              </Link>
            )}
            {(loggedInUser.role === 'admin') && (
              <Link href="/papers" className="nav-link px-4 fs-5 text-white">
                {t('header.paper')}
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="nav-link px-4 fs-5 text-white bg-transparent border-0"
              style={{ cursor: 'pointer' }}
            >
              {t('header.logout')}
            </button>
            <div className="text-white ms-4 fs-6 align-self-center">
              {t('header.welcome', { username: loggedInUser.username })}
            </div>
            <Link href="/user" className="nav-link px-4 fs-5 text-white">
              <i className="fa-solid fa-user"></i>
            </Link>
            <Language />
          </>
        ) : (
          <div className="d-flex">
            <Link href="/login" className="nav-link px-4 fs-5 text-white">
              {t('header.login')}
            </Link>
            <Link href="/signUp" className="nav-link px-4 fs-5 text-white">
              {t('header.createAccount')}
            </Link>
            <Language />
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
