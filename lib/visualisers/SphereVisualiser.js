            // Particle Sphere Visualizer
            class SphereVisualiser extends Akko.Visualiser {
                constructor() {
                    super({
                        code: 'Sp',
                        name: 'Sphere Visualiser',
                        fftSize: 256,
                        smoothingTimeConstant: 0.3,
                    });
                }
            }
            SphereVisualiser.prototype.onInit = function(data) {
                this.scene = new THREE.Scene();
                this.camera = new THREE.PerspectiveCamera(60, data.width / data.height, 0.1, 1000);
                this.camera.position.z = 30;
                this.scene.add(this.camera);
                
                this.particles = [];
                var particleCount = 200;
                var geometry = new THREE.SphereGeometry(0.2, 8, 8);
                
                for (var i = 0; i < particleCount; i++) {
                    var material = new THREE.MeshBasicMaterial({
                        color: new THREE.Color().setHSL(i / particleCount, 1, 0.5)
                    });
                    var particle = new THREE.Mesh(geometry, material);
                    
                    // Position particles in a sphere
                    var phi = Math.acos(-1 + (2 * i) / particleCount);
                    var theta = Math.sqrt(particleCount * Math.PI) * phi;
                    var radius = 15;
                    
                    particle.position.x = radius * Math.cos(theta) * Math.sin(phi);
                    particle.position.y = radius * Math.sin(theta) * Math.sin(phi);
                    particle.position.z = radius * Math.cos(phi);
                    
                    particle.originalPosition = particle.position.clone();
                    this.scene.add(particle);
                    this.particles.push(particle);
                }
            };
            SphereVisualiser.prototype.onUpdate = function(data) {
                for (var i = 0; i < this.particles.length; i++) {
                    var particle = this.particles[i];
                    var freqIndex = Math.floor((i / this.particles.length) * data.frequencyData.length);
                    var scale = 1 + data.frequencyData[freqIndex] * 2;
                    
                    particle.scale.setScalar(scale);
                    particle.material.color.setHSL((i / this.particles.length + Date.now() * 0.0001) % 1, 1, 0.5);
                    
                    // Rotate the entire sphere
                    particle.position.copy(particle.originalPosition);
                    particle.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), Date.now() * 0.001);
                }
                data.renderer.render(this.scene, this.camera);
            };
            SphereVisualiser.prototype.onDestroy = function() {
                delete this.scene;
                delete this.camera;
                delete this.particles;
            };