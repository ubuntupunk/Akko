class DynamicParticleSwarmVisualiser extends Akko.Visualiser {
    constructor() {
        super({
            code: 'DPS',
            name: 'Dynamic Particle Swarm',
            fftSize: 128,
            smoothingTimeConstant: 0.7,
        });
    }

    onInit(data) {
        console.log('DynamicParticleSwarmVisualiser: onInit called');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, data.width / data.height, 0.1, 1000);
        this.camera.position.z = 50;

        // Particle system setup
        const particleCount = 1000;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        const color = new THREE.Color();

        for (let i = 0; i < particleCount; i++) {
            // Position particles randomly
            positions[i * 3] = (Math.random() * 2 - 1) * 200;
            positions[i * 3 + 1] = (Math.random() * 2 - 1) * 200;
            positions[i * 3 + 2] = (Math.random() * 2 - 1) * 200;

            // Assign random colors
            color.setHSL(Math.random(), 1.0, 0.5);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            // Assign random sizes
            sizes[i] = Math.random() * 10 + 5;
        }

        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const shaderMaterial = new THREE.ShaderMaterial({
            uniforms: {
                                pointTexture: { value: new THREE.TextureLoader().load('https://threejs.org/examples/textures/sprites/disc.png') }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                uniform sampler2D pointTexture;
                void main() {
                    gl_FragColor = vec4(vColor, 1.0);
                    gl_FragColor = gl_FragColor * texture2D(pointTexture, gl_PointCoord);
                }
            `,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true
        });

        this.particleSystem = new THREE.Points(particles, shaderMaterial);
        this.scene.add(this.particleSystem);
    }

    onUpdate(data) {
        // console.log('DynamicParticleSwarmVisualiser: onUpdate called');
        // Example: Make particles react to bass frequencies
        const bass = data.frequencyData[0] || 0; // Assuming bass is the first frequency band
        const positions = this.particleSystem.geometry.attributes.position.array;
        const sizes = this.particleSystem.geometry.attributes.size.array;

        for (let i = 0; i < positions.length; i += 3) {
            // Simple reaction: particles move outwards with bass
            positions[i] += Math.sin(data.time * 0.001 + i) * bass * 0.01;
            positions[i + 1] += Math.cos(data.time * 0.001 + i) * bass * 0.01;
            positions[i + 2] += Math.sin(data.time * 0.001 + i) * bass * 0.01;

            // Sizes can also react
            sizes[i / 3] = (Math.random() * 10 + 5) + bass * 0.1;
        }

        this.particleSystem.geometry.attributes.position.needsUpdate = true;
        this.particleSystem.geometry.attributes.size.needsUpdate = true;

        this.particleSystem.rotation.x += 0.001;
        this.particleSystem.rotation.y += 0.002;

        data.renderer.render(this.scene, this.camera);
    }

    onResize(data) {
        this.camera.aspect = data.width / data.height;
        this.camera.updateProjectionMatrix();
    }

    onDestroy() {
        this.scene.remove(this.particleSystem);
        this.particleSystem.geometry.dispose();
        this.particleSystem.material.dispose();
        delete this.scene;
        delete this.camera;
        delete this.particleSystem;
    }
}
