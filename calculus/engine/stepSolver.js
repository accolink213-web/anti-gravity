/**
 * Step Solver Engine - Handles step-by-step math problem solutions
 */
class StepSolver {
    /**
     * @param {string} containerId - The ID of the container element
     * @param {Array} steps - Array of step objects { text, math, rule, explanation }
     */
    constructor(containerId, title = "วิธีทำ", steps = []) {
        this.containerId = containerId;
        this.title = title;
        this.steps = steps;
        this.currentStep = 0;
        
        this.render();
    }
    
    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;
        
        container.innerHTML = '';
        container.className = 'step-solver animate-fade-in-up';
        
        // Header
        const header = document.createElement('div');
        header.className = 'step-solver-header';
        header.innerHTML = `<h4>💡 ${this.title}</h4>`;
        container.appendChild(header);
        
        // Body (where steps go)
        this.body = document.createElement('div');
        this.body.className = 'step-solver-body';
        container.appendChild(this.body);
        
        // Button container
        const btnContainer = document.createElement('div');
        btnContainer.className = 'step-solver-body';
        btnContainer.style.paddingTop = '0';
        
        this.nextBtn = document.createElement('button');
        this.nextBtn.className = 'step-btn';
        this.nextBtn.innerHTML = 'แสดงขั้นต่อไป <span>→</span>';
        this.nextBtn.onclick = () => this.showNextStep();
        
        btnContainer.appendChild(this.nextBtn);
        container.appendChild(btnContainer);
        
        // Show first step initially if available
        if (this.steps.length > 0) {
            this.showNextStep();
        } else {
            this.nextBtn.style.display = 'none';
        }
    }
    
    showNextStep() {
        if (this.currentStep >= this.steps.length) return;
        
        const stepData = this.steps[this.currentStep];
        
        const stepEl = document.createElement('div');
        stepEl.className = 'step';
        
        // Step number
        const numEl = document.createElement('div');
        numEl.className = 'step-number';
        numEl.textContent = this.currentStep + 1;
        
        // Content
        const contentEl = document.createElement('div');
        contentEl.className = 'step-content';
        
        if (stepData.rule) {
            const ruleEl = document.createElement('div');
            ruleEl.className = 'step-rule';
            ruleEl.textContent = stepData.rule;
            contentEl.appendChild(ruleEl);
        }
        
        if (stepData.text) {
            const textEl = document.createElement('div');
            textEl.innerHTML = stepData.text;
            contentEl.appendChild(textEl);
        }
        
        if (stepData.math) {
            const mathEl = document.createElement('div');
            mathEl.className = 'step-math';
            MathEngine.renderMath(stepData.math, mathEl, true);
            contentEl.appendChild(mathEl);
        }
        
        if (stepData.explanation) {
            const expEl = document.createElement('div');
            expEl.className = 'step-explanation';
            expEl.textContent = stepData.explanation;
            contentEl.appendChild(expEl);
        }
        
        stepEl.appendChild(numEl);
        stepEl.appendChild(contentEl);
        
        this.body.appendChild(stepEl);
        
        // Trigger reflow for animation
        void stepEl.offsetWidth;
        stepEl.classList.add('visible');
        
        this.currentStep++;
        
        // Update button state
        if (this.currentStep >= this.steps.length) {
            this.nextBtn.innerHTML = '✓ สิ้นสุดวิธีทำ';
            this.nextBtn.disabled = true;
            this.nextBtn.classList.replace('step-btn', 'btn-secondary');
        }
    }
    
    reset() {
        this.currentStep = 0;
        this.body.innerHTML = '';
        this.nextBtn.innerHTML = 'แสดงขั้นต่อไป <span>→</span>';
        this.nextBtn.disabled = false;
        this.nextBtn.classList.replace('btn-secondary', 'step-btn');
        this.nextBtn.style.display = 'flex';
        
        if (this.steps.length > 0) {
            this.showNextStep();
        }
    }
    
    loadSteps(newSteps, title = null) {
        this.steps = newSteps;
        if (title) {
            this.title = title;
            const header = document.querySelector(`#${this.containerId} .step-solver-header h4`);
            if (header) header.innerHTML = `💡 ${title}`;
        }
        this.reset();
    }
}
