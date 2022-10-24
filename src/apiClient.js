import axios from "axios";
export class ApiClient {
  // utility verifies the response was successful
  responseStatusCheck(responseObject) {
    if (responseObject.status >= 200 && responseObject.status < 300) {
      return true;
    }
    return false;
  }

  // fetches random quote
  async fetchQuote() {
    let response = await axios.get("http://quotable.io/random");
    let success = await this.responseStatusCheck(response);
    if (!success) {
      return false;
    }
    return response;
  }

  // fecth a list of authors
  // refresh the list of authors currently visible
  async listAuthors(skip, pageSize) {
    let response = await axios.get(
      `https://quotable.io/authors?skip=${skip}&limit=${pageSize}`
    );
    if (!this.responseStatusCheck(response)) {
      return;
    }
    return response;
  }

  async getQuoteByAuthor(authorId) {
    return axios.get(`https://api.quotable.io/quotes?authorId=${authorId}`);
  }
}
