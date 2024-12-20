import React, { useState } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import { useTranslation } from 'next-i18next';
import UserService from '@services/UserService';
import styles from '@styles/login.module.css';

const UserLoginForm: React.FC = () => {
  const { t } = useTranslation('common');
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
      setNameError(t('login.usernameRequired'));
      valid = false;
    }
    if (!password) {
      setPasswordError(t('login.passwordRequired'));
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
        { type: "success", message: t('login.succesLogin') },
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
        { message: errorData.message || t('login.failedLogin'), type: "error" },
      ]);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h3>{t('login.login')}</h3>
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
        <label htmlFor="nameInput">{t('login.username')}</label>
        <input
          id="nameInput"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        {nameError && <div className={styles.errorMessage}>{nameError}</div>}
        <label htmlFor="passwordInput">{t('login.password')}</label>
        <input
          id="passwordInput"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {passwordError && <div className={styles.errorMessage}>{passwordError}</div>}
        <button type="submit">{t('login.buttonLogin')}</button>
      </form>
      <br /><br />
      <div className="overflow-x-auto mt-6">
        <h3 className="text-xl font-semibold mb-4">{t('userAccounts')}</h3>
        <table className="table-auto border-collapse border border-gray-300 w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">{t('login.username')}</th>
              <th className="border border-gray-300 px-4 py-2">{t('login.password')}</th>
              <th className="border border-gray-300 px-4 py-2">{t('login.role')}</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-gray-100">
              <td className="border border-gray-300 px-4 py-2">admin</td>
              <td className="border border-gray-300 px-4 py-2">admin</td>
              <td className="border border-gray-300 px-4 py-2">admin</td>
            </tr>
            <tr className="bg-white">
              <td className="border border-gray-300 px-4 py-2">Jhon</td>
              <td className="border border-gray-300 px-4 py-2">Doe</td>
              <td className="border border-gray-300 px-4 py-2">admin</td>
            </tr>
            <tr className="bg-gray-100">
              <td className="border border-gray-300 px-4 py-2">Rudy</td>
              <td className="border border-gray-300 px-4 py-2">rudy</td>
              <td className="border border-gray-300 px-4 py-2">journalist</td>
            </tr>
            <tr className="bg-white">
              <td className="border border-gray-300 px-4 py-2">ruben</td>
              <td className="border border-gray-300 px-4 py-2">ruben</td>
              <td className="border border-gray-300 px-4 py-2">journalist</td>
            </tr>
            <tr className="bg-gray-100">
              <td className="border border-gray-300 px-4 py-2">reader</td>
              <td className="border border-gray-300 px-4 py-2">reader</td>
              <td className="border border-gray-300 px-4 py-2">reader</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserLoginForm;
