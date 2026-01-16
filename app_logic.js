// ۱. د زده کوونکو د ډیټابیس جوړول یا لوډ کول
let babaSchoolDB = JSON.parse(localStorage.getItem('babaSchoolDB')) || [];

// ۲. د نوي زده کوونکي ثبتول (ارشیف)
function registerStudent(asas, name, grade, section, phone) {
    const student = {
        asas: asas,
        name: name,
        grade: grade,
        section: section,
        phone: phone,
        results: [],
        payments: [],
        attendance: []
    };
    
    babaSchoolDB.push(student);
    saveToDisk();
}

// ۳. د اساس نمبر له مخې د معلوماتو موندل (خورا چټک لټون)
function findStudentByAsas(asas) {
    return babaSchoolDB.find(s => s.asas == asas);
}

// ۴. په حافظه کې د معلوماتو دایمي ساتل
function saveToDisk() {
    localStorage.setItem('babaSchoolDB', JSON.stringify(babaSchoolDB));
    console.log("معلومات په موبایل کې خوندي شول! ✅");
}

// ۵. د ټیسټ لپاره: د ۳۰۰۰ کسانو د بار (Load) چک کول
function testSystemLoad() {
    console.time("System Speed");
    // دلته موږ په فرضي ډول د سیسټم سرعت ګورو
    console.timeEnd("System Speed");
}
