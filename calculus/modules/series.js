/**
 * Sequences & Series Module
 */
window.Module_series = {
    title: 'Sequences & Series',
    description: 'ลำดับและการลู่เข้า อนุกรมอนันต์ และการทดสอบการลู่เข้า',
    
    theoryHtml: `
        <div class="content-section">
            <h2>ลำดับอนันต์ (Infinite Sequences)</h2>
            <p><strong>ลำดับ</strong> คือชุดของตัวเลขที่เรียงต่อกันตามกฎเกณฑ์บางอย่าง เช่น $a_1, a_2, a_3, \\dots, a_n, \\dots$</p>
            <p>พจน์ทั่วไปเขียนแทนด้วย $a_n$ ลำดับจะลู่เข้า (Converge) สู่ค่า $L$ ก็ต่อเมื่อ $\\lim_{n \\to \\infty} a_n = L$</p>
            
            <div class="example-box">
                <div class="example-title">ตัวอย่างลำดับที่ลู่เข้า:</div>
                <p>$a_n = \\frac{1}{n}$ จะได้ลำดับ: $1, \\frac{1}{2}, \\frac{1}{3}, \\frac{1}{4}, \\dots$ ซึ่งลู่เข้าสู่ $0$</p>
            </div>
        </div>

        <div class="content-section">
            <h2>อนุกรมอนันต์ (Infinite Series)</h2>
            <p><strong>อนุกรม</strong> คือผลบวกของทุกพจน์ในลำดับ เขียนแทนด้วย $\\sum_{n=1}^{\\infty} a_n$</p>
            <p>การจะบอกว่าอนุกรมอนันต์หาค่าได้ (Converge) หรือหาค่าไม่ได้ (Diverge) เราจะพิจารณาจาก <strong>ผลบวกย่อย $n$ พจน์แรก (Partial Sum, $S_n$)</strong></p>
            <div class="math-block">
                $$S_n = \\sum_{i=1}^{n} a_i = a_1 + a_2 + \\dots + a_n$$
                $$\\sum_{n=1}^{\\infty} a_n = \\lim_{n \\to \\infty} S_n$$
            </div>
        </div>

        <div class="content-section">
            <h2>อนุกรมที่สำคัญ</h2>
            
            <h3>1. อนุกรมเรขาคณิต (Geometric Series)</h3>
            <div class="math-block">
                $$\\sum_{n=0}^{\\infty} ar^n = a + ar + ar^2 + \\dots = \\frac{a}{1-r}$$
            </div>
            <p>จะลู่เข้า (Converge) ก็ต่อเมื่อ $|r| < 1$ เท่านั้น</p>
            
            <h3>2. อนุกรมฮาร์มอนิก (Harmonic Series)</h3>
            <div class="math-block">
                $$\\sum_{n=1}^{\\infty} \\frac{1}{n} = 1 + \\frac{1}{2} + \\frac{1}{3} + \\frac{1}{4} + \\dots$$
            </div>
            <p><strong>ระวัง!</strong> อนุกรมนี้ลู่ออก (Diverge) สู่ $\\infty$ แม้ว่าพจน์ที่ $n$ จะเข้าใกล้ $0$ ก็ตาม!</p>
        </div>
        
        <div class="content-section">
            <h2>Taylor & Maclaurin Series</h2>
            <p>เราสามารถเขียนฟังก์ชันที่ซับซ้อน (เช่น $\\sin x, e^x$) ให้อยู่ในรูปของอนุกรมพหุนามอนันต์ได้!</p>
            <div class="math-block">
                $$e^x = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\frac{x^4}{4!} + \\dots = \\sum_{n=0}^{\\infty} \\frac{x^n}{n!}$$
            </div>
        </div>
    `,
    
    interactiveHtml: `
        <div class="content-section">
            <h2>Interactive Series: Maclaurin Series ของ $\\sin(x)$</h2>
            <p>ฟังก์ชัน $\\sin(x)$ สามารถประมาณค่าได้ด้วยพหุนาม การเพิ่มจำนวนพจน์ (n) จะทำให้เส้นพหุนามทับซ้อนกับเส้นกราฟของ $\\sin(x)$ ได้กว้างขึ้น!</p>
            <div class="math-block" style="font-size:0.9em">
                $$\\sin(x) \\approx x - \\frac{x^3}{3!} + \\frac{x^5}{5!} - \\frac{x^7}{7!} + \\dots$$
            </div>
            
            <div class="graph-container">
                <canvas id="series-canvas" class="graph-canvas"></canvas>
            </div>
            
            <div class="slider-control">
                <label>จำนวนพจน์ $n$:</label>
                <input type="range" id="series-n-slider" min="1" max="9" step="2" value="1">
                <span class="slider-value" id="series-n-val">1 พจน์</span>
            </div>
            
            <p id="series-eq" class="text-center mt-md" style="color:var(--accent-pink); font-family:var(--font-mono); font-size: 0.9em;">
                P(x) = x
            </p>
        </div>
    `,
    
    initInteractive: function() {
        const canvas = document.getElementById('series-canvas');
        if (!canvas) return;
        
        const slider = document.getElementById('series-n-slider');
        const nVal = document.getElementById('series-n-val');
        const eqText = document.getElementById('series-eq');
        
        // Helper: factorial
        const fact = (num) => num <= 1 ? 1 : num * fact(num - 1);
        
        // Base function
        const fn = (x) => Math.sin(x);
        
        const grapher = new Grapher(canvas, {
            bounds: { xMin: -3 * Math.PI, xMax: 3 * Math.PI, yMin: -3, yMax: 3 }
        });
        
        // Plot exact sin(x)
        grapher.addFunction(fn, 'rgba(255,255,255,0.3)', 2); // Dim white line
        
        function updateGraph(n) {
            // Remove previous approximation
            if (grapher.functions.length > 1) {
                grapher.functions.pop(); // Remove the last one
            }
            
            // Build the Taylor polynomial function
            const taylorFn = (x) => {
                let sum = 0;
                let sign = 1;
                for (let k = 1; k <= n; k += 2) {
                    sum += sign * Math.pow(x, k) / fact(k);
                    sign *= -1;
                }
                return sum;
            };
            
            // Build equation string
            let eqStr = "P(x) = ";
            let sign = 1;
            for (let k = 1; k <= n; k += 2) {
                if (k === 1) eqStr += "x";
                else {
                    eqStr += sign > 0 ? " + " : " - ";
                    eqStr += `x^${k}/${k}!`;
                }
                sign *= -1;
            }
            eqText.textContent = eqStr;
            
            // Plot approximation
            grapher.addFunction(taylorFn, '#ec4899', 2); // Pink line
            
            nVal.textContent = `${Math.ceil(n/2)} พจน์`;
        }
        
        updateGraph(1);
        
        slider.addEventListener('input', (e) => {
            updateGraph(parseInt(e.target.value));
        });
    }
};
