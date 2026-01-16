<script>
  const firebaseConfig = {
    apiKey: "AIzaSyB1SSjuFWV0Fjnpm6bjbK-6r-5qNdZPQsM",
    authDomain: "babahotakschool.firebaseapp.com",
    projectId: "babahotakschool",
    storageBucket: "babahotakschool.firebasestorage.app",
    messagingSenderId: "12958892996",
    appId: "1:12958892996:web:477e44b4453a0fbd9b9a91",
    measurementId: "G-28QZY65DZE"
  };

  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  // ۱. د اساس نمبر له مخې د زده‌کوونکي نوم موندل
  async function findStudentName() {
    const asas = document.getElementById('fAsas').value;
    const nameBox = document.getElementById('stNameBox');
    
    if (asas.length > 0) {
      const snap = await db.collection("babaStudents").where("asas", "==", asas).get();
      if (!snap.empty) {
        const std = snap.docs[0].data();
        nameBox.innerText = "د زده کوونکي نوم: " + std.name;
        nameBox.style.color = "var(--success)";
      } else {
        nameBox.innerText = "شاګرد پیدا نشو! ❌";
        nameBox.style.color = "var(--danger)";
      }
    }
  }

  // ۲. د فیس ثبتول
  async function savePayment() {
    const asas = document.getElementById('fAsas').value;
    const amount = document.getElementById('fAmount').value;
    const month = document.getElementById('fMonth').value;
    const nameStr = document.getElementById('stNameBox').innerText;

    if (!asas || !amount || !month || nameStr.includes("پیدا نشو")) {
      alert("مهرباني وکړئ معلومات پوره کړئ!");
      return;
    }

    try {
      await db.collection("babaFinance").add({
        type: "fee",
        asas: asas,
        name: nameStr.replace("د زده کوونکي نوم: ", ""),
        amount: Number(amount),
        month: month,
        date: new Date().toLocaleDateString('fa-AF')
      });
      alert("فیس په بریالیتوب سره ثبت شو! ✅");
      location.reload();
    } catch (e) { alert("خطا: " + e.message); }
  }

  // ۳. د لګښت ثبتول
  async function saveExpense() {
    const type = document.getElementById('eType').value;
    const amount = document.getElementById('eAmount').value;
    const date = document.getElementById('eDate').value;

    if (!type || !amount) {
      alert("معلومات بشپړ کړئ!");
      return;
    }

    try {
      await db.collection("babaFinance").add({
        type: "expense",
        category: type,
        amount: Number(amount),
        date: date || new Date().toLocaleDateString('fa-AF')
      });
      alert("لګښت ثبت شو! ✅");
      location.reload();
    } catch (e) { alert("خطا: " + e.message); }
  }

  // ۴. د مالي ارقامو او جدول ښودل
  function loadFinanceData() {
    const tableBody = document.getElementById('fTableBody');
    
    db.collection("babaFinance").onSnapshot(snap => {
      tableBody.innerHTML = "";
      let fees = 0; let exps = 0;

      snap.forEach(doc => {
        const d = doc.data();
        if (d.type === "fee") {
          fees += d.amount;
          tableBody.innerHTML += `<tr><td>${d.name}</td><td>${d.month}</td><td>${d.amount}</td><td><span class="badge badge-paid">فیس</span></td></tr>`;
        } else {
          exps += d.amount;
        }
      });

      document.getElementById('totalCol').innerText = fees + " AFN";
      document.getElementById('totalExp').innerText = exps + " AFN";
      document.getElementById('totalOut').innerText = (fees - exps) + " AFN";
    });
  }

  window.onload = loadFinanceData;
</script>
