import { db } from "./firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

// 📥 GET VERSIONS
export async function getVersions(userId) {
  try {
    const ref = doc(db, "versions", userId);
    const snap = await getDoc(ref);

    if (!snap.exists()) return [];

    return snap.data().items || [];
  } catch (e) {
    console.error("Get versions error:", e);
    return [];
  }
}

// 💾 SAVE VERSION
export async function saveVersion(userId, data, name = null) {
  try {
    const ref = doc(db, "versions", userId);
    const snap = await getDoc(ref);

    const newVersion = {
      ...data,
      name: name || "Auto Save",
      createdAt: Date.now(),
    };

    if (!snap.exists()) {
      await setDoc(ref, {
        items: [newVersion],
      });
    } else {
      const existing = snap.data().items || [];

      const updated = [newVersion, ...existing].slice(0, 20);

      await updateDoc(ref, {
        items: updated,
      });
    }

  } catch (e) {
    console.error("Version save error:", e);
  }
      }
