import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { ApiClient } from "./apiClient";

function App() {
  const [quotes, changeQuotes] = useState({
    content: "",
    author: "",
    tags: [],
  });
  const [fecthing, changeFetching] = useState(false);
  const [authors, changeAuthors] = useState([]);
  const [lastIndex, changeLastIndex] = useState(0);
  const [pageSize, changePageSize] = useState(5);
  const apiClient = new ApiClient();

  const fetchQuote = async () => {
    let quote = await apiClient.fetchQuote();
    if (!quote) {
      return;
    }
    changeQuotes({
      content: quote.data.content,
      author: quote.data.author,
      tags: quote.data.tags,
    });
  };
  const listAuthors = async (skip, pageSize) => {
    let authors = await apiClient.listAuthors(skip, pageSize);
    if (!authors) {
      return;
    }
    changeAuthors(authors.data.results);
  };

  const getQuote = async (authorId) => {
    console.log(authorId);
    const quote = await apiClient.getQuoteByAuthor(authorId);
    const quotes = quote.data.results;
    const random = quotes[Math.floor(Math.random() * quotes.length)];
    changeQuotes({
      content: random.content,
      author: random.author,
      tags: random.tags,
    });
  };
  // utility function to generate the html to populate the table
  const makeAuthorsTable = () => {
    const table = authors.map((author, index) => {
      return (
        <tr
          key={index}
          onClick={() => {
            getQuote(author._id);
          }}
        >
          <td>{author.name}</td>
          <td>{author.quoteCount}</td>
        </tr>
      );
    });
    return table;
  };

  const refreshPagination = (event) => {
    changePageSize(Number(event.target.value));
    listAuthors(lastIndex, Number(event.target.value));
  };

  const handlePagination = (bool) => {
    console.log(lastIndex, pageSize);
    if (bool) {
      changeLastIndex(pageSize + lastIndex);
      listAuthors(lastIndex + pageSize, pageSize);
      // user wants to advance
    } else {
      if (lastIndex <= 0) {
        changeLastIndex(0, pageSize);
        return;
      }
      // user wants to go back
      changeLastIndex(lastIndex - pageSize);
      listAuthors(lastIndex - pageSize, pageSize);
    }
  };

  useEffect(() => {
    fetchQuote();
    listAuthors(0, 5);
  }, []);

  return (
    <>
      <h1>Quote of the day</h1>
      <p>
        <b>Content:</b> {quotes.content}{" "}
      </p>
      <p>
        <b>Author:</b> {quotes.author}{" "}
      </p>
      <p>
        <b>Tags:</b> {quotes.tags.join(", ")}
      </p>

      <Row>
        <Col>
          <button disabled={fecthing} onClick={() => fetchQuote()}>
            Random Quote
          </button>
        </Col>
        <Col>
          <h3>Page size</h3>
          <select
            onClick={(event) => {
              refreshPagination(event);
            }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
          </select>
        </Col>
        <Col>
          <button
            onClick={() => {
              handlePagination(false);
            }}
          >
            Prev Page
          </button>
          <button
            onClick={() => {
              handlePagination(true);
            }}
          >
            Next Page
          </button>
        </Col>
      </Row>
      <Table>
        <thead>
          <tr>
            <td>Name</td>
            <td>No of Qutoes</td>
          </tr>
        </thead>
        <tbody>{makeAuthorsTable()}</tbody>
      </Table>
    </>
  );
}

export default App;
