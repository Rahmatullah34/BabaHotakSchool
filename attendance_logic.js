/* د بابا هوتک لیسې د حاضرۍ مدیریت سیسټم 
   پراختیا ورکوونکی: استاد رحمت الله علمي
*/

let dailyRecord = {};
let studentsData = []; // د صنف د شاګردانو ذخیره کولو لپاره

// ۱. له فایربیس څخه د شاګردانو راوستل
async function loadAttendanceList() {
    const grade = document.getElementById('attGrade').value;
    const section = document.getElementById('attSection').value;
    const table = document.getElementById('attTable');
    const footer = document.getElementById('footerArea');
    const infoLabel = document.getElementById('infoLabel');
    const tableBody = document.getElementById('attendanceTableBody');

    if(!grade || !section) {
        table.style.display = footer.style.display = "none";
        infoLabel.style.display = "block";
        return;
    }

    infoLabel.innerHTML = "د معلوماتو په راوستلو کې لږ انتظار وکړئ... ⏳";

    try {
        // فایربیس څخه د شاګردانو فلټر کول
        const snapshot = await db.collection("babaStudents")
            .where("grade", "==", grade)
            .where("section", "==", section)
            .get();

        if(snapshot.empty) {
            infoLabel.innerHTML = "په دې صنف کې شاګردان نشته! ❌";
            table.style.display = footer.style.display = "none";
            return;
        }

        studentsData = [];
        dailyRecord = {};
        infoLabel.style.display = "none";
        table.style.display = "table";
        footer.style.display = "block";
        tableBody.innerHTML = "";

        snapshot.forEach(doc => {
            const s = doc.data();
            const id = doc.id;
            studentsData.push({ id, ...s });
            dailyRecord[s.asas] = 'حاضر'; // ډیفالټ حالت

            tableBody.innerHTML += `
            <tr id="row-${s.asas}">
                <td><b>${s.name}</b><br><small style="color:#777;">اساس: ${s.asas}</small></td>
                <td>
                    <div class="att-group">
                        <button class="btn-status p active" onclick="mark('${s.asas}', 'حاضر', this)">✅</button>
                        <button class="btn-status a" onclick="mark('${s.asas}', 'غیرحاضر', this)">❌</button>
                        <button class="btn-status l" onclick="mark('${s.asas}', 'رخصت', this)">📝</button>
                        <button class="wa-btn" onclick="sendAutoMessage('${s.phone}', '${s.name}', 'WA')">💬</button>
                        <button class="wa-btn" style="background:#34495e;" onclick="sendAutoMessage('${s.phone}', '${s.name}', 'SMS')">📱</button>
                    </div>
                </td>
            </tr>`;
        });
        updateSummary();
    } catch (error) {
        infoLabel.innerHTML = "تېروتنه: " + error.message;
    }
}

// ۲. د حالت بدلول (حاضر، غیرحاضر...)
function mark(asas, status, btn) {
    dailyRecord[asas] = status;
    const row = document.getElementById(`row-${asas}`);
    const buttons = btn.parentElement.querySelectorAll('.btn-status');
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    if(status === 'غیرحاضر') row.classList.add('absent-row');
    else if(status === 'رخصت') row.style.backgroundColor = "#fffde7";
    else row.classList.remove('absent-row', 'leave-row');
    
    updateSummary();
}

// ۳. د واټساپ او SMS اتومات پیغامونه
function sendAutoMessage(phone, name, type) {
    if(!phone || phone === "") return alert("د شاګرد د پلار شمېره نشته!");
    
    const date = document.getElementById('attDate').value;
    const status = dailyRecord[Object.keys(dailyRecord).find(key => studentsData.find(s => s.asas == key && s.name == name))];
    
    if(status === 'حاضر') {
        alert("شاګرد حاضر دی، پیغام ته اړتیا نشته.");
        return;
    }

    const msg = `دروند پلار! ستاسو زوی ${name} نن په ${date} نېټه د بابا هوتک له لیسې څخه ${status} دی. هیله ده معلومات مو وي.`;

    if(type === 'WA') {
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    } else {
        // د موبایل د SMS اپلیکیشن خلاصول
        window.location.href = `sms:${phone}?body=${encodeURIComponent(msg)}`;
    }
}

// ۴. لنډیز اپډېټ کول
function updateSummary() {
    const counts = { حاضر: 0, غیرحاضر: 0, رخصت: 0 };
    Object.values(dailyRecord).forEach(s => counts[s]++);
    document.getElementById('pCount').innerText = counts['حاضر'];
    document.getElementById('aCount').innerText = counts['غیرحاضر'];
    document.getElementById('lCount').innerText = counts['رخصت'];
}

// ۵. په فایربیس کې د حاضرۍ خوندي کول
async function saveAllAttendance() {
    const date = document.getElementById('attDate').value;
    const grade = document.getElementById('attGrade').value;
    const section = document.getElementById('attSection').value;
    const saveBtn = document.querySelector('.save-btn');

    saveBtn.innerText = "خوندي کېږي... ⏳";
    saveBtn.disabled = true;

    try {
        await db.collection("babaAttendance").add({
            date, grade, section,
            records: dailyRecord,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        alert("✅ د نن ورځې حاضري په فایربیس کې خوندي شوه!");
        saveBtn.innerText = "💾 د حاضرۍ وروستی خوندي کول";
        saveBtn.disabled = false;
    } catch (error) {
        alert("تېروتنه: " + error.message);
        saveBtn.disabled = false;
    }
}
