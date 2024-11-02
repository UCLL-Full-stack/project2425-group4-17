import React, { useState } from 'react';
import { Article } from '@types';

type Props = {
    articles: Array<Article>;
    onSelectArticle: (article: Article) => void;
    selectedArticle: Article | null;
};

const ArticlesOverviewTable: React.FC<Props> = ({ articles, onSelectArticle, selectedArticle }: Props) => {
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const handleSort = (column: string) => {
        const direction = (sortColumn === column && sortDirection === 'asc') ? 'desc' : 'asc';
        setSortColumn(column);
        setSortDirection(direction);
    };

    const sortedArticles = [...articles].sort((a, b) => {
        let comparison = 0;
        if (sortColumn === 'title') {
            comparison = a.title.localeCompare(b.title);
        } else if (sortColumn === 'publishedAt') {
            comparison = new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(); 
        } else if (sortColumn === 'articleType') {
            comparison = a.articleType.localeCompare(b.articleType);
        }
        return sortDirection === 'asc' ? comparison : -comparison;
    });

    return (
        <table className="table table-hover">
            <thead>
                <tr>
                    <th scope="col" onClick={() => handleSort('title')} role="button">Title</th>
                    <th scope="col" onClick={() => handleSort('publishedAt')} role="button">Published Date</th>
                    <th scope="col" onClick={() => handleSort('articleType')} role="button">Type</th>
                </tr>
            </thead>
            <tbody>
                {sortedArticles.map((article, index) => (
                    <React.Fragment key={index}>
                        <tr onClick={() => onSelectArticle(article)} role="button">
                            <td>{article.title}</td>
                            <td>{new Date(article.publishedAt).toLocaleDateString()}</td>
                            <td>{article.articleType}</td>
                        </tr>
                        {selectedArticle && selectedArticle.id === article.id && ( 
                            <tr>
                                <td colSpan={3} style={{ paddingLeft: '20px', paddingTop: '10px' }}>
                                    <div>
                                        <h3>{article.title}</h3>
                                        <p>{article.summary}</p>
                                        <p><strong>Published Date:</strong> {new Date(article.publishedAt).toLocaleDateString()}</p>
                                        <p><strong>Type:</strong> {article.articleType}</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}
            </tbody>
        </table>
    );
};

export default ArticlesOverviewTable;
