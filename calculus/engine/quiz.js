/**
 * Quiz Engine - Handles interactive quizzes and assessments
 */
class QuizEngine {
    /**
     * @param {string} containerId - Container element ID
     * @param {Array} questions - Array of question objects
     * @param {Function} onComplete - Callback when quiz is finished
     */
    constructor(containerId, questions, onComplete = null) {
        this.containerId = containerId;
        this.questions = questions;
        this.onComplete = onComplete;
        
        this.currentQIndex = 0;
        this.score = 0;
        this.userAnswers = new Array(questions.length).fill(null);
        this.isAnswered = false;
        
        this.render();
    }
    
    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;
        
        container.innerHTML = '';
        container.className = 'quiz-container animate-fade-in-up';
        
        // If completed
        if (this.currentQIndex >= this.questions.length) {
            this.renderResults(container);
            return;
        }
        
        const q = this.questions[this.currentQIndex];
        
        // Header
        const header = document.createElement('div');
        header.className = 'quiz-header';
        header.innerHTML = `
            <h4>📝 แบบทดสอบความเข้าใจ</h4>
            <div class="quiz-score">ข้อ ${this.currentQIndex + 1} / ${this.questions.length}</div>
        `;
        container.appendChild(header);
        
        // Body
        this.body = document.createElement('div');
        this.body.className = 'quiz-body';
        
        // Question Text
        const qBox = document.createElement('div');
        qBox.className = 'quiz-question';
        
        const qText = document.createElement('div');
        qText.className = 'quiz-question-text';
        // Check if there's LaTeX in question text (wrapped in $$ or $)
        let textContent = q.question;
        qText.innerHTML = textContent;
        this.renderMathInEl(qText);
        
        qBox.appendChild(qText);
        
        if (q.math) {
            const qMath = document.createElement('div');
            qMath.className = 'math-block';
            MathEngine.renderMath(q.math, qMath, true);
            qBox.appendChild(qMath);
        }
        
        this.body.appendChild(qBox);
        
        // Options based on type
        if (q.type === 'multiple-choice') {
            this.renderMultipleChoice(q, this.body);
        } else if (q.type === 'numeric' || q.type === 'expression') {
            this.renderInput(q, this.body);
        }
        
        // Feedback Box (hidden initially)
        this.feedbackBox = document.createElement('div');
        this.feedbackBox.className = 'quiz-feedback';
        this.body.appendChild(this.feedbackBox);
        
        // Navigation
        const nav = document.createElement('div');
        nav.className = 'quiz-nav';
        
        // Dots
        const dots = document.createElement('div');
        dots.className = 'quiz-progress-dots';
        for (let i = 0; i < this.questions.length; i++) {
            const dot = document.createElement('div');
            dot.className = 'quiz-dot';
            if (i === this.currentQIndex) dot.classList.add('active');
            else if (i < this.currentQIndex) {
                dot.classList.add(this.userAnswers[i] ? 'answered' : 'wrong');
            }
            dots.appendChild(dot);
        }
        nav.appendChild(dots);
        
        // Next button
        this.nextBtn = document.createElement('button');
        this.nextBtn.className = 'btn btn-primary';
        this.nextBtn.textContent = 'ตรวจคำตอบ';
        this.nextBtn.onclick = () => this.handleAction(q);
        
        nav.appendChild(this.nextBtn);
        this.body.appendChild(nav);
        
        container.appendChild(this.body);
    }
    
    renderMultipleChoice(q, parent) {
        const optionsList = document.createElement('div');
        optionsList.className = 'quiz-options';
        
        const letters = ['A', 'B', 'C', 'D', 'E'];
        
        q.options.forEach((opt, idx) => {
            const optEl = document.createElement('div');
            optEl.className = 'quiz-option';
            optEl.dataset.index = idx;
            
            const letterEl = document.createElement('div');
            letterEl.className = 'quiz-option-letter';
            letterEl.textContent = letters[idx];
            
            const textEl = document.createElement('div');
            textEl.innerHTML = opt;
            this.renderMathInEl(textEl);
            
            optEl.appendChild(letterEl);
            optEl.appendChild(textEl);
            
            optEl.onclick = () => {
                if (this.isAnswered) return;
                
                // Remove selected from others
                Array.from(optionsList.children).forEach(c => c.classList.remove('selected'));
                optEl.classList.add('selected');
            };
            
            optionsList.appendChild(optEl);
        });
        
        parent.appendChild(optionsList);
    }
    
    renderInput(q, parent) {
        const wrapper = document.createElement('div');
        wrapper.className = 'quiz-input-wrapper';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'quiz-input';
        input.id = 'quiz-text-input';
        input.placeholder = q.type === 'numeric' ? 'ใส่ตัวเลขคำตอบ...' : 'ใส่สมการ (เช่น 2x+1)...';
        
        // Allow pressing Enter to submit
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.isAnswered) {
                this.handleAction(q);
            }
        });
        
        wrapper.appendChild(input);
        parent.appendChild(wrapper);
    }
    
    handleAction(q) {
        if (this.isAnswered) {
            // Move to next question
            this.currentQIndex++;
            this.isAnswered = false;
            this.render();
        } else {
            // Check answer
            this.checkAnswer(q);
        }
    }
    
    checkAnswer(q) {
        let isCorrect = false;
        
        if (q.type === 'multiple-choice') {
            const selected = document.querySelector('.quiz-option.selected');
            if (!selected) {
                alert('กรุณาเลือกคำตอบ');
                return;
            }
            
            const selectedIdx = parseInt(selected.dataset.index);
            isCorrect = selectedIdx === q.correctAnswer;
            
            // Highlight answers
            const options = document.querySelectorAll('.quiz-option');
            options[q.correctAnswer].classList.add('correct');
            
            if (!isCorrect) {
                selected.classList.add('incorrect');
            }
        } 
        else if (q.type === 'numeric') {
            const input = document.getElementById('quiz-text-input');
            const val = parseFloat(input.value);
            
            if (isNaN(val)) {
                alert('กรุณาใส่ตัวเลข');
                return;
            }
            
            // Check within tolerance (for float precision)
            const tolerance = q.tolerance || 0.01;
            isCorrect = Math.abs(val - q.correctAnswer) <= tolerance;
            
            input.disabled = true;
            if (isCorrect) input.style.borderColor = 'var(--accent-green)';
            else input.style.borderColor = 'var(--accent-red)';
        }
        else if (q.type === 'expression') {
            const input = document.getElementById('quiz-text-input');
            const userExpr = input.value;
            
            if (!userExpr.trim()) {
                alert('กรุณาใส่คำตอบ');
                return;
            }
            
            // Simplified check by evaluating at multiple random points
            isCorrect = true;
            const testPoints = [1, 2.5, -1, Math.PI, 0];
            
            try {
                for (let x of testPoints) {
                    const userVal = MathEngine.evaluate(userExpr, x);
                    const correctVal = typeof q.correctAnswer === 'string' 
                        ? MathEngine.evaluate(q.correctAnswer, x) 
                        : (typeof q.correctAnswer === 'function' ? q.correctAnswer(x) : q.correctAnswer);
                    
                    if (Math.abs(userVal - correctVal) > 0.01) {
                        isCorrect = false;
                        break;
                    }
                }
            } catch (e) {
                isCorrect = false;
            }
            
            input.disabled = true;
            if (isCorrect) input.style.borderColor = 'var(--accent-green)';
            else input.style.borderColor = 'var(--accent-red)';
        }
        
        // Record result
        this.userAnswers[this.currentQIndex] = isCorrect;
        if (isCorrect) this.score++;
        
        // Show feedback
        this.feedbackBox.className = 'quiz-feedback ' + (isCorrect ? 'correct' : 'incorrect');
        this.feedbackBox.innerHTML = isCorrect ? 
            '<strong>✓ ถูกต้อง!</strong> ' + (q.explanation || '') : 
            '<strong>✗ ไม่ถูกต้อง</strong> ' + (q.explanation || 'ลองทบทวนดูอีกครั้ง');
            
        this.renderMathInEl(this.feedbackBox);
        
        this.isAnswered = true;
        this.nextBtn.textContent = this.currentQIndex === this.questions.length - 1 ? 'ดูผลคะแนน' : 'ข้อถัดไป';
        
        // Update dots
        const dots = document.querySelectorAll('.quiz-dot');
        dots[this.currentQIndex].className = 'quiz-dot ' + (isCorrect ? 'answered' : 'wrong');
    }
    
    renderResults(container) {
        const percent = Math.round((this.score / this.questions.length) * 100);
        
        let message, colorClass;
        if (percent >= 80) {
            message = 'ยอดเยี่ยม! คุณเข้าใจเนื้อหาได้ดีมาก';
            colorClass = 'correct';
        } else if (percent >= 50) {
            message = 'ผ่านเกณฑ์! ฝึกฝนอีกนิดจะเก่งขึ้นแน่นอน';
            colorClass = 'correct';
        } else {
            message = 'ลองทบทวนเนื้อหาแล้วทำแบบทดสอบใหม่อีกครั้งนะ';
            colorClass = 'incorrect';
        }
        
        container.innerHTML = `
            <div class="quiz-header">
                <h4>📊 ผลการทดสอบ</h4>
            </div>
            <div class="quiz-body text-center">
                <h1 style="font-size: 3.5rem; margin: 1rem 0; color: ${percent >= 50 ? 'var(--accent-green)' : 'var(--accent-red)'}">
                    ${this.score} / ${this.questions.length}
                </h1>
                <p style="font-size: 1.1rem" class="mb-lg">${message}</p>
                
                <div class="flex-center gap-md">
                    <button class="btn btn-secondary" id="quiz-retry-btn">ทำแบบทดสอบอีกครั้ง</button>
                    ${this.onComplete ? '<button class="btn btn-primary" id="quiz-continue-btn">เรียนบทต่อไป</button>' : ''}
                </div>
            </div>
        `;
        
        document.getElementById('quiz-retry-btn').onclick = () => {
            this.currentQIndex = 0;
            this.score = 0;
            this.userAnswers = new Array(this.questions.length).fill(null);
            this.isAnswered = false;
            this.render();
        };
        
        if (this.onComplete) {
            const contBtn = document.getElementById('quiz-continue-btn');
            if (contBtn) contBtn.onclick = () => this.onComplete(this.score, this.questions.length);
        }
    }
    
    // Helper to find $math$ and convert to KaTeX
    renderMathInEl(element) {
        if (typeof window.renderMathInElement === 'function') {
            try {
                window.renderMathInElement(element, {
                    delimiters: [
                        {left: '$$', right: '$$', display: true},
                        {left: '$', right: '$', display: false}
                    ],
                    throwOnError: false
                });
            } catch(e) {
                console.warn('KaTeX auto-render error in quiz:', e);
            }
        }
    }
}
