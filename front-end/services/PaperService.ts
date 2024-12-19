const getAllPapers = async () => {
  const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/papers', {
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

const getPapersByDate = async (date: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/papers?date=${date}`, {
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

const createPaper = async (paperData: { date: string; namePaper: string; namePublisher: string }) => {
  const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/papers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JSON.parse(localStorage.getItem('loggedInUser') || '{}').token}`,
    },
    body: JSON.stringify(paperData),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

const PaperService = {
  getAllPapers,
  getPapersByDate,
  createPaper,
};

export default PaperService;
