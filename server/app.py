from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, abort, send_from_directory
from flask_cors import CORS
import pickle
import numpy as np
import time
import logging
import os
from functools import wraps




# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load data with error handling
try:
    popular_df = pickle.load(open('popular.pkl', 'rb'))
    pt = pickle.load(open('pt.pkl', 'rb'))
    books = pickle.load(open('books.pkl', 'rb'))
    similarity_score = pickle.load(open('similarity_score.pkl', 'rb'))
    logger.info("Successfully loaded all data files")
except FileNotFoundError as e:
    logger.error(f"Data file not found: {e}")
    raise
except Exception as e:
    logger.error(f"Error loading data: {e}")
    raise

# Cache for optimized book data
_books_cache = None
_books_by_letter_cache = {}

def get_optimized_books_data():
    """Get cached and optimized books data"""
    global _books_cache
    if _books_cache is None:
        print("Loading and caching books data...")
        start_time = time.time()
        
        # Get unique books with only necessary columns
        books_df = books.drop_duplicates('Book-Title')[['Book-Title', 'Book-Author', 'Image-URL-M']]
        
        # Sort once and cache
        books_df = books_df.sort_values('Book-Title')
        
        # Convert to list of dictionaries once
        _books_cache = []
        for _, book in books_df.iterrows():
            _books_cache.append({
                'Book-Title': book['Book-Title'],
                'Book-Author': book['Book-Author'],
                'Image-URL-M': book['Image-URL-M']
            })
        
        load_time = time.time() - start_time
        print(f"Books data cached in {load_time:.2f} seconds. Total books: {len(_books_cache)}")
    
    return _books_cache

def get_books_by_letter(letter):
    """Get cached books filtered by letter"""
    global _books_by_letter_cache
    
    if letter not in _books_by_letter_cache:
        print(f"Caching books for letter: {letter}")
        start_time = time.time()
        
        all_books = get_optimized_books_data()
        
        if letter == 'all':
            _books_by_letter_cache[letter] = all_books
        else:
            _books_by_letter_cache[letter] = [
                book for book in all_books 
                if book['Book-Title'].startswith(letter)
            ]
        
        cache_time = time.time() - start_time
        print(f"Letter '{letter}' cached in {cache_time:.2f} seconds. Books: {len(_books_by_letter_cache[letter])}")
    
    return _books_by_letter_cache[letter]

app = Flask(__name__, static_folder='client/build/static', template_folder='client/build')
app.secret_key = 'your_secret_key_here_change_in_production'
google_drive_base_url = "https://drive.google.com/file/d/"

# Enable CORS for all routes
CORS(app, origins=['http://localhost:3000', 'http://127.0.0.1:3000'])

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return send_from_directory('client/build', 'index.html'), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

# Decorator for error handling
def handle_errors(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except Exception as e:
            logger.error(f"Error in {f.__name__}: {str(e)}")
            flash('An error occurred. Please try again.', 'error')
            return redirect('/')
    return decorated_function


# Serve React App
@app.route('/')
def serve_react_app():
    return send_from_directory('client/build', 'index.html')

@app.route('/<path:path>')
def serve_react_routes(path):
    # Check if the path is a static file
    if os.path.exists(os.path.join('client/build', path)):
        return send_from_directory('client/build', path)
    # Otherwise serve the React app for client-side routing
    return send_from_directory('client/build', 'index.html')

# API Routes
@app.route('/api/popular')
def api_popular():
    """API endpoint for popular books"""
    return jsonify({
        'data': [
            {
                'book_name': book['Book-Title'],
                'author': book['Book-Author'],
                'image': book['Image-URL-M'],
                'votes': book['Book-Rating'],
                'rating': book['avg_ratings']
            }
            for _, book in popular_df.iterrows()
        ]
    })

@app.route('/api/books')
def api_books():
    """API endpoint for all books"""
    all_books = get_optimized_books_data()
    return jsonify({'data': all_books})

def get_file_id(book_id):
    # Implement your logic to retrieve the file ID for a given book ID
    return "1ufRI06Gj1n4JI84MmALNv5UM6LDhP8Zr"

@app.route("/showbook")
def index():
    # ... your logic to retrieve book data ...
    books = [
        {"book_id": 1, "image": "...", "book_name": "..."},
        {"book_id": 2, "image": "...", "book_name": "..."},
    ]
    return render_template("index.html", books=books)

@app.route('/api/recommend_books', methods=['POST'])
@handle_errors
def recommend_book():
    data = request.get_json()
    user_input = data.get('user_input', '').strip() if data else request.form.get('user_input', '').strip()
    
    if not user_input:
        return jsonify({'error': 'Please enter a book title.'}), 400
    
    logger.info(f"Getting recommendations for: {user_input}")
    
    # First check if the book exists in the main books database
    book_exists = books[books['Book-Title'] == user_input]
    
    if book_exists.empty:
        # Book doesn't exist in the database at all
        return jsonify({
            'error': f'Book "{user_input}" not found in our database. Please check the spelling or try a different book.',
            'data': []
        }), 404
    
    # Check if the book exists in the pivot table (for collaborative filtering)
    book_indices = np.where(pt.index == user_input)[0]
    
    if len(book_indices) == 0:
        # Book exists but not in recommendation database - provide fallback recommendations
        logger.info(f"Book '{user_input}' exists but not in recommendation database. Providing fallback recommendations.")
        
        # Get fallback recommendations based on author or similar titles
        book_info = book_exists.iloc[0]
        author = book_info['Book-Author']
        
        # Find books by the same author
        author_books = books[books['Book-Author'] == author].drop_duplicates('Book-Title')
        
        # If not enough books by same author, get popular books
        if len(author_books) < 5:
            fallback_books = popular_df.head(5)
            data = []
            for _, book in fallback_books.iterrows():
                data.append([book['Book-Title'], book['Book-Author'], book['Image-URL-M']])
        else:
            # Get books by same author
            data = []
            for _, book in author_books.head(5).iterrows():
                data.append([book['Book-Title'], book['Book-Author'], book['Image-URL-M']])
        
        return jsonify({
            'data': data,
            'message': f'Book "{user_input}" is not in our recommendation database, but here are some suggestions:'
        })
    
    # Book exists in pivot table - use collaborative filtering
    index = book_indices[0]
    
    # Find the most similar items, sorted by similarity score, excluding the first (which is the book itself)
    similar_items = sorted(list(enumerate(similarity_score[index])), key=lambda x: x[1], reverse=True)[1:6]

    data = []
    for i in similar_items:
        item = []
        temp_df = books[books['Book-Title'] == pt.index[i[0]]].drop_duplicates('Book-Title')
        if not temp_df.empty:
            item.append(temp_df['Book-Title'].values[0])
            item.append(temp_df['Book-Author'].values[0])
            item.append(temp_df['Image-URL-M'].values[0])
            data.append(item)
        
    logger.info(f"Found {len(data)} recommendations for: {user_input}")
    
    return jsonify({'data': data})

@app.route('/api/search_books', methods=['POST'])
@handle_errors
def search_books_api():
    """API endpoint for searching books by keyword - optimized"""
    start_time = time.time()
    data = request.get_json()
    keyword = data.get('keyword', '').strip() if data else request.form.get('keyword', '').strip()
    letter = data.get('letter', '').strip() if data else request.form.get('letter', '').strip()
    
    # Use cached data instead of DataFrame operations
    all_books = get_books_by_letter(letter if letter and letter != 'all' else 'all')
    
    # Filter by keyword if provided
    if keyword:
        books_list = [
            book for book in all_books
            if (keyword.lower() in str(book['Book-Title']).lower() or 
                keyword.lower() in str(book['Book-Author']).lower())
        ]
    else:
        books_list = all_books
    
    search_time = time.time() - start_time
    logger.info(f"Search completed in {search_time:.3f} seconds. Results: {len(books_list)}")
    
    return jsonify({'data': books_list})


@app.route('/api/search_suggestions', methods=['GET'])
def search_books_json():
    """JSON API for real-time search suggestions - optimized"""
    keyword = request.args.get('q', '').strip()
    
    if len(keyword) < 2:  # Only search if at least 2 characters
        return jsonify({'books': []})
    
    # Use cached data for faster search
    all_books = get_optimized_books_data()
    
    # Filter and limit results
    results = []
    keyword_lower = keyword.lower()
    
    for book in all_books:
        if (keyword_lower in book['Book-Title'].lower() or 
            keyword_lower in book['Book-Author'].lower()):
            results.append({
                'title': book['Book-Title'],
                'author': book['Book-Author'],
                'image': book['Image-URL-M']
            })
            
            if len(results) >= 10:  # Limit to 10 results
                break
    
    return jsonify({'books': results})

@app.route('/api/load_more_books', methods=['GET'])
def load_more_books():
    """Load more books for the search page - optimized with caching"""
    start_time = time.time()
    offset = int(request.args.get('offset', 0))
    limit = int(request.args.get('limit', 20))  # Reduced limit for faster loading
    letter = request.args.get('letter', 'all')
    
    # Use cached data
    all_books = get_books_by_letter(letter)
    
    # Apply offset and limit
    results = all_books[offset:offset + limit]
    
    load_time = time.time() - start_time
    print(f"Load more books completed in {load_time:.3f} seconds. Loaded: {len(results)}")
    
    return jsonify({
        'data': results, 
        'has_more': len(results) == limit,
        'total_books': len(all_books)
    })

if __name__ == '__main__':
    app.run(debug=True)
