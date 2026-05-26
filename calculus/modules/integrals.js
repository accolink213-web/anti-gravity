/**
 * Integrals Module
 */
window.Module_integrals = {
    title: 'Integrals',
    description: 'พื้นที่ใต้กราฟ, Riemann Sums, และ Fundamental Theorem of Calculus',
    
    theoryHtml: `
        <div class="content-section">
            <h2>ปฏิยานุพันธ์ (Antiderivatives) และ ปริพันธ์ไม่จำกัดเขต (Indefinite Integrals)</h2>
            <p>ถ้าอนุพันธ์คือการหา "อัตราการเปลี่ยนแปลง" ปฏิยานุพันธ์ก็คือกระบวนการย้อนกลับ: <strong>"ถ้าเรารู้อัตราการเปลี่ยนแปลง เราจะหาปริมาณดั้งเดิมได้อย่างไร?"</strong></p>
            
            <p>เรานิยามฟังก์ชัน $F(x)$ ว่าเป็นปฏิยานุพันธ์ของ $f(x)$ ก็ต่อเมื่อ $F'(x) = f(x)$</p>
            
            <p>เนื่องจากค่าคงที่ใดๆ เมื่อดิฟแล้วได้ 0 ดังนั้นปฏิยานุพันธ์จะมีได้หลายตัว เราจึงเขียนรวมๆ ในรูป <strong>ปริพันธ์ไม่จำกัดเขต</strong>:</p>
            <div class="math-block">
                $$\\int f(x) \\, dx = F(x) + C$$
            </div>
            <p>โดยที่ $C$ คือค่าคงที่ใดๆ (Constant of integration)</p>
        </div>

        <div class="content-section">
            <h2>ผลบวกรีมันน์ (Riemann Sums) และ พื้นที่ใต้กราฟ</h2>
            <p>ถ้าเราต้องการหาพื้นที่ใต้เส้นโค้ง เราสามารถประมาณค่าได้โดยการแบ่งพื้นที่เป็นแท่งสี่เหลี่ยมผืนผ้าเล็กๆ หลายๆ แท่ง ยิ่งแบ่งซอยย่อยมากเท่าไร พื้นที่ที่ได้ก็จะยิ่งแม่นยำมากขึ้นเท่านั้น</p>
            
            <p>เมื่อจำนวนแท่งสี่เหลี่ยมเข้าใกล้อนันต์ (ความกว้างแท่งเข้าใกล้ศูนย์) ผลรวมของพื้นที่สี่เหลี่ยมเหล่านั้นจะกลายเป็น <strong>ปริพันธ์จำกัดเขต (Definite Integral)</strong>:</p>
            <div class="math-block">
                $$\\int_{a}^{b} f(x) \\, dx = \\lim_{n \\to \\infty} \\sum_{i=1}^{n} f(x_i^*) \\Delta x$$
            </div>
            <p>นี่คือพื้นที่สุทธิ (Net Area) ใต้กราฟ $y = f(x)$ จาก $x=a$ ถึง $x=b$ (พื้นที่เหนือแกน X เป็นบวก ใต้แกน X เป็นลบ)</p>
        </div>

        <div class="content-section">
            <h2>ทฤษฎีบทหลักมูลของแคลคูลัส (Fundamental Theorem of Calculus)</h2>
            <p>นี่คือทฤษฎีที่เชื่อมโยง <strong>อนุพันธ์</strong> (ความชัน) เข้ากับ <strong>ปริพันธ์</strong> (พื้นที่) เข้าด้วยกัน!</p>
            
            <div class="formula-highlight">
                <div class="formula-label">Fundamental Theorem of Calculus (Part 2)</div>
                <div class="math-inline">$$\\int_{a}^{b} f(x) \\, dx = F(b) - F(a)$$</div>
                <p style="font-size: 0.85rem; color: var(--text-tertiary); margin-top: 0.5rem">เมื่อ $F(x)$ คือปฏิยานุพันธ์ใดๆ ของ $f(x)$</p>
            </div>
            
            <p>ทฤษฎีนี้บอกเราว่า การจะหาพื้นที่ใต้กราฟ (ซึ่งนิยามมาจากลิมิตที่ซับซ้อนของผลรวม) เราแค่หาปฏิยานุพันธ์ของมัน แล้วนำจุดปลายมาลบกับจุดเริ่มต้น ก็ได้คำตอบแล้ว!</p>
        </div>
    `,
    
    interactiveHtml: `
        <div class="content-section">
            <h2>Interactive Riemann Sums</h2>
            <p>ลองปรับจำนวนแท่งสี่เหลี่ยม ($n$) เพื่อดูว่าผลรวมของพื้นที่สี่เหลี่ยมประมาณค่าพื้นที่ใต้กราฟ $f(x) = -x^2 + 4$ ได้ใกล้เคียงขึ้นอย่างไร</p>
            <p>ยิ่ง $n$ มาก ผลบวกจะยิ่งเข้าใกล้ค่าของ $\\int_{-2}^{2} (-x^2 + 4) \\, dx = \\frac{32}{3} \\approx 10.67$</p>
            
            <div class="graph-container">
                <div id="int-graph-info" class="graph-info">n = 4<br>Area ≈ 0.00</div>
                <canvas id="int-canvas" class="graph-canvas"></canvas>
            </div>
            
            <div class="slider-control">
                <label>จำนวน $n$:</label>
                <input type="range" id="int-n-slider" min="2" max="100" step="1" value="4">
                <span class="slider-value" id="int-n-val">4</span>
            </div>
            
            <div class="mt-md" style="display:flex; gap:1rem; flex-wrap:wrap">
                <label style="color:var(--text-secondary); font-size:0.9rem">รูปแบบการประมาณ:</label>
                <div>
                    <input type="radio" id="riemann-left" name="riemann-type" value="riemann-left" checked>
                    <label for="riemann-left" style="color:var(--text-primary); font-size:0.9rem; cursor:pointer">จุดซ้ายสุด (Left)</label>
                </div>
                <div>
                    <input type="radio" id="riemann-right" name="riemann-type" value="riemann-right">
                    <label for="riemann-right" style="color:var(--text-primary); font-size:0.9rem; cursor:pointer">จุดขวาสุด (Right)</label>
                </div>
                <div>
                    <input type="radio" id="riemann-mid" name="riemann-type" value="riemann-mid">
                    <label for="riemann-mid" style="color:var(--text-primary); font-size:0.9rem; cursor:pointer">จุดกึ่งกลาง (Midpoint)</label>
                </div>
            </div>
        </div>
    `,
    
    initInteractive: function() {
        const canvas = document.getElementById('int-canvas');
        if (!canvas) return;
        
        const slider = document.getElementById('int-n-slider');
        const nVal = document.getElementById('int-n-val');
        const info = document.getElementById('int-graph-info');
        const radioBtns = document.getElementsByName('riemann-type');
        
        let n = 4;
        let type = 'riemann-left';
        
        // f(x) = -x^2 + 4
        const fn = (x) => -x*x + 4;
        
        const grapher = new Grapher(canvas, {
            bounds: { xMin: -3, xMax: 3, yMin: -2, yMax: 5 }
        });
        
        // Plot f(x)
        grapher.addFunction(fn, '#60a5fa', 2); // Blue line
        
        function updateGraph() {
            // Remove previous areas
            grapher.areas = [];
            
            // Add exact area in background (very faint)
            grapher.addArea(fn, -2, 2, { 
                type: 'fill', 
                color: 'rgba(255, 255, 255, 0.05)' 
            });
            
            // Add Riemann area
            grapher.addArea(fn, -2, 2, {
                type: type,
                rects: n,
                color: 'rgba(6, 182, 212, 0.4)' // Cyan translucent
            });
            
            // Calculate approximate area
            const dx = 4 / n;
            let sum = 0;
            
            for (let i = 0; i < n; i++) {
                let x;
                if (type === 'riemann-left') x = -2 + i * dx;
                else if (type === 'riemann-right') x = -2 + (i + 1) * dx;
                else x = -2 + (i + 0.5) * dx; // mid
                
                sum += fn(x) * dx;
            }
            
            info.innerHTML = `n = ${n}<br>Area ≈ <span style="color:#06b6d4">${sum.toFixed(4)}</span><br><span style="font-size:0.7em;color:#a0a0c0">ค่าจริง = 10.6667</span>`;
        }
        
        updateGraph();
        
        slider.addEventListener('input', (e) => {
            n = parseInt(e.target.value);
            nVal.textContent = n;
            updateGraph();
        });
        
        radioBtns.forEach(btn => {
            btn.addEventListener('change', (e) => {
                if (e.target.checked) {
                    type = e.target.value;
                    updateGraph();
                }
            });
        });
    }
};
