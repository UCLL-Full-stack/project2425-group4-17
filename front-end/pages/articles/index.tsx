// pages/articles/index.tsx
import Head from 'next/head';
import Header from '@components/header';
import styles from '@styles/home.module.css';
import { Article } from '@types';
import React, { useEffect, useState } from 'react';
import ArticleService from '@services/ArticleService';
import ArticlesOverviewTable from '@components/articles/ArticlesOverviewTable';

const Articles: React.FC = () => {
    const [articles, setArticles] = useState<Array<Article>>([]);

    const getArticles = async () => {
        try {
            const response = await ArticleService.getAllArticles();
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const json = await response.json();
                setArticles(json);
            } else {
                console.error("Received non-JSON response");
            }
        } catch (error) {
            console.error("Error fetching articles:", error);
        }
    };

    useEffect(() => {
        getArticles();
    }, []);

    return (
        <>
            <Head>
                <title>Articles</title>
            </Head>
            <Header />
            <main className="d-flex flex-column justify-content-center align-items-center">
                <h1>Articles</h1>
                <section>
                    <h2>Articles overview</h2>
                </section>
                {articles.length > 0 ? (
                    <ArticlesOverviewTable articles={articles} />
                ) : (
                    <p>No articles found or could not load articles.</p>
                )}
            </main>
        </>
    );
};

export default Articles;
