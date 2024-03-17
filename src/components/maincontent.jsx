import React, { useState } from 'react';

function MainContent() {
  const [quote, setQuote] = useState(null);
  const [previousQuotes, setPreviousQuotes] = useState([]);
  const [authorSearch, setAuthorSearch] = useState('');
  const [showResultHeading, setShowResultHeading] = useState(false);
  const [noResultFound, setNoResultFound] = useState(false);

  const fetchRandomQuote = () => {
    fetch('https://api.quotable.io/random')
      .then(response => response.json())
      .then(data => {
        if (quote) {
          setPreviousQuotes(prevQuotes => [...prevQuotes, quote]);
        }
        setQuote(data);
        setShowResultHeading(false); // Reset result heading
        setNoResultFound(false); // Reset no result found warning
      })
      .catch(error => console.error('Error fetching quote:', error));
  };

  const fetchQuotesByAuthor = () => {
    if (authorSearch.trim() === '') {
      // Display error message if the input is empty
      alert('Please enter a valid author name.');
      return;
    }

    fetch(`https://api.quotable.io/quotes?author=${authorSearch}`)
      .then(response => response.json())
      .then(data => {
        if (data.results.length === 0) {
          setNoResultFound(true);
        } else {
          setPreviousQuotes(data.results);
          setShowResultHeading(true); // Show result heading
          setNoResultFound(false); // Reset no result found warning
        }
      })
      .catch(error => console.error('Error fetching quotes by author:', error));
  };

  const copyToClipboard = (quote) => {
    navigator.clipboard.writeText(`${quote.content} - ${quote.author}`);
    alert('Quote copied to clipboard!');
  };

  return (
    <div className="container pt-5">
      <h2 className="text-center mb-4 ">Random Quote Generator</h2>
      <div className="text-center">
        <input className='input-main mb-3'
          type="text"
          placeholder="Enter author name"
          value={authorSearch}
          onChange={e => setAuthorSearch(e.target.value)}
        />
        <button className="btn btn-primary mx-2" onClick={fetchQuotesByAuthor}>Search by Author</button>
      </div>
      {quote && (
        <div className="text-center my-3">
          <div className="card-body">
            <p className="card-text">{quote.content}</p>
            <p className="card-text">- {quote.author}</p>
            <button className="btn btn-secondary mx-2" onClick={() => copyToClipboard(quote)}>Copy Quote</button>
          </div>
        </div>
      )}
      <div className="text-center my-3">
        <button className="btn btn-primary mx-2" onClick={fetchRandomQuote}>Get Random Quote</button>
      </div>
      {showResultHeading && (
        <h2 className="text-center">RESULT</h2>
      )}
      {noResultFound && (
        <p className="text-center text-danger">No result found. Please enter a correct author name.</p>
      )}
      {previousQuotes.length > 0 && (
        <div className="previous-quotes">
          {previousQuotes.map((prevQuote, index) => (
            <div key={index} className="text-center my-3">
              <div className="card-body">
                <p className="card-text">{prevQuote.content}</p>
                <p className="card-text">- {prevQuote.author}</p>
                <button className="btn btn-secondary mx-2" onClick={() => copyToClipboard(prevQuote)}>Copy Quote</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MainContent;
