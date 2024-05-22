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
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
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
    photoURL: photo ? photo : "",
  }).catch((error) => console.error("Ошибка смены данных,", error));
};

export const handleAddUserData = async (
  firstName,
  lastName,
  photo,
  age,
  gender,
  city,
  hobbies
) => {
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
};

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

export async function handleSendMessage(
  message,
  displayName,
  photo,
  uid,
  recipientUid
) {
  const data = {
    senderUid: uid,
    recipientUid: recipientUid,
    description: message,
    displayName: displayName,
    photo: photo,
    createdAt: serverTimestamp(),
    read: false,
  };

  const messagesCollection = collection(firestore, "messages");

  try {
    await addDoc(messagesCollection, data);
  } catch (error) {
    console.error("Ошибка при отправке сообщения,", error);
  }
}

export const updateMessageReadStatus = async (messageId) => {
  try {
    await markMessageAsRead(messageId);
  } catch (error) {
    console.error("Ошибка при обновлении статуса прочтения сообщения:", error);
  }
};

const markMessageAsRead = async (messageId) => {
  const messageDocRef = doc(collection(firestore, "messages"), messageId);
  try {
    await updateDoc(messageDocRef, { read: true });
  } catch (error) {
    console.error("Ошибка при обновлении статуса прочтения сообщения:", error);
  }
};

export async function getAllChats(currentUserUid) {
  const messagesCollection = collection(firestore, "messages");

  const sentMessagesQuery = query(
    messagesCollection,
    where("senderUid", "==", currentUserUid),
    orderBy("createdAt", "desc")
  );

  const receivedMessagesQuery = query(
    messagesCollection,
    where("recipientUid", "==", currentUserUid),
    orderBy("createdAt", "desc")
  );

  try {
    const sentMessagesSnapshot = await getDocs(sentMessagesQuery);
    const receivedMessagesSnapshot = await getDocs(receivedMessagesQuery);
    
    const chatParticipants = new Set();

    sentMessagesSnapshot.forEach((doc) => {
      const messageData = doc.data();
      chatParticipants.add(messageData.recipientUid);
    });

    receivedMessagesSnapshot.forEach((doc) => {
      const messageData = doc.data();
      chatParticipants.add(messageData.senderUid);
    });

    const participantsArray = Array.from(chatParticipants);

    const chats = [];
    for (const participant of participantsArray) {
      const messages = await getAllMessages(currentUserUid, participant);
      const participantData = await getUserData(participant);
      const chat = {
        participantId: participant,
        participantData: participantData[0],
        messages: messages,
      };
      chats.push(chat);
    }

    return chats;
  } catch (error) {
    console.error("Ошибка при получении чатов", error);
  }
}

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
      const messageData = { id: doc.id, ...doc.data() };
      messages.push(messageData);
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

export async function handleAcceptFriendship(paramsId, uid) {
  const friendshipQuery = query(
    collection(firestore, "friendship"),
    where("senderUid", "==", paramsId),
    where("recipientUid", "==", uid)
  );

  try {
    const querySnapshot = await getDocs(friendshipQuery);
    querySnapshot.forEach(async (doc) => {
      const friendshipDocRef = doc.ref;
      await updateDoc(friendshipDocRef, { status: true });
    });
  } catch (error) {
    console.error(
      "Ошибка при подтверждении запроса на добавление в друзья:",
      error
    );
  }
}

export async function handleRemoveFriendship(friendshipId) {
  const friendshipDocRef = doc(collection(firestore, "friendship"), friendshipId);

  try {
    await deleteDoc(friendshipDocRef);
  } catch (error) {
    console.error("Ошибка при удалении друга:", error);
  }
}

// export async function getFriends(uid) {
//   const friendshipCollection = collection(firestore, "friendship");
//   const friendsQuery = query(
//     friendshipCollection,
//     where("recipientUid", "==", uid)
//   );

//   try {
//     const querySnapshot = await getDocs(friendsQuery);

//     const friendRequests = [];
//     querySnapshot.forEach((doc) => {
//       friendRequests.push({ id: doc.id, ...doc.data() });
//     });

//     return friendRequests;
//   } catch (error) {
//     console.error("Ошибка при получении запросов на добавление в друзья:", error);
//   }
// }

export async function getFriends(uid) {
  const friendshipCollection = collection(firestore, "friendship");
  const friendsQuery = query(
    friendshipCollection,
    where("recipientUid", "==", uid)
  );
  const sentRequestsQuery = query(
    friendshipCollection,
    where("senderUid", "==", uid)
  );

  try {
    const friendsQuerySnapshot = await getDocs(friendsQuery);
    const sentRequestsQuerySnapshot = await getDocs(sentRequestsQuery);

    const friends = [];

    friendsQuerySnapshot.forEach((doc) => {
      const friend = { id: doc.id, ...doc.data() };
      if (friend.senderUid !== uid) {
        friends.push(friend);
      }
    });

    sentRequestsQuerySnapshot.forEach((doc) => {
      const sentRequest = { id: doc.id, ...doc.data() };
      if (sentRequest.recipientUid !== uid) {
        friends.push(sentRequest);
      }
    });

    return friends;
  } catch (error) {
    console.error("Ошибка при получении списка друзей и запросов на добавление в друзья:", error);
    return [];
  }
}

export async function handleSendFriendship(currentUserUid, recipientUid) {
  const friendshipCollection = collection(firestore, "friendship");

  const existingFriendshipFromCurrentUser = await checkExistingFriendship(currentUserUid, recipientUid);
  const existingFriendshipFromRecipient = await checkExistingFriendship(recipientUid, currentUserUid);

  if (existingFriendshipFromCurrentUser || existingFriendshipFromRecipient) {
    console.log("Запрос на дружбу уже отправлен");
    return;
  }

  const requestData = {
    senderUid: currentUserUid,
    recipientUid: recipientUid,
    status: false,
    createdAt: serverTimestamp(),
  };

  try {
    const docRef = await addDoc(friendshipCollection, requestData);
    requestData.id = docRef.idFriendship;
    return requestData; 
  } catch (error) {
    console.error("Ошибка при отправке запроса на добавление в друзья:", error);
  }
}

export async function checkExistingFriendship(uid1, uid2) {
  const friendshipCollection = collection(firestore, "friendship");
  const querySnapshot = await getDocs(
    query(friendshipCollection, 
      where("senderUid", "==", uid1), 
      where("recipientUid", "==", uid2)
    )
  );
  return !querySnapshot.empty;
}

export async function handleRespondToFriendship(requestId, accept) {
  const friendshipDocRef = doc(collection(firestore, "friendship"), requestId);

  try {
    if (accept) {
      await updateDoc(friendshipDocRef, { status: true });
    } else {
      await deleteDoc(friendshipDocRef);
    }
  } catch (error) {
    console.error("Ошибка при ответе на запрос о добавлении в друзья:", error);
  }
}

export async function getFriendshipRequests(uid) {
  const friendshipCollection = collection(firestore, "friendship");
  const friendshipQuery = query(
    friendshipCollection,
    where("recipientUid", "==", uid),
    where("status", "==", false)
  );

  try {
    const querySnapshot = await getDocs(friendshipQuery);
    const friendshipRequests = [];
    querySnapshot.forEach((doc) => {
      friendshipRequests.push({ id: doc.id, ...doc.data() });
    });
    return friendshipRequests;
  } catch (error) {
    console.error("Ошибка при получении запросов на добавление в друзья:", error);
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
  }
};
