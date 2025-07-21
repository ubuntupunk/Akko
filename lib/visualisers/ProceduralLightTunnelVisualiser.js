class ProceduralLightTunnelVisualiser extends Akko.Visualiser {
    constructor() {
        super({
            code: 'PLT',
            name: 'Procedural Light Tunnel',
            fftSize: 128,
            smoothingTimeConstant: 0.8,
        });
    }

    onInit(data) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, data.width / data.height, 0.1, 1000);
        this.camera.position.z = 0;

        // Add a simple ambient light to make things visible
        const ambientLight = new THREE.AmbientLight(0x404040, 2); // soft white light
        this.scene.add(ambientLight);

        // Add a point light to illuminate the tunnel
        const pointLight = new THREE.PointLight(0xffffff, 1, 100);
        pointLight.position.set(0, 0, 0);
        this.scene.add(pointLight);

        this.lights = [];
        const lightCount = 50;
        const lightGeometry = new THREE.SphereGeometry(0.5, 8, 8);

        for (let i = 0; i < lightCount; i++) {
            const lightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const light = new THREE.Mesh(lightGeometry, lightMaterial);
            light.position.set(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                -i * 10 // Position lights along the Z-axis to form a tunnel
            );
            this.scene.add(light);
            this.lights.push(light);
        }
    }

    onUpdate(data) {
        const frequencyData = data.frequencyData;
        const timeDomainData = data.timeDomainData;

        // Move camera forward to simulate tunnel movement
        this.camera.position.z -= 0.5; 
        if (this.camera.position.z < -500) {
            this.camera.position.z = 0;
        }

        this.lights.forEach((light, index) => {
            const freqIndex = Math.floor((index / this.lights.length) * frequencyData.length);
            const frequency = frequencyData[freqIndex] || 0;
            const timeDomain = timeDomainData[freqIndex] || 0;

            // Light intensity and color based on audio
            const intensity = 0.5 + frequency * 2;
            light.material.color.setHSL(timeDomain, 1, intensity);

            // Reset light position if it goes too far back
            if (light.position.z - this.camera.position.z > 50) {
                light.position.z -= 500; // Move it back to the front of the tunnel
            }
        });

        data.renderer.render(this.scene, this.camera);
    }

    onResize(data) {
        this.camera.aspect = data.width / data.height;
        this.camera.updateProjectionMatrix();
    }

    onDestroy() {
        this.lights.forEach(light => {
            this.scene.remove(light);
            light.geometry.dispose();
            light.material.dispose();
        });
        delete this.scene;
        delete this.camera;
        delete this.lights;
    }
}
