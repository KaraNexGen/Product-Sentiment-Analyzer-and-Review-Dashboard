import React, { useState, useEffect } from 'react'
import { X, Star, Loader2, AlertCircle } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { getReviews } from '../services/api'

const COLORS = {
  Positive: '#10b981',
  Neutral: '#6b7280',
  Negative: '#ef4444'
}

const AnalyzeModal = ({ product, onClose }) => {
  const [reviews, setReviews] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchReviews()
  }, [product.url])

  const fetchReviews = async () => {
    setLoading(true)
    setError('')
    setReviews(null)

    try {
      const response = await getReviews(product.url)
      if (response.success) {
        setReviews(response.data)
      } else {
        setError(response.error || 'Failed to fetch reviews')
      }
    } catch (err) {
      setError('Network error. Please try again.')
      console.error('Reviews error:', err)
    } finally {
      setLoading(false)
    }
  }

  const chartData = reviews ? [
    { name: 'Positive', value: reviews.counts.Positive, color: COLORS.Positive },
    { name: 'Neutral', value: reviews.counts.Neutral, color: COLORS.Neutral },
    { name: 'Negative', value: reviews.counts.Negative, color: COLORS.Negative }
  ].filter(item => item.value > 0) : []

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'Positive':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'Negative':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Review Analysis</h2>
            <p className="text-gray-600 mt-1 line-clamp-1">{product.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
                <p className="text-gray-600">⏳ Analyzing reviews...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={fetchReviews}
                  className="btn-primary"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {reviews && (
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{reviews.counts.Positive}</div>
                  <div className="text-sm text-green-700">Positive</div>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-600">{reviews.counts.Neutral}</div>
                  <div className="text-sm text-gray-700">Neutral</div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{reviews.counts.Negative}</div>
                  <div className="text-sm text-red-700">Negative</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{reviews.total}</div>
                  <div className="text-sm text-blue-700">Total Reviews</div>
                </div>
              </div>

              {/* Pie Chart */}
              {chartData.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Distribution</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Reviews List */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Latest Reviews</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {reviews.reviews.map((review, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {review.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600">{review.rating}</span>
                            </div>
                          )}
                          <span className="text-xs text-gray-500">{review.date}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSentimentColor(review.sentiment)}`}>
                          {review.sentiment}
                        </span>
                      </div>
                      
                      {review.title && (
                        <h4 className="font-medium text-gray-900 mb-1">{review.title}</h4>
                      )}
                      
                      {review.body && (
                        <p className="text-gray-700 text-sm leading-relaxed">{review.body}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AnalyzeModal
