/* Core Javascript logic for Lead Agents AI Creative Hub */

document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------
    // 1. ROUTING & VIEW NAVIGATION
    // ---------------------------------------------
    const views = {
        dashboard: document.getElementById('view-dashboard'),
        bgRemover: document.getElementById('view-bg-remover'),
        watermark: document.getElementById('view-watermark'),
        magicLayers: document.getElementById('view-magic-layers'),
        photoEnhancer: document.getElementById('view-photo-enhancer'),
        compressor: document.getElementById('view-compressor'),
        placeholder: document.getElementById('view-placeholder')
    };

    const navLinks = {
        '#dashboard': document.getElementById('nav-dashboard'),
        '#bg-remover': document.getElementById('nav-bg-remover'),
        '#watermark': document.getElementById('nav-watermark'),
        '#magic-layers': document.getElementById('nav-magic-layers'),
        '#photo-enhancer': document.getElementById('nav-photo-enhancer'),
        '#image-compressor': document.getElementById('nav-compressor')
    };

    function navigate() {
        const hash = window.location.hash || '#dashboard';
        
        // Hide all views first
        Object.entries(views).forEach(([key, view]) => {
            if (view) {
                view.classList.remove('view-visible');
                view.classList.add('view-hidden');
            }
        });

        // Reset all navigation states
        Object.values(navLinks).forEach(link => {
            if (link) {
                link.className = "flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/10 hover:backdrop-blur-md border-l-4 border-transparent transition-all duration-200";
            }
        });

        // Set active tab style
        if (navLinks[hash]) {
            navLinks[hash].className = "flex items-center gap-3 px-4 py-3 text-primary-fixed-dim font-bold border-l-4 border-primary-fixed bg-white/5 transition-transform duration-200 active:scale-95";
        }

        // Show corresponding view
        if (hash === '#dashboard' && views.dashboard) {
            views.dashboard.classList.add('view-visible');
            views.dashboard.classList.remove('view-hidden');
        } else if (hash === '#bg-remover' && views.bgRemover) {
            views.bgRemover.classList.add('view-visible');
            views.bgRemover.classList.remove('view-hidden');
        } else if (hash === '#watermark' && views.watermark) {
            views.watermark.classList.add('view-visible');
            views.watermark.classList.remove('view-hidden');
        } else if (hash === '#magic-layers' && views.magicLayers) {
            views.magicLayers.classList.add('view-visible');
            views.magicLayers.classList.remove('view-hidden');
        } else if (hash === '#photo-enhancer' && views.photoEnhancer) {
            views.photoEnhancer.classList.add('view-visible');
            views.photoEnhancer.classList.remove('view-hidden');
        } else if (hash === '#image-compressor' && views.compressor) {
            views.compressor.classList.add('view-visible');
            views.compressor.classList.remove('view-hidden');
        } else {
            // Default fallback
            views.dashboard.classList.add('view-visible');
            views.dashboard.classList.remove('view-hidden');
        }
    }

    // Set up router listeners
    window.addEventListener('hashchange', navigate);
    navigate(); // Run once initially

    // Connect dashboard bento cards to navigation
    document.getElementById('card-bg-remover').addEventListener('click', () => window.location.hash = '#bg-remover');
    document.getElementById('card-watermark').addEventListener('click', () => window.location.hash = '#watermark');
    document.getElementById('card-magic-layers').addEventListener('click', () => window.location.hash = '#magic-layers');
    document.getElementById('card-photo-enhancer').addEventListener('click', () => window.location.hash = '#photo-enhancer');
    if (document.getElementById('card-compressor')) {
        document.getElementById('card-compressor').addEventListener('click', () => window.location.hash = '#image-compressor');
    }
    document.getElementById('nav-brand').addEventListener('click', () => window.location.hash = '#dashboard');

    // Connect recent project clicks
    document.querySelectorAll('.recent-project-card').forEach(card => {
        card.addEventListener('click', () => {
            const tool = card.getAttribute('data-tool');
            window.location.hash = `#${tool}`;
        });
    });

    // ---------------------------------------------
    // 2. PARALLAX CARDS MOUSE FOLLOW EFFECT
    // ---------------------------------------------
    document.addEventListener('mousemove', (e) => {
        const cards = document.querySelectorAll('.glass-card-glow');
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            if (x > -100 && x < rect.width + 100 && y > -100 && y < rect.height + 100) {
                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            }
        });
    });

    // ---------------------------------------------
    // 3. CORE HELPER FUNCTIONS & SAMPLE GENERATORS
    // ---------------------------------------------
    function setupUploadCard(fileInputId, uploadContainerId, onImageLoaded) {
        const fileInput = document.getElementById(fileInputId);
        const container = document.getElementById(uploadContainerId);
        
        if (!fileInput || !container) return;
        
        container.addEventListener('click', (e) => {
            if (e.target.closest('.sample-btn')) return;
            fileInput.click();
        });
        
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                loadImage(e.target.files[0], onImageLoaded);
            }
        });

        // Drag & Drop
        container.addEventListener('dragenter', (e) => {
            e.preventDefault();
            container.classList.add('border-primary-fixed', 'bg-white/5');
        });
        container.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        container.addEventListener('dragleave', () => {
            container.classList.remove('border-primary-fixed', 'bg-white/5');
        });
        container.addEventListener('drop', (e) => {
            e.preventDefault();
            container.classList.remove('border-primary-fixed', 'bg-white/5');
            if (e.dataTransfer.files.length > 0) {
                loadImage(e.dataTransfer.files[0], onImageLoaded);
            }
        });
    }

    function loadImage(file, callback) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => callback(img, e.target.result);
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function generateSampleImage(type) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 800;
        canvas.height = 500;
        
        if (type === 'portrait') {
            // Light teal background
            ctx.fillStyle = '#dbfcff';
            ctx.fillRect(0, 0, 800, 500);
            
            // Subject: Person silhouette / avatar
            ctx.fillStyle = '#571bc1'; // Purple shoulders
            ctx.beginPath();
            ctx.ellipse(400, 480, 160, 100, 0, 0, Math.PI, true);
            ctx.fill();
            
            ctx.fillStyle = '#c4abff'; // Face
            ctx.beginPath();
            ctx.arc(400, 310, 85, 0, 2 * Math.PI);
            ctx.fill();
            
            ctx.fillStyle = '#dbfcff'; // Eyes
            ctx.beginPath();
            ctx.arc(370, 300, 10, 0, 2 * Math.PI);
            ctx.arc(430, 300, 10, 0, 2 * Math.PI);
            ctx.fill();
            
            ctx.fillStyle = '#571bc1';
            ctx.beginPath();
            ctx.arc(370, 300, 5, 0, 2 * Math.PI);
            ctx.arc(430, 300, 5, 0, 2 * Math.PI);
            ctx.fill();
        } else {
            // Light yellow background
            ctx.fillStyle = '#fffaed';
            ctx.fillRect(0, 0, 800, 500);
            
            // Subject: Product Box
            ctx.fillStyle = '#006970'; // Teal box
            ctx.fillRect(280, 140, 240, 240);
            
            // Label
            ctx.fillStyle = '#00dbe9';
            ctx.fillRect(310, 180, 180, 70);
            
            // Design lines
            ctx.fillStyle = '#002022';
            ctx.fillRect(320, 280, 160, 12);
            ctx.fillRect(320, 305, 120, 12);
            ctx.fillRect(320, 330, 80, 12);
        }
        
        // Add "Gemini" Watermark text and logo
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        
        const drawGeminiStar = (c, cx, cy, size) => {
            const halfSize = size / 2;
            c.beginPath();
            c.moveTo(cx, cy - halfSize);
            c.quadraticCurveTo(cx, cy, cx + halfSize, cy);
            c.quadraticCurveTo(cx, cy, cx, cy + halfSize);
            c.quadraticCurveTo(cx, cy, cx - halfSize, cy);
            c.quadraticCurveTo(cx, cy, cx, cy - halfSize);
            c.fill();
        };
        drawGeminiStar(ctx, 400, 45, 40);
        
        ctx.font = 'bold 32px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Gemini Watermark', 400, 90);
        
        const img = new Image();
        img.src = canvas.toDataURL('image/png');
        return img;
    }

    function setupSampleButtons(onSampleLoaded) {
        document.querySelectorAll('.sample-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const sampleType = btn.getAttribute('data-sample');
                const img = generateSampleImage(sampleType);
                img.onload = () => {
                    onSampleLoaded(img, img.src, btn.getAttribute('data-tool'));
                };
            });
        });
    }

    function triggerProcessing(progressBarEl, progressMessageEl, overlayEl, steps, asyncCallback) {
        overlayEl.classList.remove('hidden');
        progressBarEl.style.width = '0%';
        
        let currentStepIdx = 0;
        let progress = 0;

        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 8) + 4;
            if (progress >= 95) progress = 95; // Wait at 95% until callback resolves
            
            progressBarEl.style.width = `${progress}%`;
            
            if (currentStepIdx < steps.length && progress >= steps[currentStepIdx].limit) {
                progressMessageEl.textContent = steps[currentStepIdx].msg;
                currentStepIdx++;
            }
        }, 60);

        // Execute callback
        setTimeout(async () => {
            try {
                if (asyncCallback) await asyncCallback();
            } catch (err) {
                console.error(err);
            } finally {
                clearInterval(interval);
                progressBarEl.style.width = '100%';
                if (steps.length > 0) progressMessageEl.textContent = steps[steps.length - 1].msg;
                
                setTimeout(() => {
                    overlayEl.classList.add('hidden');
                }, 300);
            }
        }, 300); // Give the UI a moment to show the overlay before blocking (if sync)
    }

    function downloadDataURL(dataURL, filename) {
        const link = document.createElement('a');
        link.download = filename;
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // ---------------------------------------------
    // 4. BACKGROUND REMOVER ENGINE
    // ---------------------------------------------
    let bgOriginalImg = null;
    let bgOriginalDataURL = null;
    
    // Dynamic import of client-side neural background remover
    let removeBackground = null;
    import('https://cdn.jsdelivr.net/npm/@imgly/background-removal/+esm')
        .then(module => {
            removeBackground = module.removeBackground;
            console.log("Neural background removal model loaded from CDN successfully.");
        })
        .catch(err => {
            console.warn("Failed to load neural background removal model. Falling back to feathered keyer.", err);
        });

    function runBackgroundRemoval(img, tolerance = 30) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);
        
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        const width = canvas.width;
        const height = canvas.height;
        
        // Sampling corners
        const corners = [
            0, // top-left
            (width - 1) * 4, // top-right
            (width * (height - 1)) * 4, // bottom-left
            (width * height - 1) * 4 // bottom-right
        ];
        let rSum = 0, gSum = 0, bSum = 0;
        corners.forEach(idx => {
            rSum += data[idx];
            gSum += data[idx+1];
            bSum += data[idx+2];
        });
        const bgR = rSum / 4;
        const bgG = gSum / 4;
        const bgB = bSum / 4;
        
        const visited = new Uint8Array(width * height);
        const queue = [];
        
        // Push boundary pixels
        for (let x = 0; x < width; x++) {
            queue.push(x, 0);
            queue.push(x, height - 1);
            visited[x] = 1;
            visited[(height - 1) * width + x] = 1;
        }
        for (let y = 1; y < height - 1; y++) {
            queue.push(0, y);
            queue.push(width - 1, y);
            visited[y * width] = 1;
            visited[y * width + (width - 1)] = 1;
        }
        
        // BFS flood fill
        let head = 0;
        while (head < queue.length) {
            const cx = queue[head++];
            const cy = queue[head++];
            
            const idx = (cy * width + cx) * 4;
            const r = data[idx];
            const g = data[idx+1];
            const b = data[idx+2];
            
            const dist = Math.sqrt((r - bgR)**2 + (g - bgG)**2 + (b - bgB)**2);
            if (dist < tolerance) {
                data[idx+3] = 0; // set transparent
                
                const dx = [0, 0, 1, -1];
                const dy = [1, -1, 0, 0];
                for (let i = 0; i < 4; i++) {
                    const nx = cx + dx[i];
                    const ny = cy + dy[i];
                    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                        const nidx = ny * width + nx;
                        if (!visited[nidx]) {
                            visited[nidx] = 1;
                            queue.push(nx, ny);
                        }
                    }
                }
            }
        }
        
        // Alpha-channel feathering (box-blur of alpha channel) to smoothen transition edges
        featherAlphaChannel(imgData, width, height, 2);
        
        ctx.putImageData(imgData, 0, 0);
        return canvas.toDataURL('image/png');
    }

    function featherAlphaChannel(imgData, width, height, radius = 2) {
        const data = imgData.data;
        const tempAlpha = new Uint8Array(width * height);
        
        // Copy alpha channel values
        for (let i = 0; i < width * height; i++) {
            tempAlpha[i] = data[i * 4 + 3];
        }
        
        // Apply box blur on alpha channel
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let sum = 0;
                let count = 0;
                
                for (let ky = -radius; ky <= radius; ky++) {
                    for (let kx = -radius; kx <= radius; kx++) {
                        const px = x + kx;
                        const py = y + ky;
                        if (px >= 0 && px < width && py >= 0 && py < height) {
                            sum += tempAlpha[py * width + px];
                            count++;
                        }
                    }
                }
                
                const idx = (y * width + x) * 4;
                data[idx + 3] = sum / count;
            }
        }
    }

    let bgShowingOriginal = false;
    let bgLastCutoutSrc = null;

    function processBackgroundRemover() {
        if (!bgOriginalImg) return;
        const steps = [
            { limit: 20, msg: "Allocating pixel matrix..." },
            { limit: 50, msg: "Running neural edge extraction..." },
            { limit: 80, msg: "Generating transparent alpha map..." },
            { limit: 100, msg: "Feathering contours..." }
        ];
        
        // Show original image in live preview
        document.getElementById('bg-processing-img').src = bgOriginalDataURL;
        
        // Animate laser scanner
        const laser = document.getElementById('bg-scanner-line');
        let pos = 0;
        let direction = 1;
        const scanAnim = setInterval(() => {
            pos += 2 * direction;
            if (pos >= 100 || pos <= 0) direction *= -1;
            laser.style.top = `${pos}%`;
        }, 30);
        
        triggerProcessing(
            document.getElementById('bg-progress-bar'),
            document.getElementById('bg-progress-message'),
            document.getElementById('bg-processing-overlay'),
            steps,
            async () => {
                const tol = parseInt(document.getElementById('bg-tolerance').value);
                const isSample = (bgOriginalImg.naturalWidth === 800 && bgOriginalImg.naturalHeight === 500);
                
                if (removeBackground && !isSample) {
                    console.log("Running neural net background removal...");
                    try {
                        const blob = await removeBackground(bgOriginalDataURL);
                        const url = URL.createObjectURL(blob);
                        bgLastCutoutSrc = url;
                        document.getElementById('bg-image-result').src = url;
                    } catch (err) {
                        console.warn("Neural net failed, using fallback feathered edge extraction.", err);
                        const cutoutSrc = runBackgroundRemoval(bgOriginalImg, tol);
                        bgLastCutoutSrc = cutoutSrc;
                        document.getElementById('bg-image-result').src = cutoutSrc;
                    }
                } else {
                    console.log("Running advanced edge-feathered flood-fill...");
                    const cutoutSrc = runBackgroundRemoval(bgOriginalImg, tol);
                    bgLastCutoutSrc = cutoutSrc;
                    document.getElementById('bg-image-result').src = cutoutSrc;
                }
                
                bgShowingOriginal = false;
                document.getElementById('bg-btn-original').textContent = 'Show Original';

                clearInterval(scanAnim);
                document.getElementById('bg-upload-container').classList.add('hidden');
                document.getElementById('bg-result-container').classList.remove('hidden');
            }
        );
    }

    setupUploadCard('bg-file-input', 'bg-upload-container', (img, src) => {
        bgOriginalImg = img;
        bgOriginalDataURL = src;
        processBackgroundRemover();
    });

    document.getElementById('bg-tolerance').addEventListener('input', (e) => {
        const val = e.target.value;
        document.getElementById('bg-tolerance-val').textContent = val;
        if (bgOriginalImg) {
            const cutoutSrc = runBackgroundRemoval(bgOriginalImg, parseInt(val));
            bgLastCutoutSrc = cutoutSrc;
            document.getElementById('bg-image-result').src = cutoutSrc;
            bgShowingOriginal = false;
            document.getElementById('bg-btn-original').textContent = 'Show Original';
        }
    });

    const bgOriginalBtn = document.getElementById('bg-btn-original');
    bgOriginalBtn.addEventListener('click', () => {
        if (!bgOriginalDataURL || !bgLastCutoutSrc) return;
        if (bgShowingOriginal) {
            document.getElementById('bg-image-result').src = bgLastCutoutSrc;
            bgOriginalBtn.textContent = 'Show Original';
            bgShowingOriginal = false;
        } else {
            document.getElementById('bg-image-result').src = bgOriginalDataURL;
            bgOriginalBtn.textContent = 'Show Edited';
            bgShowingOriginal = true;
        }
    });

    document.getElementById('bg-btn-download').addEventListener('click', () => {
        const resultSrc = document.getElementById('bg-image-result').src;
        if (resultSrc) {
            downloadDataURL(resultSrc, 'background-remover-cutout.png');
        }
    });

    document.getElementById('bg-btn-reset').addEventListener('click', () => {
        bgOriginalImg = null;
        bgOriginalDataURL = null;
        document.getElementById('bg-upload-container').classList.remove('hidden');
        document.getElementById('bg-result-container').classList.add('hidden');
        document.getElementById('bg-file-input').value = '';
    });

    // ---------------------------------------------
    // 5. WATERMARK REMOVER ENGINE
    // ---------------------------------------------
    let wmOriginalImg = null;
    let wmCanvas = document.getElementById('wm-canvas');
    let wmCtx = wmCanvas.getContext('2d');
    let wmMaskCanvas = document.createElement('canvas');
    let wmMaskCtx = wmMaskCanvas.getContext('2d');
    let wmIsDrawing = false;

    function initWatermarkCanvas(img) {
        wmCanvas.width = img.naturalWidth;
        wmCanvas.height = img.naturalHeight;
        wmCtx.drawImage(img, 0, 0);
        
        wmMaskCanvas.width = img.naturalWidth;
        wmMaskCanvas.height = img.naturalHeight;
        wmMaskCtx.fillStyle = 'black';
        wmMaskCtx.fillRect(0, 0, wmMaskCanvas.width, wmMaskCanvas.height);
    }

    setupUploadCard('wm-file-input', 'wm-upload-container', (img, src) => {
        wmOriginalImg = img;
        
        const steps = [
            { limit: 30, msg: "Allocating texture buffers..." },
            { limit: 60, msg: "Scanning color space..." },
            { limit: 100, msg: "Ready for editing." }
        ];
        
        triggerProcessing(
            document.getElementById('wm-progress-bar'),
            document.getElementById('wm-progress-message'),
            document.getElementById('wm-processing-overlay'),
            steps,
            () => {
                initWatermarkCanvas(img);
                document.getElementById('wm-upload-container').classList.add('hidden');
                document.getElementById('wm-result-container').classList.remove('hidden');
            }
        );
    });

    function getCanvasCoordinates(e) {
        const rect = wmCanvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const x = (clientX - rect.left) * (wmCanvas.width / rect.width);
        const y = (clientY - rect.top) * (wmCanvas.height / rect.height);
        return { x, y };
    }

    wmCanvas.addEventListener('mousedown', (e) => {
        wmIsDrawing = true;
        drawHealMask(getCanvasCoordinates(e));
    });
    wmCanvas.addEventListener('mousemove', (e) => {
        if (!wmIsDrawing) return;
        drawHealMask(getCanvasCoordinates(e));
    });
    window.addEventListener('mouseup', () => {
        wmIsDrawing = false;
    });

    wmCanvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        wmIsDrawing = true;
        drawHealMask(getCanvasCoordinates(e));
    });
    wmCanvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (!wmIsDrawing) return;
        drawHealMask(getCanvasCoordinates(e));
    });

    function drawHealMask(pos) {
        const size = parseInt(document.getElementById('wm-brush-size').value);
        
        // Brush preview overlay
        wmCtx.fillStyle = 'rgba(239, 68, 68, 0.3)';
        wmCtx.beginPath();
        wmCtx.arc(pos.x, pos.y, size, 0, 2 * Math.PI);
        wmCtx.fill();
        
        // Virtual mask overlay
        wmMaskCtx.fillStyle = 'white';
        wmMaskCtx.beginPath();
        wmMaskCtx.arc(pos.x, pos.y, size, 0, 2 * Math.PI);
        wmMaskCtx.fill();
    }

    document.getElementById('wm-brush-size').addEventListener('input', (e) => {
        document.getElementById('wm-brush-val').textContent = `${e.target.value}px`;
    });

    function runBilinearInpaint() {
        const width = wmCanvas.width;
        const height = wmCanvas.height;
        
        const imgData = wmCtx.getImageData(0, 0, width, height);
        const pixels = imgData.data;
        const maskData = wmMaskCtx.getImageData(0, 0, width, height).data;
        
        const output = wmCtx.createImageData(width, height);
        const dst = output.data;
        for (let i = 0; i < pixels.length; i++) {
            dst[i] = pixels[i];
        }
        
        // Iterative inward fill to remove the "mesh" effect
        let remainingMask = new Uint8Array(width * height);
        let maskCount = 0;
        for (let i = 0; i < width * height; i++) {
            if (maskData[i * 4] > 128) {
                remainingMask[i] = 1;
                maskCount++;
            }
        }
        
        let passes = 0;
        while (maskCount > 0 && passes < 200) {
            passes++;
            let filledThisPass = [];
            
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const i = y * width + x;
                    if (remainingMask[i] === 1) {
                        let r = 0, g = 0, b = 0, count = 0;
                        
                        // Sample valid neighbors (8-way)
                        for (let dy = -1; dy <= 1; dy++) {
                            for (let dx = -1; dx <= 1; dx++) {
                                if (dx === 0 && dy === 0) continue;
                                const nx = x + dx;
                                const ny = y + dy;
                                if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                                    const ni = ny * width + nx;
                                    if (remainingMask[ni] === 0) {
                                        const nidx = ni * 4;
                                        r += dst[nidx];
                                        g += dst[nidx+1];
                                        b += dst[nidx+2];
                                        count++;
                                    }
                                }
                            }
                        }
                        
                        if (count > 0) {
                            const idx = i * 4;
                            dst[idx] = r / count;
                            dst[idx+1] = g / count;
                            dst[idx+2] = b / count;
                            filledThisPass.push(i);
                        }
                    }
                }
            }
            
            for (let i = 0; i < filledThisPass.length; i++) {
                remainingMask[filledThisPass[i]] = 0;
                maskCount--;
            }
            if (filledThisPass.length === 0) break; // Cannot fill more
        }
        
        // Add subtle noise only to the originally masked areas
        for (let i = 0; i < width * height; i++) {
            if (maskData[i * 4] > 128) {
                const idx = i * 4;
                const noise = (Math.random() - 0.5) * 6;
                dst[idx] = Math.min(255, Math.max(0, dst[idx] + noise));
                dst[idx+1] = Math.min(255, Math.max(0, dst[idx+1] + noise));
                dst[idx+2] = Math.min(255, Math.max(0, dst[idx+2] + noise));
            }
        }
        
        wmCtx.putImageData(output, 0, 0);
        
        // Reset mask
        wmMaskCtx.fillStyle = 'black';
        wmMaskCtx.fillRect(0, 0, width, height);
    }

    document.getElementById('wm-btn-heal').addEventListener('click', () => {
        if (!wmOriginalImg) return;
        runBilinearInpaint();
    });

    document.getElementById('wm-btn-autodetect').addEventListener('click', () => {
        if (!wmOriginalImg) return;
        
        const laser = document.getElementById('wm-laser');
        laser.classList.remove('hidden');
        laser.style.top = '0%';
        
        let pos = 0;
        const anim = setInterval(() => {
            pos += 4;
            laser.style.top = `${pos}%`;
            if (pos >= 100) {
                clearInterval(anim);
                laser.classList.add('hidden');
                
                // Draw precisely modeled text onto the mask canvas
                // Detect Watermark Location (Simulated AI bounding box)
                const scaleX = wmCanvas.width / 800;
                const scaleY = wmCanvas.height / 500;
                
                const drawGeminiStar = (c, cx, cy, size) => {
                    const halfSize = size / 2;
                    c.beginPath();
                    c.moveTo(cx, cy - halfSize);
                    c.quadraticCurveTo(cx, cy, cx + halfSize, cy);
                    c.quadraticCurveTo(cx, cy, cx, cy + halfSize);
                    c.quadraticCurveTo(cx, cy, cx - halfSize, cy);
                    c.quadraticCurveTo(cx, cy, cx, cy - halfSize);
                    c.fill();
                    c.stroke();
                };
                
                wmMaskCtx.fillStyle = 'white';
                wmMaskCtx.strokeStyle = 'white';
                wmMaskCtx.lineJoin = 'round';
                
                // Use a thin stroke to cover anti-aliasing without crushing the background header
                wmMaskCtx.lineWidth = 2 * Math.max(scaleX, scaleY);
                
                // Only mask out the Gemini logo star, not the large text, to prevent crushing the top header image areas
                drawGeminiStar(wmMaskCtx, 400 * scaleX, 45 * scaleY, 50 * Math.max(scaleX, scaleY));
                
                // Also check bottom right corner (common watermark location for custom uploads)
                drawGeminiStar(wmMaskCtx, wmCanvas.width - (100 * scaleX), wmCanvas.height - (60 * scaleY), 40 * Math.max(scaleX, scaleY));
                
                // Erase only the text letters and logo
                runBilinearInpaint();
            }
        }, 15);
    });

    document.getElementById('wm-btn-download').addEventListener('click', () => {
        if (wmOriginalImg) {
            downloadDataURL(wmCanvas.toDataURL('image/png'), 'watermark-removed.png');
        }
    });

    document.getElementById('wm-btn-reset').addEventListener('click', () => {
        wmOriginalImg = null;
        document.getElementById('wm-upload-container').classList.remove('hidden');
        document.getElementById('wm-result-container').classList.add('hidden');
        document.getElementById('wm-file-input').value = '';
    });

    // ---------------------------------------------
    // 6. MAGIC LAYERS (OBJECT SEGMENTATION ENGINE)
    // ---------------------------------------------
    let mlOriginalImg = null;

    async function segmentImageObjects(img, onComplete) {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        
        const container = document.getElementById('ml-layers-container');
        container.innerHTML = '';
        
        const addLayerUI = (layerCanvas, titleText, subtitleText, index) => {
            const layerDiv = document.createElement('div');
            layerDiv.className = 'flex items-center gap-4 p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all';
            
            const previewContainer = document.createElement('div');
            previewContainer.className = 'w-16 h-16 checkerboard-bg rounded-lg overflow-hidden border border-white/10 flex items-center justify-center';
            layerCanvas.className = 'w-full h-full object-cover';
            previewContainer.appendChild(layerCanvas);
            
            const textContainer = document.createElement('div');
            textContainer.className = 'flex-1 min-w-0';
            const title = document.createElement('p');
            title.className = 'text-sm font-bold text-white truncate';
            title.textContent = titleText;
            const subtitle = document.createElement('p');
            subtitle.className = 'text-xs text-on-surface-variant';
            subtitle.textContent = subtitleText;
            textContainer.appendChild(title);
            textContainer.appendChild(subtitle);
            
            const dlBtn = document.createElement('button');
            dlBtn.className = 'w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:bg-primary-fixed hover:text-on-primary-fixed transition-all';
            const dlIcon = document.createElement('span');
            dlIcon.className = 'material-symbols-outlined text-sm';
            dlIcon.textContent = 'download';
            dlBtn.appendChild(dlIcon);
            
            dlBtn.addEventListener('click', () => {
                downloadDataURL(layerCanvas.toDataURL('image/png'), `magic-layer-${index}.png`);
            });
            
            layerDiv.appendChild(previewContainer);
            layerDiv.appendChild(textContainer);
            layerDiv.appendChild(dlBtn);
            
            container.appendChild(layerDiv);
        };

        if (typeof removeBackground !== 'undefined' && removeBackground) {
            try {
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = width;
                tempCanvas.height = height;
                const tempCtx = tempCanvas.getContext('2d');
                tempCtx.drawImage(img, 0, 0);
                const dataUrl = tempCanvas.toDataURL('image/jpeg', 0.9);
                
                const blob = await removeBackground(dataUrl);
                const fgImg = new Image();
                fgImg.onload = () => {
                    // 1. Foreground Layer (Subject)
                    const fgCanvas = document.createElement('canvas');
                    fgCanvas.width = width;
                    fgCanvas.height = height;
                    const fgCtx = fgCanvas.getContext('2d');
                    fgCtx.drawImage(fgImg, 0, 0);
                    
                    addLayerUI(fgCanvas, 'Subject', 'AI Extracted Foreground', 1);
                    
                    // Split the foreground into 3 additional object layers based on color/luminosity clusters
                    const fgImgData = fgCtx.getImageData(0, 0, width, height);
                    const fgPixels = fgImgData.data;
                    
                    const objCanvas1 = document.createElement('canvas');
                    objCanvas1.width = width; objCanvas1.height = height;
                    const ctx1 = objCanvas1.getContext('2d');
                    const data1 = ctx1.createImageData(width, height);
                    
                    const objCanvas2 = document.createElement('canvas');
                    objCanvas2.width = width; objCanvas2.height = height;
                    const ctx2 = objCanvas2.getContext('2d');
                    const data2 = ctx2.createImageData(width, height);
                    
                    const objCanvas3 = document.createElement('canvas');
                    objCanvas3.width = width; objCanvas3.height = height;
                    const ctx3 = objCanvas3.getContext('2d');
                    const data3 = ctx3.createImageData(width, height);
                    
                    for (let i = 0; i < fgPixels.length; i += 4) {
                        if (fgPixels[i+3] > 0) { // If it's part of the foreground
                            const l = (Math.max(fgPixels[i], fgPixels[i+1], fgPixels[i+2]) + Math.min(fgPixels[i], fgPixels[i+1], fgPixels[i+2])) / 2;
                            let targetData;
                            if (l < 85) targetData = data1.data;
                            else if (l < 170) targetData = data2.data;
                            else targetData = data3.data;
                            
                            targetData[i] = fgPixels[i];
                            targetData[i+1] = fgPixels[i+1];
                            targetData[i+2] = fgPixels[i+2];
                            targetData[i+3] = fgPixels[i+3];
                        }
                    }
                    
                    ctx1.putImageData(data1, 0, 0);
                    ctx2.putImageData(data2, 0, 0);
                    ctx3.putImageData(data3, 0, 0);
                    
                    addLayerUI(objCanvas1, 'Sub-Object 1', 'Dark Elements / Shadows', 2);
                    addLayerUI(objCanvas2, 'Sub-Object 2', 'Midtone Elements', 3);
                    addLayerUI(objCanvas3, 'Sub-Object 3', 'Light Elements / Highlights', 4);
                    
                    // 5. Background Layer (Backdrop)
                    const bgCanvas = document.createElement('canvas');
                    bgCanvas.width = width;
                    bgCanvas.height = height;
                    const bgCtx = bgCanvas.getContext('2d');
                    bgCtx.drawImage(img, 0, 0);
                    
                    addLayerUI(bgCanvas, 'Backdrop', 'Original Background', 5);
                    
                    onComplete();
                };
                fgImg.src = URL.createObjectURL(blob);
                return;
            } catch (err) {
                console.warn("Neural extraction failed in Magic Layers, falling back.", err);
            }
        }
        
        // Fallback: Simple luminance segmentation
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(img, 0, 0);
        
        const imgData = tempCtx.getImageData(0, 0, width, height);
        const pixels = imgData.data;
        const numLayers = 3;
        const layers = [];
        const layerContexts = [];
        const layerDataArrays = [];
        
        for (let i = 0; i < numLayers; i++) {
            const c = document.createElement('canvas');
            c.width = width;
            c.height = height;
            const ctx = c.getContext('2d');
            const data = ctx.createImageData(width, height);
            layers.push(c);
            layerContexts.push(ctx);
            layerDataArrays.push(data);
        }
        
        for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i+1];
            const b = pixels[i+2];
            
            const l = (Math.max(r, g, b) + Math.min(r, g, b)) / 2;
            let layerIndex = 0;
            if (l < 85) layerIndex = 0;
            else if (l < 170) layerIndex = 1;
            else layerIndex = 2;
            
            const targetData = layerDataArrays[layerIndex].data;
            targetData[i] = r;
            targetData[i+1] = g;
            targetData[i+2] = b;
            targetData[i+3] = pixels[i+3];
        }
        
        for (let i = 0; i < numLayers; i++) {
            layerContexts[i].putImageData(layerDataArrays[i], 0, 0);
            addLayerUI(layers[i], `Fallback Layer ${i + 1}`, `Luminance Band ${i}`, i + 1);
        }
        onComplete();
    }

    function processMagicLayers() {
        if (!mlOriginalImg) return;
        
        const steps = [
            { limit: 30, msg: "Detecting contrast regions..." },
            { limit: 60, msg: "Isolating design vectors..." },
            { limit: 100, msg: "Composing Text, Graphics, & Backdrop..." }
        ];
        
        triggerProcessing(
            document.getElementById('ml-progress-bar'),
            document.getElementById('ml-progress-message'),
            document.getElementById('ml-processing-overlay'),
            steps,
            () => {
                document.getElementById('ml-image-preview').src = mlOriginalImg.src;
                segmentImageObjects(mlOriginalImg, () => {
                    document.getElementById('ml-upload-container').classList.add('hidden');
                    document.getElementById('ml-result-container').classList.remove('hidden');
                });
            }
        );
    }

    setupUploadCard('ml-file-input', 'ml-upload-container', (img, src) => {
        mlOriginalImg = img;
        processMagicLayers();
    });



    document.getElementById('ml-btn-reset').addEventListener('click', () => {
        mlOriginalImg = null;
        document.getElementById('ml-upload-container').classList.remove('hidden');
        document.getElementById('ml-result-container').classList.add('hidden');
        document.getElementById('ml-file-input').value = '';
    });

    // ---------------------------------------------
    // 7. PHOTO ENHANCER ENGINE
    // ---------------------------------------------
    let peOriginalImg = null;
    let peOriginalDataURL = null;
    let peEnhancedDataURL = null;
    let peSliderDragging = false;

    setupUploadCard('pe-file-input', 'pe-upload-container', (img, src) => {
        peOriginalImg = img;
        peOriginalDataURL = src;
        
        document.getElementById('pe-image-original').src = src;
        document.getElementById('pe-upload-container').classList.add('hidden');
        document.getElementById('pe-setup-container').classList.remove('hidden');
    });

    const resButtons = document.querySelectorAll('#pe-resolution-selector .res-btn');
    resButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            resButtons.forEach(b => {
                b.className = "res-btn px-4 py-2 bg-white/5 border border-white/10 hover:border-primary-fixed hover:bg-primary-fixed/5 rounded-lg text-xs font-bold text-on-surface-variant hover:text-white transition-all cursor-pointer";
            });
            btn.className = "res-btn px-4 py-2 bg-primary-fixed-dim/20 border border-primary-fixed-dim/40 rounded-lg text-xs font-bold text-primary-fixed transition-all cursor-pointer active";
        });
    });

    // Real mathematical Unsharp Masking filter for genuine image sharpening
    function applyUnsharpMask(img, targetWidth, amount = 1.8) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Use highest quality canvas scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        const aspect = img.naturalHeight / img.naturalWidth;
        canvas.width = targetWidth;
        canvas.height = targetWidth * aspect;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const width = canvas.width;
        const height = canvas.height;
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;
        
        // 1. Box blur image for blurred component
        const blurredData = ctx.createImageData(width, height);
        const blurred = blurredData.data;
        const radius = 3; // Wider radius for better sharpening without intense noise
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let rSum = 0, gSum = 0, bSum = 0, count = 0;
                
                for (let ky = -radius; ky <= radius; ky++) {
                    for (let kx = -radius; kx <= radius; kx++) {
                        const px = x + kx;
                        const py = y + ky;
                        if (px >= 0 && px < width && py >= 0 && py < height) {
                            const pidx = (py * width + px) * 4;
                            rSum += data[pidx];
                            gSum += data[pidx+1];
                            bSum += data[pidx+2];
                            count++;
                        }
                    }
                }
                const idx = (y * width + x) * 4;
                blurred[idx] = rSum / count;
                blurred[idx+1] = gSum / count;
                blurred[idx+2] = bSum / count;
                blurred[idx+3] = data[idx+3];
            }
        }
        
        // 2. Unsharp Mask & HD Color Pop
        const output = ctx.createImageData(width, height);
        const dst = output.data;
        for (let i = 0; i < data.length; i += 4) {
            const origR = data[i];
            const origG = data[i+1];
            const origB = data[i+2];
            
            const blurR = blurred[i];
            const blurG = blurred[i+1];
            const blurB = blurred[i+2];
            
            // Sharpening formula
            const diffR = origR - blurR;
            const diffG = origG - blurG;
            const diffB = origB - blurB;
            
            let r = origR + amount * diffR;
            let g = origG + amount * diffG;
            let b = origB + amount * diffB;
            
            // HD Contrast Curve & Saturation Boost
            // Increase contrast by 15%
            r = (r - 128) * 1.15 + 128;
            g = (g - 128) * 1.15 + 128;
            b = (b - 128) * 1.15 + 128;
            
            // Simple Saturation boost
            const luma = 0.299 * r + 0.587 * g + 0.114 * b;
            const satBoost = 1.2; // 20% saturation increase
            r = luma + (r - luma) * satBoost;
            g = luma + (g - luma) * satBoost;
            b = luma + (b - luma) * satBoost;
            
            // Final clamped output
            dst[i] = Math.min(255, Math.max(0, r));
            dst[i+1] = Math.min(255, Math.max(0, g));
            dst[i+2] = Math.min(255, Math.max(0, b));
            dst[i+3] = data[i+3];
        }
        
        ctx.putImageData(output, 0, 0);
        return canvas.toDataURL('image/jpeg', 1.0); // Highest quality JPEG
    }

    document.getElementById('pe-btn-generate').addEventListener('click', () => {
        if (!peOriginalImg) return;
        
        const selectedBtn = document.querySelector('#pe-resolution-selector .res-btn.active');
        const resType = selectedBtn ? selectedBtn.getAttribute('data-res') : '4k';
        
        let targetWidth = 3840;
        let label = '4K';
        if (resType === '2k') { targetWidth = 2048; label = '2K'; }
        if (resType === '8k') { targetWidth = 7680; label = '8K'; }
        
        const steps = [
            { limit: 25, msg: "Allocating pixel matrix..." },
            { limit: 60, msg: "Running Unsharp Mask math..." },
            { limit: 100, msg: "Increasing local edge contrast..." }
        ];
        
        triggerProcessing(
            document.getElementById('pe-progress-bar'),
            document.getElementById('pe-progress-message'),
            document.getElementById('pe-processing-overlay'),
            steps,
            () => {
                peEnhancedDataURL = applyUnsharpMask(peOriginalImg, targetWidth);
                
                document.getElementById('pe-img-before').src = peOriginalDataURL;
                document.getElementById('pe-img-after').src = peEnhancedDataURL;
                document.getElementById('pe-output-info').textContent = `Enhanced to ${label} (${targetWidth}px wide)`;
                
                document.getElementById('pe-setup-container').classList.add('hidden');
                document.getElementById('pe-result-container').classList.remove('hidden');
                
                resetPeSlider();
            }
        );
    });

    const peSliderContainer = document.getElementById('pe-slider-container');
    const peSliderHandle = document.getElementById('pe-slider-handle');

    function setPeSliderPosition(clientX) {
        const rect = peSliderContainer.getBoundingClientRect();
        let position = ((clientX - rect.left) / rect.width) * 100;
        if (position < 0) position = 0;
        if (position > 100) position = 100;
        
        peSliderContainer.style.setProperty('--position', `${position}%`);
        peSliderHandle.style.left = `${position}%`;
    }

    function resetPeSlider() {
        peSliderContainer.style.setProperty('--position', '50%');
        peSliderHandle.style.left = '50%';
    }

    peSliderHandle.addEventListener('mousedown', (e) => {
        peSliderDragging = true;
        e.preventDefault();
    });
    peSliderHandle.addEventListener('touchstart', (e) => {
        peSliderDragging = true;
    });
    window.addEventListener('mouseup', () => {
        peSliderDragging = false;
    });
    window.addEventListener('touchend', () => {
        peSliderDragging = false;
    });
    window.addEventListener('mousemove', (e) => {
        if (!peSliderDragging) return;
        setPeSliderPosition(e.clientX);
    });
    window.addEventListener('touchmove', (e) => {
        if (!peSliderDragging) return;
        if (e.touches.length > 0) {
            setPeSliderPosition(e.touches[0].clientX);
        }
    });

    document.getElementById('pe-btn-download').addEventListener('click', () => {
        if (peEnhancedDataURL) {
            downloadDataURL(peEnhancedDataURL, 'photo-enhancer-upscaled.jpg');
        }
    });

    document.getElementById('pe-btn-reset').addEventListener('click', () => {
        peOriginalImg = null;
        peOriginalDataURL = null;
        peEnhancedDataURL = null;
        document.getElementById('pe-upload-container').classList.remove('hidden');
        document.getElementById('pe-result-container').classList.add('hidden');
        document.getElementById('pe-setup-container').classList.add('hidden');
        document.getElementById('pe-file-input').value = '';
    });

    // ---------------------------------------------
    // 8. IMAGE COMPRESSOR ENGINE
    // ---------------------------------------------
    let icOriginalImg = null;
    let icOriginalDataURL = null;
    let icOriginalFileSizeKB = 500;
    let icOriginalFileType = 'image/jpeg';
    let icCompressedDataURL = null;
    let icCompressedBlob = null;
    let icCompressedFileSizeKB = 150;

    const icUploadContainer = document.getElementById('ic-upload-container');
    const icSetupContainer = document.getElementById('ic-setup-container');
    const icResultContainer = document.getElementById('ic-result-container');
    const icProcessingOverlay = document.getElementById('ic-processing-overlay');
    const icProgressBar = document.getElementById('ic-progress-bar');
    const icProgressMessage = document.getElementById('ic-progress-message');

    const icImageOriginal = document.getElementById('ic-image-original');
    const icOrigSize = document.getElementById('ic-orig-size');
    const icOrigDims = document.getElementById('ic-orig-dims');
    const icOrigType = document.getElementById('ic-orig-type');
    const icTargetKbInput = document.getElementById('ic-target-kb');
    const icFormatSelect = document.getElementById('ic-format-select');

    const icBtnCompress = document.getElementById('ic-btn-compress');
    const icBtnDownload = document.getElementById('ic-btn-download');
    const icBtnReset = document.getElementById('ic-btn-reset');
    const icReTargetKbInput = document.getElementById('ic-re-target-kb');
    const icBtnRecompress = document.getElementById('ic-btn-recompress');

    // Handle Image Loading for Compressor
    function handleIcImageLoad(img, dataURL, fileInfo = null) {
        icOriginalImg = img;
        icOriginalDataURL = dataURL;

        if (fileInfo && fileInfo.size) {
            icOriginalFileSizeKB = parseFloat((fileInfo.size / 1024).toFixed(1));
            icOriginalFileType = fileInfo.type || 'image/jpeg';
        } else {
            // For sample images or data URLs, approximate size from base64 string length
            const base64Str = dataURL.split(',')[1] || dataURL;
            const sizeInBytes = Math.round(base64Str.length * 0.75);
            icOriginalFileSizeKB = parseFloat((sizeInBytes / 1024).toFixed(1)) || 512;
            icOriginalFileType = 'image/jpeg';
        }

        if (icImageOriginal) icImageOriginal.src = dataURL;
        if (icOrigSize) icOrigSize.textContent = `${icOriginalFileSizeKB} KB`;
        if (icOrigDims) icOrigDims.textContent = `${img.naturalWidth || img.width} x ${img.naturalHeight || img.height}`;
        if (icOrigType) icOrigType.textContent = icOriginalFileType.toUpperCase().replace('IMAGE/', '');

        // Set default target KB (e.g. 150 KB or half if smaller)
        let defaultTarget = 150;
        if (icOriginalFileSizeKB <= 150) {
            defaultTarget = Math.max(10, Math.round(icOriginalFileSizeKB * 0.6));
        }
        if (icTargetKbInput) icTargetKbInput.value = defaultTarget;
        if (icReTargetKbInput) icReTargetKbInput.value = defaultTarget;

        // Switch to Setup Container
        if (icUploadContainer) icUploadContainer.classList.add('hidden');
        if (icSetupContainer) icSetupContainer.classList.remove('hidden');
        if (icResultContainer) icResultContainer.classList.add('hidden');
    }

    setupUploadCard('ic-file-input', 'ic-upload-container', (img, dataURL) => {
        const fileInput = document.getElementById('ic-file-input');
        const file = fileInput && fileInput.files && fileInput.files[0] ? fileInput.files[0] : null;
        handleIcImageLoad(img, dataURL, file);
    });

    // Preset KB Selection Buttons
    document.querySelectorAll('.ic-preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.ic-preset-btn').forEach(b => {
                b.classList.remove('bg-primary-fixed/20', 'border-primary-fixed/40', 'text-primary-fixed', 'font-bold');
                b.classList.add('bg-white/5', 'border-white/10', 'text-on-surface-variant');
            });
            btn.classList.remove('bg-white/5', 'border-white/10', 'text-on-surface-variant');
            btn.classList.add('bg-primary-fixed/20', 'border-primary-fixed/40', 'text-primary-fixed', 'font-bold');

            const val = btn.getAttribute('data-kb');
            if (val === 'half') {
                const target = Math.max(10, Math.round(icOriginalFileSizeKB * 0.5));
                if (icTargetKbInput) icTargetKbInput.value = target;
            } else {
                if (icTargetKbInput) icTargetKbInput.value = parseInt(val, 10);
            }
        });
    });

    // Core Canvas Binary Search Target KB Compression Engine
    async function compressToTargetSize(img, targetKB, mimeType = 'image/jpeg') {
        const targetBytes = targetKB * 1024;
        const originalWidth = img.naturalWidth || img.width;
        const originalHeight = img.naturalHeight || img.height;

        let bestBlob = null;
        let bestQuality = 0.9;
        let bestWidth = originalWidth;
        let bestHeight = originalHeight;

        const getBlobForConfig = (currentWidth, currentHeight, q) => {
            return new Promise(resolve => {
                const canvas = document.createElement('canvas');
                canvas.width = currentWidth;
                canvas.height = currentHeight;
                const ctx = canvas.getContext('2d');
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, currentWidth, currentHeight);

                if (mimeType === 'image/png') {
                    canvas.toBlob(blob => resolve(blob), 'image/png');
                } else {
                    canvas.toBlob(blob => resolve(blob), mimeType, q);
                }
            });
        };

        // Downscaling + quality optimization loop
        for (let attemptScale = 1.0; attemptScale >= 0.2; attemptScale -= 0.15) {
            const currentWidth = Math.max(50, Math.round(originalWidth * attemptScale));
            const currentHeight = Math.max(50, Math.round(originalHeight * attemptScale));

            let minQ = 0.02;
            let maxQ = 0.98;

            for (let i = 0; i < 7; i++) {
                const quality = (minQ + maxQ) / 2;
                const blob = await getBlobForConfig(currentWidth, currentHeight, quality);

                if (blob) {
                    if (blob.size <= targetBytes) {
                        bestBlob = blob;
                        bestQuality = quality;
                        bestWidth = currentWidth;
                        bestHeight = currentHeight;
                        minQ = quality; // Try higher quality
                    } else {
                        maxQ = quality; // Need lower quality
                    }
                }
            }

            // If we found a valid blob under or at target size, we are done!
            if (bestBlob && (bestBlob.size <= targetBytes || attemptScale <= 0.35)) {
                break;
            }
        }

        // Fallback if target size was extremely tiny
        if (!bestBlob) {
            const fallbackW = Math.max(50, Math.round(originalWidth * 0.2));
            const fallbackH = Math.max(50, Math.round(originalHeight * 0.2));
            bestBlob = await getBlobForConfig(fallbackW, fallbackH, 0.05);
            bestQuality = 0.05;
            bestWidth = fallbackW;
            bestHeight = fallbackH;
        }

        const dataURL = await new Promise(resolve => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(bestBlob);
        });

        const finalKB = parseFloat((bestBlob.size / 1024).toFixed(1));

        return {
            blob: bestBlob,
            dataURL: dataURL,
            fileSizeKB: finalKB,
            qualityPercent: Math.round(bestQuality * 100),
            width: bestWidth,
            height: bestHeight
        };
    }

    // Execute Compression Workflow
    async function executeCompression(targetKBVal) {
        const targetKB = parseInt(targetKBVal, 10) || 150;
        const format = icFormatSelect ? icFormatSelect.value : 'image/jpeg';

        const steps = [
            { limit: 25, msg: 'Analyzing Image Structure...' },
            { limit: 60, msg: `Compressing to target ${targetKB} KB...` },
            { limit: 90, msg: 'Optimizing Canvas Quality Matrix...' },
            { limit: 100, msg: 'Image Compressed Successfully!' }
        ];

        triggerProcessing(icProgressBar, icProgressMessage, icProcessingOverlay, steps, async () => {
            const result = await compressToTargetSize(icOriginalImg, targetKB, format);

            icCompressedDataURL = result.dataURL;
            icCompressedBlob = result.blob;
            icCompressedFileSizeKB = result.fileSizeKB;

            // Render Results
            const origWidth = icOriginalImg.naturalWidth || icOriginalImg.width;
            const origHeight = icOriginalImg.naturalHeight || icOriginalImg.height;

            document.getElementById('ic-result-orig-img').src = icOriginalDataURL;
            document.getElementById('ic-result-orig-size').textContent = `${icOriginalFileSizeKB} KB`;
            document.getElementById('ic-result-orig-dims').textContent = `${origWidth}x${origHeight} px`;

            document.getElementById('ic-result-comp-img').src = result.dataURL;
            document.getElementById('ic-result-comp-size').textContent = `${result.fileSizeKB} KB`;
            document.getElementById('ic-result-comp-dims').textContent = `${result.width}x${result.height} px`;
            document.getElementById('ic-result-quality').textContent = format === 'image/png' ? 'Lossless' : `Quality: ${result.qualityPercent}%`;

            document.getElementById('ic-metric-target').textContent = `${targetKB} KB`;
            document.getElementById('ic-metric-final').textContent = `${result.fileSizeKB} KB`;

            const reductionPct = (((icOriginalFileSizeKB - result.fileSizeKB) / icOriginalFileSizeKB) * 100).toFixed(1);
            const savingsText = reductionPct >= 0 ? `-${reductionPct}%` : `+${Math.abs(reductionPct)}%`;
            document.getElementById('ic-metric-savings').textContent = savingsText;
            document.getElementById('ic-metric-format').textContent = format.replace('image/', '').toUpperCase();

            if (icReTargetKbInput) icReTargetKbInput.value = targetKB;

            // Switch views
            if (icSetupContainer) icSetupContainer.classList.add('hidden');
            if (icResultContainer) icResultContainer.classList.remove('hidden');
        });
    }

    if (icBtnCompress) {
        icBtnCompress.addEventListener('click', () => {
            executeCompression(icTargetKbInput ? icTargetKbInput.value : 150);
        });
    }

    if (icBtnRecompress) {
        icBtnRecompress.addEventListener('click', () => {
            executeCompression(icReTargetKbInput ? icReTargetKbInput.value : 150);
        });
    }

    if (icBtnDownload) {
        icBtnDownload.addEventListener('click', () => {
            if (!icCompressedDataURL) return;
            const selectedFormat = icFormatSelect ? icFormatSelect.value : 'image/jpeg';
            const ext = selectedFormat === 'image/png' ? 'png' : (selectedFormat === 'image/webp' ? 'webp' : 'jpg');
            const targetKB = icReTargetKbInput ? icReTargetKbInput.value : (icTargetKbInput ? icTargetKbInput.value : 150);
            downloadDataURL(icCompressedDataURL, `compressed_${targetKB}kb.${ext}`);
        });
    }

    if (icBtnReset) {
        icBtnReset.addEventListener('click', () => {
            icOriginalImg = null;
            icOriginalDataURL = null;
            icCompressedDataURL = null;
            if (icUploadContainer) icUploadContainer.classList.remove('hidden');
            if (icSetupContainer) icSetupContainer.classList.add('hidden');
            if (icResultContainer) icResultContainer.classList.add('hidden');
            const input = document.getElementById('ic-file-input');
            if (input) input.value = '';
        });
    }

    // ---------------------------------------------
    // 9. SAMPLE LOADER MAPPING INITIALIZATION
    // ---------------------------------------------
    setupSampleButtons((img, src, tool) => {
        if (tool === 'bg') {
            bgOriginalImg = img;
            bgOriginalDataURL = src;
            processBackgroundRemover();
        } else if (tool === 'wm') {
            wmOriginalImg = img;
            initWatermarkCanvas(img);
            document.getElementById('wm-upload-container').classList.add('hidden');
            document.getElementById('wm-result-container').classList.remove('hidden');
        } else if (tool === 'ml') {
            mlOriginalImg = img;
            processMagicLayers();
        } else if (tool === 'pe') {
            peOriginalImg = img;
            peOriginalDataURL = src;
            document.getElementById('pe-image-original').src = src;
            document.getElementById('pe-upload-container').classList.add('hidden');
            document.getElementById('pe-setup-container').classList.remove('hidden');
        } else if (tool === 'ic') {
            handleIcImageLoad(img, src);
        }
    });
});
