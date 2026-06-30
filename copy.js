const fs = require('fs');
const src = "C:\\Users\\Support\\.gemini\\antigravity\\brain\\29bdc899-6f45-45ef-8710-23e8f89ec758\\media__1778668128334.jpg";
const dest = "d:\\منصة\\spedia-clone\\04_Github_Ready\\media__portrait_dr_eman_v2.jpg";
try {
    fs.copyFileSync(src, dest);
    console.log("Success");
} catch (e) {
    console.error(e);
}
