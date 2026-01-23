import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

const Plugins3D = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const pluginCardsRef = useRef([]);
  const particlesRef = useRef([]);
  const animationIdRef = useRef(null);
  const mouseRef = useRef(new THREE.Vector2());
  const raycasterRef = useRef(new THREE.Raycaster());
  const isMouseDownRef = useRef(false);
  const mouseStartRef = useRef(new THREE.Vector2());

  const [selectedPlugin, setSelectedPlugin] = useState(null);
  const [currentCategory, setCurrentCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isPluginInfoVisible, setIsPluginInfoVisible] = useState(false);

  // Plugin data
  const pluginsData = [
    {
      id: "intelligence-agent",
      name: "Intelligence_Agent",
      category: "ai",
      description: "Advanced AI agent with intelligent decision-making capabilities and autonomous task execution",
      version: "2.1.4",
      rating: 4.9,
      downloads: "850K",
      size: "12.4 MB",
      author: "NEXUS AI Team",
      tags: ["AI", "Agent", "Intelligence", "Autonomous"],
      color: [0.5, 0.3, 1.0],
      features: [
        "Autonomous decision making",
        "Multi-task execution",
        "Context awareness",
        "Learning capabilities",
        "Real-time adaptation"
      ],
      featured: true
    },
    {
      id: "dockchain",
      name: "DockChain",
      category: "infrastructure",
      description: "Containerized blockchain infrastructure with seamless deployment and scaling capabilities",
      version: "1.8.2",
      rating: 4.7,
      downloads: "420K",
      size: "24.8 MB",
      author: "DevOps Team",
      tags: ["Blockchain", "Container", "Docker", "Infrastructure"],
      color: [0.2, 0.7, 1.0],
      features: [
        "Docker containerization",
        "Blockchain integration",
        "Auto-scaling",
        "Load balancing",
        "Security protocols"
      ],
      featured: true
    },
    {
      id: "insight-logger",
      name: "InsightLogger",
      category: "logging",
      description: "Comprehensive logging and analytics system with real-time insights and intelligent monitoring",
      version: "3.0.1",
      rating: 4.8,
      downloads: "680K",
      size: "8.2 MB",
      author: "Analytics Team",
      tags: ["Logging", "Analytics", "Monitoring", "Insights"],
      color: [0.3, 1.0, 0.6],
      features: [
        "Real-time logging",
        "Advanced analytics",
        "Custom dashboards",
        "Alert system",
        "Data visualization"
      ],
      featured: true
    },
    {
      id: "confique",
      name: "Confique",
      category: "configuration",
      description: "Dynamic configuration management system with version control and environment-specific settings",
      version: "2.3.0",
      rating: 4.6,
      downloads: "390K",
      size: "5.6 MB",
      author: "Config Team",
      tags: ["Configuration", "Management", "Version Control", "Environment"],
      color: [1.0, 0.5, 0.2],
      features: [
        "Dynamic configuration",
        "Version control",
        "Environment management",
        "Hot reloading",
        "Validation system"
      ],
      featured: false
    },
    {
      id: "api-bridge",
      name: "ApiBridge",
      category: "integration",
      description: "Universal API integration bridge with protocol translation and seamless connectivity",
      version: "1.9.5",
      rating: 4.5,
      downloads: "720K",
      size: "15.3 MB",
      author: "Integration Team",
      tags: ["API", "Integration", "Bridge", "Protocol"],
      color: [0.8, 0.3, 1.0],
      features: [
        "Universal API support",
        "Protocol translation",
        "Rate limiting",
        "Authentication handling",
        "Error recovery"
      ],
      featured: true
    }
  ];

  const categories = [
    { id: "all", name: "All" },
    { id: "ai", name: "AI" },
    { id: "infrastructure", name: "Infrastructure" },
    { id: "logging", name: "Logging" },
    { id: "configuration", name: "Config" },
    { id: "integration", name: "Integration" }
  ];

  const filterPlugins = () => {
    return pluginsData.filter(plugin => {
      const matchesCategory = currentCategory === 'all' || plugin.category === currentCategory;
      const matchesSearch = searchTerm === '' || 
        plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plugin.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plugin.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchesCategory && matchesSearch;
    });
  };

  const initThreeJS = () => {
    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    scene.fog = new THREE.Fog(0x0a0a0a, 10, 50);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 15);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    setupLights();
    createParticles();
    createPluginCards();
    setupControls();
  };

  const setupLights = () => {
    const scene = sceneRef.current;

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    // Main directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Point lights for atmosphere
    const pointLight1 = new THREE.PointLight(0x60a5fa, 1, 50);
    pointLight1.position.set(-20, 10, -20);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xa855f7, 1, 50);
    pointLight2.position.set(20, 10, 20);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0x34d399, 1, 50);
    pointLight3.position.set(0, 20, 0);
    scene.add(pointLight3);
  };

  const createParticles = () => {
    const scene = sceneRef.current;
    const particleCount = 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 100;
      positions[i3 + 1] = (Math.random() - 0.5) * 100;
      positions[i3 + 2] = (Math.random() - 0.5) * 100;

      const color = new THREE.Color();
      color.setHSL(Math.random(), 0.7, 0.5);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
    particlesRef.current.push(particleSystem);
  };

  const createPluginCards = () => {
    const scene = sceneRef.current;
    const filteredPlugins = filterPlugins();
    
    // Remove existing cards
    pluginCardsRef.current.forEach(card => {
      scene.remove(card.group);
    });
    pluginCardsRef.current = [];

    filteredPlugins.forEach((plugin, index) => {
      const cardGroup = new THREE.Group();
      
      // Main card geometry
      const cardGeometry = new THREE.BoxGeometry(4, 3, 0.2);
      const cardMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(plugin.color[0], plugin.color[1], plugin.color[2]),
        transparent: true,
        opacity: 0.8,
        roughness: 0.1,
        metalness: 0.3,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        transmission: 0.1,
        ior: 1.5
      });

      const cardMesh = new THREE.Mesh(cardGeometry, cardMaterial);
      cardMesh.castShadow = true;
      cardMesh.receiveShadow = true;
      cardGroup.add(cardMesh);

      // Glow effect
      const glowGeometry = new THREE.BoxGeometry(4.2, 3.2, 0.3);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(plugin.color[0], plugin.color[1], plugin.color[2]),
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending
      });
      const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
      cardGroup.add(glowMesh);

      // Position cards in a spiral
      const angle = (index / filteredPlugins.length) * Math.PI * 2;
      const radius = 8 + Math.sin(index * 0.5) * 2;
      cardGroup.position.x = Math.cos(angle) * radius;
      cardGroup.position.z = Math.sin(angle) * radius;
      cardGroup.position.y = Math.sin(index * 0.3) * 2;

      // Add floating animation
      cardGroup.userData = {
        plugin: plugin,
        initialPosition: cardGroup.position.clone(),
        floatOffset: index * 0.1,
        rotationSpeed: 0.01 + Math.random() * 0.01
      };

      scene.add(cardGroup);
      pluginCardsRef.current.push({ group: cardGroup, plugin: plugin });
    });
  };

  const setupControls = () => {
    const renderer = rendererRef.current;
    if (!renderer) return;

    const canvas = renderer.domElement;

    const onMouseDown = (event) => {
      isMouseDownRef.current = true;
      mouseStartRef.current.x = event.clientX;
      mouseStartRef.current.y = event.clientY;
    };

    const onMouseMove = (event) => {
      if (isMouseDownRef.current) {
        const deltaX = event.clientX - mouseStartRef.current.x;
        const deltaY = event.clientY - mouseStartRef.current.y;
        
        const camera = cameraRef.current;
        const spherical = new THREE.Spherical();
        spherical.setFromVector3(camera.position);
        spherical.theta -= deltaX * 0.01;
        spherical.phi += deltaY * 0.01;
        spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));
        
        camera.position.setFromSpherical(spherical);
        camera.lookAt(0, 0, 0);
        
        mouseStartRef.current.x = event.clientX;
        mouseStartRef.current.y = event.clientY;
      }
    };

    const onMouseUp = () => {
      isMouseDownRef.current = false;
    };

    const onMouseClick = (event) => {
      if (Math.abs(event.clientX - mouseStartRef.current.x) > 5 || 
          Math.abs(event.clientY - mouseStartRef.current.y) > 5) {
        return;
      }

      const mouse = mouseRef.current;
      const raycaster = raycasterRef.current;
      const camera = cameraRef.current;

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        pluginCardsRef.current.map(card => card.group.children[0])
      );

      if (intersects.length > 0) {
        const selectedCard = pluginCardsRef.current.find(card => 
          card.group.children[0] === intersects[0].object
        );
        if (selectedCard) {
          setSelectedPlugin(selectedCard.plugin);
          setIsPluginInfoVisible(true);
        }
      }
    };

    const onMouseWheel = (event) => {
      const camera = cameraRef.current;
      const distance = camera.position.distanceTo(new THREE.Vector3(0, 0, 0));
      const zoomSpeed = distance * 0.1;
      
      if (event.deltaY > 0) {
        camera.position.multiplyScalar(1 + zoomSpeed * 0.01);
      } else {
        camera.position.multiplyScalar(1 - zoomSpeed * 0.01);
      }
      
      const newDistance = camera.position.distanceTo(new THREE.Vector3(0, 0, 0));
      if (newDistance > 50) {
        camera.position.normalize().multiplyScalar(50);
      } else if (newDistance < 5) {
        camera.position.normalize().multiplyScalar(5);
      }
    };

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('click', onMouseClick);
    canvas.addEventListener('wheel', onMouseWheel);

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('click', onMouseClick);
      canvas.removeEventListener('wheel', onMouseWheel);
    };
  };

  const animate = () => {
    const time = Date.now() * 0.001;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const renderer = rendererRef.current;

    // Animate particles
    particlesRef.current.forEach(particle => {
      particle.rotation.x += 0.001;
      particle.rotation.y += 0.002;
    });

    // Animate plugin cards
    pluginCardsRef.current.forEach((card) => {
      const { group, plugin } = card;
      const userData = group.userData;
      
      // Floating animation
      group.position.y = userData.initialPosition.y + Math.sin(time + userData.floatOffset) * 0.5;
      
      // Rotation animation
      group.rotation.y += userData.rotationSpeed;
      
      // Hover effect
      if (selectedPlugin && selectedPlugin.id === plugin.id) {
        group.scale.setScalar(1.2);
        group.rotation.x = Math.sin(time * 2) * 0.1;
      } else {
        group.scale.setScalar(1);
        group.rotation.x = Math.sin(time + userData.floatOffset) * 0.05;
      }
    });

    // Animate lights
    scene.children.forEach(child => {
      if (child.type === 'PointLight') {
        child.position.y += Math.sin(time + child.position.x * 0.1) * 0.02;
      }
    });

    renderer.render(scene, camera);
    animationIdRef.current = requestAnimationFrame(animate);
  };

  const resetCamera = () => {
    const camera = cameraRef.current;
    camera.position.set(0, 5, 15);
    camera.lookAt(0, 0, 0);
  };

  useEffect(() => {
    initThreeJS();
    animate();

    const handleResize = () => {
      const camera = cameraRef.current;
      const renderer = rendererRef.current;
      
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const handleKeyDown = (event) => {
      if (event.code === 'Space') {
        event.preventDefault();
        resetCamera();
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('keydown', handleKeyDown);
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  useEffect(() => {
    createPluginCards();
  }, [currentCategory, searchTerm]);

  return (
    <div className="w-full h-screen bg-black overflow-hidden cursor-grab active:cursor-grabbing">
      {/* Three.js Canvas */}
      <div ref={mountRef} className="w-full h-full" />
      
      {/* UI Overlay */}
      <div className="fixed inset-0 pointer-events-none z-10 text-white">
        {/* Control Panel */}
        <div className="absolute top-5 left-5 bg-black bg-opacity-80 border border-white border-opacity-20 rounded-2xl p-5 backdrop-blur-xl pointer-events-auto max-w-xs">
          <div className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            3D Plugins
          </div>
          <div className="text-sm text-white text-opacity-70 mb-5">
            Immersive plugin experience
          </div>
          
          <input
            type="text"
            placeholder="Search plugins..."
            className="w-full p-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white text-sm mb-4 placeholder-white placeholder-opacity-50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setCurrentCategory(category.id)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  currentCategory === category.id
                    ? 'bg-blue-500 bg-opacity-50 border border-blue-500 border-opacity-80 text-blue-300'
                    : 'bg-white bg-opacity-10 border border-white border-opacity-20 text-white text-opacity-80 hover:bg-white hover:bg-opacity-20 hover:text-white'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Plugin Info Panel */}
        {isPluginInfoVisible && selectedPlugin && (
          <div className={`absolute bottom-5 left-5 right-5 bg-black bg-opacity-90 border border-white border-opacity-20 rounded-2xl p-5 backdrop-blur-xl pointer-events-auto transform transition-all duration-500 ${
            isPluginInfoVisible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'
          }`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-xl font-bold text-white mb-1">
                  {selectedPlugin.name}
                </div>
                <div className="text-sm text-white text-opacity-70">
                  by {selectedPlugin.author}
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <div className="bg-blue-500 bg-opacity-30 px-2 py-1 rounded-md text-xs text-blue-300">
                  v{selectedPlugin.version}
                </div>
                <button
                  onClick={() => setIsPluginInfoVisible(false)}
                  className="bg-white bg-opacity-10 border border-white border-opacity-20 p-2 rounded-lg text-white hover:bg-white hover:bg-opacity-20 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="text-white text-opacity-80 mb-4 leading-relaxed">
              {selectedPlugin.description}
            </div>
            
            <div className="flex gap-5 mb-4">
              <div className="text-center">
                <div className="text-lg font-bold text-white">
                  {selectedPlugin.rating}
                </div>
                <div className="text-xs text-white text-opacity-60">
                  Rating
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-white">
                  {selectedPlugin.downloads}
                </div>
                <div className="text-xs text-white text-opacity-60">
                  Downloads
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-white">
                  {selectedPlugin.size}
                </div>
                <div className="text-xs text-white text-opacity-60">
                  Size
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedPlugin.tags.map((tag, index) => (
                <span key={index} className="bg-white bg-opacity-10 px-2 py-1 rounded-md text-xs text-white text-opacity-80">
                  {tag}
                </span>
              ))}
            </div>
            
            <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 py-3 rounded-lg font-bold text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-blue-500 hover:shadow-opacity-30">
              Install Plugin
            </button>
          </div>
        )}

        {/* Controls Info */}
        <div className="absolute bottom-5 right-5 bg-black bg-opacity-80 border border-white border-opacity-20 rounded-xl p-4 backdrop-blur-xl pointer-events-auto">
          <div className="text-xs text-white text-opacity-70 space-y-1">
            <div><span className="text-blue-400 font-bold">Mouse:</span> Orbit camera</div>
            <div><span className="text-blue-400 font-bold">Scroll:</span> Zoom in/out</div>
            <div><span className="text-blue-400 font-bold">Click:</span> Select plugin</div>
            <div><span className="text-blue-400 font-bold">Space:</span> Reset view</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plugins3D;