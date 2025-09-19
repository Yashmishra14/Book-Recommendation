// ===== MAIN JAVASCRIPT FILE =====

// Global variables
let isDark = localStorage.getItem('theme') === 'dark';

// ===== THEME TOGGLE FUNCTIONALITY =====
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    if (!themeToggle) return;
    
    // Apply saved theme on page load
    if (isDark) {
        body.classList.add('dark-theme');
        updateThemeToggle(true);
    }
    
    function updateThemeToggle(darkMode) {
        if (darkMode) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
        }
    }
    
    themeToggle.addEventListener('click', function() {
        isDark = !isDark;
        body.classList.toggle('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateThemeToggle(isDark);
    });
}

// ===== LOADING SCREEN =====
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading');
    if (loadingScreen) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
            }, 1000);
        });
    }
}

// ===== CUSTOM CURSOR =====
function initCustomCursor() {
    const cursor = document.getElementById('cursor');
    if (!cursor) return;
    
    document.addEventListener("mousemove", (e) => {
        cursor.style.left = e.pageX + 'px';
        cursor.style.top = e.pageY + 'px';
    });
    
    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .book-card, .home-main-container');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            cursor.style.transform = 'scale(1.5)';
        });
        
        element.addEventListener('mouseleave', function() {
            cursor.style.transform = 'scale(1)';
        });
    });
}

// ===== RIPPLE EFFECT =====
function initRippleEffect() {
    const rippleElements = document.querySelectorAll('.book-card, .home-main-container, .btn');
    
    rippleElements.forEach(element => {
        element.addEventListener('click', function(e) {
            const ripple = document.createElement('div');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(102, 126, 234, 0.3)'};
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
                z-index: 15;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// ===== ENTRANCE ANIMATIONS =====
function initEntranceAnimations() {
    const animatedElements = document.querySelectorAll('.book-card, .recommendation-card, .about-section');
    
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `all 0.6s ease ${index * 0.1}s`;
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100 + (index * 100));
    });
}

// ===== SEARCH FUNCTIONALITY =====
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchForm = document.querySelector('.search-form');
    
    if (!searchInput || !searchForm) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            const keyword = this.value.toLowerCase();
            filterBooksByKeyword(keyword);
        }, 300);
    });
    
    searchInput.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    searchInput.addEventListener('blur', function() {
        if (!this.value) {
            this.parentElement.classList.remove('focused');
        }
    });
}

// ===== BOOK FILTERING =====
function filterBooksByKeyword(keyword) {
    const bookCards = document.querySelectorAll('.book-card');
    
    bookCards.forEach(card => {
        const title = card.dataset.title ? card.dataset.title.toLowerCase() : '';
        const author = card.dataset.author ? card.dataset.author.toLowerCase() : '';
        
        if (keyword === '' || title.includes(keyword) || author.includes(keyword)) {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.5s ease';
        } else {
            card.style.display = 'none';
        }
    });
}

function filterBooksByLetter(letter) {
    const bookCards = document.querySelectorAll('.book-card');
    
    bookCards.forEach(card => {
        const title = card.dataset.title || '';
        const firstLetter = title.charAt(0).toUpperCase();
        
        if (letter === 'all' || firstLetter === letter) {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.5s ease';
        } else {
            card.style.display = 'none';
        }
    });
}

// ===== ALPHABET FILTER =====
function initAlphabetFilter() {
    const alphabetButtons = document.querySelectorAll('.alphabet-btn');
    const selectedLetterInput = document.getElementById('selectedLetter');
    
    if (!alphabetButtons.length || !selectedLetterInput) return;
    
    let currentLetter = 'all';
    
    alphabetButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active state
            alphabetButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update selected letter
            currentLetter = this.dataset.letter;
            selectedLetterInput.value = currentLetter;
            
            // Filter books
            filterBooksByLetter(currentLetter);
        });
    });
}

// ===== SORT FUNCTIONALITY =====
function initSort() {
    const sortSelect = document.getElementById('sortBy');
    
    if (!sortSelect) return;
    
    sortSelect.addEventListener('change', function() {
        sortBooks(this.value);
    });
}

function sortBooks(sortBy) {
    const booksGrid = document.getElementById('booksGrid');
    if (!booksGrid) return;
    
    const bookCards = Array.from(booksGrid.querySelectorAll('.book-card'));
    
    bookCards.sort((a, b) => {
        const aValue = sortBy === 'title' ? a.dataset.title : a.dataset.author;
        const bValue = sortBy === 'title' ? b.dataset.title : b.dataset.author;
        return aValue.localeCompare(bValue);
    });
    
    // Re-append sorted cards
    bookCards.forEach(card => booksGrid.appendChild(card));
}

// ===== LOAD MORE FUNCTIONALITY =====
function initLoadMore() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    if (!loadMoreBtn) return;
    
    let currentOffset = 20; // Initial books loaded
    let currentLetter = 'all';
    
    loadMoreBtn.addEventListener('click', function() {
        loadMoreBooks();
    });
    
    function loadMoreBooks() {
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        this.disabled = true;
        
        fetch(`/load_more_books?offset=${currentOffset}&limit=20&letter=${currentLetter}`)
            .then(response => response.json())
            .then(data => {
                if (data.books.length > 0) {
                    addBooksToGrid(data.books);
                    currentOffset += data.books.length;
                    this.innerHTML = '<i class="fas fa-plus"></i> Load More Books';
                    this.disabled = false;
                } else {
                    this.innerHTML = '<i class="fas fa-check"></i> No More Books';
                    this.disabled = true;
                }
            })
            .catch(error => {
                console.error('Error loading more books:', error);
                this.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error Loading';
                this.disabled = false;
            });
    }
    
    function addBooksToGrid(books) {
        const booksGrid = document.getElementById('booksGrid');
        if (!booksGrid) return;
        
        books.forEach(book => {
            const bookCard = document.createElement('div');
            bookCard.className = 'book-card';
            bookCard.dataset.title = book['Book-Title'];
            bookCard.dataset.author = book['Book-Author'];
            
            bookCard.innerHTML = `
                <div class="book-image-container">
                    <img src="${book['Image-URL-M']}" 
                         alt="${book['Book-Title']}" 
                         class="book-image"
                         onerror="this.src='https://via.placeholder.com/300x400/667eea/ffffff?text=Book+Cover'">
                    <div class="book-overlay">
                        <button class="book-action-btn" onclick="getRecommendations('${book['Book-Title']}')">
                            <i class="fas fa-search-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="book-info">
                    <h3 class="book-title">${book['Book-Title']}</h3>
                    <p class="book-author">${book['Book-Author']}</p>
                </div>
            `;
            
            booksGrid.appendChild(bookCard);
        });
    }
}

// ===== RECOMMENDATION FUNCTIONS =====
function getRecommendations(bookTitle) {
    window.location.href = `/recommend?book=${encodeURIComponent(bookTitle)}`;
}

function searchBook(bookTitle) {
    const searchInput = document.querySelector('input[name="user_input"]');
    if (searchInput) {
        searchInput.value = bookTitle;
        document.querySelector('.recommend-form').submit();
    }
}

// ===== KEYBOARD SHORTCUTS =====
function initKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Toggle theme with Ctrl/Cmd + D
        if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
            e.preventDefault();
            const themeToggle = document.getElementById('themeToggle');
            if (themeToggle) themeToggle.click();
        }
        
        // Focus search with Ctrl/Cmd + K
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('.search-input');
            if (searchInput) searchInput.focus();
        }
        
        // Enter key for home page
        if (e.key === 'Enter' || e.key === ' ') {
            const homeContainer = document.querySelector('.home-main-container');
            if (homeContainer && homeContainer.contains(e.target)) {
                e.preventDefault();
                searchBooks();
            }
        }
    });
}

// ===== NAVBAR SCROLL EFFECT =====
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar, .second-navbar, .recommend-navbar, .search-navbar, .search-results-navbar, .about-navbar');
    if (!navbar) return;
    
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navbar.style.background = isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(20px)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.1)';
            navbar.style.backdropFilter = 'blur(20px)';
            navbar.style.boxShadow = 'none';
        }
        
        lastScrollY = currentScrollY;
    });
}

// ===== PERFORMANCE OPTIMIZATION =====
function initPerformanceOptimization() {
    let ticking = false;
    
    function updateOnScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                // Scroll-based animations can be added here
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', updateOnScroll);
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    initThemeToggle();
    initLoadingScreen();
    initCustomCursor();
    initRippleEffect();
    initEntranceAnimations();
    initSearch();
    initAlphabetFilter();
    initSort();
    initLoadMore();
    initKeyboardShortcuts();
    initNavbarScroll();
    initPerformanceOptimization();
});

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== EXPORT FOR GLOBAL USE =====
window.BookWorld = {
    getRecommendations,
    searchBook,
    filterBooksByKeyword,
    filterBooksByLetter,
    sortBooks
};
