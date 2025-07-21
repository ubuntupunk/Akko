            // Wave Visualizer based on official Akko patterns
            class WaveVisualiser extends Akko.Visualiser {
                constructor() {
                    super({
                        code: 'Wv',
                        name: 'Wave Terrain',
                        fftSize: 128,
                        smoothingTimeConstant: 0.8,
                    });
                }

                onInit(data) {
                    this.setupSceneAndCamera(data);
                    this.setupWavePlane();
                }

                setupSceneAndCamera(data) {
                    this.scene = new THREE.Scene();
                    this.camera = new THREE.PerspectiveCamera(60, data.width / data.height, 0.1, 100);
                    this.camera.position.set(0, 15, 25);
                    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
                    this.scene.add(this.camera);
                }

                setupWavePlane() {
                    // Create wireframe plane similar to official visualizers
                    let geometry = new THREE.PlaneGeometry(30, 30, 32, 32);
                    let material = new THREE.MeshBasicMaterial({
                        color: 0x00ff88,
                        wireframe: true,
                        transparent: true,
                        opacity: 0.8
                    });
                    this.mesh = new THREE.Mesh(geometry, material);
                    this.mesh.rotation.x = -Math.PI / 2; // Lay flat
                    this.scene.add(this.mesh);
                    
                    // Store original vertex positions
                    this.originalVertices = [];
                    for (let i = 0; i < geometry.vertices.length; i++) {
                        this.originalVertices[i] = geometry.vertices[i].clone();
                    }
                }

                onUpdate(data) {
                    // Animate vertices based on frequency data
                    for (let i = 0; i < this.mesh.geometry.vertices.length; i++) {
                        let vertex = this.mesh.geometry.vertices[i];
                        let freqIndex = Math.floor((i / this.mesh.geometry.vertices.length) * data.frequencyData.length);
                        let frequency = Math.abs(data.frequencyData[freqIndex]);
                        let timeDomain = data.timeDomainData[freqIndex];
                        
                        let value = frequency * timeDomain;
                        let newZ = this.lerp(vertex.z, value * 10, 0.1);
                        vertex.z = newZ;
                    }
                    
                    this.mesh.geometry.verticesNeedUpdate = true;
                    this.mesh.rotation.z += 0.005;
                    
                    // Color cycling
                    let avgFreq = data.frequencyData.reduce((a, b) => a + b, 0) / data.frequencyData.length;
                    this.mesh.material.color.setHSL(0.3 + avgFreq * 0.4, 0.8, 0.6);
                    
                    data.renderer.render(this.scene, this.camera);
                }

                onResize(data) {
                    this.camera.aspect = data.width / data.height;
                    this.camera.updateProjectionMatrix();
                }

                onDestroy() {
                    delete this.scene;
                    delete this.camera;
                    delete this.mesh;
                }
            }