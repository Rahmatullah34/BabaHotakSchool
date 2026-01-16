/* د بابا هوتک لیسې د زده‌کوونکو د مدیریت سیسټم 
   اصلاح شوې بڼه: د اتومات آی ډي او اساس نمبر جلا کولو سره
   پراختیا ورکوونکی: استاد رحمت الله علمي
*/

let currentBase64Image = ""; 

// د عکس پروسس کول
function processImage(input) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.src = e.target.result;
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const maxWidth = 300;
                const scale = maxWidth / img.width;
                canvas.width = maxWidth;
                canvas.height = img.height * scale;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                currentBase64Image = canvas.toDataURL('image/jpeg', 0.5);
                const preview = document.getElementById('imgPreviewInForm');
                if(preview) {
                    preview.src = currentBase64Image;
                    preview.style.display = 'block';
                }
            };
        };
        reader.readAsDataURL(file);
    }
}

function toggleForm() {
    const f = document.getElementById('admissionForm');
    if (f) f.style.display = f.style.display === 'none' ? 'block' : 'none';
}

// د نوي زده‌کوونکي خوندي کول (له اتومات آی ډي سره)
async function saveStudent() {
    const asas = document.getElementById('stdAsas').value.trim();
    const name = document.getElementById('stdName').value.trim();
    const father = document.getElementById('stdFather').value.trim();
    const grandFather = document.getElementById('stdGrandFather').value.trim();
    const phone = document.getElementById('stdPhone').value.trim() || "نشته";
    const grade = document.getElementById('stdGrade').value;
    const section = document.getElementById('stdSection').value;
    const date = document.getElementById('regDate').value;

    if(!asas || !name || !grade) {
        alert("🛑 اساس نمبر، نوم او ټولګی حتماً ډک کړئ!");
        return;
    }

    // اتومات لاګین آی ډي جوړول (BH-2026-Asas)
    const autoLoginId = "BH-2026-" + asas;

    try {
        const checkDuplicate = await db.collection("babaStudents").doc(autoLoginId).get();
        if (checkDuplicate.exists) {
            alert("⚠️ دا اساس نمبر (آی ډي) لا دمخه ثبت دی!");
            return;
        }

        await db.collection("babaStudents").doc(autoLoginId).set({
            studentId: autoLoginId, // دا د لاګین لپاره ده
            asas: asas,           // دا د رسمي اساس لپاره ده
            name, father, grandFather, phone, grade, section, date,
            photo: currentBase64Image,
            status: 'برحاله',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        alert("✅ شاګرد په بریالیتوب سره ثبت شو.\nلاګین آی ډي: " + autoLoginId);
        location.reload(); 
    } catch (error) {
        alert("❌ تېروتنه: " + error.message);
    }
}

function loadTable() {
    const tableBody = document.getElementById('studentTableBody');
    if(!tableBody) return;

    db.collection("babaStudents").orderBy("createdAt", "desc").onSnapshot((snapshot) => {
        let allData = [];
        snapshot.forEach(doc => {
            allData.push({ id: doc.id, ...doc.data() });
        });
        updateStats(allData);
        renderRows(allData);
    });
}

function updateStats(data) {
    if(document.getElementById('totalStdCount'))
        document.getElementById('totalStdCount').innerText = data.length;
    if(document.getElementById('activeStdCount'))
        document.getElementById('activeStdCount').innerText = data.filter(s => s.status === 'برحاله').length;
    if(document.getElementById('inactiveCount'))
        document.getElementById('inactiveCount').innerText = data.filter(s => s.status !== 'برحاله').length;
}

// د جدول نمایش (آی ډي او اساس جلا ښکاري)
function renderRows(displayData) {
    const tableBody = document.getElementById('studentTableBody');
    if(!tableBody) return;
    tableBody.innerHTML = displayData.map(s => `
        <tr style="border-bottom: 1px solid #eee; background: white;">
            <td style="padding:10px;">
                <span style="color:#e67e22; font-weight:bold; font-size:12px;">ID: ${s.studentId}</span><br>
                <small style="color:#7f8c8d;">اساس: ${s.asas}</small>
            </td>
            <td style="padding:10px;">
                <img src="${s.photo || 'placeholder.png'}" style="width:30px; height:30px; border-radius:50%; vertical-align:middle; margin-left:5px; object-fit:cover;">
                <strong>${s.name}</strong><br><small>د ${s.father} زوی</small>
            </td>
            <td style="padding:10px;">${s.grade} - ${s.section}</td>
            <td style="padding:10px;">
                ${s.phone && s.phone !== "نشته" ? 
                    `<span style="color:blue; font-size:12px;">📱 ${s.phone}</span>` : 
                    `<button onclick="editStudent('${s.id}')" style="background:#f39c12; color:white; border:none; border-radius:5px; padding:2px 8px; cursor:pointer; font-size:11px;">+ نمبر</button>`
                }
            </td>
            <td style="padding:10px;">
                <button onclick="viewProfile('${s.id}')" style="background:#3498db; color:white; border:none; border-radius:5px; padding:5px 10px; cursor:pointer;">👁️</button>
                <button onclick="editStudent('${s.id}')" style="background:#2ecc71; color:white; border:none; border-radius:5px; padding:5px 10px; cursor:pointer;">📝</button>
                <button onclick="deleteStd('${s.id}')" style="background:#e74c3c; color:white; border:none; border-radius:5px; padding:5px 10px; cursor:pointer;">🗑️</button>
            </td>
        </tr>
    `).join('');
}

// د لټون سیسټم
async function filterStudents() {
    const term = document.getElementById('searchBar').value.toLowerCase();
    const snapshot = await db.collection("babaStudents").get();
    let filtered = [];
    snapshot.forEach(doc => {
        const s = doc.data();
        if (s.name.toLowerCase().includes(term) || (s.studentId && s.studentId.toLowerCase().includes(term)) || (s.asas && s.asas.includes(term))) {
            filtered.push({ id: doc.id, ...s });
        }
    });
    renderRows(filtered);
}

// د اډیټ (Edit) نوي فنکشنونه
async function editStudent(id) {
    const doc = await db.collection("babaStudents").doc(id).get();
    if (doc.exists) {
        const s = doc.data();
        document.getElementById('editDocId').value = id;
        document.getElementById('editName').value = s.name;
        document.getElementById('editFather').value = s.father;
        document.getElementById('editAsas').value = s.asas;
        document.getElementById('editPhone').value = (s.phone === "نشته") ? "" : s.phone;
        document.getElementById('editModal').style.display = 'flex';
    }
}

async function updateStudentData() {
    const id = document.getElementById('editDocId').value;
    const data = {
        name: document.getElementById('editName').value.trim(),
        father: document.getElementById('editFather').value.trim(),
        asas: document.getElementById('editAsas').value.trim(),
        phone: document.getElementById('editPhone').value.trim() || "نشته"
    };
    try {
        await db.collection("babaStudents").doc(id).update(data);
        alert("✅ معلومات اصلاح شول!");
        document.getElementById('editModal').style.display = 'none';
    } catch (e) { alert("❌ تېروتنه!"); }
}

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

// د پروفایل لیدل
async function viewProfile(id) {
    const doc = await db.collection("babaStudents").doc(id).get();
    if (!doc.exists) return;
    const std = doc.data();

    document.getElementById('profileDetails').innerHTML = `
        <div style="border: 2px solid #3498db; border-radius: 10px; padding: 15px; background: #fff; text-align: right;">
            <div style="text-align:center; border-bottom: 2px solid #eee; padding-bottom:10px; margin-bottom:10px;">
                <h4 style="margin: 0;">د بابا هوتک نمبر ۲ عالي لیسه</h4>
                <small>د زده‌کوونکي رسمي پېژندپاڼه</small>
            </div>
            <div style="display: flex; gap: 15px;">
                <div style="width: 80px; height: 100px; background: #f0f0f0; border: 1px solid #ddd; border-radius: 5px; overflow:hidden;">
                    <img src="${std.photo || ''}" style="width:100%; height:100%; object-fit:cover;">
                </div>
                <div style="flex: 1; font-size: 14px; line-height:1.8;">
                    <p style="margin:0;"><strong>لاګین آی ډي:</strong> <span style="color:red; font-weight:bold;">${std.studentId}</span></p>
                    <p style="margin:0;"><strong>اساس نمبر:</strong> ${std.asas}</p>
                    <p style="margin:0;"><strong>نوم:</strong> ${std.name}</p>
                    <p style="margin:0;"><strong>پلار:</strong> ${std.father}</p>
                    <p style="margin:0;"><strong>نیکه:</strong> ${std.grandFather || '---'}</p>
                    <p style="margin:0;"><strong>ټولګی:</strong> ${std.grade} - ${std.section}</p>
                </div>
            </div>
            <div style="margin-top:10px; border-top:1px solid #eee; padding-top:5px; font-size:11px; color:blue;">
               اړیکه: ${std.phone || 'نشته'}
            </div>
        </div>
    `;

    const callBtn = document.getElementById('callBtn');
    if(callBtn) {
        if (std.phone && std.phone !== "نشته") {
            callBtn.onclick = () => window.location.href = `tel:${std.phone}`;
            callBtn.style.display = "block";
        } else {
            callBtn.style.display = "none";
        }
    }
    document.getElementById('studentProfileModal').style.display = 'flex';
}

function closeProfile() {
    document.getElementById('studentProfileModal').style.display = 'none';
}

async function deleteStd(id) {
    if(confirm("⚠️ ایا ډاډه یاست چې دا زده‌کوونکی حذف کړئ؟")) {
        try {
            await db.collection("babaStudents").doc(id).delete();
        } catch (e) { alert("تېروتنه!"); }
    }
}

document.addEventListener('DOMContentLoaded', loadTable);