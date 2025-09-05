# Product Sentiment Analyzer and Review Dashboard

A full-stack web application that scrapes Amazon products, analyzes customer review sentiment using TextBlob, and displays insights through an interactive React dashboard.

## Features

- 🔍 **Product Search**: Search Amazon.in for products with real-time scraping
- 📊 **Sentiment Analysis**: Analyze review sentiment (Positive/Neutral/Negative) using TextBlob
- 📈 **Interactive Charts**: Beautiful pie charts showing sentiment distribution
- 🎨 **Modern UI**: Clean, responsive design with TailwindCSS
- ⚡ **Real-time Analysis**: Live scraping and sentiment analysis
- 📱 **Mobile Responsive**: Works on all devices

## Tech Stack

### Backend
- **Python Flask** - Web framework
- **ScraperAPI** - Web scraping service
- **BeautifulSoup** - HTML parsing
- **TextBlob** - Sentiment analysis
- **pandas** - Data handling

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **Lucide React** - Icons

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- ScraperAPI account (API key included)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Start the backend server**
   ```bash
   python app.py
   ```
   Backend will run on `http://localhost:5001`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

## Usage

1. **Open the application** at `http://localhost:5173`
2. **Search for products** (e.g., "iPhone 14", "laptop", "headphones")
3. **View product cards** with title, price, rating, and title sentiment
4. **Click "Analyze Reviews"** to see detailed sentiment analysis
5. **Explore the modal** with:
   - Sentiment distribution pie chart
   - Review statistics
   - Latest reviews with sentiment labels

## API Endpoints

### Backend (Port 5001)

- `GET /api/health` - Health check
- `GET /api/search?q=<query>` - Search products (returns 16 products)
- `GET /api/reviews?url=<amazon_url>` - Get reviews and sentiment analysis

### Example API Calls

```bash
# Search products
curl "http://localhost:5001/api/search?q=iphone"

# Get reviews
curl "http://localhost:5001/api/reviews?url=https://www.amazon.in/dp/B0BDJ8Z2X2"
```

## Configuration

### Environment Variables

The backend uses these environment variables (set in `backend/.env`):

```env
SCRAPERAPI_KEY=1fb60639f68f81b5c90ff4e0aaa9a15a
PORT=5001
SCRAPERAPI_RENDER=true
```

### ScraperAPI Configuration

- **API Key**: Included in the project
- **Country**: India (amazon.in)
- **Rendering**: Enabled for JavaScript-heavy pages
- **Device**: Desktop

## Features in Detail


### Product Search
- Searches Amazon.in using ScraperAPI
- Returns exactly 16 product cards
- Extracts: title, price, rating, image, URL, ASIN
- Analyzes title sentiment using TextBlob

### Review Analysis
- Scrapes product review pages
- Analyzes each review's sentiment
- Categorizes as Positive/Neutral/Negative
- Shows sentiment distribution in pie chart
- Displays latest reviews with sentiment labels

### UI Components
- **ProductCard**: Displays product info with analyze button
- **AnalyzeModal**: Shows detailed sentiment analysis
- **Loading States**: "⏳ Searching..." and "⏳ Analyzing reviews..."
- **Error Handling**: Graceful error messages
- **Responsive Design**: Works on mobile and desktop

## Troubleshooting

### Common Issues

1. **Backend not starting**
   - Check if port 5001 is available
   - Ensure all dependencies are installed
   - Verify Python virtual environment is activated

2. **Frontend not connecting**
   - Ensure backend is running on port 5001
   - Check browser console for CORS errors
   - Verify API_BASE_URL in `frontend/src/services/api.js`

3. **Scraping errors**
   - ScraperAPI key might be invalid/expired
   - Amazon might be blocking requests
   - Check ScraperAPI dashboard for usage limits

4. **No products found**
   - Try different search terms
   - Check if Amazon.in is accessible
   - Verify ScraperAPI is working

### Development Tips

- Use browser DevTools to debug API calls
- Check backend logs for scraping errors
- Monitor ScraperAPI usage in dashboard
- Test with different product categories

## Production Deployment

### Backend (Render/AWS)
1. Set environment variables
2. Install dependencies
3. Run with production WSGI server (Gunicorn)

### Frontend (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy static files
3. Update API_BASE_URL for production

## License

This project is for educational purposes. Please respect Amazon's terms of service and use responsibly.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request


