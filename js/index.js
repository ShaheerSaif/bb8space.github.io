(function() {
    'use strict';


    var scene, camera, renderer;


    var container, HEIGHT,
        WIDTH, fieldOfView, aspectRatio,
        nearPlane, farPlane, stats,
        geometry, particleCount,
        i, h, color, size,
        materials = [],
        mouseX = 0,
        mouseY = 0,
        windowHalfX, windowHalfY, cameraZ,
        fogHex, fogDensity, parameters = {},
        parameterCount, particles;

    init();
    animate();

    function init() {

        HEIGHT = window.innerHeight;
        WIDTH = window.innerWidth;
        windowHalfX = WIDTH / 2;
        windowHalfY = HEIGHT / 2;

        fieldOfView = 75;
        aspectRatio = WIDTH / HEIGHT;
        nearPlane = 1;
        farPlane = 3000;


        cameraZ = farPlane / 3;
        fogHex = 0x000000;
        fogDensity = 0.0007;

        camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
        camera.position.z = cameraZ;

        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(fogHex, fogDensity);

        container = document.createElement('div');
        document.body.appendChild(container);
        document.body.style.margin = 0;
        document.body.style.overflow = 'hidden';

        geometry = new THREE.Geometry();

        particleCount = 20000;


        for (i = 0; i < particleCount; i++) {

            var vertex = new THREE.Vector3();
            vertex.x = Math.random() * 2000 - 1000;
            vertex.y = Math.random() * 2000 - 1000;
            vertex.z = Math.random() * 2000 - 1000;

            geometry.vertices.push(vertex);
        }



        parameters = [
            [
                [1, 1, 0.5], 5
            ],
            [
                [0.95, 1, 0.5], 4
            ],
            [
                [0.90, 1, 0.5], 3
            ],
            [
                [0.85, 1, 0.5], 2
            ],
            [
                [0.80, 1, 0.5], 1
            ]
        ];
        parameterCount = parameters.length;

        function mousewheel(e) {
            var d = ((typeof e.wheelDelta != "undefined") ? (-e.wheelDelta) : e.detail);
            d = 100 * ((d > 0) ? 1 : -1);

            var cPos = camera.position;
            if (isNaN(cPos.x) || isNaN(cPos.y) || isNaN(cPos.y))
                return;

            var r = cPos.x * cPos.x + cPos.y * cPos.y;
            var sqr = Math.sqrt(r);
            var sqrZ = Math.sqrt(cPos.z * cPos.z + r);


            var nx = cPos.x + ((r == 0) ? 0 : (d * cPos.x / sqr));
            var ny = cPos.y + ((r == 0) ? 0 : (d * cPos.y / sqr));
            var nz = cPos.z + ((sqrZ == 0) ? 0 : (d * cPos.z / sqrZ));

            if (isNaN(nx) || isNaN(ny) || isNaN(nz))
                return;

            cPos.x = nx;
            cPos.y = ny;
            cPos.z = nz;
        }

        var loader = new THREE.JSONLoader();


        loader.load('models/starwars-millennium-falcon.json', function(geometry, materials) {
            var material = new THREE.MultiMaterial(materials);
            var object = new THREE.Mesh(geometry, material);
            scene.add(object);
        });

        for (i = 0; i < parameterCount; i++) {

            color = parameters[i][0];
            size = parameters[i][1];

            materials[i] = new THREE.PointCloudMaterial({
                size: size
            });

            particles = new THREE.PointCloud(geometry, materials[i]);

            particles.rotation.x = Math.random() * 6;
            particles.rotation.y = Math.random() * 6;
            particles.rotation.z = Math.random() * 6;

            scene.add(particles);
        }


        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(WIDTH, HEIGHT);

        container.appendChild(renderer.domElement);


        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';
        stats.domElement.style.right = '0px';
        container.appendChild(stats.domElement);

        window.addEventListener('resize', onWindowResize, false);
        document.addEventListener('mousemove', onDocumentMouseMove, false);
        document.addEventListener('touchstart', onDocumentTouchStart, false);
        document.addEventListener('touchmove', onDocumentTouchMove, false);
        document.body.addEventListener('mousewheel', mousewheel, false);
        document.body.addEventListener('DOMMouseScroll', mousewheel, false);

    }

    function animate() {
        requestAnimationFrame(animate);
        render();
        stats.update();
    }

    function render() {
        var time = Date.now() * 0.00005;

        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.05;

        camera.lookAt(scene.position);

        for (i = 0; i < scene.children.length; i++) {

            var object = scene.children[i];

            if (object instanceof THREE.PointCloud) {

                object.rotation.y = time * (i < 4 ? i + 1 : -(i + 1));
            }
        }

        for (i = 0; i < materials.length; i++) {

            color = parameters[i][0];

            h = (360 * (color[0] + time) % 360) / 360;
            materials[i].color.setHSL(h, color[1], color[2]);
        }

        renderer.render(scene, camera);
    }

    function onDocumentMouseMove(e) {
        mouseX = e.clientX - windowHalfX;
        mouseY = e.clientY - windowHalfY;
    }


    function onDocumentTouchStart(e) {

        if (e.touches.length === 1) {

            e.preventDefault();
            mouseX = e.touches[0].pageX - windowHalfX;
            mouseY = e.touches[0].pageY - windowHalfY;
        }
    }

    function onDocumentTouchMove(e) {

        if (e.touches.length === 1) {

            e.preventDefault();
            mouseX = e.touches[0].pageX - windowHalfX;
            mouseY = e.touches[0].pageY - windowHalfY;
        }
    }

    function onWindowResize() {

        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    var $w = $(window).width();
    var $dW = $('.bb8').css('width');
    $dW = $dW.replace('px', '');
    $dW = parseInt($dW);
    var $dPos = 0;
    var $dSpeed = 1;
    var $dMinSpeed = 1;
    var $dMaxSpeed = 4;
    var $dAccel = 1.04;
    var $dRot = 0;
    var $mPos = $w - $w / 5;
    var $slowOffset = 120;
    var $movingRight = false;

    function moveDroid() {
        if ($mPos > $dPos + ($dW / 4)) {
            // moving right
            if (!$movingRight) {
                $movingRight = true;
                $('.antennas').addClass('right');
                $('.eyes').addClass('right');
            }
            if ($mPos - $dPos > $slowOffset) {
                if ($dSpeed < $dMaxSpeed) {
                    // speed up
                    $dSpeed = $dSpeed * $dAccel;
                }
            } else if ($mPos - $dPos < $slowOffset) {
                if ($dSpeed > $dMinSpeed) {
                    // slow down
                    $dSpeed = $dSpeed / $dAccel;
                }
            }
            $dPos = $dPos + $dSpeed;
            $dRot = $dRot + $dSpeed;
        } else if ($mPos < $dPos - ($dW / 4)) {
            // moving left
            if ($movingRight) {
                $movingRight = false;
                $('.antennas').removeClass('right');
                $('.eyes').removeClass('right');
            }
            if ($dPos - $mPos > $slowOffset) {
                if ($dSpeed < $dMaxSpeed) {
                    // speed up
                    $dSpeed = $dSpeed * $dAccel;
                }
            } else if ($dPos - $mPos < $slowOffset) {
                if ($dSpeed > $dMinSpeed) {
                    // slow down
                    $dSpeed = $dSpeed / $dAccel;
                }
            }
            $dPos = $dPos - $dSpeed;
            $dRot = $dRot - $dSpeed;
        } else {}
        $('.bb8').css('left', $dPos);
        $('.ball').css({
            WebkitTransform: 'rotate(' + $dRot + 'deg)'
        });
        $('.ball').css({
            '-moz-transform': 'rotate(' + $dRot + 'deg)'
        });
    }

    setInterval(moveDroid, 10);

    $(document).on("mousemove", function(event) {
        $('h2').addClass('hide');
        $mPos = event.pageX;
        return $mPos;
    });
})();
