import React, { useState } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import UserService from '@services/UserService';
import styles from '@styles/login.module.css';

const UserLoginForm: React.FC = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [statusMessages, setStatusMessages] = useState<{ message: string; type: string }[]>([]);
  const [nameError, setNameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const router = useRouter();

  const clearErrors = () => {
    setNameError(null);
    setPasswordError(null);
  };

  const validate = () => {
    let valid = true;
    if (!name) {
      setNameError('Username is required');
      valid = false;
    }
    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    }
    return valid;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    clearErrors();

    if (!validate()) return;

    const user = { username: name, password };
    const response = await UserService.loginUser(user);

    if (response.status === 200) {
      setStatusMessages([
        { type: "success", message: "Login successful. Redirecting to home..." },
      ]);

      const userData = await response.json();

      localStorage.setItem(
        "loggedInUser",
        JSON.stringify({
          token: userData.token,
          fullname: userData.fullname,
          username: userData.username,
          role: userData.role,
        })
      );
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } else {
      const errorData = await response.json();
      setStatusMessages([
        { message: errorData.message || "Failed to login...", type: "error" },
      ]);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h3>Login</h3>
      {statusMessages.length > 0 && (
        <div>
          <ul className="list-none mb-3 mx-auto">
            {statusMessages.map(({ message, type }, index) => (
              <li
                key={index}
                className={classNames({
                  [styles.errorMessage]: type === "error",
                  [styles.successMessage]: type === "success",
                })}
              >
                {message}
              </li>
            ))}
          </ul>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <label htmlFor="nameInput">Username</label>
        <input
          id="nameInput"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        {nameError && <div className={styles.errorMessage}>{nameError}</div>}
        <label htmlFor="passwordInput">Password</label>
        <input
          id="passwordInput"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {passwordError && <div className={styles.errorMessage}>{passwordError}</div>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default UserLoginForm;