/* د بابا هوتک لیسې جامع مدیریت سیسټم - استاد رحمت الله علمي */

// ۱. فایربیس پیژندنه (Firebase Initialization)
const firebaseConfig = {
    apiKey: "AIzaSyB1SSjuFWV0Fjnpm6bjbK-6r-5qNdZPQsM",
    authDomain: "babahotakschool.firebaseapp.com",
    projectId: "babahotakschool",
    storageBucket: "babahotakschool.firebasestorage.app",
    messagingSenderId: "12958892996",
    appId: "1:12958892996:web:477e44b4453a0fbd9b9a91",
    measurementId: "G-28QZY65DZE"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// ۲. د ننوتلو او پاڼو ترمنځ تګ (Login & Navigation)
function goToLogin(role) {
    localStorage.setItem('userRole', role);
    window.location.href = 'login.html';
}

async function checkLogin() {
    const userField = document.getElementById('email-field')?.value.trim();
    const passField = document.getElementById('password-field')?.value.trim();
    const role = localStorage.getItem('userRole') || 'admin';

    if (!userField || !passField) {
        alert("🛑 مهرباني وکړئ معلومات ولیکئ!");
        return;
    }

    try {
        if (role === 'admin') {
            const doc = await db.collection("adminConfig").doc("credentials").get();
            if (doc.exists) {
                const data = doc.data();
                if (userField.toLowerCase() === data.username.toLowerCase() && passField === data.password) {
                    return loginSuccess();
                }
            }
            // بیک‌اپ لاګین
            if (userField === "rahmatalmi145@gmail.com" && passField === "BabaHotak3513") {
                return loginSuccess();
            }
        }
        alert("❌ معلومات غلط دي!");
    } catch (error) {
        alert("تېروتنه: " + error.message);
    }
}

function loginSuccess() {
    localStorage.setItem('isLoggedIn', 'true');
    window.location.replace('admin_dashboard.html');
}

// ۳. د زده‌کوونکو مدیریت (Student Management)
function toggleForm() {
    const f = document.getElementById('admissionForm');
    if (f) f.style.display = f.style.display === 'none' ? 'block' : 'none';
}

async function saveStudent() {
    const asas = document.getElementById('stdAsas')?.value.trim();
    const name = document.getElementById('stdName')?.value.trim();
    const father = document.getElementById('stdFather')?.value.trim();
    const grade = document.getElementById('stdGrade')?.value;
    const section = document.getElementById('stdSection')?.value;

    if(!asas || !name || !grade) {
        alert("🛑 اساس، نوم او ټولګی اړین دي!");
        return;
    }

    try {
        await db.collection("babaStudents").add({
            asas, name, father, grade, section,
            status: 'برحاله',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        alert("✅ شاګرد په ډیټابیس کې خوندي شو!");
        toggleForm();
    } catch (e) {
        alert("ثبت نشو: " + e.message);
    }
}

// ۴. د معلوماتو راوستل (Data Loading)
function loadStudentData() {
    const tableBody = document.getElementById('studentTableBody');
    if(!tableBody) return;

    db.collection("babaStudents").orderBy("asas", "asc").onSnapshot((snapshot) => {
        tableBody.innerHTML = "";
        snapshot.forEach(doc => {
            const s = doc.data();
            tableBody.innerHTML += `
                <tr>
                    <td>${s.asas}</td>
                    <td><strong>${s.name}</strong></td>
                    <td>${s.grade} - ${s.section}</td>
                    <td>
                        <button onclick="deleteStd('${doc.id}')">🗑️</button>
                    </td>
                </tr>`;
        });
    });
}

async function deleteStd(id) {
    if(confirm("ایا غواړئ دا ریکارډ حذف کړئ؟")) {
        await db.collection("babaStudents").doc(id).delete();
    }
}

// کله چې پاڼه خلاصه شي
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('studentTableBody')) loadStudentData();
});
