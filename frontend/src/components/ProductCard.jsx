import React from 'react'
import { ExternalLink, Star, TrendingUp, TrendingDown, Minus } from 'lucide-react'

const ProductCard = ({ product, onAnalyze }) => {
  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'Positive':
        return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'Negative':
        return <TrendingDown className="w-4 h-4 text-red-500" />
      default:
        return <Minus className="w-4 h-4 text-gray-500" />
    }
  }

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'Positive':
        return 'text-green-600 bg-green-50'
      case 'Negative':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      {/* Product Image */}
      <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-contain p-2"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
        ) : null}
        <div className="hidden w-full h-full items-center justify-center text-gray-400">
          <span className="text-sm">No Image</span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-2 min-h-[2.5rem]">
          {product.title}
        </h3>

        {/* Price */}
        {product.price && (
          <p className="text-lg font-bold text-green-600 mb-2">
            {product.price}
          </p>
        )}

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mb-3">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">{product.rating}</span>
          </div>
        )}

        {/* Sentiment from Title */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-gray-500">Title Sentiment:</span>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(product.sentiment)}`}>
            {getSentimentIcon(product.sentiment)}
            {product.sentiment}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onAnalyze}
            className="flex-1 btn-primary text-sm py-2"
          >
            Analyze Reviews
          </button>
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary flex items-center justify-center px-3 py-2"
            title="View on Amazon"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
