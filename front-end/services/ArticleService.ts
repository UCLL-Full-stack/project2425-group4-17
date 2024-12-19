const getAllArticles = async () => {
    return await fetch(process.env.NEXT_PUBLIC_API_URL + '/articles', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('loggedInUser') || '{}').token}`,
      }
    })
};

const ArticleService = {
    getAllArticles,
};
  
export default ArticleService;