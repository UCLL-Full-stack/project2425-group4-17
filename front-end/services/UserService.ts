import { UserInput } from "@types";

const getUserInfo = (token: string) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/users/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
};

const updateUserInfo = (id: number, userInput: Partial<UserInput>, token: string) => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(userInput),
    });
};

const loginUser = (userInput: UserInput) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userInput),
    });
};

const deleteUser = (id: number, token: string) => {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
};

const UserService = {
    getUserInfo,
    updateUserInfo,
    loginUser,
    deleteUser,
};

export default UserService;