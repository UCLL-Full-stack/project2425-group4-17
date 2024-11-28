import { StatusMessage } from "@types";
import classNames from "classnames";
import { useRouter } from "next/router";
import { useState } from "react";

const UserLoginForm: React.FC = () => {
    const router = useRouter();
    const [name, setName] = useState("");
    const [nameError, setNameError] = useState<string | null>(null);
    const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);
  
    const clearErrors = () => {
      setNameError(null);
      setStatusMessages([]);
    };
  
    const validate = (): boolean => {
      if (!name || name.trim() === "") {
        setNameError("Username cannot be empty");
        return false;
      }
      return true;
    };
  
    const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();
      clearErrors();
  
      if (!validate()) return;
  
      setStatusMessages([
        { type: "success", message: "Login successful. Redirecting to home..." },
      ]);
  
      sessionStorage.setItem("loggedInUser", name);
      setTimeout(() => router.push("/"), 3000);
    };
  
    return (
      <div
        className="d-flex justify-content-center align-items-center vh-100 bg-light"
        style={{ minHeight: "100vh" }}
      >
        <div className="card p-4 shadow-sm" style={{ maxWidth: "400px", width: "100%" }}>
          <h3 className="text-center mb-4">Login</h3>
          {statusMessages.length > 0 && (
            <ul className="list-unstyled mb-3">
              {statusMessages.map(({ message, type }, index) => (
                <li
                  key={index}
                  className={classNames({
                    "text-danger": type === "error",
                    "text-success": type === "success",
                  })}
                >
                  {message}
                </li>
              ))}
            </ul>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="nameInput" className="form-label">
                Username:
              </label>
              <input
                id="nameInput"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="form-control"
              />
              {nameError && <div className="text-danger mt-1">{nameError}</div>}
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  };
  
  export default UserLoginForm;