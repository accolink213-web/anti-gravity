/**
 * Main Application Logic
 * Handles routing, module loading, UI interactions, and state
 */

// App State
const state = {
    currentModule: 'home',
    progress: JSON.parse(localStorage.getItem('calculus-progress')) || {},
    modules: [
        { id: 'limits', title: 'Limits & Continuity', icon: '🎯', status: 'ready' },
        { id: 'derivatives', title: 'Derivatives', icon: '📈', status: 'ready' },
        { id: 'applications', title: 'Applications of Derivatives', icon: '🛠️', status: 'ready' },
        { id: 'integrals', title: 'Integrals', icon: '∫', status: 'ready' },
        { id: 'series', title: 'Sequences & Series', icon: '∑', status: 'ready' },
        { id: 'diffeq', title: 'Differential Equations', icon: 'Δ', status: 'ready' }
    ],
    // Store loaded module content
    contentCache: {}
};

// DOM Elements
const els = {
    sidebar: document.getElementById('sidebar'),
    sidebarNav: document.getElementById('sidebar-nav'),
    contentArea: document.getElementById('content-area'),
    mobileMenuBtn: document.getElementById('mobile-menu-btn'),
    overlay: document.getElementById('overlay'),
    searchInput: document.getElementById('search-input'),
    progressFill: document.getElementById('overall-progress-fill'),
    progressText: document.getElementById('overall-progress-text')
};

/**
 * Initialize Application
 */
function initApp() {
    // 1. Build Navigation
    buildNavigation();
    
    // 2. Setup Event Listeners
    setupEvents();
    
    // 3. Update Progress
    updateOverallProgress();
    
    // 4. Handle Routing
    window.addEventListener('hashchange', handleRoute);
    handleRoute(); // Call once on load
}

/**
 * Setup Event Listeners
 */
function setupEvents() {
    // Mobile Menu
    els.mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    els.overlay.addEventListener('click', closeMobileMenu);
    
    // Search
    els.searchInput.addEventListener('input', handleSearch);
}

/**
 * Build Sidebar Navigation
 */
function buildNavigation() {
    els.sidebarNav.innerHTML = '';
    
    // Home Link
    const homeEl = document.createElement('div');
    homeEl.className = 'nav-item';
    homeEl.dataset.id = 'home';
    homeEl.innerHTML = `
        <div class="nav-icon">🏠</div>
        <div class="nav-label">หน้าหลัก (Home)</div>
    `;
    homeEl.onclick = () => navigateTo('home');
    els.sidebarNav.appendChild(homeEl);
    
    // Title
    const titleEl = document.createElement('div');
    titleEl.className = 'nav-section-title';
    titleEl.textContent = 'บทเรียน (Lessons)';
    els.sidebarNav.appendChild(titleEl);
    
    // Modules
    state.modules.forEach(mod => {
        const itemEl = document.createElement('div');
        itemEl.className = 'nav-item';
        itemEl.dataset.id = mod.id;
        
        let statusHtml = '';
        if (mod.status === 'coming-soon') {
            statusHtml = '<div class="nav-badge" style="background: var(--bg-tertiary); color: var(--text-secondary)">Soon</div>';
        } else {
            // Check progress
            const modProgress = state.progress[mod.id] || 0;
            if (modProgress > 0) {
                statusHtml = `
                    <div class="nav-progress">
                        <svg viewBox="0 0 36 36" style="width:100%; height:100%;">
                            <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--bg-tertiary)" stroke-width="3"/>
                            <path class="circle" stroke-dasharray="${modProgress}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--primary)" stroke-width="3" stroke-linecap="round"/>
                        </svg>
                    </div>
                `;
            }
        }
        
        itemEl.innerHTML = `
            <div class="nav-icon">${mod.icon}</div>
            <div class="nav-label">${mod.title}</div>
            ${statusHtml}
        `;
        
        if (mod.status !== 'coming-soon') {
            itemEl.onclick = () => navigateTo(mod.id);
        } else {
            itemEl.style.opacity = '0.5';
            itemEl.style.cursor = 'not-allowed';
        }
        
        els.sidebarNav.appendChild(itemEl);
    });
}

/**
 * Handle Hash Routing
 */
function handleRoute() {
    const hash = window.location.hash.replace('#', '') || 'home';
    const parts = hash.split('/');
    const route = parts[0];
    
    // Update active nav
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    const activeEl = document.querySelector(`.nav-item[data-id="${route}"]`);
    if (activeEl) activeEl.classList.add('active');
    
    if (route === 'home') {
        renderHome();
    } else {
        const mod = state.modules.find(m => m.id === route);
        if (mod && mod.status === 'ready') {
            renderModule(route, parts[1] || 'theory');
        } else {
            renderHome(); // Fallback
        }
    }
    
    closeMobileMenu();
    window.scrollTo(0, 0);
}

function navigateTo(route, tab = '') {
    const hash = tab ? `#${route}/${tab}` : `#${route}`;
    window.location.hash = hash;
}

/**
 * Render Home Page
 */
function renderHome() {
    const completedCount = Object.values(state.progress).filter(p => p >= 100).length;
    
    let html = `
        <div class="home-hero animate-fade-in-up stagger-1">
            <h1>Interactive Calculus</h1>
            <p class="subtitle">เรียนรู้แคลคูลัสแบบเห็นภาพ พร้อมกราฟโต้ตอบได้และแบบทดสอบ</p>
            
            <div class="home-stats">
                <div class="stat-item">
                    <div class="stat-number">6</div>
                    <div class="stat-label">บทเรียน (Topics)</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">15+</div>
                    <div class="stat-label">กราฟ Interactive</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">${completedCount}</div>
                    <div class="stat-label">บทที่เรียนจบแล้ว</div>
                </div>
            </div>
            
            <button class="btn btn-primary" onclick="navigateTo('limits')">
                เริ่มเรียนบทแรก <span>🚀</span>
            </button>
        </div>
        
        <h2 class="animate-fade-in-up stagger-2 mt-2xl">เลือกบทเรียน</h2>
        <div class="topic-grid animate-fade-in-up stagger-3">
    `;
    
    state.modules.forEach((mod, idx) => {
        const progress = state.progress[mod.id] || 0;
        const isReady = mod.status === 'ready';
        const delay = (idx % 3) * 0.1;
        
        html += `
            <div class="topic-card" style="animation-delay: ${delay}s" 
                 ${isReady ? `onclick="navigateTo('${mod.id}')"` : 'style="opacity: 0.6; cursor: not-allowed;"'}>
                <div class="topic-card-icon">${mod.icon}</div>
                <h3>${mod.title}</h3>
                <p>${getModuleDescription(mod.id)}</p>
                
                <div class="topic-card-footer">
                    <span class="topic-card-lessons">${isReady ? 'พร้อมให้เรียน' : 'Coming Soon'}</span>
                    ${progress > 0 ? `
                        <div class="topic-card-progress">
                            <div class="topic-card-progress-fill" style="width: ${progress}%"></div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    });
    
    html += `</div>`;
    
    els.contentArea.innerHTML = html;
}

function getModuleDescription(id) {
    const descs = {
        'limits': 'เข้าใจแนวคิดพื้นฐานที่สุดของแคลคูลัส การลู่เข้าหาค่า ε-δ และลิมิตอนันต์',
        'derivatives': 'อัตราการเปลี่ยนแปลง, เส้นสัมผัสโค้ง, และกฎต่างๆ ในการหาอนุพันธ์',
        'applications': 'การหาค่าสูงสุด/ต่ำสุด, Optimization, และการสเก็ตช์กราฟ',
        'integrals': 'พื้นที่ใต้กราฟ, Riemann Sums, และ Fundamental Theorem of Calculus',
        'series': 'ลำดับลู่เข้า/ลู่ออก, อนุกรมเรขาคณิต, และ Taylor Series',
        'diffeq': 'สนามทิศทาง (Direction Fields) และสมการเชิงอนุพันธ์อันดับหนึ่งเบื้องต้น'
    };
    return descs[id] || '';
}

/**
 * Render Module Page
 */
function renderModule(moduleId, activeTab = 'theory') {
    const mod = state.modules.find(m => m.id === moduleId);
    
    // Ensure module script is loaded
    if (!window[`Module_${moduleId}`]) {
        els.contentArea.innerHTML = `
            <div class="text-center mt-3xl">
                <div class="loading-spinner"></div>
                <p>กำลังโหลดบทเรียน ${mod.title}...</p>
            </div>
        `;
        // In a real app we might dynamically load the script here
        // For this demo, all are loaded in index.html, so if it's missing, it's an error
        setTimeout(() => {
            if (window[`Module_${moduleId}`]) {
                renderModuleContent(moduleId, mod, activeTab);
            } else {
                els.contentArea.innerHTML = `<div class="warning-box"><h2>ไม่พบบทเรียนนี้</h2><p>ไฟล์ข้อมูลยังไม่ได้สร้าง</p></div>`;
            }
        }, 100);
        return;
    }
    
    renderModuleContent(moduleId, mod, activeTab);
}

function renderModuleContent(moduleId, mod, activeTab) {
    const moduleData = window[`Module_${moduleId}`];
    
    let html = `
        <div class="topic-header animate-fade-in-up">
            <div class="topic-breadcrumb">
                <a href="#home">Home</a>
                <span class="separator">/</span>
                <span>${mod.title}</span>
            </div>
            <h1>${mod.icon} ${mod.title}</h1>
            <p class="topic-desc">${moduleData.description}</p>
        </div>
        
        <div class="tab-nav animate-fade-in-up stagger-1">
            <button class="tab-btn ${activeTab === 'theory' ? 'active' : ''}" onclick="navigateTo('${moduleId}', 'theory')">📚 ทฤษฎี (Theory)</button>
            <button class="tab-btn ${activeTab === 'interactive' ? 'active' : ''}" onclick="navigateTo('${moduleId}', 'interactive')">🎮 กราฟโต้ตอบ (Interactive)</button>
            <button class="tab-btn ${activeTab === 'examples' ? 'active' : ''}" onclick="navigateTo('${moduleId}', 'examples')">💡 ตัวอย่าง (Examples)</button>
            <button class="tab-btn ${activeTab === 'quiz' ? 'active' : ''}" onclick="navigateTo('${moduleId}', 'quiz')">📝 แบบทดสอบ (Quiz)</button>
        </div>
        
        <div class="tab-content active" id="module-content">
            <!-- Content gets injected here -->
        </div>
    `;
    
    els.contentArea.innerHTML = html;
    
    const contentBox = document.getElementById('module-content');
    
    // Inject content based on active tab
    if (activeTab === 'theory') {
        contentBox.innerHTML = moduleData.theoryHtml;
        renderMathIn(contentBox);
        
        // Mark as started (25% progress)
        saveProgress(moduleId, Math.max(state.progress[moduleId] || 0, 25));
    } 
    else if (activeTab === 'interactive') {
        contentBox.innerHTML = moduleData.interactiveHtml;
        renderMathIn(contentBox);
        
        // Give the DOM time to render before initializing canvas
        setTimeout(() => {
            if (moduleData.initInteractive) {
                moduleData.initInteractive();
            }
        }, 0);
        
        saveProgress(moduleId, Math.max(state.progress[moduleId] || 0, 50));
    }
    else if (activeTab === 'examples') {
        contentBox.innerHTML = `
            <div class="content-section">
                <h2>ตัวอย่างวิธีทำแบบทีละขั้นตอน</h2>
                <p>เลือกโจทย์ที่ต้องการดูวิธีทำ</p>
                <div id="step-solver-container"></div>
            </div>
        `;
        
        setTimeout(() => {
            const stepsData = ProblemBank[moduleId].steps;
            if (stepsData && stepsData.length > 0) {
                new StepSolver('step-solver-container', stepsData[0].title, stepsData[0].steps);
            } else {
                document.getElementById('step-solver-container').innerHTML = '<p>ยังไม่มีตัวอย่างสำหรับบทนี้</p>';
            }
        }, 0);
        
        saveProgress(moduleId, Math.max(state.progress[moduleId] || 0, 75));
    }
    else if (activeTab === 'quiz') {
        contentBox.innerHTML = `
            <div class="content-section">
                <h2>แบบทดสอบท้ายบท</h2>
                <div id="quiz-container"></div>
            </div>
        `;
        
        setTimeout(() => {
            const quizData = ProblemBank[moduleId].quizzes;
            if (quizData && quizData.length > 0) {
                new QuizEngine('quiz-container', quizData, (score, total) => {
                    // On complete, save 100% progress
                    if (score / total >= 0.5) {
                        saveProgress(moduleId, 100);
                    }
                });
            } else {
                document.getElementById('quiz-container').innerHTML = '<p>ยังไม่มีแบบทดสอบสำหรับบทนี้</p>';
            }
        }, 0);
    }
}

/**
 * Helper to render math in an element using KaTeX auto-render
 * Retries if KaTeX hasn't loaded yet (e.g. slow CDN)
 */
function renderMathIn(element, retryCount = 0) {
    if (typeof renderMathInElement === 'function') {
        try {
            renderMathInElement(element, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false}
                ],
                throwOnError: false
            });
        } catch(e) {
            console.warn('KaTeX auto-render error:', e);
        }
    } else if (retryCount < 10) {
        // KaTeX not loaded yet, retry after a delay
        console.warn('KaTeX not loaded yet, retrying... (' + (retryCount + 1) + ')');
        setTimeout(() => renderMathIn(element, retryCount + 1), 200);
    } else {
        console.error('KaTeX failed to load. Math formulas will not render.');
    }
}

/**
 * Progress Management
 */
function saveProgress(moduleId, percent) {
    if ((state.progress[moduleId] || 0) < percent) {
        state.progress[moduleId] = percent;
        localStorage.setItem('calculus-progress', JSON.stringify(state.progress));
        
        updateOverallProgress();
        buildNavigation(); // Refresh sidebar UI
    }
}

function updateOverallProgress() {
    const readyModules = state.modules.filter(m => m.status === 'ready');
    if (readyModules.length === 0) return;
    
    let totalProgress = 0;
    readyModules.forEach(m => {
        totalProgress += (state.progress[m.id] || 0);
    });
    
    const overall = Math.round(totalProgress / readyModules.length);
    els.progressFill.style.width = `${overall}%`;
    els.progressText.textContent = `${overall}%`;
}

/**
 * UI Interactions
 */
function toggleMobileMenu() {
    els.sidebar.classList.toggle('open');
    els.overlay.classList.toggle('active');
}

function closeMobileMenu() {
    els.sidebar.classList.remove('open');
    els.overlay.classList.remove('active');
}

function handleSearch(e) {
    const term = e.target.value.toLowerCase();
    
    const items = els.sidebarNav.querySelectorAll('.nav-item');
    items.forEach(item => {
        if (item.dataset.id === 'home') return; // Always show home
        
        const label = item.querySelector('.nav-label').textContent.toLowerCase();
        if (label.includes(term)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Start app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
