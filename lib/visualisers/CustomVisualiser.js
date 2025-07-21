            // Amount of cubes to draw, must be a power of 2 since we're using it for `fftSize` below
            var CUBE_COUNT = 16;
            function CustomVisualiser() {
                Akko.Visualiser.call(this, {
                    code: 'Cv',
                    name: 'Custom Visualiser',
                    fftSize: CUBE_COUNT * 2,
                });
            }
            CustomVisualiser.prototype = Object.create(Akko.Visualiser.prototype);
            CustomVisualiser.prototype.constructor = CustomVisualiser;
            CustomVisualiser.prototype.onInit = function(data) {
                this.scene = new THREE.Scene();
                this.camera = new THREE.PerspectiveCamera(60, data.width / data.height, 0.1, 100);
                this.camera.position.z = 10;
                this.camera.lookAt(new THREE.Vector3(0, 0, 0));
                this.scene.add(this.camera);
                this.cubes = [];
                var geometry = new THREE.BoxGeometry(1, 1, 1);
                var xOffset = -CUBE_COUNT / 2 + 0.5;
                var hslStep = 1 / CUBE_COUNT;
                for (var i = 0; i < CUBE_COUNT; i++) {
                    var material = new THREE.MeshBasicMaterial({color: 0xffffff});
                    material.color.setHSL(hslStep * i, 1, 0.5);
                    var cube = new THREE.Mesh(geometry, material);
                    cube.position.set(xOffset + i, 0, 0);
                    this.scene.add(cube);
                    this.cubes.push(cube);
                }
            };
            CustomVisualiser.prototype.onUpdate = function(data) {
                for (var i = 0; i < CUBE_COUNT; i++) {
                    var cube = this.cubes[i];
                    var frequency = data.frequencyData[i];
                    var timeDomain = data.timeDomainData[i];
                    cube.scale.y = this.lerp(cube.scale.y, frequency * timeDomain, 0.1);
                }
                data.renderer.render(this.scene, this.camera);
            };
            CustomVisualiser.prototype.onDestroy = function() {
                delete this.scene;
                delete this.camera;
                delete this.cubes;
            };