async function loadAdminResults() {
    const grade = document.getElementById('classFilter').value;
    const tbody = document.getElementById('adminResTableBody');
    if(!grade) return;

    tbody.innerHTML = "د معلوماتو پلټنه... ⏳";

    try {
        // لومړی وګوره چې ایا د دې صنف لپاره چا نمرې اچولي؟
        const snapshot = await db.collection("babaResults")
            .where("grade", "==", grade).get();

        if(snapshot.empty) {
            tbody.innerHTML = `<tr><td colspan="5" style="padding:20px; color:red;">
                د دې ټولګي لپاره لا تر اوسه د ښوونکي لخوا نمرې نه دي داخلې شوې. ❌
            </td></tr>`;
            return;
        }

        tbody.innerHTML = "";
        snapshot.forEach(doc => {
            const r = doc.data();
            // د فیصدي حساب
            const total = Number(r.totalScore) || 0;
            const percentage = (total / 10).toFixed(1); 

            tbody.innerHTML += `
                <tr>
                    <td><b>${r.name}</b></td>
                    <td>${total}</td>
                    <td>${percentage}%</td>
                    <td><span style="color:${r.status.includes('کامیاب') ? 'green' : 'red'}">${r.status}</span></td>
                    <td>
                        <button class="btn-print" onclick="printReport('${doc.id}')">🖨️ چاپ</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error(error);
        tbody.innerHTML = "تېروتنه وشوه: " + error.message;
    }
}
