const admin = require("firebase-admin");
const serviceAccount = require("../firebase-key.json");
const { v4: uuid } = require("uuid");
const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "post-virtualizacion.appspot.com",
});
const firebaseStorage = app.storage().bucket();
const firestore = app.firestore();

const uploadFile = async ({ buffer, fileName, title, description }) => {
  console.log(fileName);
  const ref = `${uuid()}.${
    fileName.split(".")[fileName.split(".").length - 1]
  }`;
  const fileRef = firebaseStorage.file(ref);
  const savedFile = await fileRef.save(buffer);
  await makeFilePublic(savedFile || fileRef);
  return {
    title,
    description,
    file: ref,
  };
};
const makeFilePublic = async (ref) => {
  return ref.makePublic();
};

const savePost = async (post) => {
  const postRef = firestore.collection("posts").doc(uuid());
  return postRef.set(post);
};

const getPosts = async () => {
  const document = await firestore.collection("posts").get();
  return document.docs.map(e=>e.data());
};

module.exports = {
  uploadFile,
  savePost,
  getPosts,
};
