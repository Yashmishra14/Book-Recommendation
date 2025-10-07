# BookWorld Troubleshooting Guide

## 🚨 Common Issues and Solutions

### 1. CSS Not Working / Styling Issues

#### Problem: React app shows unstyled content
**Solution:**
```bash
# Navigate to client folder
cd client

# Install dependencies
npm install

# Build the React app
npm run build

# Start Flask server (from root directory)
python app.py
```

#### Problem: Tailwind CSS not working
**Solution:**
- Ensure `@tailwind` directives are in `client/src/index.css`
- Rebuild the app: `npm run build`
- Check if `client/build/static/css/main.*.css` exists

### 2. API Connection Issues

#### Problem: `net::ERR_FAILED` or `CORS` errors
**Solution:**
1. **Check API URL**: Ensure React app uses `http://127.0.0.1:5000` not `localhost:5000`
2. **Install CORS**: `pip install flask-cors`
3. **Restart Flask**: Stop and restart the Flask server
4. **Check Flask logs**: Look for error messages in the terminal

#### Problem: API returns 404 errors
**Solution:**
- Ensure all API endpoints use `/api/` prefix
- Check Flask server is running on port 5000
- Verify API routes are properly defined in `app.py`

### 3. Development vs Production Issues

#### Problem: Development server not working
**Solution:**
```bash
# Terminal 1: Start React dev server
cd client
npm start

# Terminal 2: Start Flask server
python app.py
```

#### Problem: Production build not working
**Solution:**
```bash
# Build React app
cd client
npm run build

# Start Flask server (serves React build)
python app.py
```

### 4. Data Loading Issues

#### Problem: Books not loading
**Solution:**
1. Check if `.pkl` files exist in root directory
2. Verify Flask server logs for data loading errors
3. Test API endpoints directly: `curl http://127.0.0.1:5000/api/popular`

#### Problem: Search not working
**Solution:**
1. Check browser console for JavaScript errors
2. Verify API endpoints are responding
3. Test search API: `curl -X POST http://127.0.0.1:5000/api/search_books -H "Content-Type: application/json" -d '{"keyword":"test"}'`

### 5. Port Issues

#### Problem: Port already in use
**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Mac/Linux
lsof -ti:5000 | xargs kill
```

#### Problem: React dev server port conflict
**Solution:**
```bash
# Start React on different port
cd client
PORT=3001 npm start
```

### 6. Build Issues

#### Problem: Build fails with errors
**Solution:**
1. Clear node_modules: `rm -rf node_modules && npm install`
2. Clear npm cache: `npm cache clean --force`
3. Check for syntax errors in React components
4. Verify all dependencies are installed

#### Problem: Build succeeds but app doesn't work
**Solution:**
1. Check browser console for errors
2. Verify API endpoints are accessible
3. Check if Flask server is running
4. Clear browser cache

### 7. Environment Issues

#### Problem: Module not found errors
**Solution:**
```bash
# Install Python dependencies
pip install -r requirements.txt

# Install Node.js dependencies
cd client
npm install
```

#### Problem: Python version issues
**Solution:**
- Ensure Python 3.7+ is installed
- Use virtual environment: `python -m venv venv && venv\Scripts\activate`

### 8. Network Issues

#### Problem: Can't access from other devices
**Solution:**
1. Update Flask to bind to all interfaces:
   ```python
   app.run(host='0.0.0.0', port=5000, debug=True)
   ```
2. Update API URL in React to use your machine's IP
3. Check firewall settings

### 9. Performance Issues

#### Problem: Slow loading
**Solution:**
1. Check if data caching is working
2. Reduce API response size
3. Optimize images
4. Check network connection

### 10. Debugging Steps

#### General Debugging Process:
1. **Check Flask logs**: Look for error messages in terminal
2. **Check browser console**: Look for JavaScript errors
3. **Test API directly**: Use curl or Postman to test endpoints
4. **Check network tab**: Verify requests are being made
5. **Clear cache**: Clear browser cache and rebuild app

#### Useful Commands:
```bash
# Test API endpoints
curl http://127.0.0.1:5000/api/popular
curl http://127.0.0.1:5000/api/load_more_books?letter=all&offset=0&limit=5

# Check if Flask is running
curl http://127.0.0.1:5000

# Check React build
ls client/build/static/css/
ls client/build/static/js/
```

### 11. Quick Fixes

#### Reset Everything:
```bash
# Stop all servers (Ctrl+C)
# Clear React build
cd client
rm -rf build node_modules
npm install
npm run build

# Restart Flask
cd ..
python app.py
```

#### Check File Structure:
```
Book-Recommendation/
├── client/
│   ├── build/          # Should exist after npm run build
│   ├── src/
│   └── package.json
├── app.py
├── *.pkl files
└── requirements.txt
```

## 🆘 Still Having Issues?

1. **Check the logs**: Both Flask server logs and browser console
2. **Verify file structure**: Ensure all files are in correct locations
3. **Test step by step**: Start with simple API calls, then complex features
4. **Check dependencies**: Ensure all packages are installed correctly
5. **Clear everything**: Remove build folders and node_modules, reinstall

## 📞 Common Error Messages

- `net::ERR_FAILED`: Usually API URL mismatch (localhost vs 127.0.0.1)
- `CORS error`: Install flask-cors and restart Flask
- `Module not found`: Install missing dependencies
- `Port already in use`: Kill process using the port
- `Build failed`: Check for syntax errors in React components

---

**Remember**: Always check the browser console and Flask server logs for detailed error messages! 🔍

