import Link from 'next/link';
import { useEffect, useState } from 'react';

const Header: React.FC = () => {
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);

  useEffect(() => {
    const user = sessionStorage.getItem('loggedInUser');
    if (user) {
      setLoggedInUser(user);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('loggedInUser');
    setLoggedInUser(null);
  };

  return (
    <header className="p-3 mb-3 border-bottom bg-dark bg-gradient">
      <a className="fs-2 d-flex justify-content-center mb-2 mb-lg-0 text-white-50 text-decoration-none">
        The Voyager
      </a>
      <nav className="nav justify-content-center">
        <Link href="/" className="nav-link px-4 fs-5 text-white">
          Home
        </Link>
        <Link href="/articles" className="nav-link px-4 fs-5 text-white">
          Articles
        </Link>
        {loggedInUser ? (
          <>
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
