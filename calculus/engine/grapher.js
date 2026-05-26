/**
 * Grapher Engine - Canvas-based Interactive Graphing
 */
class Grapher {
    constructor(canvasId, options = {}) {
        const canvas = typeof canvasId === 'string' ? document.getElementById(canvasId) : canvasId;
        if (!canvas) {
            console.error("Canvas element not found");
            return;
        }

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Handle high DPI displays
        this.pixelRatio = window.devicePixelRatio || 1;
        
        // Default bounds
        this.bounds = options.bounds || {
            xMin: -10,
            xMax: 10,
            yMin: -10,
            yMax: 10
        };

        // Graphing state
        this.functions = [];
        this.points = [];
        this.areas = [];
        this.tangents = [];
        this.secants = [];
        this.vectorFields = [];
        
        // Interaction state
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };
        this.interactivePoint = null;
        this.onPointDrag = options.onPointDrag || null;
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        // Add event listeners for interaction
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('mouseleave', this.handleMouseUp.bind(this));
        
        // Touch support
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                this.handleMouseDown({
                    clientX: touch.clientX,
                    clientY: touch.clientY,
                    button: 0
                });
            }
        }, { passive: false });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                this.handleMouseMove({
                    clientX: touch.clientX,
                    clientY: touch.clientY
                });
            }
        }, { passive: false });
        
        this.canvas.addEventListener('touchend', this.handleMouseUp.bind(this));
    }

    resize() {
        const rect = this.canvas.getBoundingClientRect();
        this.width = rect.width;
        this.height = rect.height;
        
        this.canvas.width = this.width * this.pixelRatio;
        this.canvas.height = this.height * this.pixelRatio;
        
        this.ctx.scale(this.pixelRatio, this.pixelRatio);
        this.draw();
    }

    // Coordinate mapping functions
    mapX(x) {
        return ((x - this.bounds.xMin) / (this.bounds.xMax - this.bounds.xMin)) * this.width;
    }

    mapY(y) {
        return this.height - ((y - this.bounds.yMin) / (this.bounds.yMax - this.bounds.yMin)) * this.height;
    }

    unmapX(screenX) {
        return this.bounds.xMin + (screenX / this.width) * (this.bounds.xMax - this.bounds.xMin);
    }

    unmapY(screenY) {
        return this.bounds.yMin + ((this.height - screenY) / this.height) * (this.bounds.yMax - this.bounds.yMin);
    }

    // Drawing methods
    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        this.drawGrid();
        this.drawAxes();
        
        // Draw vector fields (differential equations)
        this.vectorFields.forEach(vf => this.drawVectorField(vf));
        
        // Draw areas (integrals)
        this.areas.forEach(area => this.drawArea(area));
        
        // Draw functions
        this.functions.forEach(func => this.drawFunction(func));
        
        // Draw tangents
        this.tangents.forEach(tan => this.drawTangent(tan));
        
        // Draw secants
        this.secants.forEach(sec => this.drawSecant(sec));
        
        // Draw points
        this.points.forEach(point => this.drawPoint(point));
    }

    drawGrid() {
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        this.ctx.lineWidth = 1;

        // Vertical lines
        for (let x = Math.ceil(this.bounds.xMin); x <= Math.floor(this.bounds.xMax); x++) {
            const screenX = this.mapX(x);
            this.ctx.moveTo(screenX, 0);
            this.ctx.lineTo(screenX, this.height);
        }

        // Horizontal lines
        for (let y = Math.ceil(this.bounds.yMin); y <= Math.floor(this.bounds.yMax); y++) {
            const screenY = this.mapY(y);
            this.ctx.moveTo(0, screenY);
            this.ctx.lineTo(this.width, screenY);
        }

        this.ctx.stroke();
    }

    drawAxes() {
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.lineWidth = 1.5;

        // X-axis
        const y0 = this.mapY(0);
        if (y0 >= 0 && y0 <= this.height) {
            this.ctx.moveTo(0, y0);
            this.ctx.lineTo(this.width, y0);
        }

        // Y-axis
        const x0 = this.mapX(0);
        if (x0 >= 0 && x0 <= this.width) {
            this.ctx.moveTo(x0, 0);
            this.ctx.lineTo(x0, this.height);
        }

        this.ctx.stroke();

        // Draw ticks and labels
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.font = '10px Inter, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'top';

        // X-axis ticks
        if (y0 >= 0 && y0 <= this.height) {
            const labelY = y0 + 5;
            for (let x = Math.ceil(this.bounds.xMin); x <= Math.floor(this.bounds.xMax); x++) {
                if (x === 0) continue;
                const screenX = this.mapX(x);
                this.ctx.fillText(x.toString(), screenX, labelY);
            }
        }

        // Y-axis ticks
        this.ctx.textAlign = 'right';
        this.ctx.textBaseline = 'middle';
        if (x0 >= 0 && x0 <= this.width) {
            const labelX = x0 - 5;
            for (let y = Math.ceil(this.bounds.yMin); y <= Math.floor(this.bounds.yMax); y++) {
                if (y === 0) continue;
                const screenY = this.mapY(y);
                this.ctx.fillText(y.toString(), labelX, screenY);
            }
        }
    }

    drawFunction(funcObj) {
        const { fn, color = '#3b82f6', width = 2 } = funcObj;
        
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
        
        let isFirst = true;
        const step = (this.bounds.xMax - this.bounds.xMin) / this.width;
        
        for (let x = this.bounds.xMin; x <= this.bounds.xMax; x += step) {
            const y = typeof fn === 'string' ? MathEngine.evaluate(fn, x) : fn(x);
            
            // Skip invalid values or huge discontinuities
            if (isNaN(y) || !isFinite(y)) {
                isFirst = true;
                continue;
            }
            
            const screenX = this.mapX(x);
            const screenY = this.mapY(y);
            
            // Basic asymptote detection - if distance between points is too large, don't connect
            if (!isFirst) {
                const prevY = typeof fn === 'string' ? MathEngine.evaluate(fn, x - step) : fn(x - step);
                const screenPrevY = this.mapY(prevY);
                if (Math.abs(screenY - screenPrevY) > this.height) {
                    isFirst = true;
                }
            }
            
            if (isFirst) {
                this.ctx.moveTo(screenX, screenY);
                isFirst = false;
            } else {
                this.ctx.lineTo(screenX, screenY);
            }
        }
        
        this.ctx.stroke();
    }

    drawTangent(tanObj) {
        const { fn, x, color = '#f59e0b', width = 1.5, length = 3 } = tanObj;
        
        const y = typeof fn === 'string' ? MathEngine.evaluate(fn, x) : fn(x);
        
        // Approximate derivative
        let m;
        if (typeof fn === 'string') {
            m = MathEngine.derivativeAt(fn, x);
        } else {
            const h = 0.0001;
            m = (fn(x + h) - fn(x - h)) / (2 * h);
        }
        
        // Point-slope form: y - y1 = m(x - x1)
        // y = m(x - x1) + y1
        const x1 = x - length;
        const y1 = m * (x1 - x) + y;
        
        const x2 = x + length;
        const y2 = m * (x2 - x) + y;
        
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
        this.ctx.setLineDash([5, 5]); // Dashed line
        this.ctx.moveTo(this.mapX(x1), this.mapY(y1));
        this.ctx.lineTo(this.mapX(x2), this.mapY(y2));
        this.ctx.stroke();
        this.ctx.setLineDash([]); // Reset
    }

    drawSecant(secObj) {
        const { fn, x1, x2, color = '#ec4899', width = 1.5 } = secObj;
        
        const y1 = typeof fn === 'string' ? MathEngine.evaluate(fn, x1) : fn(x1);
        const y2 = typeof fn === 'string' ? MathEngine.evaluate(fn, x2) : fn(x2);
        
        // Extend the line beyond the points
        const m = (y2 - y1) / (x2 - x1);
        const dx = (this.bounds.xMax - this.bounds.xMin) * 0.1;
        
        const extX1 = x1 - dx;
        const extY1 = m * (extX1 - x1) + y1;
        
        const extX2 = x2 + dx;
        const extY2 = m * (extX2 - x2) + y2;
        
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = width;
        this.ctx.setLineDash([5, 5]);
        this.ctx.moveTo(this.mapX(extX1), this.mapY(extY1));
        this.ctx.lineTo(this.mapX(extX2), this.mapY(extY2));
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }

    drawArea(areaObj) {
        const { fn, xMin, xMax, type = 'fill', color = 'rgba(59, 130, 246, 0.2)', rects = 0 } = areaObj;
        
        const step = (this.bounds.xMax - this.bounds.xMin) / this.width;
        
        if (type === 'fill') {
            this.ctx.beginPath();
            this.ctx.fillStyle = color;
            
            this.ctx.moveTo(this.mapX(xMin), this.mapY(0));
            
            for (let x = xMin; x <= xMax; x += step) {
                const y = typeof fn === 'string' ? MathEngine.evaluate(fn, x) : fn(x);
                this.ctx.lineTo(this.mapX(x), this.mapY(y));
            }
            
            this.ctx.lineTo(this.mapX(xMax), this.mapY(0));
            this.ctx.closePath();
            this.ctx.fill();
            
            // Draw boundary lines
            this.ctx.beginPath();
            this.ctx.strokeStyle = color.replace(/[\d.]+\)$/g, '0.8)'); // Make it more opaque
            this.ctx.moveTo(this.mapX(xMin), this.mapY(0));
            this.ctx.lineTo(this.mapX(xMin), this.mapY(typeof fn === 'string' ? MathEngine.evaluate(fn, xMin) : fn(xMin)));
            this.ctx.moveTo(this.mapX(xMax), this.mapY(0));
            this.ctx.lineTo(this.mapX(xMax), this.mapY(typeof fn === 'string' ? MathEngine.evaluate(fn, xMax) : fn(xMax)));
            this.ctx.stroke();
        } 
        else if (type === 'riemann-left' || type === 'riemann-right' || type === 'riemann-mid') {
            if (rects <= 0) return;
            
            const dx = (xMax - xMin) / rects;
            this.ctx.fillStyle = color;
            this.ctx.strokeStyle = color.replace(/[\d.]+\)$/g, '0.8)');
            this.ctx.lineWidth = 1;
            
            for (let i = 0; i < rects; i++) {
                let evalX;
                if (type === 'riemann-left') evalX = xMin + i * dx;
                else if (type === 'riemann-right') evalX = xMin + (i + 1) * dx;
                else evalX = xMin + (i + 0.5) * dx; // mid
                
                const y = typeof fn === 'string' ? MathEngine.evaluate(fn, evalX) : fn(evalX);
                
                const rectX = this.mapX(xMin + i * dx);
                const rectY = this.mapY(y > 0 ? y : 0);
                const rectW = this.mapX(xMin + (i + 1) * dx) - rectX;
                const rectH = Math.abs(this.mapY(y) - this.mapY(0));
                
                this.ctx.fillRect(rectX, rectY, rectW, rectH);
                this.ctx.strokeRect(rectX, rectY, rectW, rectH);
            }
        }
    }

    drawVectorField(vfObj) {
        const { fnYprime, spacing = 1, length = 0.5, color = 'rgba(6, 182, 212, 0.6)' } = vfObj;
        
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 1;
        
        for (let x = Math.ceil(this.bounds.xMin); x <= Math.floor(this.bounds.xMax); x += spacing) {
            for (let y = Math.ceil(this.bounds.yMin); y <= Math.floor(this.bounds.yMax); y += spacing) {
                // dy/dx value
                const m = typeof fnYprime === 'string' 
                    ? MathEngine.evaluate(fnYprime.replace(/y/g, `(${y})`), x) 
                    : fnYprime(x, y);
                
                if (isNaN(m) || !isFinite(m)) continue;
                
                // Angle of slope
                const theta = Math.atan(m);
                
                // Draw segment centered at (x,y)
                const dx = (length / 2) * Math.cos(theta);
                const dy = (length / 2) * Math.sin(theta);
                
                this.ctx.beginPath();
                this.ctx.moveTo(this.mapX(x - dx), this.mapY(y - dy));
                this.ctx.lineTo(this.mapX(x + dx), this.mapY(y + dy));
                this.ctx.stroke();
            }
        }
    }

    drawPoint(pointObj) {
        const { x, y, color = '#ffffff', radius = 4, label = '', interactive = false, id = null } = pointObj;
        
        const screenX = this.mapX(x);
        const screenY = this.mapY(y);
        
        // Draw glow for interactive points
        if (interactive) {
            this.ctx.beginPath();
            this.ctx.arc(screenX, screenY, radius * 2.5, 0, Math.PI * 2);
            this.ctx.fillStyle = color.replace(')', ', 0.3)').replace('rgb', 'rgba');
            // Hack for hex
            if (color.startsWith('#')) {
                this.ctx.fillStyle = `${color}40`; // 25% opacity hex
            }
            this.ctx.fill();
        }
        
        // Draw point
        this.ctx.beginPath();
        this.ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        
        // Draw label
        if (label) {
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '12px Inter, sans-serif';
            this.ctx.textAlign = 'left';
            this.ctx.textBaseline = 'bottom';
            this.ctx.fillText(label, screenX + radius + 4, screenY - radius - 4);
        }
        
        // Save interactivity data
        if (interactive) {
            pointObj._screenX = screenX;
            pointObj._screenY = screenY;
        }
    }

    // Interaction handlers
    handleMouseDown(e) {
        if (e.button !== 0 && e.type !== 'touchstart') return;
        
        const rect = this.canvas.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        
        const mouseX = clientX - rect.left;
        const mouseY = clientY - rect.top;
        
        // Check if clicked on an interactive point
        const hitRadius = 15; // Generous hit area
        
        this.interactivePoint = null;
        
        for (let i = this.points.length - 1; i >= 0; i--) {
            const p = this.points[i];
            if (p.interactive && p._screenX !== undefined) {
                const dx = mouseX - p._screenX;
                const dy = mouseY - p._screenY;
                if (dx*dx + dy*dy <= hitRadius*hitRadius) {
                    this.interactivePoint = p;
                    break;
                }
            }
        }
        
        if (this.interactivePoint) {
            this.isDragging = true;
            this.canvas.style.cursor = 'grabbing';
        }
    }
    
    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const mouseX = clientX - rect.left;
        
        // Update cursor
        if (!this.isDragging) {
            let hoveringPoint = false;
            for (let i = 0; i < this.points.length; i++) {
                const p = this.points[i];
                if (p.interactive && p._screenX !== undefined) {
                    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
                    const mouseY = clientY - rect.top;
                    const dx = mouseX - p._screenX;
                    const dy = mouseY - p._screenY;
                    if (dx*dx + dy*dy <= 225) { // 15^2
                        hoveringPoint = true;
                        break;
                    }
                }
            }
            this.canvas.style.cursor = hoveringPoint ? 'grab' : 'crosshair';
            return;
        }
        
        // Dragging logic
        if (this.isDragging && this.interactivePoint) {
            const newX = this.unmapX(mouseX);
            
            // Constrain to bounds
            const constrainedX = Math.max(this.bounds.xMin, Math.min(this.bounds.xMax, newX));
            
            this.interactivePoint.x = constrainedX;
            
            // If the point is constrained to a function, update its y
            if (this.interactivePoint.constrainToFunction !== undefined) {
                const fn = this.interactivePoint.constrainToFunction;
                this.interactivePoint.y = typeof fn === 'string' 
                    ? MathEngine.evaluate(fn, constrainedX) 
                    : fn(constrainedX);
            }
            
            this.draw();
            
            if (this.onPointDrag) {
                this.onPointDrag(this.interactivePoint.id, constrainedX, this.interactivePoint.y);
            }
        }
    }
    
    handleMouseUp() {
        if (this.isDragging) {
            this.isDragging = false;
            this.interactivePoint = null;
            this.canvas.style.cursor = 'crosshair';
        }
    }

    // API methods to manage data
    addFunction(fn, color, width) {
        this.functions.push({ fn, color, width });
        this.draw();
        return this;
    }
    
    addPoint(x, y, options = {}) {
        this.points.push({ x, y, ...options });
        this.draw();
        return this;
    }
    
    addTangent(fn, x, options = {}) {
        this.tangents.push({ fn, x, ...options });
        this.draw();
        return this;
    }
    
    addArea(fn, xMin, xMax, options = {}) {
        this.areas.push({ fn, xMin, xMax, ...options });
        this.draw();
        return this;
    }
    
    addVectorField(fnYprime, options = {}) {
        this.vectorFields.push({ fnYprime, ...options });
        this.draw();
        return this;
    }
    
    clear() {
        this.functions = [];
        this.points = [];
        this.areas = [];
        this.tangents = [];
        this.secants = [];
        this.vectorFields = [];
        this.draw();
        return this;
    }
    
    setBounds(bounds) {
        this.bounds = { ...this.bounds, ...bounds };
        this.draw();
        return this;
    }
}
