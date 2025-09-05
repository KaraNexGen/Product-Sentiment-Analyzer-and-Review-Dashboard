import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

try:
    # When run as a module: python -m backend.app
    from .scraper import search_products, get_reviews_with_sentiment
except Exception:  # noqa: BLE001
    # When run directly from backend/: python app.py
    from scraper import search_products, get_reviews_with_sentiment


def create_app() -> Flask:
    app = Flask(__name__)
    CORS(app)

    @app.get("/")
    def index() -> tuple[str, int]:
        return (
            """
            <html>
              <body style="font-family: system-ui, -apple-system, Segoe UI, Roboto; padding: 16px;">
                <h2>Product Sentiment Analyzer API</h2>
                <ul>
                  <li><a href="/api/health">/api/health</a> — health check</li>
                  <li><a href="/api/search?q=iphone">/api/search?q=iphone</a> — sample search</li>
                  <li>/api/reviews?url=&lt;amazon_url&gt; — reviews + sentiment</li>
                </ul>
              </body>
            </html>
            """,
            200,
        )

    @app.get("/api/health")
    def health() -> tuple[dict, int]:
        return {"status": "ok", "message": "Product Sentiment Analyzer API is running"}, 200

    @app.get("/api/search")
    def api_search():
        query = request.args.get("q", "").strip()
        if not query:
            return jsonify({"error": "Missing query parameter 'q'"}), 400
        
        try:
            products = search_products(query=query, limit=16)
            return jsonify({
                "success": True,
                "products": products,
                "count": len(products)
            })
        except Exception as exc:  # noqa: BLE001
            return jsonify({"error": str(exc), "success": False}), 500

    @app.get("/api/reviews")
    def api_reviews():
        product_url = request.args.get("url", "").strip()
        if not product_url:
            return jsonify({"error": "Missing 'url' parameter"}), 400
        
        try:
            result = get_reviews_with_sentiment(product_url=product_url, max_pages=2)
            return jsonify({
                "success": True,
                "data": result
            })
        except Exception as exc:  # noqa: BLE001
            return jsonify({"error": str(exc), "success": False}), 500

    return app


app = create_app()

if __name__ == "__main__":
    port = int(os.getenv("PORT", "5001"))
    app.run(host="0.0.0.0", port=port, debug=True)