class InterconnectedNodeNetworkVisualiser extends Akko.Visualiser {
    constructor() {
        super({
            code: 'INN',
            name: 'Interconnected Node Network',
            fftSize: 64,
            smoothingTimeConstant: 0.7,
        });
    }

    onInit(data) {
        console.log('InterconnectedNodeNetworkVisualiser: onInit called');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, data.width / data.height, 0.1, 1000);
        this.camera.position.z = 100;

        this.nodes = [];
        this.lines = [];
        const nodeCount = 50;
        const nodeGeometry = new THREE.SphereGeometry(1, 16, 16);

        // Create nodes
        for (let i = 0; i < nodeCount; i++) {
            const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff });
            const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
            node.position.set(
                (Math.random() - 0.5) * 100,
                (Math.random() - 0.5) * 100,
                (Math.random() - 0.5) * 100
            );
            this.scene.add(node);
            this.nodes.push(node);
        }

        // Create connections between nodes
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.5 });
        for (let i = 0; i < nodeCount; i++) {
            for (let j = i + 1; j < nodeCount; j++) {
                if (this.nodes[i].position.distanceTo(this.nodes[j].position) < 50) { // Connect close nodes
                    const points = [];
                    points.push(this.nodes[i].position);
                    points.push(this.nodes[j].position);
                    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
                    const line = new THREE.Line(lineGeometry, lineMaterial);
                    this.scene.add(line);
                    this.lines.push(line);
                }
            }
        }
    }

    onUpdate(data) {
        // console.log('InterconnectedNodeNetworkVisualiser: onUpdate called');
        const frequencyData = data.frequencyData;
        const timeDomainData = data.timeDomainData;

        this.nodes.forEach((node, index) => {
            const freqIndex = Math.floor((index / this.nodes.length) * frequencyData.length);
            const frequency = frequencyData[freqIndex] || 0;
            const timeDomain = timeDomainData[freqIndex] || 0;

            // Node pulse and color based on audio
            const scale = 1 + frequency * 0.5;
            node.scale.set(scale, scale, scale);
            node.material.color.setHSL(timeDomain, 1, 0.5 + frequency * 0.5);
        });

        this.lines.forEach(line => {
            // Line opacity based on overall volume
            const avgFrequency = frequencyData.reduce((a, b) => a + b, 0) / frequencyData.length;
            line.material.opacity = 0.2 + avgFrequency * 0.8;
        });

        this.scene.rotation.y += 0.001;
        this.camera.lookAt(this.scene.position);

        data.renderer.render(this.scene, this.camera);
    }

    onResize(data) {
        this.camera.aspect = data.width / data.height;
        this.camera.updateProjectionMatrix();
    }

    onDestroy() {
        this.nodes.forEach(node => {
            this.scene.remove(node);
            node.geometry.dispose();
            node.material.dispose();
        });
        this.lines.forEach(line => {
            this.scene.remove(line);
            line.geometry.dispose();
            line.material.dispose();
        });
        delete this.scene;
        delete this.camera;
        delete this.nodes;
        delete this.lines;
    }
}
