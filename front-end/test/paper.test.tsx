import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import PaperByDate from "@components/papers/PaperByDate";
import PaperService from "@services/PaperService";


  getAllPapers: jest.fn();
  createPaper: jest.fn();


describe("PaperByDate Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockPapers = [{
    id: 1,
    date: new Date("2024-01-01"),
    namePaper: "Science Daily",
    namePublisher: "Science Publishing Group",
    articles: []},
    {id: 2,
    date: new Date("2024-01-01"),
    namePaper: "Science test",
    namePublisher: "Science test Group",
    articles: []},
  ];

  it("displays a loading message initially", () => {
    render(<PaperByDate />);
    expect(screen.getByText(/Loading.../i));
  });

  it("fetches and displays articles for the selected date", async () => {
    (PaperService.getAllPapers as jest.Mock).mockResolvedValue(mockPapers);

    render(<PaperByDate />);
    await waitFor(() => {
      expect(screen.getByText(/Paper\(s\) for/i));
    });

    const article1 = screen.getByText(/Paper 2/i);
    expect(article1);
    expect(screen.getByText(/Publisher: Publisher B/i));
  });

  it("filters articles by selected date", async () => {
    (PaperService.getAllPapers as jest.Mock).mockResolvedValue(mockPapers);

    render(<PaperByDate />);
    await waitFor(() => {
      expect(screen.getByText(/Paper\(s\) for/i));
    });

    // Change the selected date to filter articles
    fireEvent.change(screen.getByLabelText(/Select date/i), { target: { value: "2023-12-18" } });

    await waitFor(() => {
      expect(screen.getByText(/Paper 1/i));
    });

    expect(!screen.queryByText(/Paper 2/i));
  });

  it("displays an error message if fetching articles fails", async () => {
    (PaperService.getAllPapers as jest.Mock).mockRejectedValue(new Error("Fetch error"));

    render(<PaperByDate />);
    await waitFor(() => {
      expect(!screen.getByText(/Failed to fetch articles/i));
    });
  });

  it("creates a new paper and refreshes the list", async () => {
    (PaperService.getAllPapers as jest.Mock).mockResolvedValue(mockPapers);
    (PaperService.createPaper as jest.Mock).mockResolvedValue({});

    render(<PaperByDate />);
    await waitFor(() => {
      expect(screen.getByText(/Paper\(s\) for/i));
    });

    // Fill out and submit the create paper form
    fireEvent.change(screen.getByLabelText(/Paper Name/i), { target: { value: "New Paper" } });
    fireEvent.change(screen.getByLabelText(/Publisher Name/i), { target: { value: "New Publisher" } });
    fireEvent.click(screen.getByText(/Create Paper/i));

    await waitFor(() => {
      expect(PaperService.createPaper).toHaveBeenCalledWith({
        date: expect.any(String),
        namePaper: "New Paper",
        namePublisher: "New Publisher",
      });

      expect(PaperService.getAllPapers).toHaveBeenCalled();
    });
  });

  it("displays an error message if creating a paper fails", async () => {
    (PaperService.getAllPapers as jest.Mock).mockResolvedValue(mockPapers);
    (PaperService.createPaper as jest.Mock).mockRejectedValue(new Error("Create error"));

    render(<PaperByDate />);
    await waitFor(() => {
      expect(screen.getByText(/Paper\(s\) for/i));
    });

    // Fill out and submit the create paper form
    fireEvent.change(screen.getByLabelText(/Paper Name/i), { target: { value: "New Paper" } });
    fireEvent.change(screen.getByLabelText(/Publisher Name/i), { target: { value: "New Publisher" } });
    fireEvent.click(screen.getByText(/Create Paper/i));

    await waitFor(() => {
      expect(screen.getByText(/Failed to create paper/i));
    });
  });

  it("shows no articles found message if no articles match the selected date", async () => {
    (PaperService.getAllPapers as jest.Mock).mockResolvedValue(mockPapers);

    render(<PaperByDate />);
    await waitFor(() => {
      expect(screen.getByText(/Paper\(s\) for/i));
    });

    // Change to a date with no matching articles
    fireEvent.change(screen.getByLabelText(/Select date/i), { target: { value: "2023-12-17" } });

    await waitFor(() => {
      expect(screen.getByText(/No articles found for the selected date/i));
    });
  });
});
