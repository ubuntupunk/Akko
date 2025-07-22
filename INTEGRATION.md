# Akko Integration Guide

This guide shows developers how to integrate Akko with modern JavaScript features and extend the framework with custom visualizers.

## Table of Contents
- [Basic Integration](#basic-integration)
- [Modern JavaScript Features](#modern-javascript-features)
- [Creating Custom Visualizers](#creating-custom-visualizers)
- [ES12+ Integration Patterns](#es12-integration-patterns)
- [Audio Buffer Handling](#audio-buffer-handling)
- [Performance Optimization](#performance-optimization)
- [Troubleshooting](#troubleshooting)

## Basic Integration

### Standard Setup
```html
<!-- Dependencies -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

<!-- Akko Framework -->
<link rel="stylesheet" href="./dist/akko.css"/>
<script src="./dist/akko.js"></script>

<div id="akko-container"></div>

<script>
const akko = new Akko({
    containerId: 'akko-container',
    autoPlay: false,
    useDefaultVisualisers: true
});

akko.start();
</script>
```

### Node.js/Module Integration
```javascript
const Akko = require('akko');

// Create instance
const akko = new Akko({
    containerId: 'my-container',
    autoPlay: true
});

// Add custom visualizers
akko.addVisualiser(new MyCustomVisualiser());

// Add audio tracks
akko.addTrack('./audio/track.mp3', 'My Track');

akko.start();
```

## Modern JavaScript Features

### ES12+ Integration Patterns

#### Private Fields and Methods (ES2022)
```javascript
class ModernVisualiser extends Akko.Visualiser {
    // Private fields
    #particleSystem = null;
    #animationTime = 0;
    #config = {
        particleCount: 1000,
        colorScheme: 'rainbow'
    };
    
    constructor() {
        super({
            code: 'MOD',
            name: 'Modern Visualiser',
            fftSize: 256
        });
    }
    
    // Private method
    #updateParticles(audioData) {
        // Safe audio processing with modern syntax
        const bass = audioData?.frequencyData?.[0] / 255 ?? 0;
        const treble = audioData?.frequencyData?.at(-1) / 255 ?? 0;
        
        // Update logic here
    }
    
    onUpdate(data) {
        this.#animationTime += 0.016;
        this.#updateParticles(data);
    }
}
```

#### Optional Chaining and Nullish Coalescing
```javascript
class SafeVisualiser extends Akko.Visualiser {
    onUpdate(data) {
        // Safe property access
        const audioLevel = data?.frequencyData?.[0] ?? 0;
        const renderer = data?.renderer;
        
        // Safe method calls
        renderer?.render?.(this.scene, this.camera);
        
        // Nullish coalescing for defaults
        const particleCount = this.config?.particles ?? 1000;
        const colorScheme = this.settings?.colors ?? 'default';
    }
}
```

#### Top-Level Await (ES2022)
```javascript
// In module context
const audioContext = new AudioContext();
const akko = new Akko({ audioContext });

// Load visualizers dynamically
const { ParticleVisualiser } = await import('./visualizers/particles.js');
const { WaveVisualiser } = await import('./visualizers/waves.js');

akko.addVisualiser(new ParticleVisualiser());
akko.addVisualiser(new WaveVisualiser());

await akko.start();
```

## Creating Custom Visualizers

### Basic Visualizer Structure
```javascript
class CustomVisualiser extends Akko.Visualiser {
    constructor() {
        super({
            code: 'CUS',           // Unique 2-3 character code
            name: 'Custom Viz',    // Display name
            fftSize: 256,          // Audio analysis resolution
            smoothingTimeConstant: 0.8  // Audio smoothing
        });
    }
    
    // Required: Initialize your 3D scene
    onInit(data) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75, 
            data.width / data.height, 
            0.1, 
            1000
        );
        
        // Setup your objects, lights, materials
        this.setupScene();
    }
    
    // Required: Update animation each frame
    onUpdate(data) {
        // data.frequencyData: Uint8Array of frequency values (0-255)
        // data.timeDomainData: Uint8Array of waveform values
        // data.renderer: THREE.WebGLRenderer instance
        
        this.animateObjects(data);
        data.renderer.render(this.scene, this.camera);
    }
    
    // Required: Handle window resize
    onResize(data) {
        this.camera.aspect = data.width / data.height;
        this.camera.updateProjectionMatrix();
    }
    
    // Required: Cleanup resources
    onDestroy() {
        // Dispose geometries, materials, textures
        this.cleanup();
    }
}
```

### Advanced Visualizer with Controls
```javascript
class InteractiveVisualiser extends Akko.Visualiser {
    #settings = {
        particleCount: 1000,
        colorScheme: 'rainbow',
        sensitivity: 1.0
    };
    
    constructor() {
        super({
            code: 'INT',
            name: 'Interactive Visualiser'
        });
    }
    
    // Public API for external controls
    setParticleCount(count) {
        if (count >= 100 && count <= 5000) {
            this.#settings.particleCount = count;
            this.#recreateParticles();
        }
    }
    
    setColorScheme(scheme) {
        const validSchemes = ['rainbow', 'fire', 'ocean', 'neon'];
        if (validSchemes.includes(scheme)) {
            this.#settings.colorScheme = scheme;
        }
    }
    
    setSensitivity(value) {
        this.#settings.sensitivity = Math.max(0.1, Math.min(5.0, value));
    }
    
    // Private methods
    #recreateParticles() {
        // Recreate particle system with new count
    }
    
    #getColorForScheme(audioLevel, index) {
        switch (this.#settings.colorScheme) {
            case 'fire':
                return new THREE.Color(1, audioLevel * 0.8, 0);
            case 'ocean':
                return new THREE.Color(0, audioLevel * 0.6, 1);
            // ... other schemes
            default:
                return new THREE.Color().setHSL(
                    (index / 100 + audioLevel) % 1, 
                    0.8, 
                    0.6
                );
        }
    }
}
```

## ES12+ Integration Patterns

### Wrapper Class Pattern
```javascript
class ES12AkkoManager {
    #akkoInstance = null;
    #visualizers = new Map();
    #isInitialized = false;
    
    constructor(options = {}) {
        this.#akkoInstance = new Akko({
            containerId: options.containerId ?? 'akko',
            autoPlay: options.autoPlay ?? false,
            useDefaultVisualisers: options.useDefaults ?? true
        });
    }
    
    async init() {
        try {
            // Modern error handling
            await this.#setupAudio();
            this.#isInitialized = true;
            console.log('✅ Akko initialized with ES12+ features');
        } catch (error) {
            console.error('❌ Initialization failed:', error);
            throw error;
        }
    }
    
    // Dynamic visualizer loading
    async addVisualizer(visualizerPath, options = {}) {
        try {
            const { default: VisualizerClass } = await import(visualizerPath);
            const visualizer = new VisualizerClass(options);
            
            this.#akkoInstance?.addVisualiser?.(visualizer);
            this.#visualizers.set(visualizer.code, visualizer);
            
            console.log(`✅ Added ${visualizer.name}`);
            return visualizer;
        } catch (error) {
            console.error(`❌ Failed to load ${visualizerPath}:`, error);
        }
    }
    
    // Modern audio handling
    async #setupAudio() {
        if (!navigator.mediaDevices?.getUserMedia) {
            throw new Error('Media devices not supported');
        }
        
        // Optional microphone access
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                audio: true 
            });
            console.log('🎤 Microphone access granted');
        } catch {
            console.log('🎵 Microphone access denied, file upload available');
        }
    }
    
    // Getters with optional chaining
    get isReady() {
        return this.#isInitialized && this.#akkoInstance != null;
    }
    
    get visualizerCount() {
        return this.#visualizers.size;
    }
}
```

### Control Panel Integration
```javascript
class VisualizerControls {
    #visualizer = null;
    #controlPanel = null;
    
    constructor(visualizer, containerId) {
        this.#visualizer = visualizer;
        this.#createControls(containerId);
    }
    
    #createControls(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        this.#controlPanel = document.createElement('div');
        this.#controlPanel.className = 'visualizer-controls';
        
        // Create controls based on visualizer capabilities
        if (this.#visualizer.setParticleCount) {
            this.#addSliderControl('Particles', 100, 2000, 1000, 
                value => this.#visualizer.setParticleCount(value)
            );
        }
        
        if (this.#visualizer.setColorScheme) {
            this.#addSelectControl('Color Scheme', 
                ['rainbow', 'fire', 'ocean', 'neon'],
                scheme => this.#visualizer.setColorScheme(scheme)
            );
        }
        
        container.appendChild(this.#controlPanel);
    }
    
    #addSliderControl(label, min, max, initial, callback) {
        const group = document.createElement('div');
        group.innerHTML = `
            <label>${label}: <span class="value">${initial}</span></label>
            <input type="range" min="${min}" max="${max}" value="${initial}">
        `;
        
        const slider = group.querySelector('input');
        const valueSpan = group.querySelector('.value');
        
        slider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            valueSpan.textContent = value;
            callback?.(value);
        });
        
        this.#controlPanel.appendChild(group);
    }
    
    #addSelectControl(label, options, callback) {
        const group = document.createElement('div');
        group.innerHTML = `
            <label>${label}:</label>
            <select>
                ${options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
            </select>
        `;
        
        const select = group.querySelector('select');
        select.addEventListener('change', (e) => {
            callback?.(e.target.value);
        });
        
        this.#controlPanel.appendChild(group);
    }
}
```

## Audio Buffer Handling

### Safe Buffer Processing
```javascript
class SafeAudioHandler {
    static async processAudioFile(file) {
        try {
            const arrayBuffer = await file.arrayBuffer();
            
            // Clone buffer to prevent detachment (Akko v0.1.1 fix)
            const clonedBuffer = arrayBuffer.slice(0);
            
            const audioContext = new AudioContext();
            const audioBuffer = await new Promise((resolve, reject) => {
                audioContext.decodeAudioData(clonedBuffer, resolve, reject);
            });
            
            return audioBuffer;
        } catch (error) {
            console.error('Audio processing failed:', error);
            throw new Error(`Failed to process audio: ${error.message}`);
        }
    }
    
    static validateAudioData(data) {
        if (!data?.frequencyData || !data?.timeDomainData) {
            console.warn('Invalid audio data received');
            return false;
        }
        
        // Check for NaN values
        const hasNaN = Array.from(data.frequencyData).some(val => !isFinite(val));
        if (hasNaN) {
            console.warn('NaN values detected in audio data');
            return false;
        }
        
        return true;
    }
}
```

## Performance Optimization

### Efficient Particle Management
```javascript
class OptimizedParticleVisualiser extends Akko.Visualiser {
    #particlePool = [];
    #activeParticles = [];
    #maxParticles = 1000;
    
    constructor() {
        super({ code: 'OPT', name: 'Optimized Particles' });
        this.#initializePool();
    }
    
    #initializePool() {
        // Pre-allocate particle objects
        for (let i = 0; i < this.#maxParticles; i++) {
            this.#particlePool.push({
                position: new THREE.Vector3(),
                velocity: new THREE.Vector3(),
                life: 0,
                maxLife: 1
            });
        }
    }
    
    #getParticle() {
        return this.#particlePool.pop() || null;
    }
    
    #returnParticle(particle) {
        particle.life = 0;
        this.#particlePool.push(particle);
    }
    
    onUpdate(data) {
        if (!SafeAudioHandler.validateAudioData(data)) return;
        
        const audioLevel = data.frequencyData[0] / 255;
        
        // Spawn particles based on audio
        if (audioLevel > 0.1 && this.#particlePool.length > 0) {
            const particle = this.#getParticle();
            if (particle) {
                this.#initializeParticle(particle, audioLevel);
                this.#activeParticles.push(particle);
            }
        }
        
        // Update active particles
        this.#updateParticles(data);
        
        // Render
        data.renderer.render(this.scene, this.camera);
    }
    
    #updateParticles(data) {
        for (let i = this.#activeParticles.length - 1; i >= 0; i--) {
            const particle = this.#activeParticles[i];
            
            particle.life += 0.016;
            if (particle.life >= particle.maxLife) {
                this.#activeParticles.splice(i, 1);
                this.#returnParticle(particle);
            } else {
                this.#updateParticle(particle, data);
            }
        }
    }
}
```

### Memory Management
```javascript
class MemoryEfficientVisualiser extends Akko.Visualiser {
    #geometries = new Set();
    #materials = new Set();
    #textures = new Set();
    
    createGeometry() {
        const geometry = new THREE.BufferGeometry();
        this.#geometries.add(geometry);
        return geometry;
    }
    
    createMaterial(options) {
        const material = new THREE.MeshBasicMaterial(options);
        this.#materials.add(material);
        return material;
    }
    
    createTexture(source) {
        const texture = new THREE.Texture(source);
        this.#textures.add(texture);
        return texture;
    }
    
    onDestroy() {
        // Dispose all tracked resources
        this.#geometries.forEach(geo => geo.dispose());
        this.#materials.forEach(mat => mat.dispose());
        this.#textures.forEach(tex => tex.dispose());
        
        // Clear tracking sets
        this.#geometries.clear();
        this.#materials.clear();
        this.#textures.clear();
        
        console.log('🗑️ Resources cleaned up');
    }
}
```

## Troubleshooting

### Common Issues and Solutions

#### 1. "Akko is not a constructor"
```javascript
// Problem: Module loading issues
// Solution: Ensure proper script loading order
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="./dist/akko.js"></script> <!-- After THREE.js -->

// Check if Akko is available
if (typeof Akko !== 'function') {
    console.error('Akko not loaded properly');
}
```

#### 2. "NaN values in BufferGeometry"
```javascript
// Problem: Invalid position calculations
// Solution: Add safety checks
function safePosition(value, fallback = 0) {
    return isFinite(value) ? value : fallback;
}

// In your visualizer
positions[i] = safePosition(calculatedX);
positions[i + 1] = safePosition(calculatedY);
positions[i + 2] = safePosition(calculatedZ);
```

#### 3. Audio Buffer Detachment
```javascript
// Problem: ArrayBuffer becomes detached
// Solution: Clone buffers (fixed in Akko v0.1.1)
async function processAudio(file) {
    const arrayBuffer = await file.arrayBuffer();
    const clonedBuffer = arrayBuffer.slice(0); // Clone to prevent detachment
    return audioContext.decodeAudioData(clonedBuffer);
}
```

#### 4. Performance Issues
```javascript
// Problem: Too many particles/objects
// Solution: Implement LOD (Level of Detail)
class LODVisualiser extends Akko.Visualiser {
    #getParticleCount(audioLevel) {
        const baseCount = 500;
        const maxCount = 2000;
        const performance = this.#measurePerformance();
        
        if (performance < 30) { // Low FPS
            return Math.min(baseCount, baseCount * audioLevel);
        }
        
        return Math.min(maxCount, baseCount + (audioLevel * 1500));
    }
    
    #measurePerformance() {
        // Simple FPS measurement
        return this.lastFrameTime ? 1000 / this.lastFrameTime : 60;
    }
}
```

### Debug Helpers
```javascript
class AkkoDebugger {
    static logAudioData(data) {
        if (!data) return;
        
        const freq = data.frequencyData;
        const time = data.timeDomainData;
        
        console.log('Audio Data:', {
            frequencyRange: `${Math.min(...freq)} - ${Math.max(...freq)}`,
            timeRange: `${Math.min(...time)} - ${Math.max(...time)}`,
            avgFrequency: freq.reduce((a, b) => a + b) / freq.length,
            hasNaN: Array.from(freq).some(v => !isFinite(v))
        });
    }
    
    static validateVisualizer(visualizer) {
        const required = ['onInit', 'onUpdate', 'onResize', 'onDestroy'];
        const missing = required.filter(method => 
            typeof visualizer[method] !== 'function'
        );
        
        if (missing.length > 0) {
            console.error(`Visualizer missing methods: ${missing.join(', ')}`);
            return false;
        }
        
        return true;
    }
}
```

## Best Practices

1. **Always validate audio data** before processing
2. **Use object pooling** for frequently created/destroyed objects
3. **Implement proper cleanup** in `onDestroy()`
4. **Add safety checks** for mathematical operations
5. **Use modern JavaScript features** safely with fallbacks
6. **Test with various audio sources** and edge cases
7. **Monitor performance** and implement LOD when needed
8. **Document your visualizer's public API** for control integration

## Example Projects

- **ES12+ Mixer**: `examples/es12-mixer/` - Complete modern JavaScript integration
- **Custom Visualizers**: `lib/visualisers/` - Reference implementations
- **Basic Examples**: `examples/` - Simple integration patterns

For more examples and advanced patterns, see the [examples directory](./examples/) and the [ES12+ Mixer documentation](./examples/es12-mixer/README.md).