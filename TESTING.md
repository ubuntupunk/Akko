# Testing Guide for Akko v0.1.1

This guide helps maintainers and contributors test the Akko framework and examples properly.

## 🚀 Quick Start Testing

### Option 1: Direct Browser Testing (Fastest)
```bash
# Open any basic example directly in browser
firefox examples/akko-inline.html
# or
chrome examples/akko-fullscreen.html
```

**What works:**
- ✅ Akko framework loads and initializes
- ✅ UI controls appear and function
- ✅ Visualizer switching works
- ✅ Drag & drop audio files works
- ❌ Pre-loaded demo audio files won't load (CORS limitation)

**This is sufficient to verify the core framework fixes!**

### Option 2: Full Server Testing (Complete)
```bash
# Install dependencies
npm install

# Start development server
npm run examples

# Open in browser
http://localhost:8080/examples/
```

**What works:**
- ✅ Everything from Option 1
- ✅ Pre-loaded demo audio files work
- ✅ ES12+ examples with modules work
- ✅ All audio loading methods work

## 📁 Example Categories

### 🟢 Basic Examples (Work without server)
| File | Description | Server Required |
|------|-------------|-----------------|
| `akko-inline.html` | Inline Akko on a page | No |
| `akko-fullscreen.html` | Fullscreen visualization | No |
| `akko-custom-es5.html` | Custom visualizer (ES5) | No |
| `akko-custom-es6.html` | Custom visualizer (ES6) | No |

**Testing:** Open directly in browser via `file://` protocol

### 🟡 Advanced Examples (Require server)
| File | Description | Server Required |
|------|-------------|-----------------|
| `akko-custom-es12.html` | ES12+ features demo | Yes |
| `es12-mixer/index.html` | Complete ES12+ showcase | Yes |

**Testing:** Requires HTTP server due to ES modules and CORS

## 🔧 Core Framework Testing

### 1. Audio Buffer Fix Verification
```javascript
// Test that this no longer throws "ArrayBuffer detached" error
akko.addTrack('./audio/test.mp3');
```

**Expected:** Audio loads successfully without buffer errors

### 2. Module System Fix Verification
```javascript
// Test that visualizers load without circular dependency errors
const akko = new Akko();
akko.start(); // Should not throw module loading errors
```

**Expected:** No "circular dependency" or "module not found" errors

### 3. ES12+ Integration Testing
**File:** `examples/es12-mixer/index.html`

**Requirements:**
- Modern browser (Chrome 94+, Firefox 93+, Safari 15+, Edge 94+)
- HTTP server (for ES modules)

**Test Steps:**
1. Click "Launch Future" button
2. Verify ES12+ Particle Swarm visualizer loads
3. Test control panel (top-right corner):
   - Particle Style: Points/Cubes/Spheres
   - Color Scheme: Rainbow/Fire/Ocean/Neon/Cyber
   - Particle Count: 100-2000 slider
4. Verify real-time parameter changes work

**Expected:** No console errors, smooth visualization, responsive controls

## 🐛 Common Issues & Solutions

### Issue: "Akko is not a constructor"
**Cause:** Script loading order or path issues
**Solution:** Ensure THREE.js loads before Akko
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="../dist/akko.js"></script>
```

### Issue: "CORS error" when loading audio
**Cause:** File protocol limitations
**Solution:** Use HTTP server or drag & drop audio files

### Issue: "ES modules not supported"
**Cause:** File protocol or old browser
**Solution:** Use HTTP server and modern browser

### Issue: "NaN values in BufferGeometry"
**Cause:** Math errors in particle calculations (fixed in v0.1.1)
**Solution:** Update to latest build

## 📊 Browser Compatibility

### Core Framework (All Examples)
- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

### ES12+ Examples
- ✅ Chrome 94+ (Full ES12+ support)
- ✅ Firefox 93+ (Modern JavaScript)
- ✅ Safari 15+ (Private fields, optional chaining)
- ✅ Edge 94+ (Complete feature set)

## 🎯 Minimal Testing for PR Review

**For maintainers reviewing this PR, minimum testing:**

1. **Open `examples/akko-inline.html` directly in browser**
2. **Verify Akko loads without errors**
3. **Test visualizer switching**
4. **Drag & drop an audio file**

**This confirms the core framework fixes work correctly.**

## 🚀 Advanced Testing (Optional)

**For full feature testing:**

1. **Start server:** `npm run examples`
2. **Test ES12+ mixer:** `http://localhost:8080/examples/es12-mixer/`
3. **Verify all controls work**
4. **Test with different audio files**

## 📝 Testing Checklist

### Core Framework
- [ ] Akko loads without "constructor" errors
- [ ] Audio files load without "ArrayBuffer detached" errors
- [ ] Visualizers switch without module errors
- [ ] Drag & drop functionality works
- [ ] UI controls respond properly

### ES12+ Features (Server Required)
- [ ] ES12+ mixer loads without errors
- [ ] Particle controls work in real-time
- [ ] Modern JavaScript features function correctly
- [ ] No console errors in modern browsers

### Cross-Browser
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (if available)
- [ ] Edge (latest)

## 💡 Tips for Maintainers

1. **Quick verification:** Just open `akko-inline.html` in browser
2. **Audio testing:** Drag & drop your own MP3 file
3. **ES12+ testing:** Requires `npm run examples` server
4. **Mobile testing:** Basic examples work on mobile browsers

## 🆘 Getting Help

If you encounter issues:

1. **Check browser console** for error messages
2. **Verify file paths** are correct for your setup
3. **Try different browsers** for compatibility
4. **Use HTTP server** for full functionality

The core framework improvements work regardless of server setup!