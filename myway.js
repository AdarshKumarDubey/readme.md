const express = require('express');
const router = express.Router();
const Snippet = require('../models/snippet');

// Get all code snippets
router.get('/', async (req, res) => {
  try {
    const snippets = await Snippet.find();
    res.json(snippets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SnippetList = () => {
  const [snippets, setSnippets] = useState([]);

  useEffect(() => {
    axios.get('/snippets')
      .then(res => {
        setSnippets(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <h2>All Code Snippets</h2>
      {snippets.map(snippet => (
        <div key={snippet._id}>
          <h3>{snippet.title}</h3>
          <p>Language: {snippet.language}</p>
          <code>{snippet.code}</code>
        </div>
      ))}
    </div>
  );
};

export default SnippetList;
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the MERN stack coding platform!' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


