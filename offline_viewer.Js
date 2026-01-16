/* د Offline Viewer اصلي سیستم */

class OfflineViewer {
    constructor() {
        this.viewerData = {};
        this.init();
    }

    async init() {
        console.log('📖 Offline Viewer پیلېږي...');
        
        // د Offline ډیټا چارجول
        await this.loadOfflineViewerData();
        
        // د Offline Viewer UI جوړول
        this.setupOfflineViewerUI();
        
        // د Offline Navigation تنظیمول
        this.setupOfflineNavigation();
    }

    // ==================== Offline Data Loading ====================

    async loadOfflineViewerData() {
        console.log('💾 د Offline Viewer ډیټا چارجېږي...');
        
        // د Critical ډیټا چارجول
        await this.loadCriticalData();
        
        // د Cached پاڼو چارجول
        await this.loadCachedPages();
        
        // د Sample ډیټا چارجول (که چیرې واقعي ډیټا نه وي)
        await this.loadSampleData();
        
        console.log('✅ Offline Viewer ډیټا چارج شو:', this.viewerData);
    }

    async loadCriticalData() {
        // د اړینو معلوماتو چارجول
        this.viewerData.critical = {
            userInfo: {
                name: localStorage.getItem('userName') || 'کارونکی',
                role: localStorage.getItem('userRole') || 'ګوښه',
                photo: localStorage.getItem('userPhoto') || 'https://via.placeholder.com/40'
            },
            schoolInfo: {
                name: 'بابا هوتک لیسه',
                address: 'کندهار، افغانستان',
                phone: '+93 70 123 4567',
                lastSync: localStorage.getItem('lastSync') || 'نه دی تازه شوی'
            },
            systemInfo: {
                mode: 'offline',
                lastUpdated: new Date().toLocaleDateString('fa-AF'),
                dataSource: 'cached'
            }
        };
    }

    async loadCachedPages() {
        if ('caches' in window) {
            try {
                const cache = await caches.open('baba-hotak-cache-v2');
                this.viewerData.cachedPages = {};
                
                // د اړینو پاڼو لیست
                const essentialPages = [
                    'index.html',
                    'admin_dashboard.html',
                    'teacher_dashboard.html',
                    'student_dashboard.html',
                    'students.html',
                    'attendance.html',
                    'finance.html',
                    'results.html'
                ];
                
                for (const page of essentialPages) {
                    const response = await cache.match('/' + page);
                    if (response) {
                        this.viewerData.cachedPages[page] = true;
                    }
                }
                
            } catch (error) {
                console.error('❌ د Cached Pages چارج ستونزه:', error);
            }
        }
    }

    async loadSampleData() {
        // د Offline Viewer لپاره Sample ډیټا
        this.viewerData.sample = {
            students: this.getSampleStudents(),
            attendance: this.getSampleAttendance(),
            marks: this.getSampleMarks(),
            finance: this.getSampleFinance()
        };
    }

    getSampleStudents() {
        return [
            { id: 1, name: 'احمد ولي', grade: 'نهم', section: 'الف', phone: '0701234567' },
            { id: 2, name: 'محمد انور', grade: 'نهم', section: 'الف', phone: '0702345678' },
            { id: 3, name: 'ګل خان', grade: 'نهم', section: 'ب', phone: '0703456789' },
            { id: 4, name: 'شېرزاد', grade: 'نهم', section: 'ب', phone: '0704567890' }
        ];
    }

    getSampleAttendance() {
        const today = new Date().toLocaleDateString('fa-AF');
        return {
            date: today,
            stats: {
                present: 85,
                absent: 5,
                leave: 2,
                total: 92
            },
            byGrade: {
                'نهم': { present: 45, absent: 3 },
                'لسم': { present: 40, absent: 2 }
            }
        };
    }

    getSampleMarks() {
        return [
            { student: 'احمد ولي', subject: 'ریاضي', mark: 85, grade: 'A' },
            { student: 'محمد انور', subject: 'پښتو', mark: 92, grade: 'A+' },
            { student: 'ګل خان', subject: 'کیمیا', mark: 78, grade: 'B' },
            { student: 'شېرزاد', subject: 'فزیک', mark: 88, grade: 'A' }
        ];
    }

    getSampleFinance() {
        return {
            totalIncome: 150000,
            totalExpense: 120000,
            netProfit: 30000,
            byMonth: {
                حمل: 45000,
                ثور: 48000,
                جوزا: 52000,
                سرطان: 50000
            }
        };
    }

    // ==================== Offline Viewer UI ====================

    setupOfflineViewerUI() {
        // د Offline Viewer Dashboard جوړول
        this.createOfflineDashboard();
        
        // د Offline Stats ښکاره کول
        this.showOfflineStats();
        
        // د Offline Navigation Menu
        this.createOfflineNavMenu();
    }

    createOfflineDashboard() {
        // که دا Dashboard پاڼه وي
        if (document.querySelector('.dashboard-container')) {
            this.enhanceDashboardForOffline();
        }
    }

    enhanceDashboardForOffline() {
        const dashboard = document.querySelector('.dashboard-container');
        if (!dashboard) return;
        
        // د Offline Viewer Header اضافه کول
        const offlineHeader = document.createElement('div');
        offlineHeader.className = 'offline-viewer-header';
        offlineHeader.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 15px;
            margin-bottom: 20px;
            text-align: center;
        `;
        
        offlineHeader.innerHTML = `
            <div style="display:flex; align-items:center; justify-content:center; gap:15px; margin-bottom:10px;">
                <span style="font-size:40px;">📖</span>
                <div>
                    <h3 style="margin:0; font-size:18px;">Offline Viewer Mode</h3>
                    <small style="opacity:0.8;">تاسو یوازې معلومات وګورئ</small>
                </div>
            </div>
            <p style="margin:0; font-size:13px; opacity:0.9;">
                د انټرنټ اتصال وصل کړئ ترڅو تغیرات وکړئ
            </p>
        `;
        
        dashboard.insertBefore(offlineHeader, dashboard.firstChild);
        
        // د Offline Cards اضافه کول
        this.addOfflineCards(dashboard);
    }

    addOfflineCards(dashboard) {
        const cardsContainer = document.createElement('div');
        cardsContainer.className = 'offline-cards-container';
        cardsContainer.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
        `;
        
        const cards = [
            {
                title: 'شاګردان',
                count: this.viewerData.sample?.students?.length || 0,
                icon: '👥',
                color: '#3498db',
                description: 'په Offline کې شتون لري'
            },
            {
                title: 'ورځنی حاضري',
                count: this.viewerData.sample?.attendance?.stats?.present || 0,
                icon: '✅',
                color: '#2ecc71',
                description: 'د نن لپاره'
            },
            {
                title: 'نمرې',
                count: this.viewerData.sample?.marks?.length || 0,
                icon: '📊',
                color: '#9b59b6',
                description: 'نمونې ډیټا'
            },
            {
                title: 'عاید',
                count: (this.viewerData.sample?.finance?.totalIncome || 0) + ' AFN',
                icon: '💰',
                color: '#f39c12',
                description: 'میاشتنی'
            }
        ];
        
        cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.style.cssText = `
                background: white;
                padding: 15px;
                border-radius: 12px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                text-align: center;
                border-top: 4px solid ${card.color};
            `;
            
            cardElement.innerHTML = `
                <div style="font-size:30px; margin-bottom:10px;">${card.icon}</div>
                <h4 style="margin:0 0 5px 0; color:#2c3e50;">${card.title}</h4>
                <div style="font-size:24px; font-weight:bold; color:${card.color}; margin:10px 0;">
                    ${card.count}
                </div>
                <small style="color:#7f8c8d; font-size:11px;">${card.description}</small>
            `;
            
            cardsContainer.appendChild(cardElement);
        });
        
        // د Dashboard وروستی برخه کې اضافه کول
        const statsSection = dashboard.querySelector('.stats-grid, .stats-row');
        if (statsSection) {
            statsSection.parentNode.insertBefore(cardsContainer, statsSection.nextSibling);
        } else {
            const header = dashboard.querySelector('.offline-viewer-header');
            if (header) {
                header.parentNode.insertBefore(cardsContainer, header.nextSibling);
            }
        }
    }

    showOfflineStats() {
        // د Offline Statistics په Footer کې ښکاره کول
        const footer = document.querySelector('footer, .footer') || document.body;
        
        const statsFooter = document.createElement('div');
        statsFooter.className = 'offline-stats-footer';
        statsFooter.style.cssText = `
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 8px 15px;
            font-size: 11px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 9995;
        `;
        
        statsFooter.innerHTML = `
            <div style="display:flex; align-items:center; gap:10px;">
                <span style="color:#e74c3c;">●</span>
                <span>Offline Viewer</span>
            </div>
            <div style="display:flex; gap:15px;">
                <span>👥 ${this.viewerData.sample?.students?.length || 0} شاګردان</span>
                <span>✅ ${this.viewerData.sample?.attendance?.stats?.present || 0} حاضر</span>
                <span>💰 ${this.viewerData.sample?.finance?.totalIncome || 0} عاید</span>
            </div>
            <div>
                <small style="opacity:0.7;">آخر تازه: ${new Date().toLocaleTimeString('ps-AF', {hour: '2-digit', minute:'2-digit'})}</small>
            </div>
        `;
        
        footer.appendChild(statsFooter);
    }

    createOfflineNavMenu() {
        // د Offline Navigation په Sidebar یا Header کې
        const sidebar = document.querySelector('.sidebar, .menu-grid, .dashboard-header');
        if (!sidebar) return;
        
        const offlineNav = document.createElement('div');
        offlineNav.className = 'offline-nav-section';
        offlineNav.style.cssText = `
            background: #f8f9fa;
            padding: 15px;
            border-radius: 10px;
            margin: 15px 0;
            border: 2px dashed #dee2e6;
        `;
        
        offlineNav.innerHTML = `
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:10px;">
                <span style="font-size:20px;">📴</span>
                <strong style="font-size:14px;">Offline Navigation</strong>
            </div>
            <div style="font-size:12px; color:#666;">
                په Offline کې لاسرسی:
            </div>
            <div style="display:flex; flex-wrap:wrap; gap:5px; margin-top:10px;">
                ${this.getAvailableOfflinePages().map(page => `
                    <a href="${page.url}" 
                       style="background:#e9ecef; color:#495057; padding:5px 10px; border-radius:5px; text-decoration:none; font-size:11px;">
                        ${page.name}
                    </a>
                `).join('')}
            </div>
        `;
        
        sidebar.appendChild(offlineNav);
    }

    getAvailableOfflinePages() {
        // د Offline په حالت کې د لاسرسي وړ پاڼې
        return [
            { name: 'ډشبورډ', url: 'index.html' },
            { name: 'شاګردان', url: 'students.html' },
            { name: 'حاضري', url: 'attendance.html' },
            { name: 'مالي', url: 'finance.html' },
            { name: 'نتایج', url: 'results.html' }
        ];
    }

    // ==================== Offline Navigation ====================

    setupOfflineNavigation() {
        // د Offline لپاره Navigation محدودول
        this.limitNavigationForOffline();
        this.setupOfflineBackButton();
    }

    limitNavigationForOffline() {
        // د Online یوازې پاڼو مخنیوی
        const onlineOnlyLinks = document.querySelectorAll('[data-online-only]');
        onlineOnlyLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (hybridSystem.getCurrentMode() === 'offline') {
                    e.preventDefault();
                    this.showOnlineOnlyMessage(link.textContent);
                }
            });
            
            link.style.opacity = '0.5';
            link.style.pointerEvents = 'none';
            link.title = 'په Online حالت کې یوازې';
        });
    }

    showOnlineOnlyMessage(featureName) {
        const modal = document.createElement('div');
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
        `;
        
        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 15px;
            text-align: center;
            max-width: 300px;
        `;
        
        content.innerHTML = `
            <span style="font-size:48px; display:block; margin-bottom:15px;">🌐</span>
            <h3 style="margin:0 0 10px 0; color:#2c3e50;">Online Feature</h3>
            <p style="color:#666; margin-bottom:20px;">
                "${featureName}" یوازې په Online حالت کې لاسرسی لري.
                مهرباني وکړئ انټرنټ اتصال وصل کړئ.
            </p>
            <button onclick="this.closest('div').parentNode.remove()"
                    style="background:#3498db; color:white; border:none; padding:10px 20px; border-radius:8px; cursor:pointer;">
                پوه شوم
            </button>
        `;
        
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        // د کلیک خارج Modal بندول
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    setupOfflineBackButton() {
        // د Offline Back Button په هره پاڼه کې
        if (window.location.pathname !== '/index.html' && 
            window.location.pathname !== '/' &&
            hybridSystem.getCurrentMode() === 'offline') {
            
            const backBtn = document.createElement('button');
            backBtn.innerHTML = '🏠 اصلي پاڼه';
            backBtn.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                padding: 10px 15px;
                border-radius: 25px;
                cursor: pointer;
                font-weight: bold;
                font-size: 12px;
                z-index: 9996;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                display: flex;
                align-items: center;
                gap: 5px;
            `;
            
            backBtn.onclick = () => window.location.href = 'index.html';
            document.body.appendChild(backBtn);
        }
    }

    // ==================== Public API ====================

    getViewerData() {
        return this.viewerData;
    }

    refreshViewerData() {
        return this.loadOfflineViewerData();
    }

    isPageAvailableOffline(pageUrl) {
        return this.viewerData.cachedPages && 
               this.viewerData.cachedPages[pageUrl.replace('.html', '')];
    }

    getOfflineStatus() {
        return {
            mode: 'viewer',
            dataAvailable: Object.keys(this.viewerData).length > 0,
            lastUpdated: new Date().toISOString(),
            pages: Object.keys(this.viewerData.cachedPages || {}).length
        };
    }
}

// د Global Instance جوړول
window.offlineViewer = new OfflineViewer();

console.log('📚 Offline Viewer چمتو دی!');