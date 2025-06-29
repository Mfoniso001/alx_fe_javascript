let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
    { text: "Don’t let yesterday take up too much of today.", category: "Wisdom" },
  ];
  
  // Show a random quote from the selected category
  function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    localStorage.setItem('selectedCategory', selectedCategory);
  
    const filtered = selectedCategory === 'all'
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);
  
    const randomIndex = Math.floor(Math.random() * filtered.length);
    const quote = filtered[randomIndex];
  
    if (quote) {
      document.getElementById('quoteDisplay').innerText = `"${quote.text}" - [${quote.category}]`;
      sessionStorage.setItem('lastQuote', JSON.stringify(quote));
    } else {
      document.getElementById('quoteDisplay').innerText = 'No quotes in this category yet.';
    }
  }
  
  // Show a completely random quote from all quotes
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    document.getElementById('quoteDisplay').innerText = `"${quote.text}" - [${quote.category}]`;
    sessionStorage.setItem('lastQuote', JSON.stringify(quote));
  }
  
  // Add new quote
  function addQuote() {
    const text = document.getElementById('newQuoteText').value.trim();
    const category = document.getElementById('newQuoteCategory').value.trim();
  
    if (text && category) {
      const newQuote = { text, category };
      quotes.push(newQuote);
      saveQuotes();
      populateCategories();
      postQuoteToServer(newQuote); // simulate posting to server
      alert('Quote added successfully!');
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';
    } else {
      alert('Please enter both quote and category.');
    }
  }
  
  // Save quotes to local storage
  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }
  
  // Populate category dropdown
  function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    const categories = Array.from(new Set(quotes.map(q => q.category)));
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat;
      option.textContent = cat;
      categoryFilter.appendChild(option);
    });
  
    const savedFilter = localStorage.getItem('selectedCategory');
    if (savedFilter) {
      categoryFilter.value = savedFilter;
      filterQuotes();
    }
  }
  
  // Export quotes to JSON file
  function exportToJsonFile() {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    URL.revokeObjectURL(url);
  }
  
  // Import quotes from uploaded JSON file
  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(e) {
      try {
        const importedQuotes = JSON.parse(e.target.result);
        if (Array.isArray(importedQuotes)) {
          quotes.push(...importedQuotes);
          saveQuotes();
          populateCategories();
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
  
  // Notify user visually on UI
  function notifyUser(message) {
    const banner = document.createElement('div');
    banner.innerText = message;
    banner.style.background = '#f0c674';
    banner.style.color = '#000';
    banner.style.padding = '10px';
    banner.style.marginTop = '20px';
    banner.style.fontWeight = 'bold';
    document.body.insertBefore(banner, document.getElementById('quoteDisplay'));
    setTimeout(() => banner.remove(), 5000);
  }
  
  // Simulated GET from server
  function fetchQuotesFromServer() {
    return fetch('server-quotes.json') // Replace with actual API if needed
      .then(res => res.json())
      .catch(err => {
        console.error("Failed to fetch from server:", err);
        return [];
      });
  }
  
  // Simulated POST to server
  function postQuoteToServer(quote) {
    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify(quote),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(response => response.json())
      .then(data => {
        console.log("Quote posted to server (mock):", data);
      })
      .catch(error => console.error("Failed to post quote:", error));
  }
  
  // Sync quotes from server (conflict resolution: server wins)
  function syncQuotes() {
    fetchQuotesFromServer().then(serverQuotes => {
      let updated = false;
  
      serverQuotes.forEach(sq => {
        if (!quotes.some(lq => lq.text === sq.text && lq.category === sq.category)) {
          quotes.push(sq);
          updated = true;
        }
      });
  
      if (updated) {
        saveQuotes();
        populateCategories();
        notifyUser("New quotes synced from server.");
      }
    });
  }
  
  // Initial setup
  window.onload = () => {
    populateCategories();
  
    const last = sessionStorage.getItem('lastQuote');
    if (last) {
      const quote = JSON.parse(last);
      document.getElementById('quoteDisplay').innerText = `"${quote.text}" - [${quote.category}]`;
    }
  };
  
  // Event Listeners
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  
  // Periodically sync with server every 20 seconds
  setInterval(syncQuotes, 20000);
  