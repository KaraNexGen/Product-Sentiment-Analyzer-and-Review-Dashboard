import axios from 'axios'

const API_BASE_URL = 'http://localhost:5001'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout for scraping
})

// Search products
export const searchProducts = async (query) => {
  try {
    const response = await api.get('/api/search', {
      params: { q: query }
    })
    return response.data
  } catch (error) {
    console.error('Search API error:', error)
    if (error.response) {
      return {
        success: false,
        error: error.response.data.error || 'Search failed'
      }
    }
    return {
      success: false,
      error: 'Network error. Please check if the backend is running.'
    }
  }
}

// Get reviews for a product
export const getReviews = async (productUrl) => {
  try {
    const response = await api.get('/api/reviews', {
      params: { url: productUrl }
    })
    return response.data
  } catch (error) {
    console.error('Reviews API error:', error)
    if (error.response) {
      return {
        success: false,
        error: error.response.data.error || 'Failed to fetch reviews'
      }
    }
    return {
      success: false,
      error: 'Network error. Please check if the backend is running.'
    }
  }
}

// Health check
export const healthCheck = async () => {
  try {
    const response = await api.get('/api/health')
    return response.data
  } catch (error) {
    console.error('Health check error:', error)
    return { status: 'error', message: 'Backend not reachable' }
  }
}
