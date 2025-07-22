# ES12+ Mixer Example

This example showcases the ES12+ Particle Swarm Visualiser integrated with the Akko framework, demonstrating cutting-edge JavaScript features in action.

## Features

### 🌟 Modern JavaScript (ES12+)
- **Private Fields**: `#privateField` syntax for true encapsulation
- **Optional Chaining**: `obj?.prop?.method?.()` for safe property access
- **Nullish Coalescing**: `value ?? default` for robust default values
- **Top-level Await**: Direct await in module scope
- **Logical Assignment**: `x ||= y`, `x &&= y`, `x ??= y`

### 🎨 Visual Effects
- **3 Particle Styles**: Points, Cubes, Spheres
- **5 Color Schemes**: Rainbow, Fire, Ocean, Neon, Cyber
- **Audio Reactivity**: Real-time response to music
- **Explosion Effects**: Bass/treble spike detection
- **Swarm Intelligence**: Force-based particle movement

### 🎛️ Interactive Controls
- **Style Selector**: Switch between particle types
- **Color Schemes**: Choose from 5 futuristic palettes
- **Particle Count**: Adjust from 100-2000 particles
- **Real-time Updates**: Changes apply instantly

## Usage

### 🚨 **Server Required**
This example uses ES modules and requires an HTTP server:

```bash
# From Akko root directory
npm run examples
# Then visit: http://localhost:8080/examples/es12-mixer/
```

**Cannot run directly via `file://` protocol** due to:
- ES6 modules (`<script type="module">`)
- CORS restrictions on audio files

### Steps:
1. **Start Server**: `npm run examples` from project root
2. **Open Browser**: Navigate to `http://localhost:8080/examples/es12-mixer/`
3. **Click "Launch Future"**: Initialize the ES12+ mixer
4. **Allow Audio**: Grant microphone access or use demo tracks
5. **Control Panel**: Use top-right controls when Particle Swarm is active

## Browser Requirements

- **Chrome 94+**: Full ES12+ support
- **Firefox 93+**: Modern JavaScript features
- **Safari 15+**: Private fields and optional chaining
- **Edge 94+**: Complete compatibility

## Technical Details

### ES12+ Features Demonstrated

```javascript
// Private fields (ES2022)
class ES12ParticleSwarm {
    #particleSystem = null;
    #time = 0;
    
    // Private methods
    #updateParticles(data) {
        // Optional chaining
        const audioLevel = data?.frequencyData?.[0] / 255 ?? 0;
        
        // Logical assignment
        this.#time ||= 0;
        this.#time += 0.016;
    }
}

// Top-level await
const visualizer = await import('./visualizer.js');

// Nullish coalescing with destructuring
const [bass = 0, mid = 0, treble = 0] = frequencyData ?? [];
```

### Audio Processing
- **Web Audio API**: Real-time frequency analysis
- **Akko Framework**: Robust audio pipeline
- **Multiple Sources**: Microphone, file upload, demo tracks

### Performance
- **Optimized Rendering**: Efficient Three.js usage
- **Memory Management**: Proper resource cleanup
- **Scalable Particles**: 100-2000 range for different devices

## Integration with Akko

This example demonstrates how to:
1. Extend `Akko.Visualiser` with modern JavaScript
2. Integrate ES12+ features with existing frameworks
3. Create interactive, audio-reactive visualizations
4. Maintain backward compatibility while using cutting-edge features

## Educational Value

Perfect for learning:
- **Modern JavaScript**: Latest ECMAScript features
- **Audio Visualization**: Web Audio API techniques
- **Three.js**: 3D graphics programming
- **Framework Integration**: Extending existing libraries
- **Performance Optimization**: Efficient rendering techniques

## Future Enhancements

- **WebXR Support**: VR/AR visualization
- **Web Workers**: Offload heavy computations
- **WebAssembly**: Performance-critical operations
- **Real-time Collaboration**: Multi-user experiences
- **AI Integration**: Machine learning-driven effects

---

*This example showcases the future of web development with ES12+ JavaScript features.*