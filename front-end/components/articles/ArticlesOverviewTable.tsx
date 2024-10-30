// components/articles/ArticlesOverviewTable.tsx
import React from 'react';
import { Article } from '@types';

type Props = {
    articles: Array<Article>;
};

const ArticlesOverviewTable: React.FC<Props> = ({ articles }: Props) => {
    return (
        <table className="table table-hover">
            <thead>
                <tr>
                    <th scope="col">Title</th>
                    <th scope="col">Author</th>
                    <th scope="col">Published Date</th>
                    <th scope="col">Type</th>
                </tr>
            </thead>
            <tbody>
                {articles.map((article, index) => (
                    <tr key={index} onClick={() => {}} role="button">
                        <td>{article.title}</td>
                        <td>{article.user.getFirstName()} {article.user.getLastName()}</td>
                        <td>{new Date(article.publishedAt).toLocaleDateString()}</td>
                        <td>{article.articleType}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default ArticlesOverviewTable;
