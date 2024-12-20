import Head from "next/head";
import Header from "@components/header";
import PaperByDate from "@components/papers/PaperByDate";

const Papers: React.FC = () => {
    return (
        <>
            <Head>
                <title>Articles</title>
            </Head>
            <Header />
            <main>
                <section className="p-6 min-h-screen flex flex-col items-center">
                    <PaperByDate />
                </section>
            </main>
        </>
    );
};

export default Papers;