let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
    { text: "Don’t let yesterday take up too much of today.", category: "Wisdom" },
  ];
  
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    document.getElementById('quoteDisplay').innerText = `"${quote.text}" - [${quote.category}]`;
  
    // Session storage to remember last viewed quote
    sessionStorage.setItem('lastQuote', JSON.stringify(quote));
  }
  
  function addQuote() {
    const text = document.getElementById('newQuoteText').value.trim();
    const category = document.getElementById('newQuoteCategory').value.trim();
  
    if (text && category) {
      const newQuote = { text, category };
      quotes.push(newQuote);
      saveQuotes();
      alert('Quote added successfully!');
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';
    } else {
      alert('Please enter both quote and category.');
    }
  }
  
  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }
  
  function exportToJsonFile() {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    URL.revokeObjectURL(url);
  }
  
  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(e) {
      try {
        const importedQuotes = JSON.parse(e.target.result);
        if (Array.isArray(importedQuotes)) {
          quotes.push(...importedQuotes);
          saveQuotes();
          alert('Quotes imported successfully!');
        } else {
          alert('Invalid JSON format.');
        }
      } catch {
        alert('Error reading file. Ensure it’s a valid JSON.');
      }
    };
    fileReader.readAsText(event.target.files[0]);
  }
  
  // Show a quote on page load
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  
  // Load last quote viewed (sessionStorage)
  window.onload = () => {
    const last = sessionStorage.getItem('lastQuote');
    if (last) {
      const quote = JSON.parse(last);
      document.getElementById('quoteDisplay').innerText = `"${quote.text}" - [${quote.category}]`;
    }
  };
  