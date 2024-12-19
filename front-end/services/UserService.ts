import { UserInput } from "@types";

const loginUser = (userInput: UserInput) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + "/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('loggedInUser') || '{}').token}`,
        },
        body: JSON.stringify(userInput),
    });
};

const getAllUsers = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('loggedInUser') || '{}').token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

const getUserByUsername = async (username: string) => {
    console.log('loggedInUser:', localStorage.getItem('loggedInUser'));
    console.log(`${process.env.NEXT_PUBLIC_API_URL}/users/${username}`);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${username}`, {
    
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('loggedInUser') || '{}').token}`,
    },
  });
  

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

const createUser = async (userData: { username: string; password: string; firstName: string; lastName: string; email: string; role: string }) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

const updateUser = async (id: number, updates: Partial<{ username: string; firstName: string; lastName: string }>, token: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

const deleteUser = async (id: number, token: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
};

const authenticate = async (username: string, password: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};
const getUserProfile = async (token: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Ensure the token is sent here
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user profile. HTTP status: ${response.status}`);
  }

  return await response.json();
};


const UserService = {
    loginUser,
    getAllUsers,
    getUserByUsername,
    createUser,
    updateUser,
    deleteUser,
    authenticate,
    getUserProfile,
};

export default UserService;
