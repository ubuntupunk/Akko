            // Frequency Bars Visualizer based on official Akko BarVisualiser
            class BarsVisualiser extends Akko.Visualiser {
                constructor() {
                    super({
                        code: 'Br',
                        name: 'Frequency Bars',
                        fftSize: 64,
                        smoothingTimeConstant: 0.9,
                    });
                }

                onInit(data) {
                    this.setupSceneAndCamera(data);
                    this.setupBars();
                }

                setupSceneAndCamera(data) {
                    this.scene = new THREE.Scene();
                    this.camera = new THREE.PerspectiveCamera(60, data.width / data.height, 0.1, 100);
                    this.camera.position.set(0, 8, 15);
                    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
                    this.cameraPivot = new THREE.Object3D();
                    this.cameraPivot.add(this.camera);
                    this.scene.add(this.cameraPivot);
                }

                setupBars() {
                    this.bars = [];
                    const BAR_COUNT = 32;
                    let geometry = new THREE.BoxGeometry(0.4, 1, 0.4);
                    
                    for (let i = 0; i < BAR_COUNT; i++) {
                        let hue = i / BAR_COUNT;
                        let material = new THREE.MeshBasicMaterial({
                            color: new THREE.Color().setHSL(hue, 0.8, 0.6)
                        });
                        let bar = new THREE.Mesh(geometry, material);
                        
                        // Arrange in a circle like the official BarVisualiser
                        let angle = (i / BAR_COUNT) * Math.PI * 2;
                        let radius = 5;
                        bar.position.x = Math.cos(angle) * radius;
                        bar.position.z = Math.sin(angle) * radius;
                        bar.position.y = 0;
                        
                        this.scene.add(bar);
                        this.bars.push(bar);
                    }
                }

                onUpdate(data) {
                    const BAR_COUNT = this.bars.length;
                    
                    for (let i = 0; i < BAR_COUNT; i++) {
                        let bar = this.bars[i];
                        let frequency = Math.abs(data.frequencyData[i]) || 0;
                        let timeDomain = Math.abs(data.timeDomainData[i]) || 0;
                        
                        // Use the same calculation as official BarVisualiser
                        let value = frequency * timeDomain;
                        if (value === Infinity || value === -Infinity || isNaN(value)) {
                            value = 0;
                        }
                        
                        // Scale the bars more aggressively for visibility
                        let targetScale = Math.max(0.1, value * 25);
                        let newY = this.lerp(bar.scale.y, targetScale, 0.2);
                        
                        bar.scale.y = newY;
                        bar.position.y = newY / 2;
                        
                        // More vibrant color changes
                        let baseHue = i / BAR_COUNT;
                        let dynamicHue = (baseHue + frequency * 0.5) % 1;
                        let saturation = 0.9;
                        let lightness = 0.4 + Math.min(0.5, frequency * 2);
                        
                        bar.material.color.setHSL(dynamicHue, saturation, lightness);
                        
                        // Debug: log some values for the first few bars
                        if (i < 3) {
                            console.log(`Bar ${i}: freq=${frequency.toFixed(3)}, time=${timeDomain.toFixed(3)}, value=${value.toFixed(3)}, scale=${newY.toFixed(3)}`);
                        }
                    }
                    
                    // Rotate camera around the bars like official version
                    this.cameraPivot.rotation.y += 0.01;
                    data.renderer.render(this.scene, this.camera);
                }

                onResize(data) {
                    this.camera.aspect = data.width / data.height;
                    this.camera.updateProjectionMatrix();
                }

                onDestroy() {
                    delete this.scene;
                    delete this.camera;
                    delete this.bars;
                }
            }