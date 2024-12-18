const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const createArticleLike = async (articleId: number, token: string) => {
    const response = await fetch(`${API_URL}/articlelikes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ articleId }),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
};

const ArticleLikesService = {
    createArticleLike,
};

export default ArticleLikesService;