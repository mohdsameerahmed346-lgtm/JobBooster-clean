import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

// 💾 SAVE
export async function saveLayout(userId, layout) {
  try {
    await setDoc(doc(db, "layouts", userId), {
      sectionOrder: layout,
    });
  } catch (e) {
    console.error("Save layout error:", e);
  }
}

// 📥 LOAD
export async function getLayout(userId) {
  try {
    const snap = await getDoc(doc(db, "layouts", userId));

    if (snap.exists()) {
      return snap.data().sectionOrder;
    }

    return ["summary", "skills", "experience"];
  } catch (e) {
    console.error("Get layout error:", e);
    return ["summary", "skills", "experience"];
  }
                     }
