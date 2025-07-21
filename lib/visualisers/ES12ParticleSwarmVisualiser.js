/**
 * ES12+ Particle Swarm Visualiser for Akko Framework
 * Showcases modern JavaScript features while providing stunning audio-reactive visuals
 * 
 * Features:
 * - Private fields and methods (ES2022)
 * - Optional chaining and nullish coalescing (ES2020)
 * - Interactive controls with multiple particle styles
 * - 5 color schemes with audio-reactive effects
 * - Explosion effects triggered by audio spikes
 */

class ES12ParticleSwarmVisualiser extends Akko.Visualiser {
    // Private fields (ES2022)
    #particleSystem = null;
    #time = 0;
    #particleCount = 1000;
    #particleStyle = 'points'; // 'points', 'cubes', 'spheres'
    #colorScheme = 'rainbow'; // 'rainbow', 'fire', 'ocean', 'neon', 'cyber'
    #controlsCreated = false;
    #isActive = false;
    #lastBassLevel = 0;
    #lastTrebleLevel = 0;
    #explosionTrigger = 0;
    
    // Static private field for tracking instances
    static #instances = new Set();
    
    constructor() {
        super({
            code: 'PSW',
            name: 'ES12+ Particle Swarm',
            fftSize: 256,
            smoothingTimeConstant: 0.8,
        });
        
        // Add to instances tracking with modern syntax
        ES12ParticleSwarmVisualiser.#instances.add(this);
        console.log('🌟 ES12+ Particle Swarm visualizer created');
    }
    
    // Akko lifecycle method with ES12+ features
    onInit(data) {
        console.log('🚀 ES12+ Particle Swarm initializing...');
        
        // Setup scene with optional chaining
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, data.width / data.height, 0.1, 1000);
        this.camera.position.z = 50;
        
        // Create particles with modern array methods
        this.#createParticleSystem();
    }
    
    // Private method using ES12+ features
    #createParticleSystem() {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.#particleCount * 3);
        const colors = new Float32Array(this.#particleCount * 3);
        const velocities = new Float32Array(this.#particleCount * 3);
        
        // Use modern array methods with destructuring
        Array.from({ length: this.#particleCount }, (_, i) => {
            const i3 = i * 3;
            
            // Destructuring with spread operator
            const [x, y, z] = [...Array(3)].map(() => (Math.random() - 0.5) * 100);
            
            // Bright futuristic color palette - ensure visible colors
            const [r, g, b] = [
                0.5 + Math.random() * 0.5, // Ensure bright red component
                0.5 + Math.random() * 0.5, // Ensure bright green component  
                0.5 + Math.random() * 0.5  // Ensure bright blue component
            ];
            
            const [vx, vy, vz] = [...Array(3)].map(() => (Math.random() - 0.5) * 2);
            
            // Assignment with array destructuring
            [positions[i3], positions[i3 + 1], positions[i3 + 2]] = [x, y, z];
            [colors[i3], colors[i3 + 1], colors[i3 + 2]] = [r, g, b];
            [velocities[i3], velocities[i3 + 1], velocities[i3 + 2]] = [vx, vy, vz];
        });
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        // Store velocities for animation
        this.velocities = velocities;
        
        // Create different particle types based on style
        if (this.#particleStyle === 'cubes') {
            this.#createCubeParticles(geometry);
        } else if (this.#particleStyle === 'spheres') {
            this.#createSphereParticles(geometry);
        } else {
            // Default points with modern object shorthand
            const materialConfig = {
                size: 4,
                vertexColors: true,
                transparent: true,
                opacity: 0.95,
                blending: THREE.AdditiveBlending,
                sizeAttenuation: true
            };
            
            const material = new THREE.PointsMaterial(materialConfig);
            this.#particleSystem = new THREE.Points(geometry, material);
        }
        
        this.scene?.add(this.#particleSystem);
    }
    
    // Create cube-based particles
    #createCubeParticles(geometry) {
        const group = new THREE.Group();
        const positions = geometry.attributes.position.array;
        const colors = geometry.attributes.color.array;
        
        for (let i = 0; i < this.#particleCount; i++) {
            const i3 = i * 3;
            const cubeGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
            const cubeMaterial = new THREE.MeshBasicMaterial({
                color: new THREE.Color(colors[i3], colors[i3 + 1], colors[i3 + 2]),
                transparent: true,
                opacity: 0.8,
                wireframe: Math.random() > 0.7 // Some wireframe cubes for variety
            });
            
            const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube.position.set(positions[i3], positions[i3 + 1], positions[i3 + 2]);
            
            // Store velocity data on cube for updates
            cube.userData = { velocityIndex: i3 };
            group.add(cube);
        }
        
        this.#particleSystem = group;
    }
    
    // Create sphere-based particles
    #createSphereParticles(geometry) {
        const group = new THREE.Group();
        const positions = geometry.attributes.position.array;
        const colors = geometry.attributes.color.array;
        
        for (let i = 0; i < this.#particleCount; i++) {
            const i3 = i * 3;
            const sphereGeometry = new THREE.SphereGeometry(1.0, 12, 12);
            const sphereMaterial = new THREE.MeshBasicMaterial({
                color: new THREE.Color(colors[i3], colors[i3 + 1], colors[i3 + 2]),
                transparent: true,
                opacity: 0.9,
                wireframe: Math.random() > 0.8 // Some wireframe spheres
            });
            
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sphere.position.set(positions[i3], positions[i3 + 1], positions[i3 + 2]);
            group.add(sphere);
        }
        
        this.#particleSystem = group;
    }
    
    // Get color based on scheme and audio data
    #getAudioReactiveColor(audioLevel, bass, mid, treble, hueBase = 0) {
        let color = { r: 0.5, g: 0.5, b: 0.5 };
        
        switch (this.#colorScheme) {
            case 'fire':
                color = {
                    r: 0.8 + audioLevel * 0.2,
                    g: 0.3 + bass * 0.5,
                    b: 0.1 + treble * 0.2
                };
                break;
            case 'ocean':
                color = {
                    r: 0.1 + treble * 0.3,
                    g: 0.4 + mid * 0.4,
                    b: 0.7 + audioLevel * 0.3
                };
                break;
            case 'neon':
                color = {
                    r: 0.9 + Math.sin(this.#time + hueBase) * 0.1,
                    g: 0.1 + audioLevel * 0.8,
                    b: 0.9 + Math.cos(this.#time + hueBase) * 0.1
                };
                break;
            case 'cyber':
                color = {
                    r: 0.1 + bass * 0.4,
                    g: 0.8 + audioLevel * 0.2,
                    b: 0.9 + treble * 0.1
                };
                break;
            default: // rainbow
                const hue = (hueBase + this.#time * 0.1 + audioLevel) % 1;
                const tempColor = new THREE.Color().setHSL(hue, 0.8 + audioLevel * 0.2, 0.6 + audioLevel * 0.4);
                color = { r: tempColor.r, g: tempColor.g, b: tempColor.b };
        }
        
        return color;
    }
    
    // Akko update method with ES12+ features
    onUpdate(data) {
        // Early return with nullish coalescing
        if (!this.#particleSystem || !data?.frequencyData) return;
        
        this.#time += 0.016;
        
        // Destructuring with default values
        const [bass = 0, mid = 0, treble = 0] = [
            data.frequencyData[0] / 255,
            data.frequencyData[Math.floor(data.frequencyData.length / 2)] / 255,
            data.frequencyData[data.frequencyData.length - 1] / 255
        ];
        
        // Update particles with modern syntax
        this.#updateParticles(bass, mid, treble, data);
        
        // Rotation with nullish coalescing
        this.#particleSystem.rotation.y += 0.008 * (bass + 0.1);
        this.#particleSystem.rotation.x += 0.003 * (treble + 0.05);
        
        // Render with proper null checking
        if (data.renderer && this.scene && this.camera) {
            data.renderer.render(this.scene, this.camera);
        }
    }
    
    // Private update method
    #updateParticles(bass, mid, treble, data) {
        // Handle different particle types
        if (this.#particleStyle === 'points') {
            this.#updatePointParticles(bass, mid, treble, data);
        } else {
            this.#updateMeshParticles(bass, mid, treble, data);
        }
    }
    
    // Update point-based particles
    #updatePointParticles(bass, mid, treble, data) {
        const positions = this.#particleSystem.geometry.attributes.position.array;
        const colors = this.#particleSystem.geometry.attributes.color.array;
        
        // Swarm center with object shorthand
        const swarmCenter = {
            x: Math.sin(this.#time * 0.5) * 40 * (bass || 0.1),
            y: Math.cos(this.#time * 0.3) * 40 * (mid || 0.1),
            z: Math.sin(this.#time * 0.7) * 40 * (treble || 0.1)
        };
        
        // Modern for loop with array methods
        Array.from({ length: this.#particleCount }, (_, i) => {
            const i3 = i * 3;
            
            // Destructuring assignment
            const [x, y, z] = [positions[i3], positions[i3 + 1], positions[i3 + 2]];
            
            // Calculate force with modern math
            const distance = Math.hypot(
                swarmCenter.x - x,
                swarmCenter.y - y,
                swarmCenter.z - z
            );
            
            const force = 0.03 * (bass + 0.1);
            
            if (distance > 0) {
                // Array destructuring for velocity updates
                const forceVector = [
                    (swarmCenter.x - x) / distance * force,
                    (swarmCenter.y - y) / distance * force,
                    (swarmCenter.z - z) / distance * force
                ];
                
                // Update velocities
                this.velocities[i3] += forceVector[0];
                this.velocities[i3 + 1] += forceVector[1];
                this.velocities[i3 + 2] += forceVector[2];
            }
            
            // Apply damping and update positions
            [i3, i3 + 1, i3 + 2].forEach(idx => {
                this.velocities[idx] *= 0.98;
                positions[idx] += this.velocities[idx];
            });
            
            // Audio-reactive color scheme
            const audioIndex = Math.floor((i / this.#particleCount) * data.frequencyData.length);
            const audioLevel = data.frequencyData?.[audioIndex] / 255 ?? 0;
            const hueBase = i / this.#particleCount;
            const brightColor = this.#getAudioReactiveColor(audioLevel, bass, mid, treble, hueBase);
            
            const colorMultipliers = [
                brightColor.r,
                brightColor.g,
                brightColor.b
            ];
            
            colorMultipliers.forEach((multiplier, idx) => {
                colors[i3 + idx] = multiplier;
            });
        });
        
        // Update geometry
        this.#particleSystem.geometry.attributes.position.needsUpdate = true;
        this.#particleSystem.geometry.attributes.color.needsUpdate = true;
    }
    
    // Update mesh-based particles (cubes/spheres)
    #updateMeshParticles(bass, mid, treble, data) {
        if (!this.#particleSystem.children) return;
        
        // Detect audio spikes for explosive effects
        const bassSpike = bass > this.#lastBassLevel + 0.3;
        const trebleSpike = treble > this.#lastTrebleLevel + 0.2;
        
        if (bassSpike || trebleSpike) {
            this.#explosionTrigger = 1.0; // Trigger explosion effect
        }
        
        this.#explosionTrigger *= 0.95; // Decay explosion effect
        this.#lastBassLevel = bass;
        this.#lastTrebleLevel = treble;
        
        this.#particleSystem.children.forEach((mesh, i) => {
            const i3 = i * 3;
            
            // Get current position
            const [x, y, z] = [mesh.position.x, mesh.position.y, mesh.position.z];
            
            // Calculate swarm center
            const swarmCenter = {
                x: Math.sin(this.#time * 0.5) * 40 * (bass || 0.1),
                y: Math.cos(this.#time * 0.3) * 40 * (mid || 0.1),
                z: Math.sin(this.#time * 0.7) * 40 * (treble || 0.1)
            };
            
            // Calculate force
            const distance = Math.hypot(
                swarmCenter.x - x,
                swarmCenter.y - y,
                swarmCenter.z - z
            );
            
            const force = 0.03 * (bass + 0.1);
            
            if (distance > 0) {
                const forceVector = [
                    (swarmCenter.x - x) / distance * force,
                    (swarmCenter.y - y) / distance * force,
                    (swarmCenter.z - z) / distance * force
                ];
                
                // Update velocities
                this.velocities[i3] += forceVector[0];
                this.velocities[i3 + 1] += forceVector[1];
                this.velocities[i3 + 2] += forceVector[2];
            }
            
            // Apply damping and update positions
            this.velocities[i3] *= 0.98;
            this.velocities[i3 + 1] *= 0.98;
            this.velocities[i3 + 2] *= 0.98;
            
            mesh.position.x += this.velocities[i3];
            mesh.position.y += this.velocities[i3 + 1];
            mesh.position.z += this.velocities[i3 + 2];
            
            // Audio-reactive effects
            const audioIndex = Math.floor((i / this.#particleSystem.children.length) * data.frequencyData.length);
            const audioLevel = data.frequencyData?.[audioIndex] / 255 ?? 0;
            const bassBoost = bass * 3;
            const trebleBoost = treble * 2;
            const midBoost = mid * 2.5;
            
            // Fixed scaling - ensure visibility while keeping reactivity
            const baseScale = 1.0;
            const audioScale = audioLevel * 2;
            const bassScale = bassBoost * 1.5;
            const explosionScale = this.#explosionTrigger * 2;
            const pulseScale = Math.sin(this.#time * 8 + i * 0.2) * audioLevel * 0.3;
            const finalScale = baseScale + audioScale + bassScale + explosionScale + pulseScale;
            mesh.scale.setScalar(Math.max(0.5, Math.min(finalScale, 5)));
            
            // Smooth audio-reactive rotation
            mesh.rotation.x += audioLevel * 0.1 + bassBoost * 0.05;
            mesh.rotation.y += bassBoost * 0.1 + midBoost * 0.08;
            mesh.rotation.z += trebleBoost * 0.12 + audioLevel * 0.06;
            
            // Controlled audio-reactive movement
            const jitterAmount = audioLevel * 0.5;
            const explosionForce = this.#explosionTrigger * 2;
            
            // Gentle explosion effect
            if (this.#explosionTrigger > 0.3) {
                const explosionDirection = new THREE.Vector3(
                    (Math.random() - 0.5) * 0.5,
                    (Math.random() - 0.5) * 0.5,
                    (Math.random() - 0.5) * 0.5
                );
                
                mesh.position.add(explosionDirection.multiplyScalar(explosionForce));
            }
            
            // Subtle audio jitter
            mesh.position.x += (Math.random() - 0.5) * jitterAmount;
            mesh.position.y += (Math.random() - 0.5) * jitterAmount;
            mesh.position.z += (Math.random() - 0.5) * jitterAmount;
            
            // Update colors - audio-reactive with color schemes
            const hueBase = i / this.#particleSystem.children.length;
            const brightColor = this.#getAudioReactiveColor(audioLevel, bass, mid, treble, hueBase);
            
            mesh.material.color.setRGB(brightColor.r, brightColor.g, brightColor.b);
            
            // Opacity flashing with treble
            mesh.material.opacity = 0.6 + trebleBoost * 0.4 + Math.sin(this.#time * 15) * audioLevel * 0.3;
        });
    }
    
    // Akko resize method
    onResize(data) {
        this.camera.aspect = data.width / data.height;
        this.camera.updateProjectionMatrix();
        console.log(`📐 ES12+ Particle Swarm resized to ${data.width}x${data.height}`);
    }
    
    // Akko destroy method with cleanup
    onDestroy() {
        ES12ParticleSwarmVisualiser.#instances.delete(this);
        
        if (this.#particleStyle === 'points') {
            this.#particleSystem?.geometry?.dispose();
            this.#particleSystem?.material?.dispose();
        } else {
            // Clean up mesh particles
            this.#particleSystem?.children?.forEach(mesh => {
                mesh.geometry?.dispose();
                mesh.material?.dispose();
            });
        }
        
        this.scene?.remove(this.#particleSystem);
        
        // Clear references
        delete this.scene;
        delete this.camera;
        delete this.velocities;
        this.#particleSystem = null;
        
        console.log('🗑️ ES12+ Particle Swarm destroyed');
    }
    
    // Static method to get instance count
    static getInstanceCount() {
        return this.#instances.size;
    }
    
    // Public API methods for external control
    setParticleStyle(style) {
        if (['points', 'cubes', 'spheres'].includes(style)) {
            this.#particleStyle = style;
            this.#recreateParticles();
        }
    }
    
    setColorScheme(scheme) {
        if (['rainbow', 'fire', 'ocean', 'neon', 'cyber'].includes(scheme)) {
            this.#colorScheme = scheme;
        }
    }
    
    setParticleCount(count) {
        if (count >= 100 && count <= 2000) {
            this.#particleCount = count;
            this.#recreateParticles();
        }
    }
    
    // Recreate particles with new settings
    #recreateParticles() {
        if (this.#particleSystem) {
            this.scene?.remove(this.#particleSystem);
            if (this.#particleStyle === 'points') {
                this.#particleSystem?.geometry?.dispose();
                this.#particleSystem?.material?.dispose();
            } else {
                this.#particleSystem?.children?.forEach(mesh => {
                    mesh.geometry?.dispose();
                    mesh.material?.dispose();
                });
            }
        }
        this.#createParticleSystem();
    }
}

// Export for use in other projects
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ES12ParticleSwarmVisualiser;
}