import {
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";

// 💾 SAVE VERSION
export async function saveVersion(userId, data, name = null) {
  try {
    const ref = doc(db, "versions", userId);
    const snapshot = await getDoc(ref);

    const newVersion = {
      ...data,
      name: name || "Auto Save",
      createdAt: Date.now(),
    };

    if (!snapshot.exists()) {
      await setDoc(ref, {
        items: [newVersion],
      });
    } else {
      const existing = snapshot.data().items || [];

      const updated = [newVersion, ...existing].slice(0, 20);

      await updateDoc(ref, {
        items: updated,
      });
    }
  } catch (e) {
    console.error("Version save error:", e);
  }
        }

    if (!snapshot.exists()) {
      await setDoc(ref, {
        items: [newVersion],
      });
    } else {
      const existing = snapshot.data().items || [];

      const updated = [newVersion, ...existing].slice(0, 20);

      await updateDoc(ref, {
        items: updated,
      });
    }
  } catch (e) {
    console.error("Version save error:", e);
  }
}

// 📥 GET HISTORY
export async function getVersions(userId) {
  try {
    const ref = doc(db, "versions", userId);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      return snap.data().items || [];
    }

    return [];
  } catch (e) {
    console.error("Version fetch error:", e);
    return [];
  }
      }
