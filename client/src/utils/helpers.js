// Format book title for URL
export const formatBookTitleForURL = (title) => {
  return encodeURIComponent(title);
};

// Decode book title from URL
export const decodeBookTitleFromURL = (encodedTitle) => {
  return decodeURIComponent(encodedTitle);
};

// Truncate text to specified length
export const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

// Format number with commas
export const formatNumber = (num) => {
  if (!num) return '0';
  return num.toLocaleString();
};

// Format rating to 1 decimal place
export const formatRating = (rating) => {
  if (!rating) return '0.0';
  return parseFloat(rating).toFixed(1);
};

// Generate placeholder image URL
export const getPlaceholderImage = (width = 300, height = 400) => {
  return `https://via.placeholder.com/${width}x${height}/1a1a2e/ffffff?text=No+Image`;
};

// Check if image URL is valid
export const isValidImageUrl = (url) => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Handle image load error
export const handleImageError = (event) => {
  event.target.src = getPlaceholderImage();
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Generate random ID
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Check if device is mobile
export const isMobile = () => {
  return window.innerWidth < 768;
};

// Check if device is tablet
export const isTablet = () => {
  return window.innerWidth >= 768 && window.innerWidth < 1024;
};

// Check if device is desktop
export const isDesktop = () => {
  return window.innerWidth >= 1024;
};

// Get viewport size
export const getViewportSize = () => {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

// Scroll to top
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

// Copy text to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy text: ', err);
    return false;
  }
};

// Format date
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString();
};

// Format date and time
export const formatDateTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString();
};

// Get time ago
export const getTimeAgo = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
  return `${Math.floor(diffInSeconds / 31536000)}y ago`;
};
