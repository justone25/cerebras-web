import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import Cerebras from '@cerebras/cerebras_cloud_sdk';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Initialize Cerebras client
const client = new Cerebras({
  apiKey: process.env.CEREBRAS_API_KEY
});

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Serve the static files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    const response = await client.chat.completions.create({
      messages: [{ role: 'user', content: message }],
      model: 'llama3.1-8b'
    });

    res.json({ response: response.choices[0].message.content });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
