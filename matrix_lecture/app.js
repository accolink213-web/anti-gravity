/* ========================================
   MATRIX ACADEMY — Application Logic
   ======================================== */

// ============================================================
// INITIALIZATION
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initParticles();
  initCalculator();
  initScenarioTabs();
  initScrollAnimations();
  initTransformDemo();
  init3DDemo();
  initPageRankCanvas();
});

// ============================================================
// NAVIGATION
// ============================================================

function initNavigation() {
  const nav = document.getElementById('mainNav');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  // Scroll effect
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Mobile toggle
  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
    toggle.textContent = links.classList.contains('open') ? '✕' : '☰';
  });

  // Close mobile menu on link click
  links.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.textContent = '☰';
    });
  });

  // Active link tracking
  const sections = document.querySelectorAll('.section, .hero');
  const navAnchors = links.querySelectorAll('a');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 100;
      if (window.scrollY >= top) current = section.id;
    });
    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  });
}

// ============================================================
// PARTICLE BACKGROUND
// ============================================================

function initParticles() {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const COUNT = 60;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 1.5 + 0.5;
      this.opacity = Math.random() * 0.4 + 0.1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(139, 92, 246, ${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(139, 92, 246, ${0.06 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}

// ============================================================
// SCROLL ANIMATIONS (Fade In)
// ============================================================

function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// Card mouse glow effect
document.addEventListener('mousemove', (e) => {
  document.querySelectorAll('.card').forEach(card => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  });
});

// ============================================================
// MATRIX OPERATIONS (Pure Functions)
// ============================================================

function matrixAdd(A, B) {
  return A.map((row, i) => row.map((val, j) => val + B[i][j]));
}

function matrixSubtract(A, B) {
  return A.map((row, i) => row.map((val, j) => val - B[i][j]));
}

function matrixMultiply(A, B) {
  const rowsA = A.length, colsA = A[0].length;
  const colsB = B[0].length;
  const C = [];
  for (let i = 0; i < rowsA; i++) {
    C[i] = [];
    for (let j = 0; j < colsB; j++) {
      let sum = 0;
      for (let k = 0; k < colsA; k++) {
        sum += A[i][k] * B[k][j];
      }
      C[i][j] = sum;
    }
  }
  return C;
}

function scalarMultiply(s, A) {
  return A.map(row => row.map(val => s * val));
}

function transpose(A) {
  const rows = A.length, cols = A[0].length;
  const T = [];
  for (let j = 0; j < cols; j++) {
    T[j] = [];
    for (let i = 0; i < rows; i++) {
      T[j][i] = A[i][j];
    }
  }
  return T;
}

function determinant(A) {
  const n = A.length;
  if (n === 1) return A[0][0];
  if (n === 2) return A[0][0] * A[1][1] - A[0][1] * A[1][0];
  // Expansion by first row
  let det = 0;
  for (let j = 0; j < n; j++) {
    det += Math.pow(-1, j) * A[0][j] * determinant(minor(A, 0, j));
  }
  return det;
}

function minor(A, row, col) {
  return A.filter((_, i) => i !== row).map(r => r.filter((_, j) => j !== col));
}

function cofactorMatrix(A) {
  const n = A.length;
  const C = [];
  for (let i = 0; i < n; i++) {
    C[i] = [];
    for (let j = 0; j < n; j++) {
      C[i][j] = Math.pow(-1, i + j) * determinant(minor(A, i, j));
    }
  }
  return C;
}

function inverse(A) {
  const det = determinant(A);
  if (Math.abs(det) < 1e-10) return null; // Singular
  const n = A.length;
  if (n === 1) return [[1 / A[0][0]]];
  const cofactor = cofactorMatrix(A);
  const adjugate = transpose(cofactor);
  return adjugate.map(row => row.map(val => val / det));
}

// ============================================================
// CALCULATOR UI
// ============================================================

let currentOperation = 'add';

function initCalculator() {
  const opSelect = document.getElementById('calcOperation');
  opSelect.addEventListener('change', onOperationChange);

  ['rowsA', 'colsA', 'rowsB', 'colsB'].forEach(id => {
    document.getElementById(id).addEventListener('change', rebuildMatrixInputs);
  });

  onOperationChange();
  rebuildMatrixInputs();
}

function onOperationChange() {
  const op = document.getElementById('calcOperation').value;
  currentOperation = op;

  const matrixBBlock = document.getElementById('matrixBBlock');
  const operatorSymbol = document.getElementById('calcOperatorSymbol');
  const scalarGroup = document.getElementById('scalarGroup');
  const sizeBRowsGroup = document.getElementById('sizeB-rows-group');
  const sizeBColsGroup = document.getElementById('sizeB-cols-group');
  const rowsA = document.getElementById('rowsA');
  const colsA = document.getElementById('colsA');
  const rowsB = document.getElementById('rowsB');
  const colsB = document.getElementById('colsB');

  // Determine visibility
  const isBinary = ['add', 'subtract', 'multiply'].includes(op);
  const isScalar = op === 'scalar';
  const isSquareOnly = ['determinant', 'inverse'].includes(op);

  matrixBBlock.style.display = isBinary ? '' : 'none';
  operatorSymbol.style.display = isBinary ? '' : 'none';
  scalarGroup.style.display = isScalar ? '' : 'none';
  sizeBRowsGroup.style.display = isBinary ? '' : 'none';
  sizeBColsGroup.style.display = isBinary ? '' : 'none';

  // Update operator symbol
  const symbols = { add: '+', subtract: '−', multiply: '×' };
  operatorSymbol.textContent = symbols[op] || '';

  // For add/subtract, sync B size with A
  if (op === 'add' || op === 'subtract') {
    rowsB.value = rowsA.value;
    colsB.value = colsA.value;
    rowsB.disabled = true;
    colsB.disabled = true;
  } else if (op === 'multiply') {
    rowsB.value = colsA.value; // rows B = cols A
    rowsB.disabled = true;
    colsB.disabled = false;
  } else {
    rowsB.disabled = false;
    colsB.disabled = false;
  }

  // For square-only ops
  if (isSquareOnly) {
    colsA.value = rowsA.value;
    colsA.disabled = true;
  } else {
    colsA.disabled = false;
  }

  rebuildMatrixInputs();
  hideResult();
}

function rebuildMatrixInputs() {
  const op = currentOperation;
  const rA = parseInt(document.getElementById('rowsA').value);
  let cA = parseInt(document.getElementById('colsA').value);

  if (['determinant', 'inverse'].includes(op)) {
    cA = rA;
    document.getElementById('colsA').value = rA;
  }

  buildGrid('matrixAGrid', rA, cA);

  if (['add', 'subtract'].includes(op)) {
    document.getElementById('rowsB').value = rA;
    document.getElementById('colsB').value = cA;
    buildGrid('matrixBGrid', rA, cA);
  } else if (op === 'multiply') {
    const rB = cA;
    document.getElementById('rowsB').value = rB;
    const cB = parseInt(document.getElementById('colsB').value);
    buildGrid('matrixBGrid', rB, cB);
  } else if (['add', 'subtract', 'multiply'].includes(op)) {
    const rB = parseInt(document.getElementById('rowsB').value);
    const cB = parseInt(document.getElementById('colsB').value);
    buildGrid('matrixBGrid', rB, cB);
  }
}

function buildGrid(gridId, rows, cols) {
  const grid = document.getElementById(gridId);
  grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  grid.innerHTML = '';
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const inp = document.createElement('input');
      inp.type = 'number';
      inp.step = 'any';
      inp.placeholder = `${i + 1},${j + 1}`;
      inp.id = `${gridId}_${i}_${j}`;
      inp.setAttribute('aria-label', `แถว ${i + 1} หลัก ${j + 1}`);
      grid.appendChild(inp);
    }
  }
}

function readMatrix(gridId) {
  const grid = document.getElementById(gridId);
  const inputs = grid.querySelectorAll('input');
  const cols = parseInt(grid.style.gridTemplateColumns.split(' ').length) ||
    grid.style.gridTemplateColumns.match(/repeat\((\d+)/)?.[1];
  const colCount = parseInt(grid.style.gridTemplateColumns.match(/repeat\((\d+)/)?.[1] || '2');

  const matrix = [];
  let row = [];
  inputs.forEach((inp, idx) => {
    const val = parseFloat(inp.value) || 0;
    row.push(val);
    if (row.length === colCount) {
      matrix.push(row);
      row = [];
    }
  });
  if (row.length > 0) matrix.push(row);
  return matrix;
}

function fillRandom() {
  document.querySelectorAll('.matrix-input-grid input').forEach(inp => {
    if (inp.closest('.matrix-input-grid').offsetParent !== null ||
      inp.closest('.calc-matrix-block').style.display !== 'none') {
      inp.value = Math.floor(Math.random() * 19) - 9; // -9 to 9
    }
  });
}

function scrollToCalcWithOp(op) {
  document.getElementById('calcOperation').value = op;
  onOperationChange();
  document.getElementById('calculator').scrollIntoView({ behavior: 'smooth' });
}

// ============================================================
// CALCULATION & RESULTS
// ============================================================

function calculate() {
  hideResult();
  const op = currentOperation;
  const A = readMatrix('matrixAGrid');

  let result, steps, isScalarResult = false;

  try {
    switch (op) {
      case 'add': {
        const B = readMatrix('matrixBGrid');
        validateSameSize(A, B);
        result = matrixAdd(A, B);
        steps = generateAddSteps(A, B, '+');
        break;
      }
      case 'subtract': {
        const B = readMatrix('matrixBGrid');
        validateSameSize(A, B);
        result = matrixSubtract(A, B);
        steps = generateAddSteps(A, B, '−');
        break;
      }
      case 'multiply': {
        const B = readMatrix('matrixBGrid');
        if (A[0].length !== B.length) {
          throw new Error(`ไม่สามารถคูณได้: จำนวนหลักของ A (${A[0].length}) ต้องเท่ากับจำนวนแถวของ B (${B.length})`);
        }
        result = matrixMultiply(A, B);
        steps = generateMultiplySteps(A, B);
        break;
      }
      case 'scalar': {
        const s = parseFloat(document.getElementById('scalarValue').value) || 0;
        result = scalarMultiply(s, A);
        steps = generateScalarSteps(s, A);
        break;
      }
      case 'transpose': {
        result = transpose(A);
        steps = generateTransposeSteps(A);
        break;
      }
      case 'determinant': {
        validateSquare(A);
        const det = determinant(A);
        result = det;
        isScalarResult = true;
        steps = generateDeterminantSteps(A);
        break;
      }
      case 'inverse': {
        validateSquare(A);
        const det = determinant(A);
        if (Math.abs(det) < 1e-10) {
          throw new Error('เมทริกซ์นี้ไม่มีอินเวอร์ส (det = 0 — Singular Matrix)');
        }
        result = inverse(A);
        steps = generateInverseSteps(A);
        break;
      }
    }

    showResult(result, isScalarResult, steps, op);
  } catch (err) {
    showError(err.message);
  }
}

function validateSameSize(A, B) {
  if (A.length !== B.length || A[0].length !== B[0].length) {
    throw new Error(`เมทริกซ์ต้องมีขนาดเท่ากัน: A(${A.length}×${A[0].length}) ≠ B(${B.length}×${B[0].length})`);
  }
}

function validateSquare(A) {
  if (A.length !== A[0].length) {
    throw new Error(`ต้องเป็นเมทริกซ์จัตุรัส: ได้ ${A.length}×${A[0].length}`);
  }
}

function showResult(result, isScalar, steps, op) {
  const container = document.getElementById('calcResult');
  const label = document.getElementById('resultLabel');
  const display = document.getElementById('resultDisplay');
  const stepsList = document.getElementById('stepsList');

  const opNames = {
    add: 'A + B', subtract: 'A − B', multiply: 'A × B',
    scalar: 'k · A', transpose: 'Aᵀ', determinant: 'det(A)', inverse: 'A⁻¹'
  };

  label.innerHTML = `<span class="icon">✅</span> ผลลัพธ์ ${opNames[op]}`;

  if (isScalar) {
    display.innerHTML = `<div class="result-scalar"><div class="scalar-value">${formatNum(result)}</div></div>`;
  } else {
    const rows = result.length;
    const cols = result[0].length;
    let gridHTML = '';
    result.forEach(row => {
      row.forEach(val => {
        gridHTML += `<span>${formatNum(val)}</span>`;
      });
    });
    display.innerHTML = `
      <div class="result-matrix-display">
        <div class="result-matrix">
          <span class="result-bracket">[</span>
          <div class="result-grid" style="grid-template-columns: repeat(${cols}, auto);">
            ${gridHTML}
          </div>
          <span class="result-bracket">]</span>
        </div>
      </div>`;
  }

  // Steps
  stepsList.innerHTML = '';
  steps.forEach((step, i) => {
    stepsList.innerHTML += `
      <div class="step-card">
        <div class="step-number">${i + 1}</div>
        <div class="step-text">${step}</div>
      </div>`;
  });

  container.classList.add('visible');
  container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showError(msg) {
  const container = document.getElementById('calcResult');
  const display = document.getElementById('resultDisplay');
  const label = document.getElementById('resultLabel');
  const stepsList = document.getElementById('stepsList');

  label.innerHTML = '<span class="icon">❌</span> เกิดข้อผิดพลาด';
  display.innerHTML = `<div class="error-message">${msg}</div>`;
  stepsList.innerHTML = '';
  container.classList.add('visible');
}

function hideResult() {
  document.getElementById('calcResult').classList.remove('visible');
  document.getElementById('stepsList').classList.remove('visible');
}

function toggleSteps() {
  document.getElementById('stepsList').classList.toggle('visible');
  const btn = document.getElementById('stepsToggle');
  const isVisible = document.getElementById('stepsList').classList.contains('visible');
  btn.textContent = isVisible ? '📝 ซ่อนวิธีทำ' : '📝 ดูวิธีทำทีละขั้นตอน';
}

function formatNum(n) {
  if (Number.isInteger(n)) return n.toString();
  // Show as fraction if close to simple fraction
  const rounded = Math.round(n * 1000) / 1000;
  if (rounded === Math.round(rounded)) return Math.round(rounded).toString();
  return rounded.toFixed(3);
}

// ============================================================
// STEP-BY-STEP GENERATORS
// ============================================================

function generateAddSteps(A, B, symbol) {
  const steps = [];
  const rows = A.length, cols = A[0].length;
  steps.push(`เมทริกซ์ทั้งสองมีขนาด <span class="highlight">${rows}×${cols}</span> เท่ากัน จึง${symbol === '+' ? 'บวก' : 'ลบ'}กันได้`);
  steps.push(`${symbol === '+' ? 'บวก' : 'ลบ'}สมาชิกในตำแหน่งเดียวกันทีละตัว: <span class="formula">C[i][j] = A[i][j] ${symbol} B[i][j]</span>`);

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const res = symbol === '+' ? A[i][j] + B[i][j] : A[i][j] - B[i][j];
      steps.push(
        `ตำแหน่ง [${i + 1},${j + 1}]: <span class="formula">${A[i][j]} ${symbol} ${B[i][j]} = ${formatNum(res)}</span>`
      );
    }
  }
  return steps;
}

function generateMultiplySteps(A, B) {
  const steps = [];
  const rA = A.length, cA = A[0].length, cB = B[0].length;
  steps.push(`A ขนาด <span class="highlight">${rA}×${cA}</span> คูณ B ขนาด <span class="highlight">${cA}×${cB}</span> ได้ผลลัพธ์ขนาด <span class="highlight">${rA}×${cB}</span>`);
  steps.push(`สูตร: <span class="formula">C[i][j] = Σ A[i][k] × B[k][j]</span> สำหรับ k = 1 ถึง ${cA}`);

  for (let i = 0; i < rA; i++) {
    for (let j = 0; j < cB; j++) {
      const terms = [];
      let sum = 0;
      for (let k = 0; k < cA; k++) {
        terms.push(`${A[i][k]}×${B[k][j]}`);
        sum += A[i][k] * B[k][j];
      }
      steps.push(
        `C[${i + 1},${j + 1}] = <span class="formula">${terms.join(' + ')} = ${formatNum(sum)}</span>`
      );
    }
  }
  return steps;
}

function generateScalarSteps(s, A) {
  const steps = [];
  steps.push(`คูณทุกสมาชิกด้วยสเกลาร์ <span class="highlight">k = ${s}</span>`);
  steps.push(`สูตร: <span class="formula">(kA)[i][j] = k × A[i][j]</span>`);
  for (let i = 0; i < A.length; i++) {
    for (let j = 0; j < A[0].length; j++) {
      steps.push(
        `ตำแหน่ง [${i + 1},${j + 1}]: <span class="formula">${s} × ${A[i][j]} = ${formatNum(s * A[i][j])}</span>`
      );
    }
  }
  return steps;
}

function generateTransposeSteps(A) {
  const steps = [];
  const rows = A.length, cols = A[0].length;
  steps.push(`เมทริกซ์เดิมขนาด <span class="highlight">${rows}×${cols}</span> → ทรานสโพสได้ <span class="highlight">${cols}×${rows}</span>`);
  steps.push(`สลับแถวเป็นหลักและหลักเป็นแถว: <span class="formula">Aᵀ[j][i] = A[i][j]</span>`);

  for (let j = 0; j < cols; j++) {
    const vals = [];
    for (let i = 0; i < rows; i++) {
      vals.push(A[i][j]);
    }
    steps.push(`หลักที่ ${j + 1} ของ A → แถวที่ ${j + 1} ของ Aᵀ: <span class="formula">[${vals.join(', ')}]</span>`);
  }
  return steps;
}

function generateDeterminantSteps(A) {
  const steps = [];
  const n = A.length;

  if (n === 2) {
    steps.push(`เมทริกซ์ 2×2: ใช้สูตร <span class="formula">det = ad − bc</span>`);
    steps.push(`<span class="formula">a=${A[0][0]}, b=${A[0][1]}, c=${A[1][0]}, d=${A[1][1]}</span>`);
    const ad = A[0][0] * A[1][1];
    const bc = A[0][1] * A[1][0];
    steps.push(`<span class="formula">ad = ${A[0][0]} × ${A[1][1]} = ${formatNum(ad)}</span>`);
    steps.push(`<span class="formula">bc = ${A[0][1]} × ${A[1][0]} = ${formatNum(bc)}</span>`);
    steps.push(`<span class="formula">det = ${formatNum(ad)} − ${formatNum(bc)} = ${formatNum(ad - bc)}</span>`);
  } else if (n === 3) {
    steps.push(`เมทริกซ์ 3×3: ใช้ <span class="highlight">Cofactor Expansion</span> ตามแถวที่ 1`);
    steps.push(`<span class="formula">det = a₁₁·C₁₁ − a₁₂·C₁₂ + a₁₃·C₁₃</span>`);

    for (let j = 0; j < 3; j++) {
      const sign = j % 2 === 0 ? '+' : '−';
      const m = minor(A, 0, j);
      const mDet = determinant(m);
      steps.push(
        `${sign} ${A[0][j]} × det<span class="formula">[${m[0].join(',')}; ${m[1].join(',')}]</span> = ${sign} ${A[0][j]} × ${formatNum(mDet)} = <span class="formula">${formatNum(Math.pow(-1, j) * A[0][j] * mDet)}</span>`
      );
    }
    steps.push(`ผลรวม: <span class="formula">det = ${formatNum(determinant(A))}</span>`);
  } else {
    steps.push(`เมทริกซ์ ${n}×${n}: ใช้ Cofactor Expansion ตามแถวที่ 1`);
    steps.push(`<span class="formula">det = ${formatNum(determinant(A))}</span>`);
  }

  return steps;
}

function generateInverseSteps(A) {
  const steps = [];
  const n = A.length;
  const det = determinant(A);

  steps.push(`ขั้นตอนที่ 1: หา <span class="highlight">det(A)</span>`);
  steps.push(`<span class="formula">det(A) = ${formatNum(det)}</span> (≠ 0 จึงมีอินเวอร์ส)`);

  if (n === 2) {
    steps.push(`สูตร 2×2: <span class="formula">A⁻¹ = (1/det) × [d, −b; −c, a]</span>`);
    steps.push(`<span class="formula">A⁻¹ = (1/${formatNum(det)}) × [${A[1][1]}, ${-A[0][1]}; ${-A[1][0]}, ${A[0][0]}]</span>`);
  } else {
    steps.push(`ขั้นตอนที่ 2: หา <span class="highlight">Cofactor Matrix</span>`);
    steps.push(`ขั้นตอนที่ 3: Transpose Cofactor → <span class="highlight">Adjugate Matrix</span>`);
    steps.push(`ขั้นตอนที่ 4: <span class="formula">A⁻¹ = (1/det) × adj(A)</span>`);
  }

  const inv = inverse(A);
  const display = inv.map(row => `[${row.map(v => formatNum(v)).join(', ')}]`).join('<br>');
  steps.push(`ผลลัพธ์: <span class="formula">${display}</span>`);

  return steps;
}

// ============================================================
// SCENARIO TABS
// ============================================================

function initScenarioTabs() {
  document.querySelectorAll('.scenario-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.scenario-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.scenario-content').forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const targetId = 'scenario-' + tab.dataset.tab;
      document.getElementById(targetId).classList.add('active');

      // Re-init demos when switching
      if (tab.dataset.tab === 'transform') initTransformDemo();
      if (tab.dataset.tab === 'graphics') init3DDemo();
      if (tab.dataset.tab === 'pagerank') initPageRankCanvas();
    });
  });
}

// ============================================================
// SCENARIO 1: 2D TRANSFORM DEMO
// ============================================================

let currentTransformType = 'rotate';

function setTransform(type) {
  currentTransformType = type;
  const slider = document.getElementById('transformSlider');
  const label = document.getElementById('transformLabel');
  const valueSpan = document.getElementById('transformValue');

  document.querySelectorAll('.scenario-demo .demo-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('btn-' + type).classList.add('active');

  if (type === 'rotate') {
    slider.min = 0; slider.max = 360; slider.value = 0;
    label.innerHTML = `มุมหมุน: <span id="transformValue">0</span>°`;
  } else if (type === 'scale') {
    slider.min = 10; slider.max = 300; slider.value = 100;
    label.innerHTML = `สเกล: <span id="transformValue">100</span>%`;
  } else if (type === 'shear') {
    slider.min = -200; slider.max = 200; slider.value = 0;
    label.innerHTML = `เฉือน: <span id="transformValue">0</span>%`;
  }
  updateTransformDemo();
}

function initTransformDemo() {
  setTransform('rotate');
  updateTransformDemo();
}

function updateTransformDemo() {
  const canvas = document.getElementById('transformCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const cx = w / 2, cy = h / 2;
  const slider = document.getElementById('transformSlider');
  const val = parseFloat(slider.value);

  document.getElementById('transformValue').textContent = Math.round(val);

  ctx.clearRect(0, 0, w, h);

  // Grid
  ctx.strokeStyle = 'rgba(139, 92, 246, 0.08)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= w; x += 20) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for (let y = 0; y <= h; y += 20) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }

  // Axes
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke();

  // Original shape (square)
  const shape = [[-40, -40], [40, -40], [40, 40], [-40, 40]];

  // Draw original (faint)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  shape.forEach((p, i) => {
    const x = cx + p[0], y = cy + p[1];
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.stroke();
  ctx.setLineDash([]);

  // Build transform matrix
  let m;
  if (currentTransformType === 'rotate') {
    const rad = (val * Math.PI) / 180;
    m = [[Math.cos(rad), -Math.sin(rad)], [Math.sin(rad), Math.cos(rad)]];
  } else if (currentTransformType === 'scale') {
    const s = val / 100;
    m = [[s, 0], [0, s]];
  } else {
    const s = val / 100;
    m = [[1, s], [0, 1]];
  }

  // Transform and draw
  const transformed = shape.map(p => [
    m[0][0] * p[0] + m[0][1] * p[1],
    m[1][0] * p[0] + m[1][1] * p[1]
  ]);

  // Fill
  ctx.fillStyle = 'rgba(139, 92, 246, 0.15)';
  ctx.beginPath();
  transformed.forEach((p, i) => {
    const x = cx + p[0], y = cy + p[1];
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fill();

  // Stroke
  ctx.strokeStyle = '#8b5cf6';
  ctx.lineWidth = 2;
  ctx.beginPath();
  transformed.forEach((p, i) => {
    const x = cx + p[0], y = cy + p[1];
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.stroke();

  // Vertices
  transformed.forEach(p => {
    ctx.beginPath();
    ctx.arc(cx + p[0], cy + p[1], 4, 0, Math.PI * 2);
    ctx.fillStyle = '#06b6d4';
    ctx.fill();
  });

  // Matrix display
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(4, 4, 130, 45);
  ctx.font = '11px JetBrains Mono, monospace';
  ctx.fillStyle = '#06b6d4';
  ctx.fillText(`[${m[0][0].toFixed(2)}  ${m[0][1].toFixed(2)}]`, 10, 22);
  ctx.fillText(`[${m[1][0].toFixed(2)}  ${m[1][1].toFixed(2)}]`, 10, 40);
}

// ============================================================
// SCENARIO 3: 3D GRAPHICS DEMO
// ============================================================

function init3DDemo() {
  update3DDemo();
}

function update3DDemo() {
  const canvas = document.getElementById('graphics3dCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  const cx = w / 2, cy = h / 2;

  const rotY = (parseFloat(document.getElementById('rotYSlider').value) * Math.PI) / 180;
  const rotX = (parseFloat(document.getElementById('rotXSlider').value) * Math.PI) / 180;

  document.getElementById('rotYValue').textContent = Math.round(rotY * 180 / Math.PI);
  document.getElementById('rotXValue').textContent = Math.round(rotX * 180 / Math.PI);

  ctx.clearRect(0, 0, w, h);

  // Grid
  ctx.strokeStyle = 'rgba(59, 130, 246, 0.06)';
  for (let x = 0; x <= w; x += 20) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for (let y = 0; y <= h; y += 20) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }

  // Cube vertices
  const s = 55;
  const vertices = [
    [-s, -s, -s], [s, -s, -s], [s, s, -s], [-s, s, -s],
    [-s, -s, s], [s, -s, s], [s, s, s], [-s, s, s]
  ];

  const edges = [
    [0, 1], [1, 2], [2, 3], [3, 0],
    [4, 5], [5, 6], [6, 7], [7, 4],
    [0, 4], [1, 5], [2, 6], [3, 7]
  ];

  // Rotation matrices
  function rotateY(p) {
    return [
      Math.cos(rotY) * p[0] + Math.sin(rotY) * p[2],
      p[1],
      -Math.sin(rotY) * p[0] + Math.cos(rotY) * p[2]
    ];
  }

  function rotateX(p) {
    return [
      p[0],
      Math.cos(rotX) * p[1] - Math.sin(rotX) * p[2],
      Math.sin(rotX) * p[1] + Math.cos(rotX) * p[2]
    ];
  }

  function project(p) {
    const scale = 300 / (300 + p[2]);
    return [cx + p[0] * scale, cy + p[1] * scale, p[2]];
  }

  const projected = vertices.map(v => project(rotateX(rotateY(v))));

  // Draw edges
  edges.forEach(([a, b]) => {
    const pa = projected[a], pb = projected[b];
    const avgZ = (vertices[a][2] + vertices[b][2]) / 2;
    const alpha = 0.3 + 0.5 * (1 - (avgZ + s) / (2 * s));

    ctx.strokeStyle = `rgba(59, 130, 246, ${alpha.toFixed(2)})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(pa[0], pa[1]);
    ctx.lineTo(pb[0], pb[1]);
    ctx.stroke();
  });

  // Draw vertices
  projected.forEach((p, i) => {
    ctx.beginPath();
    ctx.arc(p[0], p[1], 4, 0, Math.PI * 2);
    ctx.fillStyle = i < 4 ? '#8b5cf6' : '#06b6d4';
    ctx.fill();
  });

  // Matrix label
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(4, 4, 150, 30);
  ctx.font = '11px JetBrains Mono, monospace';
  ctx.fillStyle = '#3b82f6';
  ctx.fillText(`Ry=${Math.round(rotY * 180 / Math.PI)}° Rx=${Math.round(rotX * 180 / Math.PI)}°`, 10, 23);
}

// ============================================================
// SCENARIO 4: HILL CIPHER
// ============================================================

function hillEncrypt() {
  let text = (document.getElementById('cipherInput').value || '').toUpperCase().replace(/[^A-Z]/g, '');
  if (text.length === 0) {
    document.getElementById('cipherOutput').textContent = 'กรุณาพิมพ์ข้อความ';
    return;
  }
  // Pad to even length
  if (text.length % 2 !== 0) text += 'X';

  const K = [[3, 3], [2, 5]];
  let result = '';

  for (let i = 0; i < text.length; i += 2) {
    const p1 = text.charCodeAt(i) - 65;
    const p2 = text.charCodeAt(i + 1) - 65;
    const c1 = (K[0][0] * p1 + K[0][1] * p2) % 26;
    const c2 = (K[1][0] * p1 + K[1][1] * p2) % 26;
    result += String.fromCharCode(((c1 % 26) + 26) % 26 + 65);
    result += String.fromCharCode(((c2 % 26) + 26) % 26 + 65);
  }

  document.getElementById('cipherOutput').innerHTML =
    `<strong>เข้ารหัส:</strong> ${text} → <span style="color:var(--accent-purple);font-weight:700;">${result}</span>`;
}

function hillDecrypt() {
  let text = (document.getElementById('cipherInput').value || '').toUpperCase().replace(/[^A-Z]/g, '');
  if (text.length === 0) {
    document.getElementById('cipherOutput').textContent = 'กรุณาพิมพ์ข้อความ';
    return;
  }
  if (text.length % 2 !== 0) text += 'X';

  // Inverse of K = [[3,3],[2,5]] mod 26
  // det = 15-6 = 9, 9^-1 mod 26 = 3 (since 9*3=27≡1 mod 26)
  // adj = [[5,-3],[-2,3]]
  // K^-1 = 3 * [[5,-3],[-2,3]] mod 26 = [[15,-9],[-6,9]] mod 26 = [[15,17],[20,9]]
  const Ki = [[15, 17], [20, 9]];
  let result = '';

  for (let i = 0; i < text.length; i += 2) {
    const c1 = text.charCodeAt(i) - 65;
    const c2 = text.charCodeAt(i + 1) - 65;
    const p1 = (Ki[0][0] * c1 + Ki[0][1] * c2) % 26;
    const p2 = (Ki[1][0] * c1 + Ki[1][1] * c2) % 26;
    result += String.fromCharCode(((p1 % 26) + 26) % 26 + 65);
    result += String.fromCharCode(((p2 % 26) + 26) % 26 + 65);
  }

  document.getElementById('cipherOutput').innerHTML =
    `<strong>ถอดรหัส:</strong> ${text} → <span style="color:var(--accent-green);font-weight:700;">${result}</span>`;
}

// ============================================================
// SCENARIO 2: ECONOMICS (LEONTIEF)
// ============================================================

function calculateEconomics() {
  const d1 = parseFloat(document.getElementById('econD1').value) || 0;
  const d2 = parseFloat(document.getElementById('econD2').value) || 0;

  // A = [[0.2, 0.3],[0.4, 0.1]]
  // I - A = [[0.8, -0.3],[-0.4, 0.9]]
  // det(I-A) = 0.72 - 0.12 = 0.60
  // (I-A)^-1 = (1/0.6) * [[0.9, 0.3],[0.4, 0.8]]
  //          = [[1.5, 0.5],[0.667, 1.333]]

  const invIA = [[1.5, 0.5], [2 / 3, 4 / 3]];
  const x1 = invIA[0][0] * d1 + invIA[0][1] * d2;
  const x2 = invIA[1][0] * d1 + invIA[1][1] * d2;

  document.getElementById('econOutput').innerHTML =
    `<strong>A (Input-Output Matrix):</strong><br>` +
    `&nbsp;&nbsp;[0.2, 0.3]<br>&nbsp;&nbsp;[0.4, 0.1]<br><br>` +
    `<strong>(I−A)⁻¹:</strong><br>` +
    `&nbsp;&nbsp;[${invIA[0][0].toFixed(3)}, ${invIA[0][1].toFixed(3)}]<br>` +
    `&nbsp;&nbsp;[${invIA[1][0].toFixed(3)}, ${invIA[1][1].toFixed(3)}]<br><br>` +
    `<strong>ผลผลิตที่ต้องผลิต:</strong><br>` +
    `&nbsp;&nbsp;อุตสาหกรรม 1: <span style="color:var(--accent-cyan);font-weight:700;">${x1.toFixed(1)}</span> หน่วย<br>` +
    `&nbsp;&nbsp;อุตสาหกรรม 2: <span style="color:var(--accent-cyan);font-weight:700;">${x2.toFixed(1)}</span> หน่วย`;
}

// ============================================================
// SCENARIO 5: PAGERANK
// ============================================================

function initPageRankCanvas() {
  const canvas = document.getElementById('pagerankCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  drawPageRankGraph(ctx, canvas.width, canvas.height, null);
}

function drawPageRankGraph(ctx, w, h, ranks) {
  ctx.clearRect(0, 0, w, h);

  // Grid
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.06)';
  for (let x = 0; x <= w; x += 20) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for (let y = 0; y <= h; y += 20) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }

  // Node positions
  const nodes = [
    { x: 140, y: 50, label: 'A' },
    { x: 240, y: 140, label: 'B' },
    { x: 200, y: 240, label: 'C' },
    { x: 80, y: 240, label: 'D' },
    { x: 40, y: 140, label: 'E' }
  ];

  // Edges (from -> to)
  const edges = [
    [0, 1], [0, 2],
    [1, 2],
    [2, 0], [2, 3],
    [3, 4],
    [4, 0], [4, 2]
  ];

  // Draw edges
  edges.forEach(([from, to]) => {
    const fx = nodes[from].x, fy = nodes[from].y;
    const tx = nodes[to].x, ty = nodes[to].y;

    const dx = tx - fx, dy = ty - fy;
    const len = Math.sqrt(dx * dx + dy * dy);
    const ux = dx / len, uy = dy / len;

    const startX = fx + ux * 22, startY = fy + uy * 22;
    const endX = tx - ux * 22, endY = ty - uy * 22;

    ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Arrowhead
    const angle = Math.atan2(endY - startY, endX - startX);
    ctx.fillStyle = 'rgba(6, 182, 212, 0.5)';
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(endX - 10 * Math.cos(angle - 0.3), endY - 10 * Math.sin(angle - 0.3));
    ctx.lineTo(endX - 10 * Math.cos(angle + 0.3), endY - 10 * Math.sin(angle + 0.3));
    ctx.closePath();
    ctx.fill();
  });

  // Draw nodes
  nodes.forEach((node, i) => {
    const r = ranks ? Math.max(15, ranks[i] * 80) : 20;

    // Glow
    const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, r + 10);
    gradient.addColorStop(0, 'rgba(139, 92, 246, 0.3)');
    gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(node.x, node.y, r + 10, 0, Math.PI * 2);
    ctx.fill();

    // Node circle
    ctx.fillStyle = ranks ? `rgba(139, 92, 246, ${0.3 + ranks[i] * 2})` : 'rgba(139, 92, 246, 0.5)';
    ctx.beginPath();
    ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Label
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.label, node.x, node.y);

    // Rank value
    if (ranks) {
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.fillStyle = '#06b6d4';
      ctx.fillText((ranks[i] * 100).toFixed(1) + '%', node.x, node.y + r + 14);
    }
  });
}

function simulatePageRank() {
  // Transition matrix for the graph
  // A links to B, C (2 outgoing)
  // B links to C (1 outgoing)
  // C links to A, D (2 outgoing)
  // D links to E (1 outgoing)
  // E links to A, C (2 outgoing)

  const M = [
    [0, 0, 0.5, 0, 0.5],    // Column for who links to A
    [0.5, 0, 0, 0, 0],      // Column for who links to B
    [0.5, 1, 0, 0, 0.5],    // Column for who links to C
    [0, 0, 0.5, 0, 0],      // Column for who links to D
    [0, 0, 0, 1, 0]         // Column for who links to E
  ];

  const d = 0.85;
  const n = 5;
  let r = [0.2, 0.2, 0.2, 0.2, 0.2];

  const canvas = document.getElementById('pagerankCanvas');
  const ctx = canvas.getContext('2d');
  let iteration = 0;
  const maxIter = 20;

  const outputEl = document.getElementById('pagerankOutput');

  function step() {
    if (iteration >= maxIter) {
      outputEl.innerHTML = `<strong>ลู่เข้าแล้ว (${maxIter} iterations):</strong><br>` +
        ['A', 'B', 'C', 'D', 'E'].map((label, i) =>
          `${label}: ${(r[i] * 100).toFixed(1)}%`
        ).join(' | ');
      return;
    }

    const newR = [];
    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = 0; j < n; j++) {
        sum += M[i][j] * r[j];
      }
      newR.push((1 - d) / n + d * sum);
    }
    r = newR;
    iteration++;

    drawPageRankGraph(ctx, canvas.width, canvas.height, r);
    outputEl.innerHTML = `<strong>Iteration ${iteration}:</strong> ` +
      ['A', 'B', 'C', 'D', 'E'].map((label, i) =>
        `${label}=${(r[i] * 100).toFixed(1)}%`
      ).join(' ');

    if (iteration < maxIter) {
      setTimeout(step, 200);
    }
  }

  iteration = 0;
  r = [0.2, 0.2, 0.2, 0.2, 0.2];
  step();
}
