/**
 * Differential Equations Module
 */
window.Module_diffeq = {
    title: 'Differential Equations',
    description: 'สนามทิศทาง (Direction Fields) และสมการเชิงอนุพันธ์อันดับหนึ่ง',
    
    theoryHtml: `
        <div class="content-section">
            <h2>สมการเชิงอนุพันธ์คืออะไร?</h2>
            <p><strong>สมการเชิงอนุพันธ์ (Differential Equation)</strong> คือสมการที่มีฟังก์ชันและอนุพันธ์ของฟังก์ชันนั้นอยู่รวมกัน</p>
            <p>ในสมการพีชคณิตปกติ เราหาค่า $x$ แต่ในสมการเชิงอนุพันธ์ เราต้องการหา <strong>ฟังก์ชัน $y = f(x)$</strong> ที่ทำให้สมการเป็นจริง</p>
            
            <div class="example-box">
                <div class="example-title">ตัวอย่างสมการ:</div>
                <div class="math-block" style="margin-top: 0">
                    $$\\frac{dy}{dx} = y$$
                </div>
                <p>คำถามคือ "ฟังก์ชันอะไรเอ่ย ที่อนุพันธ์ของมัน มีค่าเท่ากับตัวมันเอง?"<br>
                คำตอบก็คือ ฟังก์ชันเอกซ์โพเนนเชียล: $y = C e^x$</p>
            </div>
        </div>

        <div class="content-section">
            <h2>สนามทิศทาง (Direction Fields / Slope Fields)</h2>
            <p>บางครั้งเราไม่สามารถหาสูตรคำตอบของสมการเชิงอนุพันธ์ได้อย่างชัดแจ้ง (Explicit form) แต่เราสามารถ <strong>"วาดภาพ"</strong> รูปร่างของคำตอบได้!</p>
            
            <p>เนื่องจากสมการ $y' = F(x, y)$ บอกเราว่า <strong>ความชัน (Slope)</strong> ของคำตอบที่พิกัด $(x,y)$ ใดๆ มีค่าเท่ากับ $F(x,y)$ เราจึงสามารถวาดเส้นขีดสั้นๆ ที่มีความชันเหล่านั้นทั่วทั้งระนาบได้ เกิดเป็นสนามทิศทาง</p>
        </div>

        <div class="content-section">
            <h2>การแก้สมการแบบแยกตัวแปรได้ (Separable Equations)</h2>
            <p>สมการเชิงอนุพันธ์อันดับหนึ่งที่เขียนในรูป $y' = g(x)h(y)$ สามารถแก้ได้โดยการแยก $x$ ไว้ฝั่งหนึ่ง และ $y$ ไว้ฝั่งหนึ่ง จากนั้นอินทิเกรตทั้งสองฝั่ง:</p>
            <div class="math-block">
                $$\\frac{dy}{dx} = g(x)h(y)$$
                $$\\frac{dy}{h(y)} = g(x) dx$$
                $$\\int \\frac{1}{h(y)} \\, dy = \\int g(x) \\, dx$$
            </div>
        </div>
    `,
    
    interactiveHtml: `
        <div class="content-section">
            <h2>Interactive Direction Field</h2>
            <p>สมการ $\\frac{dy}{dx} = x - y$ (ความชันที่จุดใดๆ มีค่าเท่ากับค่าพิกัด x ลบด้วย y)</p>
            <p><strong>คลิกบนกราฟ</strong> เพื่อวาดเส้นโค้งคำตอบ (Solution Curve) ที่ลากผ่านจุดนั้น (Initial Value Problem)</p>
            
            <div class="graph-container">
                <canvas id="df-canvas" class="graph-canvas"></canvas>
            </div>
            
            <div class="text-center mt-md">
                <button class="btn btn-secondary" id="df-clear-btn">ล้างเส้นโค้งทั้งหมด</button>
            </div>
        </div>
    `,
    
    initInteractive: function() {
        const canvas = document.getElementById('df-canvas');
        if (!canvas) return;
        
        const clearBtn = document.getElementById('df-clear-btn');
        
        // dy/dx = x - y
        const fnYprime = (x, y) => x - y;
        
        const grapher = new Grapher(canvas, {
            bounds: { xMin: -5, xMax: 5, yMin: -5, yMax: 5 }
        });
        
        // Plot direction field
        grapher.addVectorField(fnYprime, { 
            spacing: 0.5, 
            length: 0.35, 
            color: 'rgba(6, 182, 212, 0.4)' 
        });
        
        // Basic Euler's Method for drawing solution curve
        function drawSolutionCurve(startX, startY) {
            const h = 0.05; // step size
            const maxSteps = 200; // to prevent infinite loops
            
            // We draw two parts: forward and backward
            
            grapher.ctx.beginPath();
            grapher.ctx.strokeStyle = '#f59e0b'; // Amber
            grapher.ctx.lineWidth = 2;
            
            // Forward (positive x direction)
            let x = startX;
            let y = startY;
            grapher.ctx.moveTo(grapher.mapX(x), grapher.mapY(y));
            
            for (let i = 0; i < maxSteps && x <= grapher.bounds.xMax; i++) {
                const slope = fnYprime(x, y);
                y = y + slope * h;
                x = x + h;
                grapher.ctx.lineTo(grapher.mapX(x), grapher.mapY(y));
            }
            grapher.ctx.stroke();
            
            // Backward (negative x direction)
            grapher.ctx.beginPath();
            x = startX;
            y = startY;
            grapher.ctx.moveTo(grapher.mapX(x), grapher.mapY(y));
            
            for (let i = 0; i < maxSteps && x >= grapher.bounds.xMin; i++) {
                const slope = fnYprime(x, y);
                y = y - slope * h;
                x = x - h;
                grapher.ctx.lineTo(grapher.mapX(x), grapher.mapY(y));
            }
            grapher.ctx.stroke();
            
            // Draw starting point
            grapher.ctx.beginPath();
            grapher.ctx.arc(grapher.mapX(startX), grapher.mapY(startY), 4, 0, Math.PI * 2);
            grapher.ctx.fillStyle = '#ef4444'; // Red
            grapher.ctx.fill();
            grapher.ctx.strokeStyle = '#fff';
            grapher.ctx.lineWidth = 1;
            grapher.ctx.stroke();
        }
        
        // Add click listener to canvas to draw curves
        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            // Use Grapher's unmap methods
            const mathX = grapher.bounds.xMin + (mouseX / grapher.width) * (grapher.bounds.xMax - grapher.bounds.xMin);
            const mathY = grapher.bounds.yMin + ((grapher.height - mouseY) / grapher.height) * (grapher.bounds.yMax - grapher.bounds.yMin);
            
            drawSolutionCurve(mathX, mathY);
        });
        
        clearBtn.addEventListener('click', () => {
            grapher.draw(); // Redraws grid, axes, and vector field, clearing the curves
        });
    }
};
