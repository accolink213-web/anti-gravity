/**
 * Derivatives Module
 */
window.Module_derivatives = {
    title: 'Derivatives',
    description: 'อัตราการเปลี่ยนแปลง, เส้นสัมผัสโค้ง, และกฎต่างๆ ในการหาอนุพันธ์',
    
    theoryHtml: `
        <div class="content-section">
            <h2>อนุพันธ์ (Derivative) คืออะไร?</h2>
            <p><strong>อนุพันธ์</strong> คือเครื่องมือในการหา "อัตราการเปลี่ยนแปลงขณะใดขณะหนึ่ง" (Instantaneous rate of change) หรือความชันของเส้นสัมผัสเส้นโค้ง ณ จุดใดจุดหนึ่ง</p>
            
            <p>นิยามของอนุพันธ์สร้างมาจากเรื่องลิมิต:</p>
            <div class="math-block">
                $$f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$$
            </div>
            
            <p>สัญลักษณ์ที่ใช้แทนอนุพันธ์:</p>
            <ul class="content-list">
                <li>$f'(x)$ (อ่านว่า f-prime ของ x)</li>
                <li>$\\frac{dy}{dx}$ (สัญลักษณ์ของ Leibniz)</li>
                <li>$y'$</li>
            </ul>
        </div>

        <div class="content-section">
            <h2>กฎพื้นฐานของการหาอนุพันธ์ (Derivative Rules)</h2>
            <table class="content-table">
                <thead>
                    <tr>
                        <th>ชื่อกฎ</th>
                        <th>ฟังก์ชัน $f(x)$</th>
                        <th>อนุพันธ์ $f'(x)$</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>ค่าคงที่ (Constant)</td>
                        <td>$c$ (ค่าคงที่)</td>
                        <td>$0$</td>
                    </tr>
                    <tr>
                        <td>กฎกำลัง (Power Rule)</td>
                        <td>$x^n$</td>
                        <td>$nx^{n-1}$</td>
                    </tr>
                    <tr>
                        <td>เอกซ์โพเนนเชียล</td>
                        <td>$e^x$</td>
                        <td>$e^x$</td>
                    </tr>
                    <tr>
                        <td>ลอการิทึม</td>
                        <td>$\\ln(x)$</td>
                        <td>$\\frac{1}{x}$</td>
                    </tr>
                    <tr>
                        <td>ไซน์ (Sine)</td>
                        <td>$\\sin(x)$</td>
                        <td>$\\cos(x)$</td>
                    </tr>
                    <tr>
                        <td>โคไซน์ (Cosine)</td>
                        <td>$\\cos(x)$</td>
                        <td>$-\\sin(x)$</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="content-section">
            <h2>กฎสำหรับฟังก์ชันที่ซับซ้อนขึ้น</h2>
            
            <div class="formula-highlight">
                <div class="formula-label">Product Rule (ผลคูณ)</div>
                <div class="math-inline">$$(uv)' = u'v + uv'$$</div>
                <p style="font-size: 0.85rem; color: var(--text-tertiary); margin-top: 0.5rem">หน้า ดิฟหลัง + หลัง ดิฟหน้า</p>
            </div>
            
            <div class="formula-highlight">
                <div class="formula-label">Quotient Rule (ผลหาร)</div>
                <div class="math-inline">$$\\left(\\frac{u}{v}\\right)' = \\frac{u'v - uv'}{v^2}$$</div>
                <p style="font-size: 0.85rem; color: var(--text-tertiary); margin-top: 0.5rem">(ล่าง ดิฟบน - บน ดิฟล่าง) / ล่างกำลังสอง</p>
            </div>
            
            <div class="formula-highlight">
                <div class="formula-label">Chain Rule (กฎลูกโซ่)</div>
                <div class="math-inline">$$\\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx}$$</div>
                <p style="font-size: 0.85rem; color: var(--text-tertiary); margin-top: 0.5rem">สำหรับการหาอนุพันธ์ฟังก์ชันซ้อนฟังก์ชัน (ดิฟนอก ดิฟใน)</p>
            </div>
        </div>
    `,
    
    interactiveHtml: `
        <div class="content-section">
            <h2>เส้นสัมผัสโค้ง (Tangent Line) และความชัน</h2>
            <p>ลากจุด 🔴 เพื่อดูการเปลี่ยนแปลงความชันของเส้นสัมผัสโค้ง $f(x) = \\sin(x)$ ค่าความชันนี้ก็คือค่าของอนุพันธ์ $f'(x)$ นั่นเอง</p>
            
            <div class="graph-container">
                <div id="deriv-graph-info" class="graph-info">x = 0.00, slope = 1.00</div>
                <canvas id="deriv-canvas" class="graph-canvas"></canvas>
            </div>
            
            <div class="slider-control">
                <label>ค่า x:</label>
                <input type="range" id="deriv-x-slider" min="-6" max="6" step="0.1" value="0">
                <span class="slider-value" id="deriv-x-val">0.0</span>
            </div>
            
            <div class="example-box mt-lg">
                <div class="example-title">ความสัมพันธ์ระหว่าง $f(x)$ และ $f'(x)$</div>
                <p>สังเกตว่าเมื่อกราฟ $\\sin(x)$ อยู่ที่จุดสูงสุดหรือต่ำสุด ความชันของเส้นสัมผัสจะเป็น <strong style="color:var(--accent-red)">0</strong> (เส้นอยู่ในแนวนอน) ซึ่งตรงกับค่าของ $\\cos(x) = 0$ พอดี!</p>
            </div>
        </div>
    `,
    
    initInteractive: function() {
        const canvas = document.getElementById('deriv-canvas');
        if (!canvas) return;
        
        const slider = document.getElementById('deriv-x-slider');
        const xVal = document.getElementById('deriv-x-val');
        const info = document.getElementById('deriv-graph-info');
        
        const fn = (x) => Math.sin(x);
        const dfn = (x) => Math.cos(x); // Derivative
        
        const grapher = new Grapher(canvas, {
            bounds: { xMin: -6, xMax: 6, yMin: -2.5, yMax: 2.5 },
            onPointDrag: (id, x, y) => {
                updateUI(x);
            }
        });
        
        // Plot f(x)
        grapher.addFunction(fn, '#3b82f6', 2);
        
        // Interactive point
        grapher.addPoint(0, 0, {
            id: 'p1',
            color: '#ef4444',
            radius: 6,
            interactive: true,
            constrainToFunction: fn
        });
        
        // Custom draw function to animate the tangent line
        const originalDraw = grapher.draw.bind(grapher);
        grapher.draw = () => {
            originalDraw();
            
            const p = grapher.points.find(p => p.id === 'p1');
            if (p) {
                const x = p.x;
                const y = p.y;
                const m = dfn(x);
                
                // Draw tangent line
                const ctx = grapher.ctx;
                ctx.beginPath();
                ctx.strokeStyle = '#f59e0b'; // Amber
                ctx.lineWidth = 2;
                
                const length = 2.5; // length in graph units
                
                // point 1 (left)
                const x1 = x - length;
                const y1 = m * (x1 - x) + y;
                
                // point 2 (right)
                const x2 = x + length;
                const y2 = m * (x2 - x) + y;
                
                ctx.moveTo(grapher.mapX(x1), grapher.mapY(y1));
                ctx.lineTo(grapher.mapX(x2), grapher.mapY(y2));
                ctx.stroke();
                
                // Plot the derivative function lightly in background
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)'; // Green, dim
                ctx.lineWidth = 2;
                
                const step = (grapher.bounds.xMax - grapher.bounds.xMin) / grapher.width;
                let first = true;
                for (let px = grapher.bounds.xMin; px <= grapher.bounds.xMax; px += step) {
                    const py = dfn(px);
                    if (first) {
                        ctx.moveTo(grapher.mapX(px), grapher.mapY(py));
                        first = false;
                    } else {
                        ctx.lineTo(grapher.mapX(px), grapher.mapY(py));
                    }
                }
                ctx.stroke();
                
                // Point on derivative curve
                const dx = grapher.mapX(x);
                const dy = grapher.mapY(m);
                
                ctx.beginPath();
                ctx.arc(dx, dy, 4, 0, Math.PI * 2);
                ctx.fillStyle = '#10b981';
                ctx.fill();
                
                // Dashed line connecting them
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(255,255,255,0.2)';
                ctx.setLineDash([3, 3]);
                ctx.moveTo(grapher.mapX(x), grapher.mapY(y));
                ctx.lineTo(dx, dy);
                ctx.stroke();
                ctx.setLineDash([]);
            }
        };
        
        grapher.draw();
        
        function updateUI(x) {
            slider.value = x;
            xVal.textContent = x.toFixed(1);
            
            const slope = dfn(x);
            info.innerHTML = `x = ${x.toFixed(2)}<br>ความชัน f'(x) = <span style="color:${slope >= 0 ? '#10b981' : '#ef4444'}">${slope.toFixed(2)}</span>`;
        }
        
        slider.addEventListener('input', (e) => {
            const x = parseFloat(e.target.value);
            const p = grapher.points.find(p => p.id === 'p1');
            if (p) {
                p.x = x;
                p.y = fn(x);
                grapher.draw();
                updateUI(x);
            }
        });
    }
};
