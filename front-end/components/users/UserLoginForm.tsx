import { StatusMessage } from "@types";
import classNames from "classnames";
import { useRouter } from "next/router";
import { useState } from "react";
import UserService from "../../services/UserService";

const UserLoginForm: React.FC = () => {
    const router = useRouter();
    const [name, setName] = useState("");
    const [nameError, setNameError] = useState<string | null>(null);
    const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState<string | null>(null);

    const clearErrors = () => {
      setNameError(null);
      setPasswordError(null);
      setStatusMessages([]);
    };
  
    const validate = (): boolean => {
    let result = true;
    if (!name && name.trim() === "") {
      setNameError("Username cannot be empty");
      result = false;
    }

    if (!password && password.trim() === "") {
      setPasswordError("Password cannot be empty");
      result = false;
    }

    return result;
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
      <>
        <h3 className="px-0">login</h3>
        {statusMessages && (
          <div className="row">
            <ul className="list-none mb-3 mx-auto ">
              {statusMessages.map(({ message, type }, index) => (
                <li
                  key={index}
                  className={classNames({
                    "text-red-800": type === "error",
                    "text-green-800": type === "success",
                  })}
                >
                  {message}
                </li>
              ))}
            </ul>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <label htmlFor="nameInput" className="block mb-2 text-sm font-medium">
            Username
          </label>
          <div className="block mb-2 text-sm font-medium">
            <input
              id="nameInput"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue:500 block w-full p-2.5"
            />
            {nameError && <div className="text-red-800 ">{nameError}</div>}
          </div>
          <div className="mt-2">
            <div>
              <label
                htmlFor="passwordInput"
                className="block mb-2 text-sm font-medium"
              >
                password
              </label>
            </div>
            <div className="block mb-2 text-sm font-medium">
              <input
                id="passwordInput"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue:500 block w-full p-2.5"
              />
              {passwordError && (
                <div className=" text-red-800">{passwordError}</div>
              )}
            </div>
          </div>
          <button
            className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            type="submit"
          >
            Login
          </button>
        </form>
      </>
    );
  };
  
  export default UserLoginForm;