const express = require('express');
const axios = require('axios');
const router = express.Router();

const ALPHA_VANTAGE_API_KEY = 'your_alpha_vantage_api_key';
const NEWS_API_KEY = 'your_news_api_key';

// Финансовые данные (например, акции компании)
router.get('/finance', async (req, res) => {
    try {
        const response = await axios.get('https://www.alphavantage.co/query', {
            params: {
                function: 'TIME_SERIES_DAILY',
                symbol: 'AAPL',
                apikey: ALPHA_VANTAGE_API_KEY,
            },
        });
        const data = response.data['Time Series (Daily)'];
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Новости
router.get('/news', async (req, res) => {
    try {
        const response = await axios.get('https://newsapi.org/v2/everything', {
            params: {
                q: 'technology',
                apiKey: NEWS_API_KEY,
            },
        });
        res.json(response.data.articles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
function authorize(roles = []) {
    return (req, res, next) => {
        const userRole = req.user?.role; // Предполагается, что информация о пользователе хранится в req.user
        if (!roles.includes(userRole)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    };
}

// Пример использования:
router.post('/finance', authorize(['editor']), async (req, res) => {
    // Данные для визуализации создаются только "editor"
});
module.exports = router;

