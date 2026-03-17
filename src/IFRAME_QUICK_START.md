# Iframe Embedding - Quick Start

## ✅ Configuration Status

This application **IS FULLY CONFIGURED** for iframe embedding.

### Backend (.NET Core)
- ✅ X-Frame-Options header removed
- ✅ CORS enabled for all origins
- ✅ No CSP frame-ancestors restrictions
- ✅ PostMessage communication supported

### Frontend (React)
- ✅ No iframe blocking headers
- ✅ Works in cross-origin contexts
- ✅ Responsive within iframe
- ✅ Authentication works in iframe

## 🚀 Embedding in 30 Seconds

### Minimal Example

```html
<iframe 
    src="https://your-client-management-app.com"
    style="width: 100%; height: 100vh; border: none;"
    allow="clipboard-read; clipboard-write"
></iframe>
```

That's it! The application will load and work normally.

## 🧪 Testing Locally

1. **Start your React dev server**:
   ```bash
   npm start
   ```

2. **Open the test page**:
   Navigate to: `http://localhost:3000/test-iframe-embedding.html`

   This test page includes:
   - Live iframe embedding test
   - PostMessage communication testing
   - Size and navigation controls
   - Message logging

3. **Or create your own test file**:
   ```html
   <!-- save as test.html and open in browser -->
   <!DOCTYPE html>
   <html>
   <body>
       <iframe src="http://localhost:3000" style="width:100%;height:100vh"></iframe>
   </body>
   </html>
   ```

## 📡 Communication with Parent Window

### From Parent → Iframe

```javascript
// In parent window
const iframe = document.getElementById('my-iframe');
iframe.contentWindow.postMessage({
    type: 'NAVIGATE',
    path: '/clients/123'
}, '*');
```

### From Iframe → Parent

```javascript
// In React component
import { useIframeEmbedding } from './hooks/useIframeEmbedding';

function MyComponent() {
    const { sendToParent } = useIframeEmbedding();
    
    sendToParent({
        type: 'CLIENT_SELECTED',
        clientId: 123
    });
}
```

## 🔒 Production Security (Optional)

If you want to restrict embedding to specific domains in production:

### Backend (Program.cs)
```csharp
// Uncomment and modify in Program.cs
context.Response.Headers.Add("Content-Security-Policy", 
    "frame-ancestors 'self' https://your-internal-app.com");
```

### Parent Window (JavaScript)
```javascript
window.addEventListener('message', function(event) {
    // Verify origin
    if (event.origin !== 'https://your-client-management-app.com') {
        return; // Ignore messages from unknown origins
    }
    // Process message
});
```

## 📱 Responsive Iframe

For responsive height based on content:

```html
<iframe id="app-iframe" src="https://your-app.com"></iframe>

<script>
window.addEventListener('message', function(event) {
    if (event.data.type === 'RESIZE') {
        document.getElementById('app-iframe').style.height = 
            event.data.height + 'px';
    }
});
</script>
```

## 🐛 Troubleshooting

### "Refused to display in a frame"
- ✅ Already fixed - X-Frame-Options removed

### CORS errors
- ✅ Already fixed - CORS enabled for all origins

### Authentication not working
- ✅ JWT tokens work in iframe via localStorage
- ✅ Cross-origin requests supported

### Blank iframe
- Check browser console for errors
- Verify URL is correct
- Check network tab for failed requests

## 📚 Full Documentation

For complete details, see:
- `IFRAME_EMBEDDING_GUIDE.md` - Comprehensive guide
- `/public/test-iframe-embedding.html` - Interactive test page
- `/hooks/useIframeEmbedding.ts` - React hook for iframe features

## 💡 Example: Full Integration

```html
<!DOCTYPE html>
<html>
<head>
    <title>Internal Dashboard</title>
    <style>
        body { margin: 0; }
        #container { display: flex; height: 100vh; }
        #sidebar { width: 250px; background: #1e293b; }
        #main { flex: 1; }
        iframe { width: 100%; height: 100%; border: none; }
    </style>
</head>
<body>
    <div id="container">
        <div id="sidebar">
            <h2 style="color: white; padding: 20px;">Dashboard</h2>
        </div>
        <div id="main">
            <iframe 
                id="client-mgmt"
                src="https://your-client-management-app.com"
            ></iframe>
        </div>
    </div>

    <script>
        // Listen for iframe ready
        window.addEventListener('message', e => {
            if (e.data.type === 'CLIENT_MANAGEMENT_READY') {
                console.log('✅ Client Management loaded');
            }
        });
    </script>
</body>
</html>
```

## ✨ Features Available in Iframe

All features work normally when embedded:
- ✅ Client management
- ✅ Statistics dashboard
- ✅ User authentication
- ✅ File uploads/downloads
- ✅ Search and filtering
- ✅ Responsive layout
- ✅ Keyboard shortcuts
- ✅ Mock mode

## 🎯 Next Steps

1. Deploy your application
2. Embed using the minimal example above
3. Test in your internal application
4. Optionally add PostMessage communication
5. Optionally add production security restrictions

**That's all! The application is ready for iframe embedding.**
