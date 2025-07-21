class AudioReactiveVoxelGridVisualiser extends Akko.Visualiser {
    constructor() {
        super({
            code: 'AVG',
            name: 'Audio Reactive Voxel Grid',
            fftSize: 64,
            smoothingTimeConstant: 0.8,
        });
    }

    onInit(data) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, data.width / data.height, 0.1, 1000);
        this.camera.position.set(0, 0, 100);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        this.voxels = [];
        const gridSize = 10;
        const spacing = 10;
        const startX = -(gridSize / 2) * spacing;
        const startY = -(gridSize / 2) * spacing;
        const startZ = -(gridSize / 2) * spacing;

        const geometry = new THREE.BoxGeometry(5, 5, 5);

        for (let x = 0; x < gridSize; x++) {
            for (let y = 0; y < gridSize; y++) {
                for (let z = 0; z < gridSize; z++) {
                    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
                    const voxel = new THREE.Mesh(geometry, material);
                    voxel.position.set(
                        startX + x * spacing,
                        startY + y * spacing,
                        startZ + z * spacing
                    );
                    this.scene.add(voxel);
                    this.voxels.push(voxel);
                }
            }
        }
    }

    onUpdate(data) {
        const frequencyData = data.frequencyData;
        const timeDomainData = data.timeDomainData;

        this.voxels.forEach((voxel, index) => {
            const freqIndex = Math.floor((index / this.voxels.length) * frequencyData.length);
            const frequency = frequencyData[freqIndex] || 0;
            const timeDomain = timeDomainData[freqIndex] || 0;

            const scale = 1 + frequency * 0.5; // Scale based on frequency
            voxel.scale.set(scale, scale, scale);

            // Color based on time domain and frequency
            const hue = (frequency * 0.5 + timeDomain * 0.5) % 1; // Combine frequency and timeDomain for hue
            const saturation = 0.8; // Keep saturation high for vibrant colors
            const lightness = 0.4 + frequency * 0.3; // Lightness reacts to frequency
            voxel.material.color.setHSL(hue, saturation, lightness);
        });

        this.scene.rotation.x += 0.001;
        this.scene.rotation.y += 0.002;

        data.renderer.render(this.scene, this.camera);
    }

    onResize(data) {
        this.camera.aspect = data.width / data.height;
        this.camera.updateProjectionMatrix();
    }

    onDestroy() {
        this.voxels.forEach(voxel => {
            this.scene.remove(voxel);
            voxel.geometry.dispose();
            voxel.material.dispose();
        });
        delete this.scene;
        delete this.camera;
        delete this.voxels;
    }
}
