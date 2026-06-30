const fs = require('fs');
const path = require('path');
const files = [
    'index.html', 'admin.html', 'dashboard.html',
    'explore.html', 'grade.html', 'login.html',
    'subjects.html', 'my-subscriptions.html'
];
files.forEach(f => {
    const p = path.join('d:/منصة/spedia-clone/04_Github_Ready', f);
    if (!fs.existsSync(p)) return;
    let d = fs.readFileSync(p, 'utf8');
    d = d.replace(/content="width=1200"/g, 'content="width=800"');
    fs.writeFileSync(p, d, 'utf8');
});
process.exit(0);
