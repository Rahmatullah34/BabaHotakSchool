/* د افلاین سیستم د پیلولو لپاره اصلي فایل */

// د افلاین سیستم پیلول
async function initOfflineSystem() {
    console.log('🚀 د افلاین سیستم پیلېږي...');
    
    try {
        // لومړی Service Worker چک
        if ('serviceWorker' in navigator) {
            await navigator.serviceWorker.register('/sw.js');
            console.log('✅ Service Worker ثبت شو');
        }
        
        // بیا افلاین ډیټابیس پیلول
        await offlineDB.initializeDB();
        console.log('✅ افلاین ډیټابیس چمتو دی');
        
        // د Firebase افلاین ملاتړ
        if (typeof firebase !== 'undefined') {
            await firebaseOffline.initFirebaseOffline();
            console.log('✅ Firebase افلاین ملاتړ فعال شو');
        }
        
        // د افلاین UI پیلول
        offlineUI.init();
        console.log('✅ افلاین UI چمتو دی');
        
        // د افلاین سینک سیستم پیلول
        console.log('✅ افلاین سینک سیستم چمتو دی');
        
        // د نوټیفیکیشن اجازه
        requestNotificationPermission();
        
        console.log('🎉 ټول افلاین سیستمونه په بریالیتوب سره پیل شول!');
        
        // د افلاین حالت ښودل که آفلاین وي
        if (!navigator.onLine) {
            offlineUI.showOfflineMessage();
        }
        
    } catch (error) {
        console.error('❌ د افلاین سیستم پیلولو ستونزه:', error);
        
        // د بدیل پیغام ښودل
        showErrorToast('د افلاین سیستم ستونزه', 'سیستم په بشپړ ډول آفلاین کار نه کوي، مګر اسانه فعالیتونه کارولی شئ.');
    }
}

// د نوټیفیکیشن اجازه
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('🔔 نوټیفیکیشن اجازه ورکړل شوه');
            }
        });
    }
}

// د Error نوټیفیکیشن
function showErrorToast(title, message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #f44336;
        color: white;
        padding: 15px 25px;
        border-radius: 12px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 9999;
        max-width: 80%;
        text-align: center;
        animation: slideDown 0.5s;
    `;
    
    toast.innerHTML = `
        <strong style="display:block; margin-bottom:5px;">${title}</strong>
        <small>${message}</small>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 5000);
}

// په پیل کې CSS animations اضافه کول
document.head.insertAdjacentHTML('beforeend', `
    <style>
        @keyframes slideDown {
            from { transform: translate(-50%, -100px); opacity: 0; }
            to { transform: translate(-50%, 0); opacity: 1; }
        }
        
        @keyframes slideUp {
            from { transform: translate(-50%, 100px); opacity: 0; }
            to { transform: translate(-50%, 0); opacity: 1; }
        }
        
        @keyframes slideIn {
            from { transform: translateX(100px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    </style>
`);

// د افلاین فورم ملاتړ
function setupOfflineForms() {
    // د ټولو فورمونو لپاره افلاین ملاتړ
    document.addEventListener('submit', async function(event) {
        const form = event.target;
        
        // که فورم افلاین ملاتړ لري
        if (form.hasAttribute('data-offline-support')) {
            event.preventDefault();
            
            const formData = new FormData(form);
            const data = {};
            
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            // د فورم ډول تشخیص
            let formType = 'general';
            
            if (form.id.includes('attendance')) formType = 'attendance';
            else if (form.id.includes('student')) formType = 'students';
            else if (form.id.includes('mark')) formType = 'marks';
            else if (form.id.includes('fee')) formType = 'fees';
            else if (form.id.includes('chat')) formType = 'chat';
            
            try {
                // په افلاین کې ذخیره کول
                let result;
                
                switch(formType) {
                    case 'attendance':
                        result = await offlineDB.addAttendance(data);
                        break;
                    case 'students':
                        result = await offlineDB.addStudent(data);
                        break;
                    case 'marks':
                        result = await offlineDB.addMark(data);
                        break;
                    case 'fees':
                        result = await offlineDB.addFee(data);
                        break;
                    case 'chat':
                        result = await offlineDB.addChatMessage(data);
                        break;
                    default:
                        result = await offlineDB.addRecord('general', {
                            ...data,
                            formType: formType,
                            syncStatus: 'pending'
                        });
                }
                
                // د بریالیتوب پیغام
                offlineUI.showSuccessMessage('✅ خوندي شو!', 'ډیټا په افلاین حالت کې خوندي شو.');
                
                // د فورم پاکول
                form.reset();
                
            } catch (error) {
                console.error('❌ د افلاین فورم ستونزه:', error);
                offlineUI.showErrorMessage('❌ ستونزه!', 'ډیټا ونه خوندي شو.');
            }
        }
    });
}

// د افلاین سیستم د پیلولو لپاره Event Listener
document.addEventListener('DOMContentLoaded', function() {
    // لږ وخت وروسته پیلول ترڅو نور JavaScript فایلونه چارج شي
    setTimeout(() => {
        initOfflineSystem();
        setupOfflineForms();
    }, 1000);
});

console.log('📱 افلاین سیستم پیلولو کوډ چارج شو!');