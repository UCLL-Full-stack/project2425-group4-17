import Head from "next/head";
import Header from "@components/header";
import UserLoginForm from "@components/users/UserLoginForm";

const Login: React.FC = () => {
    return (
        <>
            <Head>
                <title>Login</title>
            </Head>
            <Header />
            <main>
                <section className="p-6 min-h-screen flex flex-col items-center">
                    <UserLoginForm />
                </section>
            </main>
        </>
    );
};

export default Login;