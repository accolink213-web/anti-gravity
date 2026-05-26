/**
 * Applications of Derivatives Module
 */
window.Module_applications = {
    title: 'Applications of Derivatives',
    description: 'การประยุกต์ใช้อนุพันธ์ในการหาค่าสูงสุด-ต่ำสุด, Optimization, และการสร้างกราฟ',
    
    theoryHtml: `
        <div class="content-section">
            <h2>จุดวิกฤต (Critical Points)</h2>
            <p>จุดวิกฤตคือจุดที่ความชันของเส้นสัมผัสโค้งเป็นศูนย์ (แนวนอน) หรือหาค่าความชันไม่ได้</p>
            <p>เราหาจุดวิกฤตโดยการแก้สมการ: <strong style="color:var(--primary-light)">$f'(x) = 0$</strong> หรือหาจุดที่ $f'(x)$ ไม่มีนิยาม</p>
            
            <div class="note-box">
                <div class="note-title">💡 ความสำคัญ</div>
                <p>จุดสูงสุดสัมพัทธ์ (Relative Maximum) และจุดต่ำสุดสัมพัทธ์ (Relative Minimum) จะเกิดขึ้นที่จุดวิกฤตเสมอ!</p>
            </div>
        </div>

        <div class="content-section">
            <h2>การทดสอบค่าสุดวิสัย (Extrema Tests)</h2>
            
            <h3>1. First Derivative Test (การทดสอบด้วยอนุพันธ์อันดับ 1)</h3>
            <p>สมมติว่า $c$ เป็นจุดวิกฤต:</p>
            <ul class="content-list">
                <li>ถ้า $f'(x)$ เปลี่ยนจาก <strong>บวก (+)</strong> เป็น <strong>ลบ (-)</strong> ผ่าน $c$ แล้ว $f(c)$ เป็น <strong>ค่าสูงสุดสัมพัทธ์</strong></li>
                <li>ถ้า $f'(x)$ เปลี่ยนจาก <strong>ลบ (-)</strong> เป็น <strong>บวก (+)</strong> ผ่าน $c$ แล้ว $f(c)$ เป็น <strong>ค่าต่ำสุดสัมพัทธ์</strong></li>
            </ul>
            
            <h3 class="mt-lg">2. Second Derivative Test (การทดสอบด้วยอนุพันธ์อันดับ 2)</h3>
            <p>เราสามารถใช้อนุพันธ์อันดับสอง $f''(x)$ เพื่อทดสอบจุดวิกฤต $c$ ได้:</p>
            <ul class="content-list">
                <li>ถ้า $f''(c) > 0$ (โค้งหงาย ∪) $\\rightarrow$ เป็น <strong>ค่าต่ำสุดสัมพัทธ์</strong></li>
                <li>ถ้า $f''(c) < 0$ (โค้งคว่ำ ∩) $\\rightarrow$ เป็น <strong>ค่าสูงสุดสัมพัทธ์</strong></li>
                <li>ถ้า $f''(c) = 0$ $\\rightarrow$ สรุปไม่ได้ (ต้องกลับไปใช้ First Derivative Test)</li>
            </ul>
        </div>
        
        <div class="content-section">
            <h2>ปัญหา Optimization (การหาค่าสูงสุด-ต่ำสุด)</h2>
            <p>ปัญหาคลาสสิกของแคลคูลัสคือการพยายามหาว่า "ต้องตั้งค่าเท่าไร ถึงจะได้ผลลัพธ์ที่ดีที่สุด (มากสุด หรือ น้อยสุด)"</p>
            <p><strong>ขั้นตอนการแก้ปัญหา:</strong></p>
            <ol class="content-list">
                <li>สร้างสมการตัวแปรเดียวที่ต้องการหาค่าสูงสุด/ต่ำสุด</li>
                <li>หาโดเมน (ขอบเขตที่เป็นไปได้) ของตัวแปร</li>
                <li>หาอนุพันธ์และจับเท่ากับศูนย์ เพื่อหาจุดวิกฤต</li>
                <li>ทดสอบว่าจุดนั้นให้ค่าสูงสุดหรือต่ำสุดตามที่ต้องการ</li>
            </ol>
        </div>
    `,
    
    interactiveHtml: `
        <div class="content-section">
            <h2>Interactive Optimization: การทำกล่องให้มีปริมาตรมากที่สุด</h2>
            <p>มีกระดาษแข็งขนาด 20x15 นิ้ว ต้องการตัดมุมทั้งสี่เป็นรูปสี่เหลี่ยมจัตุรัสขนาด $x \\times x$ นิ้ว แล้วพับขึ้นมาเป็นกล่องที่ไม่มีฝา</p>
            <p>ต้องตัดมุม $x$ ขนาดเท่าไร <strong>ปริมาตรกล่องถึงจะมากที่สุด?</strong> ลากปรับค่า $x$ เพื่อหาคำตอบ!</p>
            
            <div class="graph-container">
                <div id="opt-graph-info" class="graph-info">x = 0.00<br>Volume = 0.00</div>
                <canvas id="opt-canvas" class="graph-canvas"></canvas>
            </div>
            
            <div class="slider-control">
                <label>ค่า x:</label>
                <input type="range" id="opt-x-slider" min="0" max="7.5" step="0.1" value="0">
                <span class="slider-value" id="opt-x-val">0.0</span>
            </div>
            
            <div id="opt-success" class="quiz-feedback correct mt-md">
                <strong>🎉 ยอดเยี่ยม!</strong> คุณเจอจุดที่ให้ปริมาตรสูงสุดแล้ว ($x \\approx 2.83$)<br>
                สมการปริมาตรคือ $V(x) = x(20-2x)(15-2x)$<br>
                การหาจุดสูงสุดทางคณิตศาสตร์คือการแก้สมการ $V'(x) = 12x^2 - 140x + 300 = 0$
            </div>
        </div>
    `,
    
    initInteractive: function() {
        const canvas = document.getElementById('opt-canvas');
        if (!canvas) return;
        
        const slider = document.getElementById('opt-x-slider');
        const xVal = document.getElementById('opt-x-val');
        const info = document.getElementById('opt-graph-info');
        const success = document.getElementById('opt-success');
        
        // V(x) = x * (20-2x) * (15-2x)
        const fn = (x) => x * (20 - 2*x) * (15 - 2*x);
        const dfn = (x) => 12*x*x - 140*x + 300;
        
        const grapher = new Grapher(canvas, {
            bounds: { xMin: -1, xMax: 8, yMin: -50, yMax: 400 },
            onPointDrag: (id, x, y) => {
                updateUI(x);
            }
        });
        
        // Plot V(x)
        grapher.addFunction(fn, '#a78bfa', 3); // Purple line
        
        // Add interactive point
        grapher.addPoint(0, 0, {
            id: 'p1',
            color: '#ef4444',
            radius: 6,
            interactive: true,
            constrainToFunction: fn
        });
        
        const originalDraw = grapher.draw.bind(grapher);
        grapher.draw = () => {
            originalDraw();
            
            const p = grapher.points.find(p => p.id === 'p1');
            if (p) {
                const x = p.x;
                const v = p.y;
                const ctx = grapher.ctx;
                
                // Shade area under curve up to x to make it look like a volume being filled
                ctx.beginPath();
                ctx.fillStyle = 'rgba(139, 92, 246, 0.2)'; // Purple translucent
                ctx.moveTo(grapher.mapX(0), grapher.mapY(0));
                
                const step = x / 50;
                for (let px = 0; px <= x; px += step) {
                    ctx.lineTo(grapher.mapX(px), grapher.mapY(fn(px)));
                }
                
                ctx.lineTo(grapher.mapX(x), grapher.mapY(0));
                ctx.closePath();
                ctx.fill();
                
                // Draw line to axes
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(255,255,255,0.3)';
                ctx.setLineDash([5, 5]);
                
                ctx.moveTo(grapher.mapX(x), grapher.mapY(0));
                ctx.lineTo(grapher.mapX(x), grapher.mapY(v));
                
                ctx.moveTo(grapher.mapX(0), grapher.mapY(v));
                ctx.lineTo(grapher.mapX(x), grapher.mapY(v));
                
                ctx.stroke();
                ctx.setLineDash([]);
                
                // Simple box drawing to visualize the cut
                drawBox(ctx, x);
            }
        };
        
        function drawBox(ctx, x) {
            // Only draw if x is valid
            if (x < 0 || x > 7.5) return;
            
            const paperW = 200;
            const paperH = 150;
            const scale = 0.5; // Scale down for UI
            
            const drawX = grapher.width - (paperW * scale) - 30;
            const drawY = 30;
            
            const scaledX = x * 10 * scale; // Map x (0-7.5) to pixels
            
            // Paper base
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 1;
            ctx.fillRect(drawX, drawY, paperW * scale, paperH * scale);
            ctx.strokeRect(drawX, drawY, paperW * scale, paperH * scale);
            
            if (scaledX > 0) {
                // The cuts (red squares)
                ctx.fillStyle = 'rgba(239, 68, 68, 0.5)';
                
                // TL
                ctx.fillRect(drawX, drawY, scaledX, scaledX);
                // TR
                ctx.fillRect(drawX + (paperW*scale) - scaledX, drawY, scaledX, scaledX);
                // BL
                ctx.fillRect(drawX, drawY + (paperH*scale) - scaledX, scaledX, scaledX);
                // BR
                ctx.fillRect(drawX + (paperW*scale) - scaledX, drawY + (paperH*scale) - scaledX, scaledX, scaledX);
                
                // Fold lines
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.setLineDash([3, 3]);
                
                // Top horiz
                ctx.moveTo(drawX + scaledX, drawY + scaledX);
                ctx.lineTo(drawX + (paperW*scale) - scaledX, drawY + scaledX);
                
                // Bottom horiz
                ctx.moveTo(drawX + scaledX, drawY + (paperH*scale) - scaledX);
                ctx.lineTo(drawX + (paperW*scale) - scaledX, drawY + (paperH*scale) - scaledX);
                
                // Left vert
                ctx.moveTo(drawX + scaledX, drawY + scaledX);
                ctx.lineTo(drawX + scaledX, drawY + (paperH*scale) - scaledX);
                
                // Right vert
                ctx.moveTo(drawX + (paperW*scale) - scaledX, drawY + scaledX);
                ctx.lineTo(drawX + (paperW*scale) - scaledX, drawY + (paperH*scale) - scaledX);
                
                ctx.stroke();
                ctx.setLineDash([]);
                
                // Dimensions text
                ctx.fillStyle = '#fff';
                ctx.font = '10px Inter';
                ctx.textAlign = 'center';
                ctx.fillText(`x = ${x.toFixed(1)}`, drawX + scaledX/2, drawY + scaledX/2 + 4);
            }
        }
        
        grapher.draw();
        
        function updateUI(x) {
            slider.value = x;
            xVal.textContent = x.toFixed(1);
            
            const v = fn(x);
            info.innerHTML = `x = ${x.toFixed(2)}<br>ปริมาตร V = <span style="color:#a78bfa">${v.toFixed(1)}</span>`;
            
            // Peak is at x = 2.828... 
            if (Math.abs(x - 2.83) < 0.15) {
                success.style.display = 'block';
            } else {
                success.style.display = 'none';
            }
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
