/**
 * Limits & Continuity Module
 */
window.Module_limits = {
    title: 'Limits & Continuity',
    description: 'เรียนรู้แนวคิดพื้นฐานที่สุดของแคลคูลัส การเข้าหาค่าของฟังก์ชัน และความต่อเนื่อง',
    
    theoryHtml: `
        <div class="content-section">
            <h2>ลิมิตคืออะไร?</h2>
            <p><strong>ลิมิต (Limit)</strong> คือค่าที่ฟังก์ชัน $f(x)$ "พยายาม" จะเข้าหา เมื่อ $x$ มีค่าเข้าใกล้จุดๆ หนึ่ง</p>
            <p>เราเขียนแทนด้วยสัญลักษณ์:</p>
            <div class="math-block">
                $$\\lim_{x \\to a} f(x) = L$$
            </div>
            <p>อ่านว่า "ลิมิตของ $f(x)$ เมื่อ $x$ เข้าใกล้ $a$ มีค่าเท่ากับ $L$"</p>
            
            <div class="note-box">
                <div class="note-title">💡 สิ่งสำคัญ</div>
                <p>การหาลิมิต <strong>ไม่ได้สนใจ</strong> ว่าค่าของ $f(a)$ จะเป็นเท่าไร หรือนิยามไว้หรือไม่ เราสนใจแค่ว่าเมื่อ $x$ <em>เข้าใกล้</em> $a$ แล้ว $f(x)$ <em>เข้าใกล้</em> ค่าอะไร</p>
            </div>
        </div>

        <div class="content-section">
            <h2>ลิมิตซ้ายและลิมิตขวา</h2>
            <p>การที่ฟังก์ชันจะมีลิมิตที่จุด $a$ ได้ ลิมิตเมื่อเข้าใกล้จากทางซ้าย (ค่าน้อยกว่า $a$) และทางขวา (ค่ามากกว่า $a$) ต้องมีค่าเท่ากัน</p>
            <ul class="content-list">
                <li><strong>ลิมิตซ้าย (Left-hand limit):</strong> $\\lim_{x \\to a^-} f(x)$ เข้าใกล้ $a$ จากค่าน้อยกว่า</li>
                <li><strong>ลิมิตขวา (Right-hand limit):</strong> $\\lim_{x \\to a^+} f(x)$ เข้าใกล้ $a$ จากค่ามากกว่า</li>
            </ul>
            <div class="math-block">
                $$\\lim_{x \\to a} f(x) = L \\iff \\lim_{x \\to a^-} f(x) = \\lim_{x \\to a^+} f(x) = L$$
            </div>
        </div>

        <div class="content-section">
            <h2>ความต่อเนื่อง (Continuity)</h2>
            <p>ฟังก์ชันจะ "ต่อเนื่อง" ที่จุด $x = a$ ก็ต่อเมื่อเงื่อนไข 3 ข้อนี้เป็นจริง:</p>
            <ol class="content-list">
                <li>$f(a)$ หาค่าได้ (ฟังก์ชันนิยามที่จุด $a$)</li>
                <li>$\\lim_{x \\to a} f(x)$ หาค่าได้ (ลิมิตซ้ายเท่ากับลิมิตขวา)</li>
                <li>$\\lim_{x \\to a} f(x) = f(a)$ (ลิมิตเท่ากับค่าฟังก์ชัน)</li>
            </ol>
            
            <div class="example-box">
                <div class="example-title">📝 ตัวอย่าง:</div>
                <p>ฟังก์ชันพหุนาม (Polynomials) เช่น $f(x) = x^2 + 3x$ ต่อเนื่องทุกจุดบนจำนวนจริง เราสามารถหาลิมิตได้โดยการแทนค่า $x$ ลงไปตรงๆ ได้เลย</p>
                <div class="math-block">
                    $$\\lim_{x \\to 2} (x^2 + 3x) = (2)^2 + 3(2) = 10$$
                </div>
            </div>
        </div>
    `,
    
    interactiveHtml: `
        <div class="content-section">
            <h2>Interactive Limit Explorer: $\\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2}$</h2>
            <p>ฟังก์ชันนี้ไม่มีนิยามที่ $x=2$ (เพราะส่วนเป็นศูนย์) แต่เราสามารถหาลิมิตได้ ลากจุด 🔴 เพื่อดูว่าเกิดอะไรขึ้นเมื่อ $x$ เข้าใกล้ 2</p>
            
            <div class="graph-container">
                <div id="limit-graph-info" class="graph-info">x = 0.00, f(x) = 0.00</div>
                <canvas id="limit-canvas" class="graph-canvas"></canvas>
            </div>
            
            <div class="slider-control">
                <label>ค่า x:</label>
                <input type="range" id="limit-x-slider" min="0" max="4" step="0.01" value="0">
                <span class="slider-value" id="limit-x-val">0.00</span>
            </div>
            
            <div id="limit-feedback" class="note-box" style="display:none">
                <div class="note-title">🔍 สังเกตเห็นไหม?</div>
                <p>แม้ว่าที่ $x = 2$ ฟังก์ชันจะหาค่าไม่ได้ (เส้นกราฟเป็นรูโหว่) แต่เมื่อ $x$ เข้าใกล้ 2 จากทั้งซ้ายและขวา ค่า $f(x)$ จะวิ่งเข้าหา 4</p>
            </div>
        </div>
    `,
    
    initInteractive: function() {
        const canvas = document.getElementById('limit-canvas');
        if (!canvas) return;
        
        const slider = document.getElementById('limit-x-slider');
        const xVal = document.getElementById('limit-x-val');
        const info = document.getElementById('limit-graph-info');
        const feedback = document.getElementById('limit-feedback');
        
        // Define function: f(x) = (x^2 - 4)/(x - 2)
        // Mathematically simplifies to x + 2 for x != 2
        const fn = (x) => {
            if (Math.abs(x - 2) < 0.001) return NaN; // Simulate the hole
            return (x*x - 4) / (x - 2);
        };
        
        const grapher = new Grapher(canvas, {
            bounds: { xMin: 0, xMax: 4, yMin: 0, yMax: 6 },
            onPointDrag: (id, x, y) => {
                updateUI(x);
            }
        });
        
        // Plot the function
        grapher.addFunction(fn, '#3b82f6', 2);
        
        // Add the "hole" at x=2
        grapher.addPoint(2, 4, { 
            color: '#06060f', // Match background
            radius: 5,
            interactive: false 
        });
        
        // Add interactive point
        grapher.addPoint(0, 2, {
            id: 'p1',
            color: '#ef4444',
            radius: 6,
            interactive: true,
            constrainToFunction: fn
        });
        
        // Add reference lines for x=2, y=4
        const drawRefs = () => {
            const ctx = grapher.ctx;
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.setLineDash([5, 5]);
            
            // vertical line at x=2
            ctx.moveTo(grapher.mapX(2), grapher.mapY(0));
            ctx.lineTo(grapher.mapX(2), grapher.mapY(6));
            
            // horizontal line at y=4
            ctx.moveTo(grapher.mapX(0), grapher.mapY(4));
            ctx.lineTo(grapher.mapX(4), grapher.mapY(4));
            
            ctx.stroke();
            ctx.setLineDash([]);
        };
        
        // Override draw to add our reference lines
        const originalDraw = grapher.draw.bind(grapher);
        grapher.draw = () => {
            originalDraw();
            drawRefs();
        };
        
        grapher.draw();
        
        // UI sync function
        function updateUI(x) {
            slider.value = x;
            xVal.textContent = x.toFixed(2);
            
            if (Math.abs(x - 2) < 0.05) {
                // When very close to 2
                info.innerHTML = `x = 2.00<br>f(x) = <span style="color:#ef4444">หาค่าไม่ได้ (0/0)</span>`;
                feedback.style.display = 'block';
            } else {
                const y = fn(x);
                info.innerHTML = `x = ${x.toFixed(2)}<br>f(x) = ${y.toFixed(2)}`;
            }
        }
        
        // Slider listener
        slider.addEventListener('input', (e) => {
            const x = parseFloat(e.target.value);
            
            // Find the interactive point and update it
            const p = grapher.points.find(p => p.id === 'p1');
            if (p) {
                p.x = x;
                p.y = Math.abs(x - 2) < 0.001 ? 4 : fn(x); // Put point at hole if exactly 2
                grapher.draw();
                updateUI(x);
            }
        });
    }
};
