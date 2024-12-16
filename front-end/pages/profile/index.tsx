import Head from "next/head";
import Header from "@components/header";
import ProfilePage from "@components/users/profilePage";

const Users: React.FC = () => {
  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <Header />
      <main>
        <section className="p-6 min-h-screen flex flex-col items-center">
         <ProfilePage />
        </section>
      </main>
    </>
  );
};

export default Users;
