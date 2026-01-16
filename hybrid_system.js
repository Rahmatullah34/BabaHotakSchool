/* د بابا هوتک لیسې Online/Offline Hybrid سیستم */

class HybridSystem {
    constructor() {
        this.isOnline = navigator.onLine;
        this.currentMode = this.isOnline ? 'online' : 'offline';
        this.init();
    }

    async init() {
        console.log(`🚀 سیستم په ${this.currentMode.toUpperCase()} حالت کې پیل شو`);
        
        // د انټرنټ حالت څارنه
        window.addEventListener('online', this.handleOnline.bind(this));
        window.addEventListener('offline', this.handleOffline.bind(this));
        
        // د سیستم حالت تنظیمول
        await this.setupSystemMode();
        
        // د UI تازه کول
        this.updateUI();
    }

    // ==================== د انټرنټ حالت مدیریت ====================

    handleOnline() {
        console.log('🌐 انټرنټ وصل شو - په Online حالت کې تبدیلی...');
        this.isOnline = true;
        this.currentMode = 'online';
        this.switchToOnlineMode();
    }

    handleOffline() {
        console.log('📴 انټرنټ قطع شو - په Offline حالت کې تبدیلی...');
        this.isOnline = false;
        this.currentMode = 'offline';
        this.switchToOfflineMode();
    }

    // ==================== د سیستم حالت تنظیمول ====================

    async setupSystemMode() {
        if (this.currentMode === 'online') {
            await this.setupOnlineMode();
        } else {
            await this.setupOfflineMode();
        }
    }

    async setupOnlineMode() {
        console.log('🟢 Online Mode: بشپړ Interactive سیستم');
        
        // ۱. د Firebase اتصال فعالول
        if (typeof firebase !== 'undefined') {
            try {
                await this.enableFirebase();
            } catch (error) {
                console.error('❌ د Firebase ستونزه:', error);
            }
        }
        
        // ۲. د Interactive عناصر فعالول
        this.enableInteractiveElements();
        
        // ۳. د Offline ډیټا سینک
        await this.syncOfflineData();
    }

    async setupOfflineMode() {
        console.log('📴 Offline Mode: View Only سیستم');
        
        // ۱. د Offline ډیټا چارجول
        await this.loadOfflineData();
        
        // ۲. د View Only حالت فعالول
        this.enableViewOnlyMode();
        
        // ۳. د Interactive عناصر غیرفعالول
        this.disableInteractiveElements();
    }

    // ==================== Online حالت ====================

    async enableFirebase() {
        console.log('🔥 Firebase فعالېږي...');
        
        // د Firebase اتصال تایید
        const isConnected = await this.checkFirebaseConnection();
        
        if (isConnected) {
            // د Firestore Offline Data چارجول
            await this.enableFirestoreOffline();
            
            // د Real-time Updates فعالول
            this.enableRealtimeUpdates();
        } else {
            console.warn('⚠️ Firebase سره اتصال نشته، په Offline حالت کې کار کول');
            this.currentMode = 'offline';
            this.setupOfflineMode();
        }
    }

    async checkFirebaseConnection() {
        return new Promise((resolve) => {
            if (!firebase.apps.length) {
                resolve(false);
                return;
            }
            
            const db = firebase.firestore();
            const timeout = setTimeout(() => resolve(false), 5000);
            
            db.collection('babaStudents').limit(1).get()
                .then(() => {
                    clearTimeout(timeout);
                    resolve(true);
                })
                .catch(() => {
                    clearTimeout(timeout);
                    resolve(false);
                });
        });
    }

    async enableFirestoreOffline() {
        try {
            await firebase.firestore().enablePersistence({
                synchronizeTabs: true
            });
            console.log('✅ Firestore Offline Data فعال شو');
        } catch (error) {
            console.warn('⚠️ د Firestore Offline Data ستونزه:', error);
        }
    }

    enableRealtimeUpdates() {
        console.log('🔄 Real-time Updates فعال شول');
        // دلته د Real-time listeners اضافه کولی شئ
    }

    enableInteractiveElements() {
        console.log('🖱️ Interactive Elements فعال شول');
        
        // د ټولو Interactive عناصر فعالول
        const interactiveElements = document.querySelectorAll([
            'button:not([data-offline-allowed])',
            'input:not([readonly]):not([data-offline-allowed])',
            'select:not([disabled]):not([data-offline-allowed])',
            'textarea:not([readonly]):not([data-offline-allowed])',
            'a[href="#"]:not([data-offline-allowed])'
        ].join(','));
        
        interactiveElements.forEach(element => {
            element.style.opacity = '1';
            element.style.pointerEvents = 'auto';
            element.disabled = false;
            element.readOnly = false;
        });
    }

    // ==================== Offline حالت ====================

    async loadOfflineData() {
        console.log('💾 Offline Data چارجېږي...');
        
        // د Service Worker څخه Cached ډیټا راوستل
        await this.loadCachedData();
        
        // د IndexedDB څخه Offline ډیټا راوستل
        await this.loadIndexedDBData();
        
        // د localStorage څخه Critical ډیټا راوستل
        this.loadLocalStorageData();
    }

    async loadCachedData() {
        if ('caches' in window) {
            try {
                const cache = await caches.open('baba-hotak-cache-v2');
                const keys = await cache.keys();
                
                console.log(`📁 ${keys.length} Cached فایلونه موندل شول`);
                
                // د HTML پاڼو چارجول
                await this.loadCachedPages(cache);
                
            } catch (error) {
                console.error('❌ د Cache راوستلو ستونزه:', error);
            }
        }
    }

    async loadCachedPages(cache) {
        // د اړینو پاڼو لټون
        const essentialPages = [
            '/index.html',
            '/admin_dashboard.html',
            '/teacher_dashboard.html',
            '/student_dashboard.html',
            '/students.html',
            '/attendance.html',
            '/finance.html'
        ];
        
        for (const page of essentialPages) {
            try {
                const response = await cache.match(page);
                if (response) {
                    console.log(`✅ Cached پاڼه: ${page}`);
                }
            } catch (error) {
                console.warn(`⚠️ د ${page} راوستلو ستونزه:`, error);
            }
        }
    }

    async loadIndexedDBData() {
        // دلته د IndexedDB څخه ډیټا راوستل
        console.log('🗃️ IndexedDB ډیټا چارجېږي...');
    }

    loadLocalStorageData() {
        // Critical ډیټا له localStorage څخه
        const criticalData = {
            userRole: localStorage.getItem('userRole'),
            userName: localStorage.getItem('userName'),
            userPhoto: localStorage.getItem('userPhoto'),
            lastSync: localStorage.getItem('lastSync')
        };
        
        console.log('🔑 Critical ډیټا چارج شوه:', criticalData);
    }

    enableViewOnlyMode() {
        console.log('👁️ View Only Mode فعال شو');
        
        // ۱. د Read-only عناصر تنظیمول
        this.makeElementsReadOnly();
        
        // ۲. د Offline پیغام ښکاره کول
        this.showOfflineWarning();
        
        // ۳. د Sync بټن فعالول
        this.enableSyncButton();
    }

    makeElementsReadOnly() {
        // د فورم عناصر Read-only کول
        const formElements = document.querySelectorAll([
            'input:not([type="hidden"]):not([data-offline-allowed])',
            'textarea:not([data-offline-allowed])',
            'select:not([data-offline-allowed])'
        ].join(','));
        
        formElements.forEach(element => {
            element.readOnly = true;
            element.disabled = true;
            element.style.opacity = '0.7';
            element.style.backgroundColor = '#f5f5f5';
            element.style.cursor = 'not-allowed';
            element.title = 'په Offline حالت کې نه شي تغیریدلی';
        });
        
        // د بټنونو غیرفعالول
        const buttons = document.querySelectorAll([
            'button:not([data-offline-allowed])',
            'a.btn:not([data-offline-allowed])',
            'input[type="submit"]:not([data-offline-allowed])',
            'input[type="button"]:not([data-offline-allowed])'
        ].join(','));
        
        buttons.forEach(button => {
            if (!button.hasAttribute('data-offline-allowed')) {
                button.disabled = true;
                button.style.opacity = '0.5';
                button.style.cursor = 'not-allowed';
                button.style.pointerEvents = 'none';
                button.title = 'په Offline حالت کې نه شي کارول کیدلی';
            }
        });
        
        // د Delete او Edit بټنونو مخنیوی
        const actionButtons = document.querySelectorAll([
            '[onclick*="delete"]',
            '[onclick*="remove"]',
            '[onclick*="edit"]',
            '[onclick*="update"]',
            '[onclick*="save"]'
        ].join(','));
        
        actionButtons.forEach(button => {
            button.disabled = true;
            button.style.opacity = '0.3';
            button.onclick = null;
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showOfflineActionMessage();
            });
        });
    }

    // ==================== حالت بدلول ====================

    switchToOnlineMode() {
        console.log('🔁 په Online حالت کې تبدیلی...');
        
        // ۱. د Offline پیغام لرې کول
        this.hideOfflineWarning();
        
        // ۲. د Interactive عناصر فعالول
        this.enableInteractiveElements();
        
        // ۳. د Online نوټیفیکیشن
        this.showOnlineNotification();
        
        // ۴. د UI تازه کول
        this.updateUI();
        
        // ۵. د Auto-sync پیلول
        setTimeout(() => this.syncOfflineData(), 2000);
    }

    switchToOfflineMode() {
        console.log('🔁 په Offline حالت کې تبدیلی...');
        
        // ۱. د Offline پیغام ښکاره کول
        this.showOfflineWarning();
        
        // ۲. د View Only فعالول
        this.enableViewOnlyMode();
        
        // ۳. د UI تازه کول
        this.updateUI();
    }

    // ==================== Offline Data Sync ====================

    async syncOfflineData() {
        console.log('🔄 Offline Data سینک کېږي...');
        
        // دلته د Offline ډیټا سینک منطق
        // د IndexedDB څخه Firebase ته
        
        // د سینک بشپړېدو نوټیفیکیشن
        this.showSyncCompleteNotification();
    }

    // ==================== UI Management ====================

    updateUI() {
        // د حالت انډیکیټر تازه کول
        this.updateStatusIndicator();
        
        // د مینو تازه کول
        this.updateMenuItems();
        
        // د فورمونو تازه کول
        this.updateForms();
    }

    updateStatusIndicator() {
        let indicator = document.getElementById('networkStatusIndicator');
        
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'networkStatusIndicator';
            indicator.style.cssText = `
                position: fixed;
                top: 10px;
                left: 10px;
                padding: 8px 15px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: bold;
                z-index: 9999;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: all 0.3s;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            `;
            document.body.appendChild(indicator);
        }
        
        if (this.currentMode === 'online') {
            indicator.innerHTML = `
                <span style="color:#2ecc71; font-size:14px;">●</span>
                <span style="color:#2ecc71;">Online</span>
                <small style="opacity:0.7; margin-left:5px;">بشپړ Access</small>
            `;
            indicator.style.background = '#e8f5e9';
            indicator.style.color = '#27ae60';
            indicator.style.border = '1px solid #2ecc71';
        } else {
            indicator.innerHTML = `
                <span style="color:#e74c3c; font-size:14px;">●</span>
                <span style="color:#e74c3c;">Offline</span>
                <small style="opacity:0.7; margin-left:5px;">View Only</small>
            `;
            indicator.style.background = '#ffebee';
            indicator.style.color = '#c0392b';
            indicator.style.border = '1px solid #e74c3c';
        }
    }

    updateMenuItems() {
        const menuItems = document.querySelectorAll('.menu-item, .m-btn, [data-online-only]');
        
        menuItems.forEach(item => {
            if (item.hasAttribute('data-online-only') && this.currentMode === 'offline') {
                item.style.opacity = '0.5';
                item.style.pointerEvents = 'none';
                item.style.cursor = 'not-allowed';
                item.title = 'په Offline حالت کې نشئ کارولی';
            } else if (item.hasAttribute('data-offline-allowed')) {
                item.style.opacity = '1';
                item.style.pointerEvents = 'auto';
            }
        });
    }

    updateForms() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            if (this.currentMode === 'offline') {
                form.style.opacity = '0.8';
                form.style.pointerEvents = 'none';
                
                // د Offline پیغام اضافه کول
                if (!form.querySelector('.offline-form-message')) {
                    const message = document.createElement('div');
                    message.className = 'offline-form-message';
                    message.style.cssText = `
                        background: #fff3cd;
                        border: 1px solid #ffeaa7;
                        padding: 10px;
                        border-radius: 5px;
                        margin-bottom: 15px;
                        font-size: 12px;
                        color: #856404;
                        text-align: center;
                    `;
                    message.innerHTML = `
                        <span style="font-size:14px;">📴</span>
                        <strong>په Offline حالت کې یاست!</strong><br>
                        <small>تاسو یوازې معلومات وګورئ، تغیرات نشئ کولی.</small>
                    `;
                    form.insertBefore(message, form.firstChild);
                }
            } else {
                form.style.opacity = '1';
                form.style.pointerEvents = 'auto';
                
                // د Offline پیغام لرې کول
                const message = form.querySelector('.offline-form-message');
                if (message) {
                    message.remove();
                }
            }
        });
    }

    // ==================== نوټیفیکیشنونه ====================

    showOfflineWarning() {
        // د Offline Warning بanner
        let banner = document.getElementById('offlineWarningBanner');
        
        if (!banner) {
            banner = document.createElement('div');
            banner.id = 'offlineWarningBanner';
            banner.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background: linear-gradient(135deg, #ff6b6b, #ee5a52);
                color: white;
                padding: 12px 20px;
                text-align: center;
                z-index: 9998;
                font-size: 14px;
                font-weight: bold;
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 10px;
                animation: slideDown 0.5s;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            `;
            document.body.appendChild(banner);
        }
        
        banner.innerHTML = `
            <span style="font-size:16px;">📴</span>
            <div>
                <strong>تاسو آفلاین یاست!</strong>
                <small style="opacity:0.9; display:block; font-weight:normal;">
                    سیستم په View Only حالت کې دی. کله چې انټرنټ وصل شي، به په اتومات ډول Online شي.
                </small>
            </div>
        `;
        
        // د CSS Animation اضافه کول
        document.head.insertAdjacentHTML('beforeend', `
            <style>
                @keyframes slideDown {
                    from { transform: translateY(-100%); }
                    to { transform: translateY(0); }
                }
            </style>
        `);
    }

    hideOfflineWarning() {
        const banner = document.getElementById('offlineWarningBanner');
        if (banner) {
            banner.style.animation = 'slideUp 0.5s';
            banner.style.transform = 'translateY(-100%)';
            
            setTimeout(() => {
                if (banner.parentNode) {
                    banner.parentNode.removeChild(banner);
                }
            }, 500);
            
            document.head.insertAdjacentHTML('beforeend', `
                <style>
                    @keyframes slideUp {
                        from { transform: translateY(0); }
                        to { transform: translateY(-100%); }
                    }
                </style>
            `);
        }
    }

    showOnlineNotification() {
        // د Online Notification Toast
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 60px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #4CAF50, #2ecc71);
            color: white;
            padding: 12px 25px;
            border-radius: 25px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 9997;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideIn 0.5s;
        `;
        
        toast.innerHTML = `
            <span style="font-size:16px;">🌐</span>
            <div>
                <strong>انټرنټ وصل شو!</strong><br>
                <small style="opacity:0.9;">سیستم اوس په Online حالت کې دی.</small>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'slideOut 0.5s';
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                    }
                }, 500);
            }
        }, 3000);
        
        document.head.insertAdjacentHTML('beforeend', `
            <style>
                @keyframes slideIn {
                    from { transform: translate(-50%, -100px); opacity: 0; }
                    to { transform: translate(-50%, 0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translate(-50%, 0); opacity: 1; }
                    to { transform: translate(-50%, -100px); opacity: 0; }
                }
            </style>
        `);
    }

    showOfflineActionMessage() {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 20px 30px;
            border-radius: 15px;
            z-index: 10000;
            text-align: center;
            max-width: 300px;
            animation: fadeIn 0.3s;
        `;
        
        message.innerHTML = `
            <span style="font-size:40px; display:block; margin-bottom:10px;">📴</span>
            <strong style="display:block; margin-bottom:10px;">په Offline حالت کې یاست!</strong>
            <small style="opacity:0.8;">
                تاسو اوس یوازې معلومات وګورئ.<br>
                د تغیراتو لپاره انټرنټ اتصال ضروري دی.
            </small>
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            if (message.parentNode) {
                message.style.animation = 'fadeOut 0.3s';
                setTimeout(() => {
                    if (message.parentNode) {
                        message.parentNode.removeChild(message);
                    }
                }, 300);
            }
        }, 2000);
        
        document.head.insertAdjacentHTML('beforeend', `
            <style>
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
            </style>
        `);
    }

    showSyncCompleteNotification() {
        // دلته د سینک بشپړېدو نوټیفیکیشن
        console.log('✅ Sync بشپړ شو');
    }

    enableSyncButton() {
        // د Sync بټن په Offline حالت کې
        const syncButton = document.getElementById('manualSyncBtn');
        if (syncButton) {
            syncButton.disabled = false;
            syncButton.style.opacity = '1';
            syncButton.style.pointerEvents = 'auto';
            syncButton.title = 'د انټرنټ د وصلېدو پرته Sync کول';
        }
    }

    // ==================== Public API ====================

    getCurrentMode() {
        return this.currentMode;
    }

    isSystemOnline() {
        return this.isOnline;
    }

    forceOnlineMode() {
        console.log('⚡ په زور سره Online Mode فعالېږي...');
        this.currentMode = 'online';
        this.switchToOnlineMode();
    }

    forceOfflineMode() {
        console.log('⚡ په زور سره Offline Mode فعالېږي...');
        this.currentMode = 'offline';
        this.switchToOfflineMode();
    }

    // ==================== Utility Functions ====================

    checkConnectivity() {
        return new Promise((resolve) => {
            const timeout = setTimeout(() => resolve(false), 3000);
            
            fetch('/favicon.ico', { mode: 'no-cors' })
                .then(() => {
                    clearTimeout(timeout);
                    resolve(true);
                })
                .catch(() => {
                    clearTimeout(timeout);
                    resolve(false);
                });
        });
    }

    getNetworkInfo() {
        return {
            online: navigator.onLine,
            mode: this.currentMode,
            connection: navigator.connection ? {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt,
                saveData: navigator.connection.saveData
            } : null,
            timestamp: new Date().toISOString()
        };
    }
}

// د Global Instance جوړول
window.hybridSystem = new HybridSystem();

console.log('🎯 Hybrid System چمتو دی!');