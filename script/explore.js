// News API configuration
const API_KEY = 'YOUR_NEWS_API_KEY'; // Replace with your News API key
const NEWS_API_URL = 'https://newsapi.org/v2/everything';
const GOOGLE_NEWS_URL = 'https://news.google.com/rss/search?q=';

// Static news data as fallback
const STATIC_NEWS = [
    {
        title: "Government Announces New Farmer Support Scheme",
        description: "The government has launched a new financial assistance program for small-scale farmers, providing up to ₹50,000 per acre for sustainable farming practices.",
        source: { name: "The Hindu" },
        url: "https://example.com/news1",
        publishedAt: new Date().toISOString()
    },
    {
        title: "Climate Change Impact on Global Agriculture",
        description: "New research shows significant impact of climate change on crop yields worldwide, with potential solutions being implemented in various countries.",
        source: { name: "BBC News" },
        url: "https://example.com/news2",
        publishedAt: new Date().toISOString()
    },
    {
        title: "Organic Farming Regulations Updated",
        description: "New regulations for organic farming certification have been released, making it easier for farmers to get certified while maintaining high standards.",
        source: { name: "Times of India" },
        url: "https://example.com/news3",
        publishedAt: new Date().toISOString()
    },
    {
        title: "Smart Farming Technologies Revolutionizing Agriculture",
        description: "Farmers are increasingly adopting IoT and AI technologies to improve crop yields and reduce water usage.",
        source: { name: "Economic Times" },
        url: "https://example.com/news4",
        publishedAt: new Date().toISOString()
    },
    {
        title: "New Agricultural Policy Focuses on Sustainability",
        description: "The government's new agricultural policy emphasizes sustainable farming practices and environmental conservation.",
        source: { name: "Indian Express" },
        url: "https://example.com/news5",
        publishedAt: new Date().toISOString()
    },
    {
        title: "Global Food Security Challenges Addressed",
        description: "International organizations are working together to address food security challenges through innovative farming techniques.",
        source: { name: "Reuters" },
        url: "https://example.com/news6",
        publishedAt: new Date().toISOString()
    }
];

// Farming-related keywords for news search
const FARMING_KEYWORDS = [
    'farming',
    'agriculture',
    'farmers',
    'crops',
    'agricultural policy',
    'organic farming',
    'sustainable agriculture',
    'farm subsidies',
    'rural development'
];

// Function to format date
function formatDate(date) {
    return new Date(date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Function to create news cards
function createNewsCard(news) {
    const card = document.createElement('div');
    card.className = 'news-card';
    
    card.innerHTML = `
        <div class="news-content">
            <h2 class="news-title">${news.title}</h2>
            <p class="news-summary">${news.description || 'No description available'}</p>
            <p class="reference">Source: ${news.source.name}</p>
            <a href="${news.url}" class="read-more-btn" target="_blank">Read More</a>
        </div>
    `;
    
    return card;
}

// Function to display all news cards
function displayNews(articles) {
    const newsContainer = document.getElementById('news-container');
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    
    // Clear existing content
    newsContainer.innerHTML = '';
    
    if (articles.length === 0) {
        errorElement.style.display = 'block';
        errorElement.innerHTML = '<p>No farming news available at the moment. Please check back later.</p>';
        return;
    }
    
    articles.forEach(news => {
        const card = createNewsCard(news);
        newsContainer.appendChild(card);
    });
    
    // Update last updated time
    document.getElementById('last-updated').textContent = formatDate(new Date());
    
    // Hide loading and error states
    loadingElement.style.display = 'none';
    errorElement.style.display = 'none';
}

// Function to handle errors
function handleError(error) {
    console.error('Error fetching news:', error);
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    
    loadingElement.style.display = 'none';
    errorElement.style.display = 'block';
    errorElement.innerHTML = `<p>Error loading news: ${error.message}</p>`;
}

// Function to fetch news from Google News RSS
async function fetchGoogleNews() {
    try {
        const query = FARMING_KEYWORDS.join('+');
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(GOOGLE_NEWS_URL + query)}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data.contents, "text/xml");
        
        const items = xmlDoc.getElementsByTagName("item");
        const articles = [];
        
        for (let i = 0; i < Math.min(items.length, 12); i++) {
            const item = items[i];
            articles.push({
                title: item.getElementsByTagName("title")[0].textContent,
                description: item.getElementsByTagName("description")[0].textContent,
                source: { name: item.getElementsByTagName("source")[0].textContent },
                url: item.getElementsByTagName("link")[0].textContent,
                publishedAt: item.getElementsByTagName("pubDate")[0].textContent
            });
        }
        
        return articles;
    } catch (error) {
        console.error('Error fetching Google News:', error);
        return null;
    }
}

// Function to fetch news from News API
async function fetchNewsAPI() {
    try {
        const query = FARMING_KEYWORDS.join(' OR ');
        const response = await fetch(`${NEWS_API_URL}?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&apiKey=${API_KEY}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.articles && data.articles.length > 0) {
            return data.articles.slice(0, 12);
        }
        return null;
    } catch (error) {
        console.error('Error fetching News API:', error);
        return null;
    }
}

// Main function to fetch news from multiple sources
async function fetchNews() {
    try {
        const loadingElement = document.getElementById('loading');
        loadingElement.style.display = 'block';
        
        // Try Google News first
        let articles = await fetchGoogleNews();
        
        // If Google News fails, try News API
        if (!articles) {
            articles = await fetchNewsAPI();
        }
        
        // If both APIs fail, use static data
        if (!articles) {
            articles = STATIC_NEWS;
        }
        
        // Sort articles by date (newest first)
        const sortedArticles = articles.sort((a, b) => 
            new Date(b.publishedAt) - new Date(a.publishedAt)
        );
        
        displayNews(sortedArticles);
    } catch (error) {
        handleError(error);
    }
}

// Initialize the page and fetch news
document.addEventListener('DOMContentLoaded', () => {
    fetchNews();
    
    // Refresh news every 30 minutes
    setInterval(fetchNews, 30 * 60 * 1000);
}); 