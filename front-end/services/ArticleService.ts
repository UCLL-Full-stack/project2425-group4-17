const getAllArticles = async () => {
    return await fetch(process.env.NEXT_PUBLIC_API_URL + '/articles', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
};

const ArticleService = {
    getAllArticles,
};
  
export default ArticleService;