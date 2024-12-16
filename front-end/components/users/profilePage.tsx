import React, { useEffect, useState } from "react";
import Head from "next/head";
import Header from "@components/header";

interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("loggedInUser")
      ? JSON.parse(localStorage.getItem("loggedInUser") || "{}").token
      : null;

    if (!token) {
      setError("User not logged in.");
      return;
    }

    fetch("/api/users/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        return response.json();
      })
      .then((data) => setUser(data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return <div className="text-red-500">Error loading profile: {error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>User Profile</title>
      </Head>
      <Header />
      <main>
        <section className="p-6 min-h-screen flex flex-col items-center">
          <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
            <h1 className="text-xl font-bold mb-4">User Profile</h1>
            <p>
              <strong>Username:</strong> {user.username}
            </p>
            <p>
              <strong>Full Name:</strong> {user.firstName} {user.lastName}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Role:</strong> {user.role}
            </p>
          </div>
        </section>
      </main>
    </>
  );
};

export default ProfilePage;
