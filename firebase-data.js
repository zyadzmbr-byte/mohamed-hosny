import { db } from './firebase-init.js';
import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    query,
    where,
    onSnapshot,
    doc,
    updateDoc,
    deleteDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { storage } from './firebase-init.js';
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// Global exports to window for non-module script.js to access
window.fsData = {
    // STORAGE
    uploadFile: async (file, path) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'husoon');

        const response = await fetch('https://api.cloudinary.com/v1_1/dnbpfkeuk/auto/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Cloudinary upload failed: ${response.statusText}`);
        }

        const data = await response.json();
        return data.secure_url;
    },

    uploadPdfToFirebase: async (file) => {
        const storageRef = ref(storage, `pdfs/${Date.now()}_${file.name}`);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
    },

    // SUBSCRIPTIONS (Content purchased with generated codes)
    addSubscriptionCode: async (sub) => {
        return await addDoc(collection(db, "subscription_codes"), sub);
    },
    getAllSubscriptionCodes: async () => {
        const snap = await getDocs(collection(db, "subscription_codes"));
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    getSubscriptionsByCode: async (code) => {
        const q = query(collection(db, "subscription_codes"), where("code", "==", code));
        const snap = await getDocs(q);
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    // CONTENT (Books/Courses)
    addContent: async (item) => {
        return await addDoc(collection(db, "content"), item);
    },
    getAllContent: async () => {
        const snap = await getDocs(collection(db, "content"));
        return snap.docs.map(doc => ({ fsId: doc.id, ...doc.data() }));
    },
    deleteContent: async (id) => {
        try {
            // First, attempt to delete exactly by the Firestore document ID (fsId) which is guaranteed unique
            await deleteDoc(doc(db, "content", id.toString()));

            // Second, attempt query deletion in case the ID passed was the numeric timestamp
            if (!isNaN(parseInt(id))) {
                const q = query(collection(db, "content"), where("id", "==", parseInt(id)));
                const snap = await getDocs(q);
                if (!snap.empty) {
                    for (let document of snap.docs) {
                        await deleteDoc(doc(db, "content", document.id));
                    }
                }
            }
        } catch (e) {
            console.error("Firestore Delete Error:", e);
        }
    },
    updateContent: async (id, data) => {
        return await updateDoc(doc(db, "content", id), data);
    },

    // EXAMS
    addExam: async (exam) => {
        return await addDoc(collection(db, "exams"), exam);
    },
    getAllExams: async () => {
        const snap = await getDocs(collection(db, "exams"));
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    // SUBMISSIONS
    addSubmission: async (sub) => {
        return await addDoc(collection(db, "submissions"), sub);
    },
    getAllSubmissions: async () => {
        const snap = await getDocs(collection(db, "submissions"));
        return snap.docs.map(doc => ({ id: doc.id, fsId: doc.id, ...doc.data() }));
    },
    updateSubmission: async (id, data) => {
        return await updateDoc(doc(db, "submissions", id), data);
    },

    // RESULTS
    addResult: async (res) => {
        return await addDoc(collection(db, "results"), res);
    },
    getUserResults: async (userCode) => {
        const q = query(collection(db, "results"), where("code", "==", userCode));
        const snap = await getDocs(q);
        return snap.docs.map(doc => doc.data());
    },

    // USERS
    addUser: async (user) => {
        const userDoc = doc(db, "users", user.code.toString());
        return await setDoc(userDoc, user);
    },
    updateUser: async (code, data) => {
        try {
            const userDoc = doc(db, "users", code.toString());
            await setDoc(userDoc, data, { merge: true });
            return true;
        } catch (e) {
            console.warn("Direct updateUser failed, trying query fallback:", e);
            try {
                const q = query(collection(db, "users"), where("code", "==", code.toString()));
                const snap = await getDocs(q);
                if (!snap.empty) {
                    for (let d of snap.docs) {
                        await setDoc(doc(db, "users", d.id), data, { merge: true });
                    }
                    return true;
                }
            } catch (err2) {
                console.error("Fallback updateUser error:", err2);
            }
            throw e;
        }
    },
    getUserByCode: async (code) => {
        try {
            const userDoc = await getDoc(doc(db, "users", code.toString()));
            if (userDoc.exists()) {
                return { fsId: userDoc.id, ...userDoc.data() };
            }
            const q = query(collection(db, "users"), where("code", "==", code.toString()));
            const snap = await getDocs(q);
            if (!snap.empty) {
                return { fsId: snap.docs[0].id, ...snap.docs[0].data() };
            }
        } catch (e) {
            console.warn("getUserByCode error:", e);
        }
        return null;
    },
    resetUserSubscription: async (code, newTimestamp = Date.now()) => {
        return await window.fsData.updateUser(code, { registrationDate: newTimestamp });
    },
    resetAllSubscriptions: async (newTimestamp = Date.now()) => {
        try {
            const snap = await getDocs(collection(db, "users"));
            const promises = snap.docs.map(d => setDoc(doc(db, "users", d.id), { registrationDate: newTimestamp }, { merge: true }));
            await Promise.all(promises);
            return snap.docs.length;
        } catch (e) {
            console.error("resetAllSubscriptions error:", e);
            throw e;
        }
    },
    getAllUsers: async () => {
        const snap = await getDocs(collection(db, "users"));
        return snap.docs.map(doc => ({ fsId: doc.id, ...doc.data() }));
    },

    // ATTENDANCE
    addAttendance: async (att) => {
        return await addDoc(collection(db, "attendance"), att);
    },
    getAttendance: async () => {
        const snap = await getDocs(collection(db, "attendance"));
        return snap.docs.map(doc => ({ fsId: doc.id, ...doc.data() }));
    },

    // CODES (Activation Codes for platform access)
    addCode: async (codeObj) => {
        return await addDoc(collection(db, "codes"), codeObj);
    },
    getAllCodes: async () => {
        const snap = await getDocs(collection(db, "codes"));
        return snap.docs.map(doc => ({ fsId: doc.id, ...doc.data() }));
    },
    updateCode: async (fsId, data) => {
        return await updateDoc(doc(db, "codes", fsId), data);
    },

    // EVALS
    addEval: async (evalObj) => {
        return await addDoc(collection(db, "evals"), evalObj);
    },
    getAllEvals: async () => {
        const snap = await getDocs(collection(db, "evals"));
        return snap.docs.map(doc => ({ fsId: doc.id, ...doc.data() }));
    },

    // CLASS LINKS
    addClassLink: async (linkObj) => {
        return await addDoc(collection(db, "class_links"), linkObj);
    },
    getAllClassLinks: async () => {
        const snap = await getDocs(collection(db, "class_links"));
        return snap.docs.map(doc => ({ fsId: doc.id, ...doc.data() }));
    },
    deleteClassLink: async (id) => {
        try {
            if (!isNaN(parseInt(id))) {
                const q = query(collection(db, "class_links"), where("id", "==", parseInt(id)));
                const snap = await getDocs(q);
                if (!snap.empty) {
                    for (let document of snap.docs) {
                        await deleteDoc(doc(db, "class_links", document.id));
                    }
                }
            } else {
                await deleteDoc(doc(db, "class_links", id.toString()));
            }
        } catch (e) { console.error("Firestore Delete Link Error:", e); }
    },

    // ADMIN FILES
    addAdminFile: async (fileObj) => {
        return await addDoc(collection(db, "admin_files"), fileObj);
    },
    getAllAdminFiles: async () => {
        const snap = await getDocs(collection(db, "admin_files"));
        return snap.docs.map(doc => ({ fsId: doc.id, ...doc.data() }));
    },

    // STUDENT FILES
    addStudentFile: async (fileObj) => {
        return await addDoc(collection(db, "student_files"), fileObj);
    },
    getAllStudentFiles: async () => {
        const snap = await getDocs(collection(db, "student_files"));
        return snap.docs.map(doc => ({ fsId: doc.id, ...doc.data() }));
    },

    // CUSTOM CONTENT (Directed to a specific user code)
    addCustomContent: async (contentObj) => {
        return await addDoc(collection(db, "custom_content"), contentObj);
    },
    getCustomContentByUser: async (code) => {
        const q = query(collection(db, "custom_content"), where("studentCode", "==", code));
        const snap = await getDocs(q);
        return snap.docs.map(doc => ({ fsId: doc.id, ...doc.data() }));
    },

    // CHAT MESSAGES
    addChatMessage: async (msg) => {
        return await addDoc(collection(db, "chat_messages"), msg);
    },
    getAllChatMessages: async () => {
        const snap = await getDocs(collection(db, "chat_messages"));
        return snap.docs.map(doc => ({ fsId: doc.id, ...doc.data() }));
    },

    // MONTHLY REPORTS
    addMonthlyReport: async (report) => {
        return await addDoc(collection(db, "monthly_reports"), report);
    },
    getAllMonthlyReports: async () => {
        const snap = await getDocs(collection(db, "monthly_reports"));
        return snap.docs.map(doc => ({ fsId: doc.id, ...doc.data() }));
    },

    // TEACHER REPORTS
    addTeacherReport: async (report) => {
        return await addDoc(collection(db, "teacher_reports"), report);
    },
    getAllTeacherReports: async () => {
        const snap = await getDocs(collection(db, "teacher_reports"));
        return snap.docs.map(doc => ({ fsId: doc.id, ...doc.data() }));
    },

    updateGeneric: async (colName, idToQuery, data, matchField = 'id') => {
        try {
            await setDoc(doc(db, colName, idToQuery.toString()), data, { merge: true });
            return true;
        } catch (e) {
            try {
                let qStr = matchField === 'id' && !isNaN(parseInt(idToQuery)) ? parseInt(idToQuery) : idToQuery.toString();
                const q = query(collection(db, colName), where(matchField, "==", qStr));
                const snap = await getDocs(q);
                if (!snap.empty) {
                    for (let document of snap.docs) {
                        await setDoc(doc(db, colName, document.id), data, { merge: true });
                    }
                    return true;
                }
            } catch (err2) {
                console.warn("updateGeneric fallback error:", err2);
            }
            throw e;
        }
    },

    deleteGeneric: async (colName, idToQuery, matchField = 'id') => {
        try {
            await deleteDoc(doc(db, colName, idToQuery.toString()));
            let qStr = matchField === 'id' ? parseInt(idToQuery) : idToQuery;
            if (matchField === 'id' && isNaN(qStr)) qStr = idToQuery;
            const q = query(collection(db, colName), where(matchField, "==", qStr));
            const snap = await getDocs(q);
            if (!snap.empty) {
                for (let document of snap.docs) {
                    await deleteDoc(doc(db, colName, document.id));
                }
            }
        } catch (e) {
            console.warn("deleteGeneric error", e);
        }
    }
};
