import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Header: React.FC = () => {
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
    if (user) {
      setLoggedInUser(user.fullname || user.username);
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
              Home
            </Link>
            <Link href="/articles" className="nav-link px-4 fs-5 text-white">
              Articles
            </Link>
            <Link href="/articles/createArticle" className="nav-link px-4 fs-5 text-white">
              Create Article
            </Link>
            <button
              onClick={handleLogout}
              className="nav-link px-4 fs-5 text-white bg-transparent border-0"
              style={{ cursor: 'pointer' }}
            >
              Logout
            </button>
            <div className="text-white ms-4 fs-6 align-self-center">
              Welcome, {loggedInUser}!
            </div>
          </>
        ) : (
          <Link href="/login" className="nav-link px-4 fs-5 text-white">
            Login
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;