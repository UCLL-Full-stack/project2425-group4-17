import { Paper } from '../../model/paper';
import paperService from '../../service/paper.service';
import paperDB from '../../repository/paper.db';

const paper = new Paper({id: 1,
    date: new Date("2024-01-01"),
    namePaper: "Science Daily",
    namePublisher: "Science Publishing Group",
    articles: []});

const paper2 = new Paper({id: 2,
    date: new Date("2024-01-01"),
    namePaper: "Science test",
    namePublisher: "Science test Group",
    articles: []});


const papers = [paper, paper2];
const paperData = { date: new Date(), namePaper: 'Daily News', namePublisher: 'News Corp' };
const newPaper = new Paper({id: 3,
    date: new Date("2024-01-01"),
    namePaper: "New Science test",
    namePublisher: "New Science test Group",
    articles: []});
    
const updates = {
    date: new Date("2024-01-01"),
    namePaper: "updated Science test",
    namePublisher: "New Science test Group",
    articles: []};
const updatedPaper = new Paper({ id: 1, ...updates });

afterEach(() => {
    jest.clearAllMocks();
});

test('should fetch all papers', async () => {
   
    jest.spyOn(paperDB, 'getAllPapers').mockResolvedValue(papers);

    const result = await paperService.getAllPapers();

    expect(result).toEqual(papers);
    expect(paperDB.getAllPapers).toHaveBeenCalledTimes(1);
});

test('should fetch a paper by ID', async () => {
    
    jest.spyOn(paperDB, 'getPaperById').mockResolvedValue(paper);

    const result = await paperService.getPaperById(1);

    expect(result).toEqual(paper);
    expect(paperDB.getPaperById).toHaveBeenCalledWith(1);
});

test('should create a paper', async () => {
    

    jest.spyOn(paperDB, 'createPaper').mockResolvedValue(newPaper);

    const result = await paperService.createPaper(paperData);

    expect(result).toEqual(newPaper);
    expect(paperDB.createPaper).toHaveBeenCalledWith(expect.any(Paper));
});

test('should update a paper', async () => {
    

    jest.spyOn(paperDB, 'updatePaper').mockResolvedValue(updatedPaper);

    const result = await paperService.updatePaper(1, updates);

    expect(result).toEqual(updatedPaper);
    expect(paperDB.updatePaper).toHaveBeenCalledWith(1, updates);
});

test('should delete a paper', async () => {
    jest.spyOn(paperDB, 'deletePaper').mockResolvedValue();

    await paperService.deletePaper(1);

    expect(paperDB.deletePaper).toHaveBeenCalledWith(1);
});

