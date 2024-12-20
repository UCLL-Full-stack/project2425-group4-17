const getAllArticles = async () => {
    return await fetch(process.env.NEXT_PUBLIC_API_URL + '/articles', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
};

const getAllArticlesProfile = async () => {
  const token = JSON.parse(localStorage.getItem('loggedInUser') || '{}').token;
  return await fetch(process.env.NEXT_PUBLIC_API_URL + '/articles', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
  });
};

const getArticlesOfToday = async () => {
  const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/articles/today', {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('loggedInUser') || '{}').token}`,
      },
  });

  if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

const createArticle = async (articleData: { title: string; summary: string; picture: string; articleType: string }, token: string) => {
  const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/articles', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(articleData),
  });

  if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

const updateArticle = async (id: string, articleData: any, token: string) => {
  return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/articles/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(articleData),
  });
};

const ArticleService = {
    getAllArticles,
    getArticlesOfToday,
    createArticle,
    getAllArticlesProfile,
    updateArticle,
};
  
export default ArticleService;