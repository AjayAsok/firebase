console.log(firebase);
const auth = firebase.auth();

const whenSignedIn = document.getElementById("whenSignedIn");
const whenSignedOut = document.getElementById("whenSignedOut");
const signInBtn = document.getElementById("signInBtn");
const signOutBtn = document.getElementById("signOutBtn");
const userDetails = document.getElementById("userDetails");
const addItem = document.getElementById("addItem");
const itemList = document.getElementById("itemList");

const provider = new firebase.auth.GoogleAuthProvider();

signInBtn.onclick = () => {
  auth.signInWithPopup(provider);
};
signOutBtn.onclick = () => {
  console.log("here");
  auth.signOut();
};
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("inside if");
    whenSignedIn.hidden = false;
    whenSignedOut.hidden = true;
    userDetails.innerHTML = `<h3>Hello ${user.displayName}</h3>`;
  } else {
    console.log("inside else");
    whenSignedIn.hidden = true;
    whenSignedOut.hidden = false;
    userDetails.innerHTML = ``;
  }
});

const db = firebase.firestore();

let itemRef;
let unsubscribe;

auth.onAuthStateChanged((user) => {
  if (user) {
    //DB connection
    itemRef = db.collection("items");
    addItem.onclick = () => {
      //   console.log(faker);
      itemRef.add({
        uid: user.uid,
        name: faker.commerce.productName(),
        createdOn: firebase.firestore.FieldValue.serverTimestamp(),
      });
    };
    unsubscribe = itemRef
      .where("uid", "==", user.uid)
      .orderBy("createdOn")
      .onSnapshot((querySnapshot) => {
        const items = querySnapshot.docs.map((doc) => {
          return `<li> ${doc.data().name}</li>`;
        });
        itemList.innerHTML = items.join("");
      });
  } else {
    unsubscribe && unsubscribe();
  }
});
