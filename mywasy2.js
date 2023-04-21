// app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 5000;

// connect to MongoDB database
mongoose.connect('mongodb://localhost:27017/code-snippets', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// create code snippet schema
const codeSnippetSchema = new mongoose.Schema({
  title: { type: String, required: true },
  language: { type: String, required: true },
  code: { type: String, required: true },
}, { timestamps: true });

// create code snippet model
const CodeSnippet = mongoose.model('CodeSnippet', codeSnippetSchema);

app.use(cors());
app.use(express.json());

// GET all code snippets
app.get('/api/code-snippets', async (req, res) => {
  try {
    const codeSnippets = await CodeSnippet.find();
    res.json(codeSnippets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET a specific code snippet by ID
app.get('/api/code-snippets/:id', getCodeSnippet, (req, res) => {
  res.json(res.codeSnippet);
});

// POST a new code snippet
app.post('/api/code-snippets', async (req, res) => {
  const codeSnippet = new CodeSnippet({
    title: req.body.title,
    language: req.body.language,
    code: req.body.code
  });

  try {
    const newCodeSnippet = await codeSnippet.save();
    res.status(201).json(newCodeSnippet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT (update) a code snippet by ID
app.put('/api/code-snippets/:id', getCodeSnippet, async (req, res) => {
  if (req.body.title != null) {
    res.codeSnippet.title = req.body.title;
  }
  if (req.body.language != null) {
    res.codeSnippet.language = req.body.language;
  }
  if (req.body.code != null) {
    res.codeSnippet.code = req.body.code;
  }

  try {
    const updatedCodeSnippet = await res.codeSnippet.save();
    res.json(updatedCodeSnippet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a code snippet by ID
app.delete('/api/code-snippets/:id', getCodeSnippet, async (req, res) => {
  try {
    await res.codeSnippet.remove();
    res.json({ message: 'Code snippet deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// middleware function to get a code snippet by ID
async function getCodeSnippet(req, res, next) {
  let codeSnippet;
  try {
    codeSnippet = await CodeSnippet.findById(req.params.id);
    if (codeSnippet == null) {
      return res.status(404).json({ message: 'Code snippet not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.codeSnippet = codeSnippet;
  next();
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
