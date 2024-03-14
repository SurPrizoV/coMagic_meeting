import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import "./fireBase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { firestore } from "./fireBase";

const auth = getAuth();
const storage = getStorage();

export const handleRegister = async (email, password) =>
  await createUserWithEmailAndPassword(auth, email, password);

export const handleLogIn = async (email, password) =>
  await signInWithEmailAndPassword(auth, email, password);

export const getUser = async () => {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userData = {
          displayName: user.displayName,
          photo: user.photoURL,
        };
        resolve(userData);
      }
    });
  });
};

export const handleUpdateProfile = (firstName, lastName, photo) => {
  updateProfile(auth.currentUser, {
    displayName: firstName + " " + lastName,
    photoURL: photo ? photo : ""
  }).catch((error) => console.error("Ошибка смены данных,", error));
};

export const handleAddUserData = async (firstName, lastName, photo, age, gender, city, hobbies) => {
  const uid = localStorage.getItem("access");
  const userData = {
    uid: localStorage.getItem("access"),
    firstName: firestore ? firstName : "",
    lastName: firestore ? lastName : "",
    photo: photo ? photo : "",
    age: age ? age : "",
    gender: gender ? gender : "",
    city: city ? city : "",
    hobbies: hobbies ? hobbies : [],
    createdAt: serverTimestamp(),
  };

  try {
    const userDataCollectionRef = collection(firestore, "userData");
    const userDataDocRef = doc(userDataCollectionRef, uid);

    await setDoc(userDataDocRef, userData);
  } catch (error) {
    console.error("Ошибка при обновлении данных пользователя:", error);
  }
};

export const getAllUsers = async () => {
  const usersCollection = collection(firestore, "userData");
  const usersQuery = query(usersCollection);

  try {
    const querySnapshot = await getDocs(usersQuery);

    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });

    return users;
  } catch (error) {
    console.error("Ошибка при получении пользователей", error);
  }
}

export async function getUserData(uid) {
  const userDataCollection = collection(firestore, "userData");
  const userDocRef = doc(userDataCollection, uid);

  try {
    const docSnapshot = await getDoc(userDocRef);

    if (docSnapshot.exists()) {
      return [{ id: docSnapshot.id, ...docSnapshot.data() }];
    } else {
      console.error("Документ пользователя не найден");
      return [];
    }
  } catch (error) {
    console.error("Ошибка при получении данных пользователя", error);
    return [];
  }
}

// export async function handleSendMessage(message, displayName, photo) {
//   const data = {
//     uid: localStorage.getItem("access"),
//     description: message,
//     displayName: displayName,
//     photo: photo,
//     createdAt: serverTimestamp(),
//   };

//   const messagesCollection = collection(firestore, "messages");

//   try {
//     await addDoc(messagesCollection, data);
//   } catch (error) {
//     console.error("Ошибка при отправке сообщения,", error);
//   }
// }

export async function handleSendMessage(message, displayName, photo, uid, recipientUid) {
  const data = {
    senderUid: uid,
    recipientUid: recipientUid,
    description: message,
    displayName: displayName,
    photo: photo,
    createdAt: serverTimestamp(),
  };

  const messagesCollection = collection(firestore, "messages");

  try {
    await addDoc(messagesCollection, data);
  } catch (error) {
    console.error("Ошибка при отправке сообщения,", error);
  }
}

// export async function getAllMessages() {
//   const messagesCollection = collection(firestore, "messages");
//   const messagesQuery = query(messagesCollection, orderBy("createdAt", "desc"));

//   try {
//     const querySnapshot = await getDocs(messagesQuery);

//     const messages = [];
//     querySnapshot.forEach((doc) => {
//       messages.push({ id: doc.id, ...doc.data() });
//     });

//     return messages;
//   } catch (error) {
//     console.error("Ошибка при получении сообщений", error);
//   }
// }

export async function getAllMessages(currentUserUid, otherUserUid) {
  const messagesCollection = collection(firestore, "messages");

  const messagesQuery = query(
    messagesCollection,
    where("senderUid", "==", currentUserUid),
    where("recipientUid", "==", otherUserUid),
    orderBy("createdAt", "desc")
  );

  const reverseMessagesQuery = query(
    messagesCollection,
    where("senderUid", "==", otherUserUid),
    where("recipientUid", "==", currentUserUid),
    orderBy("createdAt", "desc")
  );

  try {
    const querySnapshot = await getDocs(messagesQuery);
    const reverseQuerySnapshot = await getDocs(reverseMessagesQuery);

    const messages = [];
    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });
    reverseQuerySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });

    messages.sort((a, b) => b.createdAt - a.createdAt);

    return messages;
  } catch (error) {
    console.error("Ошибка при получении сообщений", error);
  }
}

export const handleUploadPhoto = async (file) => {
  const uid = localStorage.getItem("access");

  const userPhotoRef = ref(storage, `${uid}`);

  const metadata = {
    contentType: "image/jpeg",
  };

  try {
    await uploadBytes(userPhotoRef, file, metadata);
    const downloadURL = await getDownloadURL(userPhotoRef);
    return downloadURL;
  } catch (error) {
    console.error("Ошибка загрузки файла:", error);
    throw error;
  }
};
