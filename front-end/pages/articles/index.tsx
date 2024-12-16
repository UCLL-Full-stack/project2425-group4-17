import Head from 'next/head';
import Header from '@components/header';
import ArticlesOverviewTable from '@components/articles/ArticlesOverviewTable';

const Articles: React.FC = () => {
    return (
        <>
            <Head>
                <title>Articles</title>
            </Head>
            <Header />
            <main className="p-6 min-h-screen flex flex-col items-center">
                <ArticlesOverviewTable />
            </main>
        </>
    );
};

export default Articles;