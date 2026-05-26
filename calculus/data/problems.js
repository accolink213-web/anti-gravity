/**
 * Problem Bank Data
 * Contains quizzes and step-by-step problems for all modules
 */
const ProblemBank = {
    limits: {
        quizzes: [
            {
                type: 'multiple-choice',
                question: 'ค่าของ $\\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2}$ คือเท่าใด?',
                options: ['0', '2', '4', 'หาค่าไม่ได้', '$\\infty$'],
                correctAnswer: 2, // '4'
                explanation: 'แทนค่า $x=2$ จะได้ $\\frac{0}{0}$ ต้องแยกตัวประกอบ: $\\frac{(x-2)(x+2)}{x-2} = x+2$ แทนค่า $x=2$ จะได้ $2+2 = 4$'
            },
            {
                type: 'multiple-choice',
                question: 'พิจารณาฟังก์ชัน $f(x) = \\frac{1}{x}$ ค่าของ $\\lim_{x \\to 0} f(x)$ คือเท่าใด?',
                options: ['0', '1', '$\\infty$', '$-\\infty$', 'หาค่าไม่ได้ (ไม่มีลิมิต)'],
                correctAnswer: 4,
                explanation: 'ลิมิตซ้ายเข้าหา $-\\infty$ ส่วนลิมิตขวาเข้าหา $\\infty$ ลิมิตทั้งสองด้านไม่เท่ากัน จึงไม่มีลิมิตที่ $x=0$'
            },
            {
                type: 'numeric',
                question: 'จงหาค่าของ $\\lim_{x \\to \\infty} \\frac{3x^2 + 2x - 1}{x^2 + 5}$',
                correctAnswer: 3,
                explanation: 'เมื่อ $x \\to \\infty$ ให้ดูที่สัมประสิทธิ์ของกำลังสูงสุด (ซึ่งคือกำลัง 2) จะได้ $\\frac{3}{1} = 3$'
            }
        ],
        steps: [
            {
                id: 'limit-1',
                title: 'การหาลิมิตด้วยการแยกตัวประกอบ',
                steps: [
                    {
                        text: 'จงหาค่าของลิมิตต่อไปนี้:',
                        math: '\\lim_{x \\to 3} \\frac{x^2 - 9}{x - 3}'
                    },
                    {
                        rule: 'แทนค่าโดยตรง',
                        text: 'เมื่อลองแทน $x = 3$ จะพบว่าอยู่ในรูปแบบที่ไม่กำหนด (Indeterminate Form)',
                        math: '\\frac{3^2 - 9}{3 - 3} = \\frac{0}{0}',
                        explanation: 'เมื่อได้ 0/0 เราต้องพยายามจัดรูปสมการใหม่'
                    },
                    {
                        rule: 'แยกตัวประกอบ',
                        text: 'แยกตัวประกอบของ $x^2 - 9$ ซึ่งเป็นผลต่างกำลังสอง',
                        math: '\\lim_{x \\to 3} \\frac{(x - 3)(x + 3)}{x - 3}',
                        explanation: 'ใช้สูตร $A^2 - B^2 = (A-B)(A+B)$'
                    },
                    {
                        rule: 'ตัดทอน',
                        text: 'เนื่องจาก $x \\to 3$ หมายความว่า $x$ เข้าใกล้ 3 แต่ไม่เท่ากับ 3 ดังนั้น $x-3 \\neq 0$ สามารถตัดกันได้',
                        math: '\\lim_{x \\to 3} (x + 3)'
                    },
                    {
                        rule: 'แทนค่าอีกครั้ง',
                        text: 'ตอนนี้เราสามารถแทนค่า $x = 3$ ได้แล้ว',
                        math: '3 + 3 = 6'
                    },
                    {
                        text: '<strong>สรุปคำตอบ:</strong>',
                        math: '\\lim_{x \\to 3} \\frac{x^2 - 9}{x - 3} = 6'
                    }
                ]
            }
        ]
    },
    
    derivatives: {
        quizzes: [
            {
                type: 'multiple-choice',
                question: 'ถ้า $f(x) = x^3 - 4x^2 + 5x - 2$ แล้ว $f\'(x)$ คืออะไร?',
                options: [
                    '$3x^2 - 8x + 5$',
                    '$3x^2 - 4x + 5$',
                    '$x^2 - 8x + 5$',
                    '$3x^3 - 8x^2 + 5$',
                    '$3x^2 - 8x$'
                ],
                correctAnswer: 0,
                explanation: 'ใช้ Power Rule ($d/dx(x^n) = n x^{n-1}$): $d/dx(x^3) = 3x^2$, $d/dx(-4x^2) = -8x$, $d/dx(5x) = 5$, $d/dx(-2) = 0$'
            },
            {
                type: 'multiple-choice',
                question: 'จงหาอนุพันธ์ของ $y = \\sin(2x)$',
                options: [
                    '$\\cos(2x)$',
                    '$2\\cos(2x)$',
                    '$-2\\cos(2x)$',
                    '$2\\sin(2x)$',
                    '$\\cos(x)$'
                ],
                correctAnswer: 1,
                explanation: 'ใช้ Chain Rule: อนุพันธ์ของ $\\sin(u)$ คือ $\\cos(u) \\cdot u\'$ ในที่นี้ $u = 2x$ ดังนั้น $u\' = 2$ จึงได้ $2\\cos(2x)$'
            }
        ],
        steps: [
            {
                id: 'deriv-chain',
                title: 'การใช้อนุพันธ์กฎลูกโซ่ (Chain Rule)',
                steps: [
                    {
                        text: 'จงหาอนุพันธ์ของฟังก์ชัน:',
                        math: 'f(x) = (3x^2 + 1)^4'
                    },
                    {
                        rule: 'วิเคราะห์ฟังก์ชัน',
                        text: 'ฟังก์ชันนี้เป็นฟังก์ชันประกอบ (Composite Function) ให้อยู่ในรูป $u^4$ โดยที่ $u = 3x^2 + 1$',
                        explanation: 'เราต้องใช้ Chain Rule: $\\frac{dy}{dx} = \\frac{dy}{du} \\cdot \\frac{du}{dx}$'
                    },
                    {
                        rule: 'หาอนุพันธ์ตัวนอก (dy/du)',
                        text: 'หาอนุพันธ์ของ $u^4$ เทียบกับ $u$',
                        math: '\\frac{d}{du}(u^4) = 4u^3'
                    },
                    {
                        rule: 'หาอนุพันธ์ตัวใน (du/dx)',
                        text: 'หาอนุพันธ์ของ $3x^2 + 1$ เทียบกับ $x$',
                        math: '\\frac{d}{dx}(3x^2 + 1) = 6x'
                    },
                    {
                        rule: 'ประกอบกลับเข้าด้วยกัน',
                        text: 'คูณอนุพันธ์ทั้งสองส่วนเข้าด้วยกัน',
                        math: 'f\'(x) = 4(3x^2 + 1)^3 \\cdot (6x)'
                    },
                    {
                        rule: 'จัดรูป',
                        text: 'จัดรูปให้สวยงามโดยคูณค่าคงที่เข้าด้วยกัน ($4 \\cdot 6x = 24x$)',
                        math: 'f\'(x) = 24x(3x^2 + 1)^3'
                    }
                ]
            }
        ]
    },
    
    // Will add other modules' data as needed
    integrals: { quizzes: [], steps: [] },
    applications: { quizzes: [], steps: [] },
    series: { quizzes: [], steps: [] },
    diffeq: { quizzes: [], steps: [] }
};
