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

// 详细的请求日志中间件
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
});

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 初始化 Cerebras client
console.log('Initializing Cerebras client with API key:', process.env.CEREBRAS_API_KEY ? '***[MASKED]***' : 'NOT SET');
const client = new Cerebras({
    apiKey: process.env.CEREBRAS_API_KEY
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    console.log('[Chat Request Started]');
    try {
        if (!process.env.CEREBRAS_API_KEY) {
            console.error('CEREBRAS_API_KEY is not set');
            return res.status(500).json({ error: 'API key not configured' });
        }

        const { message } = req.body;
        if (!message) {
            console.error('No message provided in request');
            return res.status(400).json({ error: 'Message is required' });
        }

        console.log('Sending request to Cerebras API...');
        console.log('Request payload:', { messages: [{ role: 'user', content: message }] });
        
        const response = await client.chat.completions.create({
            messages: [{ role: 'user', content: message }],
            model: 'llama3.1-8b'
        });

        console.log('Received response from Cerebras API:', response);
        res.json({ response: response.choices[0].message.content });
        
    } catch (error) {
        console.error('Error in /api/chat:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            response: error.response?.data
        });
        
        // 检查是否是 Cerebras API 错误
        if (error.response) {
            return res.status(error.response.status || 500).json({
                error: 'Cerebras API Error',
                details: error.response.data
            });
        }
        
        res.status(500).json({ 
            error: 'Internal Server Error',
            details: error.message
        });
    }
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ 
        error: 'An unexpected error occurred',
        details: err.message
    });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server started at ${new Date().toISOString()}`);
    console.log(`Server is running on port ${port}`);
    console.log('Environment:', process.env.NODE_ENV);
    console.log('Cerebras API Key configured:', !!process.env.CEREBRAS_API_KEY);
});
