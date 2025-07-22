# Contributing to Akko

Thank you for your interest in contributing to Akko! This document provides guidelines for contributing to the project.

## Development Setup

### Prerequisites
- Node.js 14+ (for build tools)
- Modern browser with WebGL and Web Audio API support
- Git

### Getting Started
```bash
# Clone the repository
git clone https://github.com/TimboKZ/Akko.git
cd Akko

# Install dependencies
npm install

# Build the project
npm run build

# Start development server
npm run examples
```

## Project Structure

```
Akko/
├── lib/                    # Core framework source
│   ├── Akko.js            # Main Akko class
│   ├── MusicPlayer.js     # Audio handling
│   ├── VisualisationCore.js # Visualizer management
│   ├── UI.jsx             # User interface
│   └── visualisers/       # Built-in visualizers
├── examples/              # Example implementations
│   ├── es12-mixer/       # Modern JavaScript demo
│   └── *.html            # Basic examples
├── dist/                 # Built files (generated)
├── sass/                 # Stylesheets
└── webpack.config.js     # Build configuration
```

## Types of Contributions

### 🐛 Bug Fixes
- Audio processing issues
- Module loading problems
- Performance bottlenecks
- Browser compatibility

### ✨ New Features
- New visualizer types
- Audio analysis improvements
- UI enhancements
- Modern JavaScript integrations

### 📚 Documentation
- API documentation
- Integration guides
- Example projects
- Performance tips

### 🎨 Examples
- New visualizer examples
- Integration patterns
- Educational demos

## Development Guidelines

### Code Style
- **ES6+** for new code (ES5 for legacy browser support where needed)
- **JSDoc comments** for public APIs
- **Consistent naming**: camelCase for variables/functions, PascalCase for classes
- **Error handling**: Always handle potential failures gracefully

### Visualizer Development
```javascript
// Template for new visualizers
class NewVisualiser extends Visualiser {
    constructor() {
        super({
            code: 'NEW',  // Unique 2-3 character code
            name: 'New Visualiser',
            fftSize: 256,
            smoothingTimeConstant: 0.8
        });
    }
    
    onInit(data) {
        // Initialize 3D scene, camera, objects
    }
    
    onUpdate(data) {
        // Update animation based on audio data
        // data.frequencyData, data.timeDomainData available
    }
    
    onResize(data) {
        // Handle window resize
    }
    
    onDestroy() {
        // Clean up resources
    }
}
```

### Audio Processing Best Practices
```javascript
// Always validate audio data
if (!data?.frequencyData || !data?.timeDomainData) {
    return; // Skip frame if no audio data
}

// Check for NaN values
const audioLevel = data.frequencyData[0] / 255;
if (!isFinite(audioLevel)) {
    return; // Skip if invalid data
}

// Clone buffers to prevent detachment
const clonedBuffer = arrayBuffer.slice(0);
```

### Performance Guidelines
- **Object pooling** for frequently created objects
- **Efficient geometry updates** using `needsUpdate` flags
- **LOD (Level of Detail)** for complex visualizations
- **Resource cleanup** in `onDestroy()`

## Testing

### Manual Testing
```bash
# Start development server
npm run examples

# Test in multiple browsers:
# - Chrome (latest)
# - Firefox (latest) 
# - Safari (if on macOS)
# - Edge (latest)
```

### Test Cases
- [ ] Audio file loading and playback
- [ ] Drag & drop functionality
- [ ] Visualizer switching
- [ ] Window resize handling
- [ ] Error scenarios (invalid files, no audio permission)

### Performance Testing
- [ ] Monitor FPS with different visualizers
- [ ] Test with various audio file formats
- [ ] Memory usage over time
- [ ] Mobile device performance

## Submission Process

### 1. Fork and Branch
```bash
git fork https://github.com/TimboKZ/Akko.git
git checkout -b feature/my-new-feature
```

### 2. Development
- Write your code following the guidelines above
- Test thoroughly across browsers
- Update documentation if needed

### 3. Build and Lint
```bash
npm run build    # Ensure clean build
npm run lint     # Fix any linting errors
```

### 4. Commit
```bash
git add .
git commit -m "feat: add new particle visualizer with ES12+ features"

# Commit message format:
# feat: new feature
# fix: bug fix
# docs: documentation
# style: formatting
# refactor: code restructuring
# test: adding tests
# chore: maintenance
```

### 5. Pull Request
- Create PR with clear description
- Reference any related issues
- Include screenshots/videos for visual changes
- Ensure CI passes

## Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Testing
- [ ] Tested in Chrome
- [ ] Tested in Firefox
- [ ] Tested in Safari
- [ ] Tested in Edge
- [ ] Mobile testing (if applicable)

## Screenshots/Videos
(If applicable)

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
- [ ] Build passes (`npm run build`)
- [ ] Lint passes (`npm run lint`)
```

## Specific Contribution Areas

### Core Framework
**Location**: `lib/`
**Focus**: Audio processing, visualizer management, UI components
**Requirements**: Deep understanding of Web Audio API and Three.js

### Visualizers
**Location**: `lib/visualisers/`
**Focus**: New visualization techniques, audio-reactive effects
**Requirements**: Three.js knowledge, creative vision

### Examples
**Location**: `examples/`
**Focus**: Integration patterns, educational content
**Requirements**: Clear documentation, modern JavaScript

### Documentation
**Location**: `*.md` files, JSDoc comments
**Focus**: API docs, tutorials, integration guides
**Requirements**: Clear writing, technical accuracy

## Release Process

### Version Numbering
- **Major** (1.0.0): Breaking changes
- **Minor** (0.1.0): New features, backwards compatible
- **Patch** (0.0.1): Bug fixes, backwards compatible

### Release Checklist
- [ ] All tests pass
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version bumped in package.json
- [ ] Build artifacts updated
- [ ] Git tag created

## Community Guidelines

### Code of Conduct
- Be respectful and inclusive
- Provide constructive feedback
- Help newcomers learn
- Focus on technical merit

### Communication
- **Issues**: Bug reports, feature requests
- **Discussions**: General questions, ideas
- **Pull Requests**: Code contributions

### Getting Help
- Check existing issues and documentation first
- Provide minimal reproducible examples
- Include browser/OS information
- Be patient and respectful

## Recognition

Contributors are recognized in:
- CHANGELOG.md for significant contributions
- README.md contributors section
- Git commit history

## License

By contributing to Akko, you agree that your contributions will be licensed under the GPL-3.0 license.

---

Thank you for contributing to Akko! Your efforts help make audio visualization more accessible and powerful for everyone. 🎵✨