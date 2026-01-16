/* د View Only Offline Components */

class ViewOnlyComponents {
    constructor() {
        this.components = {};
        this.init();
    }

    init() {
        // د Offline View Components تنظیمول
        this.setupViewOnlyTables();
        this.setupViewOnlyForms();
        this.setupViewOnlyCharts();
        this.setupOfflineNavigation();
    }

    // ==================== د View Only جدولونه ====================

    setupViewOnlyTables() {
        // د ټولو جدولونو لپاره View Only تنظیمات
        const tables = document.querySelectorAll('table');
        
        tables.forEach(table => {
            // د Edit/Delete بټنونو مخنیوی
            const actionCells = table.querySelectorAll('td:last-child, th:last-child');
            actionCells.forEach(cell => {
                if (cell.textContent.includes('🗑️') || 
                    cell.textContent.includes('✏️') || 
                    cell.textContent.includes('عمل')) {
                    cell.style.opacity = '0.5';
                    cell.style.pointerEvents = 'none';
                }
            });
            
            // د Row کلیک مخنیوی
            table.addEventListener('click', (e) => {
                if (hybridSystem.getCurrentMode() === 'offline') {
                    const row = e.target.closest('tr');
                    if (row && !row.classList.contains('header-row')) {
                        e.preventDefault();
                        e.stopPropagation();
                        this.showRowDetails(row);
                    }
                }
            });
        });
    }

    showRowDetails(row) {
        // د Row تفصیلات په Modal کې ښکاره کول
        const cells = row.querySelectorAll('td');
        let details = '<div style="padding:15px;">';
        
        cells.forEach((cell, index) => {
            const header = row.closest('table').querySelectorAll('th')[index];
            if (header && cell) {
                details += `
                    <div style="margin-bottom:10px;">
                        <strong style="color:#666; font-size:12px;">${header.textContent}:</strong><br>
                        <span style="font-size:14px;">${cell.textContent}</span>
                    </div>
                `;
            }
        });
        
        details += '</div>';
        
        this.showModal('تفصیلات', details);
    }

    // ==================== د View Only فورمونه ====================

    setupViewOnlyForms() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            // د View Only فورم جوړول
            this.convertFormToViewOnly(form);
            
            // د Submit مخنیوی
            form.addEventListener('submit', (e) => {
                if (hybridSystem.getCurrentMode() === 'offline') {
                    e.preventDefault();
                    this.showOfflineFormMessage();
                    return false;
                }
            });
        });
    }

    convertFormToViewOnly(form) {
        // د Input عناصر Read-only کول
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            if (!input.hasAttribute('data-offline-allowed')) {
                const originalValue = input.value;
                const inputType = input.type;
                
                // د Read-only Input جوړول
                const viewOnlyElement = document.createElement('div');
                viewOnlyElement.className = 'view-only-field';
                viewOnlyElement.style.cssText = `
                    padding: 10px;
                    background: #f8f9fa;
                    border: 1px solid #dee2e6;
                    border-radius: 5px;
                    margin-bottom: 10px;
                    font-size: 14px;
                    min-height: 40px;
                    display: flex;
                    align-items: center;
                `;
                
                if (inputType === 'checkbox' || inputType === 'radio') {
                    viewOnlyElement.innerHTML = `
                        <span style="margin-right:10px;">${input.checked ? '✅' : '❌'}</span>
                        <span>${input.nextElementSibling?.textContent || (input.checked ? 'هو' : 'نه')}</span>
                    `;
                } else if (inputType === 'file') {
                    viewOnlyElement.innerHTML = `
                        <span style="margin-right:10px;">📎</span>
                        <span>فایل: ${input.files[0]?.name || 'نه دی انتخاب شوی'}</span>
                    `;
                } else {
                    viewOnlyElement.textContent = originalValue || '—';
                }
                
                // د Input ځای نیول
                input.style.display = 'none';
                input.parentNode.insertBefore(viewOnlyElement, input);
            }
        });
        
        // د Submit بټن ښکاره کول
        const submitBtn = form.querySelector('[type="submit"], button[type="submit"]');
        if (submitBtn && !submitBtn.hasAttribute('data-offline-allowed')) {
            submitBtn.style.display = 'none';
            
            const viewOnlyMsg = document.createElement('div');
            viewOnlyMsg.className = 'view-only-submit-message';
            viewOnlyMsg.style.cssText = `
                background: #fff3cd;
                border: 1px solid #ffeaa7;
                padding: 10px;
                border-radius: 5px;
                text-align: center;
                color: #856404;
                font-size: 12px;
                margin-top: 15px;
            `;
            viewOnlyMsg.innerHTML = `
                <span style="font-size:14px;">📴</span>
                <strong>په Offline حالت کې</strong><br>
                <small>تاسو یوازې معلومات وګورئ، ثبتول نشئ کولی.</small>
            `;
            
            submitBtn.parentNode.insertBefore(viewOnlyMsg, submitBtn.nextSibling);
        }
    }

    showOfflineFormMessage() {
        hybridSystem.showOfflineActionMessage();
    }

    // ==================== د View Only چارټونه ====================

    setupViewOnlyCharts() {
        // که چارټ وي، د Static نسخه ښکاره کول
        const chartContainers = document.querySelectorAll('.chart-container, [data-chart]');
        
        chartContainers.forEach(container => {
            // د Offline Chart Data اضافه کول
            this.addOfflineChartData(container);
        });
    }

    addOfflineChartData(container) {
        // د Offline لپاره Sample ډیټا اضافه کول
        const chartId = container.id || 'chart-' + Date.now();
        
        const offlineData = {
            'student-chart': {
                labels: ['لومړی', 'دوهم', 'دریم', 'څلورم', 'پنځم'],
                datasets: [{
                    label: 'شاګردان',
                    data: [45, 52, 48, 55, 50],
                    backgroundColor: '#3498db'
                }]
            },
            'attendance-chart': {
                labels: ['حمل', 'ثور', 'جوزا', 'سرطان', 'اسد'],
                datasets: [{
                    label: 'حاضري %',
                    data: [95, 92, 88, 94, 96],
                    backgroundColor: '#2ecc71'
                }]
            },
            'finance-chart': {
                labels: ['فیسونه', 'مصارف', 'عاید'],
                data: [150000, 120000, 30000],
                backgroundColor: ['#2ecc71', '#e74c3c', '#3498db']
            }
        };
        
        // که چارټ JavaScript وي، د Offline ډیټا ورکول
        if (window[chartId]) {
            window[chartId].data = offlineData[chartId] || this.getDefaultChartData();
            window[chartId].update();
        }
    }

    getDefaultChartData() {
        return {
            labels: ['نمونه ۱', 'نمونه ۲', 'نمونه ۳'],
            datasets: [{
                label: 'Offline ډیټا',
                data: [30, 50, 20],
                backgroundColor: '#95a5a6'
            }]
        };
    }

    // ==================== د Offline نیویګیشن ====================

    setupOfflineNavigation() {
        // د Offline لپاره د نیویګیشن محدودول
        const navLinks = document.querySelectorAll('a[href]:not([href^="#"]):not([href^="javascript"])');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            // که پاڼه په Cache کې نه وي
            if (!this.isPageCached(href) && hybridSystem.getCurrentMode() === 'offline') {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showPageNotAvailableMessage(href);
                });
                
                link.style.opacity = '0.5';
                link.style.pointerEvents = 'none';
                link.title = 'دا پاڼه په Offline حالت کې نشته';
            }
        });
    }

    isPageCached(pageUrl) {
        // د Cached پاڼو لیست
        const cachedPages = [
            'index.html',
            'admin_dashboard.html',
            'teacher_dashboard.html',
            'student_dashboard.html',
            'students.html',
            'attendance.html',
            'finance.html',
            'results.html'
        ];
        
        return cachedPages.some(cachedPage => pageUrl.includes(cachedPage));
    }

    showPageNotAvailableMessage(pageUrl) {
        const pageName = pageUrl.split('/').pop().replace('.html', '') || 'پاڼه';
        
        this.showModal(
            'پاڼه نشته',
            `
            <div style="text-align:center; padding:20px;">
                <span style="font-size:48px; display:block; margin-bottom:15px;">📴</span>
                <strong style="display:block; margin-bottom:10px;">${pageName} په Offline حالت کې نشته</strong>
                <p style="color:#666; font-size:14px;">
                    دا پاڼه یوازې په Online حالت کې لاسرسی لري.<br>
                    د انټرنټ اتصال وصل کړئ ترڅو وګورئ.
                </p>
            </div>
            `
        );
    }

    // ==================== Modal System ====================

    showModal(title, content) {
        // د موجود Modal حذف کول
        const existingModal = document.getElementById('viewOnlyModal');
        if (existingModal) existingModal.remove();
        
        // نوی Modal جوړول
        const modal = document.createElement('div');
        modal.id = 'viewOnlyModal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            animation: fadeIn 0.3s;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            border-radius: 15px;
            width: 90%;
            max-width: 500px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        `;
        
        modalContent.innerHTML = `
            <div style="padding:20px; border-bottom:1px solid #eee;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <h3 style="margin:0; color:#2c3e50;">${title}</h3>
                    <button onclick="document.getElementById('viewOnlyModal').remove()" 
                            style="background:none; border:none; font-size:20px; cursor:pointer; color:#666;">
                        ×
                    </button>
                </div>
            </div>
            <div style="padding:20px;">
                ${content}
            </div>
            <div style="padding:15px 20px; border-top:1px solid #eee; text-align:center;">
                <button onclick="document.getElementById('viewOnlyModal').remove()"
                        style="background:#3498db; color:white; border:none; padding:10px 20px; border-radius:8px; cursor:pointer;">
                    بندول
                </button>
            </div>
        `;
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // د کلیک خارج Modal بندول
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // ==================== Utility Functions ====================

    getOfflineDataSummary() {
        return {
            students: this.getOfflineStudentCount(),
            attendance: this.getOfflineAttendanceCount(),
            marks: this.getOfflineMarksCount(),
            lastUpdated: localStorage.getItem('offlineDataLastUpdated') || 'نه دی تازه شوی'
        };
    }

    getOfflineStudentCount() {
        // د localStorage څخه د شاګردانو شمېر
        const students = JSON.parse(localStorage.getItem('offlineStudents') || '[]');
        return students.length;
    }

    getOfflineAttendanceCount() {
        // د localStorage څخه د حاضري شمېر
        const attendance = JSON.parse(localStorage.getItem('offlineAttendance') || '[]');
        return attendance.length;
    }

    getOfflineMarksCount() {
        // د localStorage څخه د نمرو شمېر
        const marks = JSON.parse(localStorage.getItem('offlineMarks') || '[]');
        return marks.length;
    }

    // ==================== Public API ====================

    enableComponent(componentId) {
        if (this.components[componentId]) {
            this.components[componentId].enabled = true;
            console.log(`✅ ${componentId} فعال شو`);
        }
    }

    disableComponent(componentId) {
        if (this.components[componentId]) {
            this.components[componentId].enabled = false;
            console.log(`❌ ${componentId} غیرفعال شو`);
        }
    }

    isComponentEnabled(componentId) {
        return this.components[componentId]?.enabled || false;
    }
}

// د Global Instance جوړول
window.viewOnlyComponents = new ViewOnlyComponents();

console.log('👁️ View Only Components چمتو دی!');