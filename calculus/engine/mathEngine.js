/**
 * Math Engine - Expression Parser and Evaluator
 * Handles mathematical evaluation for graphs and quizzes
 */
const MathEngine = (function() {
    // A simplified expression parser and evaluator
    // Note: For a production app, we would use a robust library like math.js
    // but for this self-contained demo, we build a basic one

    const constants = {
        'pi': Math.PI,
        'e': Math.E
    };

    const functions = {
        'sin': Math.sin,
        'cos': Math.cos,
        'tan': Math.tan,
        'asin': Math.asin,
        'acos': Math.acos,
        'atan': Math.atan,
        'sqrt': Math.sqrt,
        'log': Math.log, // natural log
        'ln': Math.log,
        'exp': Math.exp,
        'abs': Math.abs
    };

    /**
     * Evaluates a mathematical function string at a given x
     * @param {string} funcStr - The function string (e.g., "x^2 + 2*x")
     * @param {number} x - The x value to evaluate at
     * @returns {number} The calculated y value
     */
    function evaluate(funcStr, x) {
        if (!funcStr) return 0;
        
        try {
            // Very basic sanitation (not secure for real production, but okay for this controlled environment)
            let parsedStr = funcStr
                .replace(/\s+/g, '') // Remove spaces
                .replace(/pi/g, 'Math.PI')
                .replace(/e\b/g, 'Math.E')
                .replace(/sin\(/g, 'Math.sin(')
                .replace(/cos\(/g, 'Math.cos(')
                .replace(/tan\(/g, 'Math.tan(')
                .replace(/sqrt\(/g, 'Math.sqrt(')
                .replace(/log\(/g, 'Math.log(')
                .replace(/ln\(/g, 'Math.log(')
                .replace(/exp\(/g, 'Math.exp(')
                .replace(/abs\(/g, 'Math.abs(')
                .replace(/\^/g, '**'); // Handle exponents
                
            // Handle implicit multiplication like 2x -> 2*x
            parsedStr = parsedStr.replace(/(\d)([a-zA-Z])/g, '$1*$2');
            
            // Handle x
            parsedStr = parsedStr.replace(/x/g, `(${x})`);
            
            // eslint-disable-next-line no-new-func
            return new Function('return ' + parsedStr)();
        } catch (error) {
            console.error("Error evaluating function:", funcStr, error);
            return NaN;
        }
    }

    /**
     * Parse a LaTeX string for rendering
     * @param {string} formula 
     * @returns {string} LaTeX string
     */
    function toLaTeX(formula) {
        // Simplified mapping for common expressions
        return formula
            .replace(/\*/g, ' \\cdot ')
            .replace(/sin/g, '\\sin')
            .replace(/cos/g, '\\cos')
            .replace(/tan/g, '\\tan')
            .replace(/sqrt\((.*?)\)/g, '\\sqrt{$1}')
            .replace(/pi/g, '\\pi')
            .replace(/\((.*?)\)\/(.*?)(?=[+\-]|$)/g, '\\frac{$1}{$2}');
    }

    /**
     * Find derivative of a function at point x numerically (if symbolic not available)
     * @param {string} funcStr 
     * @param {number} x 
     * @param {number} h Step size
     * @returns {number} Derivative value
     */
    function derivativeAt(funcStr, x, h = 0.0001) {
        return (evaluate(funcStr, x + h) - evaluate(funcStr, x - h)) / (2 * h);
    }
    
    /**
     * Compute definite integral using Simpson's 1/3 Rule
     * @param {string} funcStr 
     * @param {number} a Lower limit
     * @param {number} b Upper limit
     * @param {number} n Number of intervals (must be even)
     * @returns {number} Integral value
     */
    function integral(funcStr, a, b, n = 100) {
        if (n % 2 !== 0) n++; // Ensure n is even
        
        const h = (b - a) / n;
        let sum = evaluate(funcStr, a) + evaluate(funcStr, b);
        
        for (let i = 1; i < n; i++) {
            const x = a + i * h;
            if (i % 2 === 0) {
                sum += 2 * evaluate(funcStr, x);
            } else {
                sum += 4 * evaluate(funcStr, x);
            }
        }
        
        return (h / 3) * sum;
    }

    /**
     * Render KaTeX into an element
     * @param {string} tex LaTeX string
     * @param {HTMLElement} element Target element
     * @param {boolean} displayMode Block or inline math
     */
    function renderMath(tex, element, displayMode = false) {
        if (typeof katex !== 'undefined') {
            try {
                katex.render(tex, element, {
                    throwOnError: false,
                    displayMode: displayMode,
                    strict: false
                });
            } catch (e) {
                console.error("KaTeX error:", e);
                element.innerHTML = tex;
            }
        } else {
            // Fallback if KaTeX is not loaded
            element.innerHTML = tex;
        }
    }

    return {
        evaluate,
        toLaTeX,
        derivativeAt,
        integral,
        renderMath
    };
})();
