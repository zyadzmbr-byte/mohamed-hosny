const fs = require('fs');
try {
    fs.renameSync("WhatsApp Image 2026-05-13 at 9.02.12 AM.jpeg", "media__portrait_dr_eman_v3.jpg");
    console.log("Success");
} catch (e) {
    console.error(e);
}
