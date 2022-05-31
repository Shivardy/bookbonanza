import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  Timestamp,
  onSnapshot,
  query,
  doc,
  deleteDoc,
  setDoc,
  orderBy,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB76NsZ34_r4cglUhXUY4xjiE-oBgsCEeg",
  authDomain: "susan-bookbonanza.firebaseapp.com",
  projectId: "susan-bookbonanza",
  storageBucket: "susan-bookbonanza.appspot.com",
  messagingSenderId: "708659550979",
  appId: "1:708659550979:web:3b17ded9aa2ec75fa8a736",
  measurementId: "G-48Q5SEYHSS",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

getAnalytics(firebaseApp);

export const getEvents = () => {
  const eventsCollection = collection(db, "events");
  const eventsQuery = query(eventsCollection);
  const eventStream = (callback) =>
    onSnapshot(eventsQuery, (snapshot) => {
      const events = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      callback(events);
    });
  return eventStream;
};

export const uploadCSV = async (eventName, users) => {
  const eventsCollection = collection(db, "events");
  const doc = await addDoc(eventsCollection, {
    eventName,
    createdAt: Timestamp.fromDate(new Date()),
  });
  const usersCollection = collection(db, "events", doc.id, "users");
  await Promise.all(
    users.map((user) =>
      addDoc(usersCollection, {
        ...user,
        updatedAt: Timestamp.fromDate(new Date()),
      })
    )
  );
};

export const deleteEvent = async (eventId) => {
  const eventRef = doc(db, "events", eventId);
  await deleteDoc(eventRef);
  const usersCollection = collection(db, "events", eventId, "users");
  const usersSnapshot = await getDocs(usersCollection);
  await Promise.all(usersSnapshot.docs.map((user) => deleteDoc(user.ref)));
};

export const getEventUsers = (eventId) => {
  const usersCollection = collection(db, "events", eventId, "users");
  const usersQuery = query(usersCollection, orderBy("firstName"));
  const usersStream = (callback) =>
    onSnapshot(usersQuery, (snapshot) => {
      const events = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      callback(events);
    });
  return usersStream;
};

export const deleteEventUser = async (eventId, userId) => {
  const eventRef = doc(db, "events", eventId, "users", userId);
  await deleteDoc(eventRef);
};

export const addEventUser = async (eventId, userData) => {
  const usersCollection = collection(db, "events", eventId, "users");
  const doc = await addDoc(usersCollection, userData);
  return doc;
};

export const updateStatus = async (eventId, userId, user) => {
  const userRef = doc(db, "events", eventId, "users", userId);
  await setDoc(userRef, user);
};
