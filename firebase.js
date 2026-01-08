// ===== FIREBASE IMPORT =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp,
    onSnapshot,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ===== FIREBASE CONFIG =====
const firebaseConfig = {
    apiKey: "AIzaSyAY96679MxmZjdSoknbiFyUhtfeen4CoPU",
    authDomain: "fethiep-c1b39.firebaseapp.com",
    projectId: "fethiep-c1b39",
    storageBucket: "fethiep-c1b39.firebasestorage.app",
    messagingSenderId: "513601675732",
    appId: "1:513601675732:web:2ae8aaa27caa57b19eb641"
};

// ===== INIT =====
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ===== SEND WISH =====
window.sendWish = async function () {
    const wishname = document.getElementById("wishname")?.value.trim();
    const message = document.getElementById("message")?.value.trim();

    if (!wishname || !message) {
        alert("Nhập đầy đủ nhé!");
        return;
    }

    await addDoc(collection(db, "wishes"), {
        wishname,
        message,
        hearts: 0,
        createdAt: serverTimestamp()
    });

    document.getElementById("message").value = "";
};

// ===== REALTIME LOAD =====
const wishList = document.getElementById("wish-list");

const q = query(
    collection(db, "wishes"),
    orderBy("hearts", "desc"),
    orderBy("createdAt", "desc")
);

onSnapshot(q, (snapshot) => {
    if (!wishList) return;

    wishList.innerHTML = "";

    snapshot.forEach((doc) => {
        const w = doc.data();
        wishList.innerHTML += `
  <div class="border border-pink-200 rounded-md px-3 py-2 bg-pink-50">
    <p class="text-sm text-gray-700 break-words whitespace-pre-wrap leading-snug text-left indent-4">
      ${w.message}
    </p>

    <div class="flex justify-between items-center mt-2 text-xs text-gray-500">
      <span>— ${w.wishname}</span>

      <button
        onclick="addHeart('${doc.id}', ${w.hearts || 0})"
        class="flex items-center gap-1 text-rose-500"
      >
        ❤️ <span>${w.hearts || 0}</span>
      </button>
    </div>
  </div>
`;



    });
});


import { doc, updateDoc, increment }
    from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.addHeart = async function (id) {
    const wishRef = doc(db, "wishes", id);
    await updateDoc(wishRef, {
        hearts: increment(1)
    });
};
