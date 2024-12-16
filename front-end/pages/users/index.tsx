import React, { useEffect, useState } from "react";
import Head from "next/head";
import Header from "@components/header";
import UserList from "@components/users/UserList";

const Users: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [show401, setShow401] = useState(false);  // Renamed to show401

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    const tokenData = storedUser ? JSON.parse(storedUser) : null;

    if (!tokenData || tokenData.role !== "admin") {
      setShow401(true); // Show 401 if not admin
    } else {
      setIsAuthorized(true);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (show401) {
    return <div className="text-center p-6 text-red-500 text-2xl">401 - Unauthorized</div>;  // Changed to 401 error message
  }

  return (
    <>
      <Head>
        <title>Users</title>
      </Head>
      <Header />
      <main>
        <section className="p-6 min-h-screen flex flex-col items-center">
          <UserList />
        </section>
      </main>
    </>
  );
};

export default Users;
