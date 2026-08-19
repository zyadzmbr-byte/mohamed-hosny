
        function showSection(id, btn) {
            document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
            document.querySelectorAll('.admin-nav button').forEach(b => b.classList.remove('active'));
            document.getElementById(id).classList.add('active');
            if (btn) btn.classList.add('active');
        }


        window.addEval = async function (e) {
            e.preventDefault();
            let code = document.getElementById('ev-code').value;
            let note = document.getElementById('ev-note').value;
            let newUserEval = { code, note, date: new Date().toLocaleDateString('ar-EG') };

            if (window.fsData && window.fsData.addEval) {
                try { await Promise.race([window.fsData.addEval(newUserEval), new Promise((_,_r) => setTimeout(()=>_r(new Error('timeout')), 1500))]); } catch (er) { console.warn("Firebase Eval Add Error:", er); }
            }

            let evals = JSON.parse(localStorage.getItem('spedia_evals') || '[]');
            evals.push(newUserEval);
            localStorage.setItem('spedia_evals', JSON.stringify(evals));
            alert('تم إضافة التقييم!');
            e.target.reset();
        }

        async function renderTables() {
            let codes = JSON.parse(localStorage.getItem('spedia_codes') || '[]');
            let users = [];
            let att = [];
            let subCodes = [];
            if (window.fsData) {
                if (window.fsData.getAllCodes) {
                    try {
                        let fbCodes = await Promise.race([window.fsData.getAllCodes(), new Promise((_,_r) => setTimeout(()=>_r(new Error('timeout')), 1500))]);
                        if (fbCodes && fbCodes.length > 0) {
                            codes = fbCodes;
                            localStorage.setItem('spedia_codes', JSON.stringify(codes));
                        }
                    } catch (e) { }
                }
                try { users = await Promise.race([window.fsData.getAllUsers(), new Promise((_,_r) => setTimeout(()=>_r(new Error('timeout')), 1500))]); } catch(e) { users = JSON.parse(localStorage.getItem('spedia_users') || '[]'); }
                try { att = await Promise.race([window.fsData.getAttendance(), new Promise((_,_r) => setTimeout(()=>_r(new Error('timeout')), 1500))]); } catch(e) { att = JSON.parse(localStorage.getItem('spedia_attendance') || '[]'); }
                if (window.fsData.getAllSubscriptionCodes) {
                    try { subCodes = await Promise.race([window.fsData.getAllSubscriptionCodes(), new Promise((_,_r) => setTimeout(()=>_r(new Error('timeout')), 1500))]); } catch(e) { subCodes = JSON.parse(localStorage.getItem('spedia_sub_codes') || '[]'); }
                }
            } else {
                users = JSON.parse(localStorage.getItem('spedia_users') || '[]');
                att = JSON.parse(localStorage.getItem('spedia_attendance') || '[]');
                subCodes = JSON.parse(localStorage.getItem('spedia_sub_codes') || '[]');
            }
            let subs = [];
            if (window.fsData) {
                try { subs = await Promise.race([window.fsData.getAllSubmissions(), new Promise((_,_r) => setTimeout(()=>_r(new Error('timeout')), 1500))]); } catch(e) { subs = JSON.parse(localStorage.getItem('spedia_submissions') || '[]'); }
            } else {
                subs = JSON.parse(localStorage.getItem('spedia_submissions') || '[]');
            }
            let adminType = sessionStorage.getItem('adminType');

            const tCodes = document.getElementById('table-codes');
            if (tCodes) {
                let ths = `<th>الكود</th><th>مستخدم؟</th>`;
                if (adminType === 'full') ths += `<th>حذف</th>`;
                tCodes.innerHTML = `<tr>${ths}</tr>` + codes.map(c => {
                    let tr = `<td>${c.code}</td><td style="color:${c.isUsed ? 'red' : 'green'}">${c.isUsed ? 'مستخدم' : 'متاح'}</td>`;
                    if (adminType === 'full') tr += `<td><button onclick="window.deleteItemGeneric('codes', '${c.fsId || c.code}', 'spedia_codes', 'code')" style="background:#f44336; color:#fff; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">حذف</button></td>`;
                    return `<tr>${tr}</tr>`;
                }).join('');
            }

            const tSubCodes = document.getElementById('table-sub-codes');
            if (tSubCodes) {
                let ths = `<th>الكود</th><th>النوع</th><th>العنوان</th><th>التاريخ</th>`;
                if (adminType === 'full') ths += `<th>حذف</th>`;
                tSubCodes.innerHTML = `<tr>${ths}</tr>` + subCodes.map(c => {
                    let tr = `<td>${c.code}</td><td>${c.type === 'course' ? 'كورس' : 'كتاب'}</td><td>${c.title}</td><td>${c.date || ''}</td>`;
                    if (adminType === 'full') tr += `<td><button onclick="window.deleteItemGeneric('subscription_codes', '${c.fsId || c.code}', 'spedia_sub_codes', 'code')" style="background:#f44336; color:#fff; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">حذف</button></td>`;
                    return `<tr>${tr}</tr>`;
                }).join('');
            }

            const tUsers = document.getElementById('table-users');
            if (tUsers) {
                let ths = `<th>الكود</th><th>الاسم</th><th>الهاتف</th><th>الصف</th>`;
                if (adminType === 'full') ths += `<th>تجديد الاشتراك</th><th>حذف</th>`;
                tUsers.innerHTML = `<tr>${ths}</tr>` + users.map(u => {
                    let tr = `<td>${u.code}</td><td>${u.name}</td><td>${adminType === 'restricted' ? '********' : u.phone}</td><td>${u.grade}</td>`;
                    if (adminType === 'full') tr += `<td><button onclick="window.renewStudent('${u.code}')" style="background:#4caf50; color:#fff; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">تجديد</button></td><td><button onclick="window.deleteItemGeneric('users', '${u.fsId || u.code}', 'spedia_users', 'code')" style="background:#f44336; color:#fff; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">حذف</button></td>`;
                    return `<tr>${tr}</tr>`;
                }).join('');
            }

            const tAtt = document.getElementById('table-attendance');
            if (tAtt) {
                let ths = `<th>الكود</th><th>الاسم</th><th>التاريخ</th><th>الوقت</th>`;
                if (adminType === 'full') ths += `<th>حذف</th>`;
                tAtt.innerHTML = `<tr>${ths}</tr>` + att.map(a => {
                    let tr = `<td>${a.code}</td><td>${a.name}</td><td>${a.date}</td><td>${a.time}</td>`;
                    if (adminType === 'full') tr += `<td><button onclick="window.deleteItemGeneric('attendance', '${a.fsId || a.code}', 'spedia_attendance', 'code')" style="background:#f44336; color:#fff; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">حذف</button></td>`;
                    return `<tr>${tr}</tr>`;
                }).join('');
            }

            const tExams = document.getElementById('table-submitted-exams');
            if (tExams) {
                let ths = `<th>الطالب</th><th>الامتحان</th><th>الحالة</th><th>تصحيح</th>`;
                if (adminType === 'full') ths += `<th>حذف</th>`;
                tExams.innerHTML = `<tr>${ths}</tr>` + subs.map(s => {
                    let tr = `<td>${s.name || s.code}</td><td>${s.examTitle}</td><td>${s.status}</td><td><button onclick="window.openGrading('${s.code}', '${s.examTitle}')" style="padding:5px 10px; background:var(--primary-color); border:none; color:#fff; border-radius:5px; cursor:pointer;">فتح</button></td>`;
                    if (adminType === 'full') tr += `<td><button onclick="window.deleteItemGeneric('submissions', '${s.fsId || s.id || s.code}', 'spedia_submissions', 'id')" style="background:#f44336; color:#fff; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">حذف</button></td>`;
                    return `<tr>${tr}</tr>`;
                }).join('');
            }

            let contentList = [];
            if (window.fsData && window.fsData.getAllContent) {
                try {
                    contentList = await Promise.race([window.fsData.getAllContent(), new Promise((_,_r) => setTimeout(()=>_r(new Error('timeout')), 1500))]);
                } catch (e) { }
            }
            let localContent = JSON.parse(localStorage.getItem('spedia_content') || '[]');
            localContent.forEach(lc => { if (!contentList.find(cc => cc.id === lc.id)) contentList.push(lc); });
            localStorage.setItem('spedia_content', JSON.stringify(contentList));

            // Populate Stats
            let statStudents = document.getElementById('stat-students');
            if (statStudents) statStudents.innerText = users.length;
            
            let fees = JSON.parse(localStorage.getItem('spedia_fees') || '[]');
            let totalRevenue = fees.reduce((sum, f) => sum + parseInt(f.amount || 0), 0);
            let statRevenue = document.getElementById('stat-revenue');
            if (statRevenue) statRevenue.innerText = totalRevenue + " ج.م";

            const tContent = document.getElementById('table-content-manager');
            if (tContent) {
                tContent.innerHTML = `<tr><th>النوع</th><th>العنوان</th><th>السعر</th><th>إجراءات</th></tr>` + contentList.map(c => `<tr>
                    <td>${c.type === 'course' ? 'كورس' : (c.type === 'game' ? 'لعبة HTML' : 'مذكرة/كتاب')}</td>
                    <td>${c.title}</td>
                    <td>${c.priceBase || 0}</td>
                    <td>
                        <button onclick="window.editContent('${c.fsId ? c.fsId : c.id}')" style="background:#ff9800; color:#fff; border:none; padding:5px 10px; border-radius:5px; margin-bottom:5px; cursor:pointer; display:block; width:100%;"><i class="fas fa-edit"></i> تعديل</button>
                        <button onclick="window.deleteContent('${c.fsId ? c.fsId : c.id}')" style="background:#f44336; color:#fff; border:none; padding:5px 10px; border-radius:5px; cursor:pointer; width:100%;"><i class="fas fa-trash"></i> حذف</button>
                    </td>
                </tr>`).join('');
            }
            
            const contentSel = document.getElementById('content-selector');
            if (contentSel) {
                contentSel.innerHTML = '<option value="">اختر المحتوى...</option>' + contentList.map(c => `<option value="${c.fsId || c.id}">${c.title} (${c.type === 'course' ? 'كورس' : 'كتاب/مذكرة'})</option>`).join('');
            }

            let links = JSON.parse(localStorage.getItem('spedia_class_links') || '[]');
            if (window.fsData && window.fsData.getAllClassLinks) {
                try { links = await Promise.race([window.fsData.getAllClassLinks(), new Promise((_,_r) => setTimeout(()=>_r(new Error('timeout')), 1500))]); localStorage.setItem('spedia_class_links', JSON.stringify(links)); } catch (e) { }
            }
            const tLinks = document.getElementById('table-links');
            if (tLinks) {
                let ths = `<th>الفئة/الطالب</th><th>الصف</th><th>العنوان</th><th>الرابط</th><th>حذف</th>`;
                tLinks.innerHTML = `<tr>${ths}</tr>` + links.map(l => {
                    let targetText = l.studentCode ? `كود: ${l.studentCode}` : 'الكل';
                    return `<tr><td>${targetText}</td><td>${l.grade}</td><td>${l.title}</td><td><a href="${l.url}" target="_blank">فتح الرابط</a></td><td><button onclick="window.deleteLink('${l.fsId ? l.fsId : l.id}')" style="background:#f44336; color:#fff; padding:5px; border-radius:5px; border:none; cursor:pointer;">حذف</button></td></tr>`;
                }).join('');
            }

            let sFiles = JSON.parse(localStorage.getItem('spedia_student_files') || '[]');
            if (window.fsData && window.fsData.getAllStudentFiles) {
                try { sFiles = await Promise.race([window.fsData.getAllStudentFiles(), new Promise((_,_r) => setTimeout(()=>_r(new Error('timeout')), 1500))]); localStorage.setItem('spedia_student_files', JSON.stringify(sFiles)); } catch (e) { }
            }
            const tSFiles = document.getElementById('table-student-files');
            if (tSFiles) {
                let ths = `<th>الطالب</th><th>الصف</th><th>الوصف</th><th>تاريخ</th><th>الملف</th>`;
                if (adminType === 'full') ths += `<th>حذف</th>`;
                tSFiles.innerHTML = `<tr>${ths}</tr>` + sFiles.map(f => {
                    let tr = `<td>${f.studentName || f.studentCode}</td><td>${f.grade}</td><td>${f.title}</td><td>${f.date}</td><td><a href="${f.url}" target="_blank" style="color:var(--primary-color);">معاينة</a></td>`;
                    if (adminType === 'full') tr += `<td><button onclick="window.deleteItemGeneric('student_files', '${f.fsId || f.id || f.studentCode}', 'spedia_student_files', 'id')" style="background:#f44336; color:#fff; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">حذف</button></td>`;
                    return `<tr>${tr}</tr>`;
                }).join('');
            }

            let allCreatedExams = [];
            if (window.fsData && window.fsData.getAllExams) {
                try { allCreatedExams = await Promise.race([window.fsData.getAllExams(), new Promise((_,_r) => setTimeout(()=>_r(new Error('timeout')), 1500))]); } catch (e) { }
            } else {
                allCreatedExams = JSON.parse(localStorage.getItem('spedia_exams') || '[]');
            }
            const tExamsManager = document.getElementById('table-exams-manager');
            if (tExamsManager) {
                let ths = `<th>الفئة/الطالب</th><th>الصف</th><th>العنوان</th>`;
                if (adminType === 'full') ths += `<th>حذف</th>`;
                tExamsManager.innerHTML = `<tr>${ths}</tr>` + allCreatedExams.map(ex => {
                    let targetText = ex.studentCode ? `كود: ${ex.studentCode}` : 'الكل';
                    let tr = `<td>${targetText}</td><td>${ex.grade}</td><td>${ex.title}</td>`;
                    if (adminType === 'full') tr += `<td><button onclick="window.deleteItemGeneric('exams', '${ex.fsId || ex.id || ex.title}', 'spedia_exams', 'id')" style="background:#f44336; color:#fff; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">حذف</button></td>`;
                    return `<tr>${tr}</tr>`;
                }).join('');
            }

            const tCustomContent = document.getElementById('table-custom-content');
            if (tCustomContent) {
                let ccLocal = JSON.parse(localStorage.getItem('spedia_custom_content') || '[]');
                let ccListId = [];
                if (window.fsData && window.fsData.getCustomContentByUser) {
                    try {
                        // It gets all custom content if there's a getter. Since there's no getAllCustomContent, we just rely on local storage for admin.
                        // Or we can just use localStorage which is populated when Admin sends it.
                    } catch (e) { }
                }
                let ths = `<th>كود الطالب</th><th>النوع</th><th>العنوان</th><th>تاريخ</th>`;
                if (adminType === 'full') ths += `<th>حذف</th>`;
                tCustomContent.innerHTML = `<tr>${ths}</tr>` + ccLocal.map(c => {
                    let tr = `<td>${c.studentCode}</td><td>${c.type}</td><td>${c.title}</td><td>${c.date}</td>`;
                    if (adminType === 'full') tr += `<td><button onclick="window.deleteItemGeneric('custom_content', '${c.fsId || c.id}', 'spedia_custom_content', 'id')" style="background:#f44336; color:#fff; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">حذف</button></td>`;
                    return `<tr>${tr}</tr>`;
                }).join('');
            }

            if (adminType === 'teacher' || adminType === 'restricted') {
                const tReRes = document.getElementById('table-re-results');
                if (tReRes) {
                    tReRes.innerHTML = '<tr><th>الكود</th><th>الوصف</th><th>تاريخ</th><th>الملف المستلم</th></tr>' +
                        sFiles.map(f => `<tr><td>${f.studentCode}</td><td>${f.title}</td><td>${f.date}</td><td><a href="${f.url}" target="_blank" style="color:#12b8c5;">فتح الملف</a></td></tr>`).join('');
                }
                const tReExams = document.getElementById('table-re-exams');
                if (tReExams) {
                    tReExams.innerHTML = `<tr><th>الكود</th><th>الامتحان</th><th>الحالة</th><th>تصحيح</th></tr>` +
                        subs.map(s => `<tr><td>${s.code}</td><td>${s.examTitle}</td><td>${s.status}</td><td><button onclick="window.openGrading('${s.code}', '${s.examTitle}')" style="padding:5px 10px; background:var(--primary-color); border:none; color:#fff; border-radius:5px; cursor:pointer;">فتح</button></td></tr>`).join('');
                }
            }

            const chatTable = document.getElementById('table-chat-messages');
            if (chatTable) {
                let chats = JSON.parse(localStorage.getItem('spedia_chat') || '[]');
                if (window.fsData && window.fsData.getAllChatMessages) {
                    try { chats = await Promise.race([window.fsData.getAllChatMessages(), new Promise((_,_r) => setTimeout(()=>_r(new Error('timeout')), 1500))]); localStorage.setItem('spedia_chat', JSON.stringify(chats)); } catch (e) { }
                }
                chatTable.innerHTML = `<tr><th>كود الطالب</th><th>المرسل / المدرس</th><th>الرسالة</th><th>التاريخ</th></tr>` +
                    chats.map(c => {
                        let senderLabel = c.sender === 'admin' ? `الإدارة (${c.teacher || ''})` : `الطالب (إلى: ${c.teacher || ''})`;
                        return `<tr><td>${c.studentCode}</td><td>${senderLabel}</td><td>${c.message}</td><td>${c.date}</td></tr>`;
                    }).join('');
            }

            const tReportTable = document.getElementById('table-teacher-reports');
            if (tReportTable) {
                let treports = JSON.parse(localStorage.getItem('spedia_teacher_reports') || '[]');
                if (window.fsData && window.fsData.getAllTeacherReports) {
                    try { treports = await Promise.race([window.fsData.getAllTeacherReports(), new Promise((_,_r) => setTimeout(()=>_r(new Error('timeout')), 1500))]); localStorage.setItem('spedia_teacher_reports', JSON.stringify(treports)); } catch (e) { }
                }
                tReportTable.innerHTML = `<tr><th>اسم المدرس / الأدمن</th><th>عنوان الحصة</th><th>التاريخ</th></tr>` +
                    treports.map(t => `<tr><td>${t.teacherName}</td><td>${t.lesson}</td><td>${t.date}</td></tr>`).join('');
            }
        }

        window.renewStudent = async function(code) {
            if (!confirm('هل تريد تجديد اشتراك الطالب لـ 30 يوماً إضافية؟')) return;
            
            let users = JSON.parse(localStorage.getItem('spedia_users') || '[]');
            let userIndex = users.findIndex(u => u.code === code);
            if (userIndex > -1) {
                users[userIndex].registrationDate = Date.now();
                localStorage.setItem('spedia_users', JSON.stringify(users));
                
                if (window.fsData && window.fsData.updateGeneric && users[userIndex].fsId) {
                    try {
                        await Promise.race([window.fsData.updateGeneric('users', users[userIndex].fsId, { registrationDate: Date.now(), new Promise((_,_r) => setTimeout(()=>_r(new Error('timeout')), 1500))]) });
                    } catch (e) { console.warn(e); }
                }
                alert('تم التجديد بنجاح!');
                renderTables();
            } else {
                alert('الطالب غير موجود.');
            }
        };

        window.saveFees = function(e) {
            e.preventDefault();
            let code = document.getElementById('fee-code').value;
            let amount = document.getElementById('fee-amount').value;
            let desc = document.getElementById('fee-desc').value;
            
            let fees = JSON.parse(localStorage.getItem('spedia_fees') || '[]');
            fees.push({ id: Date.now(), code, amount, desc, date: new Date().toLocaleDateString('ar-EG') });
            localStorage.setItem('spedia_fees', JSON.stringify(fees));
            
            alert('تم حفظ التحصيل بنجاح!');
            e.target.reset();
            renderTables();
        };

        window.saveTopStudents = function(e) {
            e.preventDefault();
            let semester = document.getElementById('top-semester').value;
            let year = document.getElementById('top-year').value;
            let tops = [];
            for(let i=1; i<=10; i++) {
                let code = document.getElementById('top-code-' + i).value;
                let rank = document.getElementById('top-rank-' + i).value;
                if(code) tops.push({ code, rank });
            }
            localStorage.setItem('spedia_top_students', JSON.stringify({ semester, year, students: tops }));
            alert('تم حفظ قائمة الأوائل بنجاح! سيتم عرضها في الصفحة الرئيسية.');
        };

        window.generateContentCode = function(e) {
            e.preventDefault();
            let contentId = document.getElementById('content-selector').value;
            if(!contentId) return alert('يرجى اختيار المحتوى');
            
            let cList = JSON.parse(localStorage.getItem('spedia_content') || '[]');
            let content = cList.find(c => (c.id && c.id.toString() === contentId) || c.fsId === contentId);
            if(!content) {
                alert('حدث خطأ في العثور على المحتوى المحدد.');
                return;
            }
            
            let rnd = Math.floor(1000 + Math.random() * 9000).toString();
            let subCode = { code: rnd, type: content.type, title: content.title, contentId: contentId, date: new Date().toLocaleDateString('ar-EG'), isUsed: false };
            
            let subCodes = JSON.parse(localStorage.getItem('spedia_sub_codes') || '[]');
            subCodes.push(subCode);
            localStorage.setItem('spedia_sub_codes', JSON.stringify(subCodes));
            
            if (window.fsData && window.fsData.addSubscriptionCode) {
                window.fsData.addSubscriptionCode(subCode).catch(e=>console.warn(e));
            }
            
            let display = document.getElementById('generated-code-display');
            display.innerText = `الكود المولد: ${rnd}`;
            display.style.display = 'block';
            renderTables();
        };

        window.saveAnnouncements = function(e) {
            e.preventDefault();
            let a1 = document.getElementById('ann-1').value;
            let a2 = document.getElementById('ann-2').value;
            let a3 = document.getElementById('ann-3').value;
            let anns = [a1, a2, a3];
            localStorage.setItem('spedia_announcements', JSON.stringify(anns));
            alert('تم حفظ وتحديث الإعلانات بنجاح!');
        };

        document.addEventListener('DOMContentLoaded', () => {
            let container = document.getElementById('top-students-container');
            if(container) {
                let html = '';
                for(let i=1; i<=10; i++) {
                    html += `
                    <div style="background:#f4f7fa; padding:10px; border-radius:10px; border:1px solid #eee;">
                        <label style="font-weight:bold; font-size:14px; margin-bottom:5px;">الطالب رقم ${i}</label>
                        <input type="text" id="top-code-${i}" placeholder="كود الطالب" style="width:100%; padding:8px; margin-bottom:5px; border-radius:5px; border:1px solid #ccc;">
                        <input type="text" id="top-rank-${i}" placeholder="الترتيب" style="width:100%; padding:8px; border-radius:5px; border:1px solid #ccc;">
                    </div>`;
                }
                container.innerHTML = html;
                
                let existingStr = localStorage.getItem('spedia_top_students');
                if(existingStr) {
                    try {
                        let existing = JSON.parse(existingStr);
                        document.getElementById('top-semester').value = existing.semester || '';
                        if(document.getElementById('top-year')) document.getElementById('top-year').value = existing.year || '';
                        existing.students.forEach((s, idx) => {
                            let i = idx + 1;
                            if(document.getElementById('top-code-'+i)) {
                                document.getElementById('top-code-'+i).value = s.code;
                                document.getElementById('top-rank-'+i).value = s.rank;
                            }
                        });
                    } catch(e){}
                }
            }
            
            // Load Announcements
            let existingAnnsStr = localStorage.getItem('spedia_announcements');
            if(existingAnnsStr) {
                try {
                    let existingAnns = JSON.parse(existingAnnsStr);
                    if(document.getElementById('ann-1')) document.getElementById('ann-1').value = existingAnns[0] || '';
                    if(document.getElementById('ann-2')) document.getElementById('ann-2').value = existingAnns[1] || '';
                    if(document.getElementById('ann-3')) document.getElementById('ann-3').value = existingAnns[2] || '';
                } catch(e){}
            }
        });

        window.deleteItemGeneric = async function (collection, idVal, lsKey, idProp) {
            if (!confirm('هل تأكد حذف هذا العنصر نهائياً؟')) return;

            let arr = JSON.parse(localStorage.getItem(lsKey) || '[]');
            arr = arr.filter(item => {
                if (item.fsId === idVal) return false;
                if (item[idProp] && item[idProp].toString() === idVal.toString()) return false;
                return true;
            });
            localStorage.setItem(lsKey, JSON.stringify(arr));

            if (window.fsData && window.fsData.deleteGeneric) {
                try { await Promise.race([window.fsData.deleteGeneric(collection, idVal, idProp), new Promise((_,_r) => setTimeout(()=>_r(new Error('timeout')), 1500))]); } catch (e) { console.warn(e); }
            }
            renderTables();
        };

        window.deleteLink = async function (id) {
            if (!confirm('حذف الرابط؟')) return;
            let links = JSON.parse(localStorage.getItem('spedia_class_links') || '[]');
            let targetLnk = links.find(l => l.id.toString() === id.toString() || l.fsId === id.toString());
            links = links.filter(l => l.id.toString() !== id.toString() && l.fsId !== id.toString());
            localStorage.setItem('spedia_class_links', JSON.stringify(links));

            if (window.fsData && window.fsData.deleteClassLink) {
                let dId = targetLnk && targetLnk.fsId ? targetLnk.fsId : id.toString();
                try { await Promise.race([window.fsData.deleteClassLink(dId), new Promise((_,_r) => setTimeout(()=>_r(new Error('timeout')), 1500))]); } catch (e) { }
            }
            renderTables();
        };

        window.addClassLink = async function (e) {
            e.preventDefault();
            let lnk = {
                id: Date.now(),
                country: document.getElementById('lnk-country').value,
                grade: document.getElementById('lnk-grade').value,
                title: document.getElementById('lnk-title').value,
                url: document.getElementById('lnk-url').value,
                date: new Date().toLocaleDateString('ar-EG'),
                studentCode: document.getElementById('lnk-student-code') ? document.getElementById('lnk-student-code').value.trim() : ''
            };

            if (window.fsData && window.fsData.addClassLink) {
                try { await Promise.race([window.fsData.addClassLink(lnk), new Promise((_,_r) => setTimeout(()=>_r(new Error('timeout')), 1500))]); } catch (er) { }
            }

            let links = JSON.parse(localStorage.getItem('spedia_class_links') || '[]');
            links.push(lnk);
            localStorage.setItem('spedia_class_links', JSON.stringify(links));
            alert('تم نشر الرابط بنجاح!');
            e.target.reset();
            renderTables();
        };

        window.sendAdminFile = async function (e) {
            e.preventDefault();
            const btn = document.getElementById('btn-af-submit');
            btn.innerText = 'جاري الرفع... الرجاء الانتظار';
            try {
                let file = document.getElementById('af-file').files[0];
                let fileUrl = await window.uploadToCloudinary(file);
                let fItem = {
                    id: Date.now(),
                    country: document.getElementById('af-country').value,
                    grade: document.getElementById('af-grade').value,
                    title: document.getElementById('af-title').value,
                    url: fileUrl,
                    date: new Date().toLocaleDateString('ar-EG')
                };

                if (window.fsData && window.fsData.addAdminFile) {
                    try { await Promise.race([window.fsData.addAdminFile(fItem), new Promise((_,_r) => setTimeout(()=>_r(new Error('timeout')), 1500))]); } catch (er) { }
                }

                let aFiles = JSON.parse(localStorage.getItem('spedia_admin_files') || '[]');
                aFiles.push(fItem);
                localStorage.setItem('spedia_admin_files', JSON.stringify(aFiles));
                alert('تم إرسال الملف للطلاب بنجاح!');
                e.target.reset();
            } catch (er) {
                alert('حدث خطأ أثناء الرفع: ' + er.message);
            }
            btn.innerText = 'إرسال الملف';
        };

        window.sendCustomContent = async function (e) {
            e.preventDefault();
            const btn = document.getElementById('btn-cc-submit');
            btn.innerText = 'جاري الإرسال... الرجاء الانتظار';
            try {
                let code = document.getElementById('cc-code').value;
                let type = document.getElementById('cc-type').value;
                let title = document.getElementById('cc-title').value;
                let url = document.getElementById('cc-url').value;

                let file = document.getElementById('cc-file').files[0];
                let fileUrl = '';
                if (file) {
                    fileUrl = await window.uploadToCloudinary(file);
                }

                let cItem = {
                    id: Date.now(),
                    studentCode: code,
                    type: type,
                    title: title,
                    url: url,
                    fileUrl: fileUrl,
                    date: new Date().toLocaleDateString('ar-EG')
                };

                if (window.fsData && window.fsData.addCustomContent) {
                    try { await Promise.race([window.fsData.addCustomContent(cItem), new Promise((_,_r) => setTimeout(()=>_r(new Error('timeout')), 1500))]); } catch (er) { console.warn(er); }
                }

                let ccLocal = JSON.parse(localStorage.getItem('spedia_custom_content') || '[]');
                ccLocal.push(cItem);
                localStorage.setItem('spedia_custom_content', JSON.stringify(ccLocal));

                alert('تم إرسال المحتوى المخصص للطالب بنجاح!');
                e.target.reset();
            } catch (er) {
                alert('حدث خطأ أثناء الإرسال: ' + er.message);
            }
            btn.innerText = 'إرسال المحتوى';
        };

        window.sendRestrictedContent = async function (e) {
            e.preventDefault();
            const btn = document.getElementById('btn-re-submit');
            btn.innerText = 'جاري الإرسال... الرجاء الانتظار';
            try {
                let code = document.getElementById('re-code').value;
                let type = document.getElementById('re-type').value;
                let title = document.getElementById('re-title').value;
                let url = document.getElementById('re-url').value;

                let file = document.getElementById('re-file').files[0];
                let fileUrl = '';
                if (file) {
                    fileUrl = await window.uploadToCloudinary(file);
                }

                let cItem = {
                    id: Date.now(),
                    studentCode: code,
                    type: type,
                    title: title,
                    url: url,
                    fileUrl: fileUrl,
                    date: new Date().toLocaleDateString('ar-EG'),
                    sender: 'restricted'
                };

                if (window.fsData && window.fsData.addCustomContent) {
                    try { await Promise.race([window.fsData.addCustomContent(cItem), new Promise((_,_r) => setTimeout(()=>_r(new Error('timeout')), 1500))]); } catch (er) { console.warn(er); }
                }

                let ccLocal = JSON.parse(localStorage.getItem('spedia_custom_content') || '[]');
                ccLocal.push(cItem);
                localStorage.setItem('spedia_custom_content', JSON.stringify(ccLocal));

                alert('تم إرسال المحتوى للطالب بنجاح! سيتمكن من رؤيته في لوحته.');
                document.getElementById('re-code').value = '';
            } catch (er) {
                alert('حدث خطأ أثناء الإرسال: ' + er.message);
            }
            btn.innerText = 'إرسال';
        };

        window.deleteContent = async function (id) {
            if (!confirm('هل أنت متأكد من الحذف؟')) return;
            let c = JSON.parse(localStorage.getItem('spedia_content') || '[]');
            c = c.filter(item => item.id.toString() !== id.toString() && item.fsId !== id.toString());
            localStorage.setItem('spedia_content', JSON.stringify(c));

            if (window.fsData && window.fsData.deleteContent) {
                try {
                    await Promise.race([window.fsData.deleteContent(id.toString(), new Promise((_,_r) => setTimeout(()=>_r(new Error('timeout')), 1500))]));
                } catch (e) { console.warn(e) }
            }
            alert('تم الحذف بنجاح');
            renderTables();
        };

        window.editContent = function (id) {
            let cList = JSON.parse(localStorage.getItem('spedia_content') || '[]');
            let content = cList.find(c => c.id.toString() === id.toString() || c.fsId === id.toString());
            if (!content) return alert("لم يتم العثور على المحتوى");

            document.getElementById('edit-id').value = content.id || '';
            document.getElementById('edit-fsid').value = content.fsId || '';
            document.getElementById('edit-type').value = content.type === 'course' ? 'كورس' : (content.type === 'game' ? 'لعبة' : 'كتاب/مذكرة');
            document.getElementById('edit-title').value = content.title || '';

            let ytContainer = document.getElementById('edit-yt-link-container');
            if (ytContainer) {
                ytContainer.style.display = content.type === 'course' ? 'block' : 'none';
            }
            document.getElementById('edit-yt-link').value = content.videoUrl || '';

            document.getElementById('edit-content-modal').style.display = 'flex';
        };

        window.submitEditContent = async function (e) {
            e.preventDefault();
            const btn = document.getElementById('btn-save-edit');
            btn.innerText = 'جاري الحفظ...';

            let id = document.getElementById('edit-id').value;
            let fsId = document.getElementById('edit-fsid').value;
            let title = document.getElementById('edit-title').value;
            let updates = { title };
            let fileInput = document.getElementById('edit-image');
            let ytLinkVal = document.getElementById('edit-yt-link').value;


            let type = document.getElementById('edit-type').value;
            if (type === 'كورس' && ytLinkVal) {
                updates.videoUrl = ytLinkVal;
            }

            try {
                if (fileInput.files && fileInput.files[0]) {
                    updates.image = await window.uploadToCloudinary(fileInput.files[0]);
                }

                // update local storage
                let cList = JSON.parse(localStorage.getItem('spedia_content') || '[]');
                let index = cList.findIndex(c => c.id.toString() === id || c.fsId === fsId);
                if (index > -1) {
                    cList[index] = { ...cList[index], ...updates };
                    localStorage.setItem('spedia_content', JSON.stringify(cList));
                }

                // update firebase
                if (window.fsData && window.fsData.updateContent && fsId) {
                    await Promise.race([window.fsData.updateContent(fsId, updates), new Promise((_,_r) => setTimeout(()=>_r(new Error('timeout')), 1500))]);
                }

                alert('تم التعديل بنجاح!');
                document.getElementById('edit-content-modal').style.display = 'none';
                renderTables();
            } catch (er) {
                alert('حدث خطأ: ' + er.message);
            }
            btn.innerText = 'حفظ التعديلات';
        };

        window.generateCode = async function () {
            const btn = document.querySelector('button[onclick="generateCode()"]');
            if (btn) btn.innerText = "جاري الإنشاء...";
            let rnd = Math.floor(1000 + Math.random() * 9000).toString();
            let codeObj = { code: rnd, isUsed: false };

            if (window.fsData && window.fsData.addCode) {
                window.fsData.addCode(codeObj).catch(e => console.warn("Firebase save error", e));
            }

            let codes = [];
            try {
                codes = JSON.parse(localStorage.getItem('spedia_codes') || '[]');
            } catch (e) {
                console.warn("Error parsing spedia_codes, resetting to empty array");
                codes = [];
            }
            codes.push(codeObj);
            localStorage.setItem('spedia_codes', JSON.stringify(codes));
            
            // تحديث واجهة المتصفح فوراً بدون انتظار
            const tCodes = document.getElementById('table-codes');
            if (tCodes) {
                let adminType = sessionStorage.getItem('adminType');
                let ths = `<th>الكود</th><th>مستخدم؟</th>`;
                if (adminType === 'full') ths += `<th>حذف</th>`;
                tCodes.innerHTML = `<tr>${ths}</tr>` + codes.map(c => {
                    let tr = `<td>${c.code}</td><td style="color:${c.isUsed ? 'red' : 'green'}">${c.isUsed ? 'مستخدم' : 'متاح'}</td>`;
                    if (adminType === 'full') tr += `<td><button onclick="window.deleteItemGeneric('codes', '${c.fsId || c.code}', 'spedia_codes', 'code')" style="background:#f44336; color:#fff; border:none; padding:5px 10px; border-radius:5px; cursor:pointer;">حذف</button></td>`;
                    return `<tr>${tr}</tr>`;
                }).join('');
            }

            renderTables();
            if (btn) btn.innerText = "إنشاء كود";
        }

        window.addContent = async function (e) {
            e.preventDefault();
            const btn = e.target.querySelector('button[type="submit"]');
            if (btn) btn.innerText = "جاري الحفظ...";

            try {
                let ctType = document.getElementById('ct-type') ? document.getElementById('ct-type').value : 'course';

                let titleEl = document.getElementById('ct-title');
                let gradeEl = document.getElementById('ct-grade');
                let countryEl = document.getElementById('ct-country');

                let newItem = {
                    id: Date.now(),
                    type: ctType,
                    title: titleEl ? titleEl.value : '',
                    grade: gradeEl ? gradeEl.value : '',
                    country: countryEl ? countryEl.value : 'EG'
                };


                let imgInput = document.getElementById('ct-image');
                if (imgInput && imgInput.files && imgInput.files[0]) {
                    try {
                        newItem.image = await window.uploadToCloudinary(imgInput.files[0]);
                    } catch (e) {
                        throw new Error("فشل رفع صورة الغلاف: " + e.message);
                    }
                } else {
                    newItem.image = newItem.type === 'course'
                        ? "https://cdni.iconscout.com/illustration/premium/thumb/online-learning-2766324-2305593.png"
                        : "https://cdni.iconscout.com/illustration/premium/thumb/book-4113220-3406254.png";
                }

                if (newItem.type === 'course') {
                    let ytLinkEl = document.getElementById('ct-yt-link');
                    if (ytLinkEl && ytLinkEl.value) {
                        newItem.videoUrl = ytLinkEl.value;
                    } else {
                        let ytEl = document.getElementById('ct-yt');
                        if (ytEl && ytEl.files && ytEl.files[0]) {
                            try {
                                btn.innerText = "جاري رفع الفيديو... (يرجى عدم إغلاق الصفحة)";
                                newItem.videoUrl = await window.uploadToCloudinary(ytEl.files[0]);
                            } catch (e) {
                                throw new Error("فشل رفع فيديو الكورس: " + e.message);
                            }
                        }
                    }
                } else if (newItem.type === 'book') {
                    let pdfInput = document.getElementById('ct-pdf');
                    if (pdfInput && pdfInput.files && pdfInput.files[0]) {
                        try {
                            btn.innerText = "جاري رفع المذكرة/الكتاب (PDF)...";
                            newItem.pdfUrl = await window.uploadToCloudinary(pdfInput.files[0]);
                        } catch (e) {
                            throw new Error("فشل رفع ملف المذكرة/الكتاب: " + e.message);
                        }
                    }
                } else if (newItem.type === 'game') {
                    let htmlInput = document.getElementById('ct-html');
                    if (htmlInput && htmlInput.files && htmlInput.files[0]) {
                        try {
                            btn.innerText = "جاري رفع اللعبة (HTML)...";
                            newItem.htmlUrl = await window.uploadToCloudinary(htmlInput.files[0]);
                        } catch (e) {
                            throw new Error("فشل رفع اللعبة: " + e.message);
                        }
                    }
                }

                if (window.fsData && window.fsData.addContent) {
                    try {
                        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Firebase Timeout")), 5000));
                        await Promise.race([window.fsData.addContent(newItem), timeoutPromise]);
                    } catch (e) {
                        console.warn("Firestore save failed, saving locally instead:", e);
                        let c = JSON.parse(localStorage.getItem('spedia_content') || '[]');
                        c.push(newItem);
                        localStorage.setItem('spedia_content', JSON.stringify(c));
                    }
                } else {
                    let c = JSON.parse(localStorage.getItem('spedia_content') || '[]');
                    c.push(newItem);
                    localStorage.setItem('spedia_content', JSON.stringify(c));
                }

                alert('تم الحفظ بنجاح! سيتم عرض المحتوى في المنصة فوراً.');
                if (e.target && e.target.reset) e.target.reset();
                if (window.renderTables) window.renderTables();
            } catch (err) {
                console.error("Save Error:", err);
                alert('عذراً، فشل الحفظ. تأكد من إعدادات Storage أو اتصال الإنترنت.\nالمشكلة: ' + err.message);
            } finally {
                if (btn) btn.innerText = "حفظ المحتوى";
            }
        }

        function addQuestionField(type) {
            let container = document.getElementById('dynamic-questions-container');
            let qDiv = document.createElement('div');
            qDiv.className = 'q-block';
            qDiv.dataset.type = type;
            qDiv.style.cssText = "background:#f8fafc; border:1px solid #e0e6ed; padding:15px; border-radius:10px; position:relative; margin-top:10px;";
            qDiv.innerHTML = `<button type="button" onclick="this.parentElement.remove()" style="position:absolute; top:5px; left:5px;">X</button>`;
            if (type === 'mcq') {
                let rId = Date.now() + Math.floor(Math.random()*1000);
                qDiv.innerHTML += `<input type="text" class="q-text" placeholder="السؤال" style="width:100%;">
                <div style="display:grid; grid-template-columns:1fr; gap:5px; margin-top:5px;">
                    <div style="display:flex; align-items:center; gap:5px;" title="اختر كإجابة صحيحة"><input type="radio" name="mcq_correct_${rId}" value="0" checked><input type="text" class="q-opt" placeholder="الاختيار 1" style="flex:1;"></div>
                    <div style="display:flex; align-items:center; gap:5px;" title="اختر كإجابة صحيحة"><input type="radio" name="mcq_correct_${rId}" value="1"><input type="text" class="q-opt" placeholder="الاختيار 2" style="flex:1;"></div>
                    <div style="display:flex; align-items:center; gap:5px;" title="اختر كإجابة صحيحة"><input type="radio" name="mcq_correct_${rId}" value="2"><input type="text" class="q-opt" placeholder="الاختيار 3" style="flex:1;"></div>
                    <div style="display:flex; align-items:center; gap:5px;" title="اختر كإجابة صحيحة"><input type="radio" name="mcq_correct_${rId}" value="3"><input type="text" class="q-opt" placeholder="الاختيار 4" style="flex:1;"></div>
                </div>`;
            }
            else if (type === 'tf') qDiv.innerHTML += `<input type="text" class="q-text" placeholder="العبارة" style="width:100%;"><select class="q-tf-answer"><option value="true">صح</option><option value="false">خطأ</option></select>`;
            else qDiv.innerHTML += `<input type="text" class="q-text" placeholder="السؤال" style="width:100%;">`;
            container.appendChild(qDiv);
        }

        window.addExam = async function (e) {
            e.preventDefault();
            try {
                let qs = [];
                document.querySelectorAll('.q-block').forEach(b => {
                    let t = b.dataset.type;
                    if (t === 'mcq') {
                        let opts = Array.from(b.querySelectorAll('.q-opt')).map(i => i.value);
                        let correctRadio = b.querySelector('input[type="radio"]:checked');
                        let correctIndex = correctRadio ? parseInt(correctRadio.value) : 0;
                        qs.push({ type: 'mcq', text: b.querySelector('.q-text').value, options: opts, correctAnswer: opts[correctIndex] });
                    }
                    else if (t === 'tf') qs.push({ type: 'tf', text: b.querySelector('.q-text').value, answer: b.querySelector('.q-tf-answer').value });
                    else qs.push({ type: 'essay', text: b.querySelector('.q-text').value });
                });

                let exam = {
                    id: Date.now(),
                    title: document.getElementById('ex-title').value,
                    grade: document.getElementById('ex-grade').value,
                    country: 'ALL',
                    time: document.getElementById('ex-time').value,
                    durationMinutes: document.getElementById('ex-time').value,
                    type: document.getElementById('ex-type').value,
                    typeName: document.getElementById('ex-type').options[document.getElementById('ex-type').selectedIndex].text,
                    startDate: document.getElementById('ex-start').value,
                    endDate: document.getElementById('ex-end').value,
                    questionsList: qs,
                    studentCode: document.getElementById('ex-student-code') ? document.getElementById('ex-student-code').value.trim() : ''
                };
                if (window.fsData) await Promise.race([window.fsData.addExam(exam), new Promise((_,_r) => setTimeout(()=>_r(new Error('timeout')), 1500))]);
                else {
                    let ex = JSON.parse(localStorage.getItem('spedia_exams') || '[]');
                    ex.push(exam);
                    localStorage.setItem('spedia_exams', JSON.stringify(ex));
                }
                alert('تم نشر الامتحان بنجاح!');
                e.target.reset();
                document.getElementById('dynamic-questions-container').innerHTML = '';
            } catch (err) {
                alert('خطأ في نشر الامتحان');
            }
        }

        let currentSub = null;
        window.openGrading = async function (code, title) {
            let subs = window.fsData ? await Promise.race([window.fsData.getAllSubmissions(), new Promise((_,_r) => setTimeout(()=>_r(new Error('timeout')), 1500))]) : JSON.parse(localStorage.getItem('spedia_submissions') || '[]');
            currentSub = subs.find(s => s.code === code && s.examTitle === title);
            document.getElementById('grad-student-name').innerText = currentSub.name || code;

            let allExams = [];
            if (window.fsData && window.fsData.getAllExams) {
                try { allExams = await Promise.race([window.fsData.getAllExams(), new Promise((_,_r) => setTimeout(()=>_r(new Error('timeout')), 1500))]); } catch (e) { }
            } else {
                allExams = JSON.parse(localStorage.getItem('spedia_exams') || '[]');
            }
            let originalExam = allExams.find(e => e.title === title);
            let qList = (originalExam && originalExam.questionsList) ? originalExam.questionsList : [];

            let answersHtml = '';
            let ansObj = currentSub.answers || {};
            let total = Array.isArray(ansObj) ? ansObj.length : Object.keys(ansObj).length;

            for (let i = 0; i < total; i++) {
                let q = qList[i] || {};
                let qText = q.text || (typeof q === 'string' ? q : 'سؤال محذوف/غير معروف');
                let aText = ansObj[i] || 'لم تتم الإجابة';

                answersHtml += `
                <div style="margin-top:15px; border-bottom:1px solid #eee; padding-bottom:15px; background:#f9fbff; padding:15px; border-radius:10px;">
                    <p style="font-weight:bold; color:var(--text-dark); margin-bottom:10px;"><b style="color:var(--primary-color);">السؤال ${i + 1}:</b> ${qText}</p>
                    <p style="margin-bottom:10px; font-weight:bold;"><b>الإجابة:</b> <span style="color:#e91e63;">${aText}</span></p>
                    <div style="display:flex; gap:15px; margin-top:10px; padding-top:10px; border-top:1px dashed #ccc;">
                        <label style="cursor:pointer; font-weight:bold; color:#4caf50;"><input type="radio" name="grad_q${i}" value="1"> صح</label>
                        <label style="cursor:pointer; font-weight:bold; color:#f44336;"><input type="radio" name="grad_q${i}" value="0"> خطأ</label>
                    </div>
                </div>`;
            }

            if (total === 0) {
                answersHtml = '<p style="text-align:center; color:red; font-weight:bold;">لا توجد إجابات مخزنة لهذا الكود.</p>';
            }

            document.getElementById('grad-questions-container').innerHTML = answersHtml;
            document.getElementById('grading-modal').style.display = 'flex';
        }

        window.submitGrading = async function () {
            let ansObj = currentSub.answers || {};
            let total = Array.isArray(ansObj) ? ansObj.length : Object.keys(ansObj).length;
            total = total === 0 ? 1 : total;
            let ok = 0;
            for (let i = 0; i < total; i++) {
                let sel = document.querySelector(`input[name="grad_q${i}"]:checked`);
                if (sel && sel.value === "1") ok++;
            }

            // Save to Results
            let newResult = { code: currentSub.code, examTitle: currentSub.examTitle, grade: `${ok}/${total}`, date: new Date().toLocaleDateString('ar-EG') };
            let results = JSON.parse(localStorage.getItem('spedia_results') || '[]');
            results.push(newResult);
            localStorage.setItem('spedia_results', JSON.stringify(results));

            if (window.fsData && window.fsData.addResult) {
                try { await Promise.race([window.fsData.addResult(newResult), new Promise((_,_r) => setTimeout(()=>_r(new Error('timeout')), 1500))]); } catch (e) { }
            }

            // Update Submissions Status
            let subs = JSON.parse(localStorage.getItem('spedia_submissions') || '[]');
            let sIndex = subs.findIndex(s => s.code === currentSub.code && s.examTitle === currentSub.examTitle);
            if (sIndex > -1) {
                subs[sIndex].status = "تم التصحيح";
                localStorage.setItem('spedia_submissions', JSON.stringify(subs));
            }
            if (window.fsData && window.fsData.updateSubmission && currentSub.id) {
                try { await Promise.race([window.fsData.updateSubmission(currentSub.id, { status: "تم التصحيح" }), new Promise((_,_r) => setTimeout(()=>_r(new Error('timeout')), 1500))]); } catch (e) { }
            }

            document.getElementById('grading-modal').style.display = 'none';
            alert('تم التصحيح بنجاح وإرسال النتيجة للطالب!');
            renderTables();
        }

        document.addEventListener('DOMContentLoaded', () => {
            if (sessionStorage.getItem('isAdmin') !== 'yes') {
                window.location.href = 'index.html';
                return;
            }
            let adminType = sessionStorage.getItem('adminType');
            let qActions = document.getElementById('quick-actions');
            let adminAlerts = document.getElementById('admin-alerts');

            if (adminType === 'teacher' || adminType === 'restricted') {
                document.getElementById('main-admin-nav').style.display = 'none';
                if (qActions) qActions.style.display = 'none';
                if (adminAlerts) adminAlerts.style.display = 'none';

                let tNav = document.getElementById('teacher-nav');
                if (tNav) tNav.style.display = 'flex';
                let sNav = document.getElementById('secretary-nav');
                if (sNav) sNav.style.display = 'none';

                showSection('tab-teacher-manage', document.querySelector('#teacher-nav button:first-child'));
            } else if (adminType === 'secretary') {
                document.getElementById('main-admin-nav').style.display = 'none';
                if (qActions) qActions.style.display = 'none';
                if (adminAlerts) adminAlerts.style.display = 'none';

                let tNav = document.getElementById('teacher-nav');
                if (tNav) tNav.style.display = 'none';
                let sNav = document.getElementById('secretary-nav');
                if (sNav) sNav.style.display = 'flex';

                showSection('tab-fees', document.querySelector('#secretary-nav button:first-child'));
            } else {
                document.getElementById('main-admin-nav').style.display = 'flex';
                if (qActions) qActions.style.display = 'flex';
                if (adminAlerts) adminAlerts.style.display = 'block';

                let tNav = document.getElementById('teacher-nav');
                if (tNav) tNav.style.display = 'none';
                let sNav = document.getElementById('secretary-nav');
                if (sNav) sNav.style.display = 'none';

                showSection('tab-codes', document.querySelector('#main-admin-nav button:first-child'));
            }
            renderTables();

            setTimeout(() => {
                if (window.loadNotifications) window.loadNotifications('admin');
            }, 300);
        });

        window.sendChatMessage = async function (e) {
            e.preventDefault();
            let code = document.getElementById('chat-code').value.trim();
            let teacher = document.getElementById('chat-teacher-name').value.trim();
            let msg = document.getElementById('chat-message').value.trim();

            let chatMsg = { id: Date.now(), studentCode: code, teacher: teacher, message: msg, date: new Date().toLocaleDateString('ar-EG'), sender: 'admin' };
            let chats = JSON.parse(localStorage.getItem('spedia_chat') || '[]');
            chats.push(chatMsg);
            localStorage.setItem('spedia_chat', JSON.stringify(chats));

            if (window.fsData && window.fsData.addChatMessage) {
                try { await Promise.race([window.fsData.addChatMessage(chatMsg), new Promise((_,_r) => setTimeout(()=>_r(new Error('timeout')), 1500))]); } catch (er) { }
            }

            let notifs = JSON.parse(localStorage.getItem('spedia_notifications') || '[]');
            notifs.push({ code: code, text: `رسالة جديدة من ${teacher}`, date: new Date().toLocaleDateString('ar-EG'), read: false });
            localStorage.setItem('spedia_notifications', JSON.stringify(notifs));

            alert('تم إرسال الرسالة بنجاح.');
            e.target.reset();
            renderTables();
        };

        window.sendMonthlyReport = async function (e) {
            e.preventDefault();
            let code = document.getElementById('mr-code').value.trim();
            let title = document.getElementById('mr-title').value.trim();
            let evalText = document.getElementById('mr-evaluation').value.trim();
            let details = document.getElementById('mr-details').value.trim();

            let report = { id: Date.now(), studentCode: code, title: title, evaluation: evalText, details: details, date: new Date().toLocaleDateString('ar-EG') };
            let reports = JSON.parse(localStorage.getItem('spedia_monthly_reports') || '[]');
            reports.push(report);
            localStorage.setItem('spedia_monthly_reports', JSON.stringify(reports));

            if (window.fsData && window.fsData.addMonthlyReport) {
                try { await Promise.race([window.fsData.addMonthlyReport(report), new Promise((_,_r) => setTimeout(()=>_r(new Error('timeout')), 1500))]); } catch (er) { }
            }

            let notifs = JSON.parse(localStorage.getItem('spedia_notifications') || '[]');
            notifs.push({ code: code, text: `تقرير شهري جديد: ${title}`, date: new Date().toLocaleDateString('ar-EG'), read: false });
            localStorage.setItem('spedia_notifications', JSON.stringify(notifs));

            alert('تم إرسال التقرير الشهري بنجاح.');
            e.target.reset();
        };

        window.addTeacherReport = async function (e) {
            e.preventDefault();
            let name = document.getElementById('tr-name').value.trim();
            let lesson = document.getElementById('tr-lesson').value.trim();

            let treport = { id: Date.now(), teacherName: name, lesson: lesson, date: new Date().toLocaleDateString('ar-EG') };
            let tReports = JSON.parse(localStorage.getItem('spedia_teacher_reports') || '[]');
            tReports.push(treport);
            localStorage.setItem('spedia_teacher_reports', JSON.stringify(tReports));

            if (window.fsData && window.fsData.addTeacherReport) {
                try { await Promise.race([window.fsData.addTeacherReport(treport), new Promise((_,_r) => setTimeout(()=>_r(new Error('timeout')), 1500))]); } catch (er) { }
            }

            alert('تم حفظ التقرير بنجاح.');
            e.target.reset();
            renderTables();
        };
        window.searchTeacherStudent = function () {
            let q = document.getElementById('teacher-search').value.trim();
            if (!q) return;
            let users = JSON.parse(localStorage.getItem('spedia_users') || '[]');
            let found = users.filter(u => u.name.includes(q) || u.code.includes(q) || (u.phone && u.phone.includes(q)));
            let resDiv = document.getElementById('teacher-search-results');
            if (found.length === 0) {
                resDiv.innerHTML = '<p style="color:red;">لم يتم العثور على طالب بهذا البحث.</p>';
            } else {
                resDiv.innerHTML = '<table style="width:100%; border-collapse:separate; border-spacing:0 5px;"><tr><th>الاسم</th><th>الكود</th><th>الهاتف</th><th>الصف</th></tr>' + found.map(f => `<tr><td>${f.name}</td><td>${f.code}</td><td>${f.phone}</td><td>${f.grade}</td></tr>`).join('') + '</table>';
            }
        };
    