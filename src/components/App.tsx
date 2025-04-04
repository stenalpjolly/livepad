import "./../assets/scss/App.scss";

import * as React from "react";
import { hot } from "react-hot-loader";
import { JoinSession } from "./JoinSession";
import { useCallback, useState, useRef } from "react"; // Add useRef
import { StatusBar } from "./StatusBar";
import * as CodeMirror from "codemirror";
import firebase from "firebase";
import { Session } from "../utils/Session";
import { EditorConfiguration, Editor, Position } from "codemirror"; // Remove SearchCursor import

// Augment CodeMirror interface to include addon methods
declare module "codemirror" {
  // Define SearchCursor interface if not implicitly available (safer approach)
  interface SearchCursor {
    findNext(): boolean;
    findPrevious(): boolean;
    from(): Position;
    to(): Position;
    replace(text: string, origin?: string): void;
  }
  interface Editor {
    // Reference the SearchCursor type defined above or implicitly available
    getSearchCursor(query: string | RegExp, start?: Position, caseFold?: boolean): SearchCursor;
  }
}

import { Toast, Modal, Button } from "react-bootstrap"; // Add Modal and Button
import {createSessionSnapshot} from "../utils/LocalStore";

require("firebase/firebase-database");
require("firebase/storage"); // Import Firebase Storage

global.CodeMirror = CodeMirror;
const Firepad = require("firepad");

require("codemirror/mode/javascript/javascript");
require("codemirror/addon/search/searchcursor"); // Import search cursor addon

 // Remove editor param, add editorRef param
 function setupEditor(editorRef: React.MutableRefObject<CodeMirror.Editor | null>, options: CodeMirror.EditorConfiguration, firepadRef: firebase.database.Reference, currentUser: string, setShowToast: (value: (((prevState: boolean) => boolean) | boolean)) => void, roomId: string, handleImageClick: (imageUrl: string, range: { from: Position, to: Position }) => void) {
  // Assign to the ref's current property
  editorRef.current = CodeMirror(document.getElementById("editor"), options);
  const editor = editorRef.current; // Use a local const for convenience within this function scope

  // Create Firepad
  const firepad = Firepad.fromCodeMirror(firepadRef, editor, {
    userId: currentUser,
  });

  firepad.on("cursor", function (params) {
    const cursor = document.querySelector(`[data-clientid="${params}"]`);
    if (cursor) {
      cursor.innerHTML = `<span>${params}</span>`;
      if (!isInViewport(cursor)) {
        setShowToast(true)
      } else {
        setShowToast(false)
      }
    }
  });

  firepadRef.child("history").on("value", function () {
      setTimeout(() => {
          createSessionSnapshot(roomId, firepad.getText());
      }, 100);
  });

  // --- Render existing images on load ---
  firepad.on('ready', () => {
    console.log("Firepad ready, rendering existing images...");
    renderExistingImages(editor, handleImageClick); // Pass handleImageClick down
  });
  // --- End render existing images ---

  // Add DOM paste event listener for image handling
  editor.getWrapperElement().addEventListener('paste', (event: ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    let imageFound = false;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith('image/')) {
        imageFound = true;
        event.preventDefault(); // Prevent default paste behavior for the image

        const file = item.getAsFile();
        if (!file) continue;

        const timestamp = Date.now();
        const filename = `image-${timestamp}-${currentUser}-${i}.${file.name.split('.').pop() || 'png'}`;
        const storagePath = `images/${roomId}/${filename}`;
        const storageRef = firebase.storage().ref(storagePath);

        // --- Upload Indicator Logic ---
        const placeholderText = `[Uploading ${file.name}...]`;
        const startPosPlaceholder = editor.getCursor();
        editor.replaceSelection(placeholderText);
        const endPosPlaceholder = editor.getCursor();

        // Create visual loading indicator
        const loadingIndicator = document.createElement('span');
        loadingIndicator.textContent = `⏳ Uploading ${file.name}...`;
        loadingIndicator.style.fontStyle = 'italic';
        loadingIndicator.style.color = '#888'; // Style as needed

        // Mark the placeholder text and replace it visually
        const marker = editor.markText(startPosPlaceholder, endPosPlaceholder, {
          replacedWith: loadingIndicator,
          atomic: true
        });
        // --- End Upload Indicator Logic ---

        console.log(`Uploading ${filename} to ${storagePath}...`);
        const uploadTask = storageRef.put(file);

        uploadTask.on('state_changed',
          (snapshot) => {
            // Update loading indicator with progress
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            loadingIndicator.textContent = `⏳ Uploading ${file.name} (${progress}%)...`;
            console.log('Upload is ' + progress + '% done');
          },
          (error) => {
            // Handle unsuccessful uploads
            console.error("Error uploading image:", error);
            const errorText = `[Upload Failed: ${file.name}]`;
            const range = marker.find();
            if (range) {
              editor.replaceRange(errorText, range.from, range.to);
            }
            marker.clear(); // Clear the visual marker
            // Optionally: Show a more prominent error message to the user
          },
          () => {
            // Handle successful uploads on complete
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
              console.log('File available at', downloadURL);
              const markdown = `![Pasted Image](${downloadURL})`;

              // Find the original placeholder range using the marker
              const range = marker.find();
              if (!range) {
                  console.error("Could not find marker range after upload.");
                  marker.clear(); // Clear marker anyway
                  // Fallback: insert at current cursor? Or handle error better.
                  editor.replaceSelection(markdown); // Insert at cursor as fallback
                  return;
              }

              // Replace the placeholder text with the final markdown
              editor.replaceRange(markdown, range.from, range.to);
              marker.clear(); // Clear the visual marker

              // Get the new range of the inserted markdown
              const startPosFinal = range.from;
              // Calculate end position based on start and markdown length
              const endPosFinal = { line: startPosFinal.line, ch: startPosFinal.ch + markdown.length };


              // Create the image element to display
              const img = document.createElement('img');
              img.src = downloadURL;
              img.alt = 'Pasted Image';
              // Add some basic styling
              img.style.maxWidth = '200px';
              img.style.maxHeight = '200px';
              img.style.verticalAlign = 'middle';
              img.style.cursor = 'pointer';
              // Add onclick handler
              img.onclick = () => handleImageClick(downloadURL, { from: startPosFinal, to: endPosFinal });

              // Replace the markdown text visually with the image
              editor.markText(startPosFinal, endPosFinal, {
                replacedWith: img,
                handleMouseEvents: true,
                atomic: true
              });

            }).catch(error => {
              console.error("Error getting download URL:", error);
              const errorText = `[Error getting URL: ${file.name}]`;
               const range = marker.find();
               if (range) {
                 editor.replaceRange(errorText, range.from, range.to);
               }
               marker.clear();
            });
          }
        );
      }
    }
    // If no image was found, the default paste behavior will proceed naturally
  });
}

// Function to find and render Markdown images already in the document
function renderExistingImages(editor: CodeMirror.Editor, handleImageClick: (imageUrl: string, range: { from: Position, to: Position }) => void) { // Add handleImageClick param
  const regex = /!\[.*?\]\((.*?)\)/g; // Regex to find ![alt](url)
  const cursor = editor.getSearchCursor(regex);

  while (cursor.findNext()) {
    try {
      const match = editor.getRange(cursor.from(), cursor.to());
      // Use a simpler regex for URL extraction from the matched string
      const urlMatch = /\((.*?)\)/.exec(match);
      if (!urlMatch || urlMatch.length < 2) continue;

      const downloadURL = urlMatch[1];
      const startPos = cursor.from();
      const endPos = cursor.to();

      // Create the image element
      const img = document.createElement('img');
      img.src = downloadURL;
      img.alt = 'Image'; // Extract alt text if needed: match.match(/!\[(.*?)\]/)?.[1] || 'Image'
      img.style.maxWidth = '200px';
      img.style.maxHeight = '200px';
      img.style.verticalAlign = 'middle';
      img.style.cursor = 'pointer';
      // Add onclick handler
      img.onclick = () => handleImageClick(downloadURL, { from: startPos, to: endPos });

      // Use CodeMirror's operation to batch changes for performance
      editor.operation(() => {
        editor.markText(startPos, endPos, {
          replacedWith: img,
          handleMouseEvents: true,
          atomic: true
        });
      });
    } catch (e) {
        console.error("Error rendering existing image:", e, "at", cursor.from());
    }
  }
}

function App() {
  let myName: string = ""
  const [users, setUserName] = useState([]);
  const [showToast, setShowToast] = useState(false);
  // State for image modal
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);
  const [modalImageRange, setModalImageRange] = useState<{ from: Position, to: Position } | null>(null);

  // Function to open the image modal - DEFINED INSIDE App
  const handleImageClick = (imageUrl: string, range: { from: Position, to: Position }) => {
    setModalImageUrl(imageUrl);
    setModalImageRange(range);
    setShowImageModal(true);
  };

  // Use useRef to hold the editor instance
  const editorRef = useRef<CodeMirror.Editor | null>(null);

  const firebaseConfig = {
    apiKey: "AIzaSyCz-v0dUj8n0IEBaW7Y_jcTdMK0Bl5aEn4",
    authDomain: "livepad-c8b42.firebaseapp.com",
    databaseURL: "https://livepad-c8b42.firebaseio.com",
    projectId: "livepad-c8b42",
    storageBucket: "livepad-c8b42.appspot.com",
    messagingSenderId: "955572407056",
    appId: "1:955572407056:web:f3ab18032182fc8d4f3395",
    measurementId: "G-S4DSYBQCC6",
  };

  const options: EditorConfiguration = {
    mode: "javascript",
    theme: "ayu-mirage",
    lineWrapping: true,
    lineNumbers: true,
  };

  const setupFirepad = (firepadRef: firebase.database.Reference, roomId: string) => {
    // Pass handleImageClick down to setupEditor
    // Pass the ref instead of the variable
    setupEditor(editorRef, options, firepadRef, myName, setShowToast, roomId, handleImageClick);
  };

  const setNewConnection = useCallback((sessionInfo: Session.Info) => {
    myName = sessionInfo.userName;

    const app = firebase.initializeApp(firebaseConfig);

    // Get Firebase Database reference.
    const firepadRef = firebase.database(app).ref(`sessions/${sessionInfo.roomId}`);

    firepadRef.on("value", (snapshot) => {
      const userList = snapshot.val()?.users;
      const newUserList = [];
      for (const user in userList) {
        if (userList.hasOwnProperty(user)) {
          newUserList.push({
            name: user,
            color: userList[user].color
          });
        }
      }
      setUserName(newUserList);
    });

    if (sessionInfo.sessionType === Session.Type.CANDIDATE) {
      options.mode = "";
    }

    setupFirepad(firepadRef, sessionInfo.roomId);
  }, []);

  return (
    <>
      <JoinSession setConnection={setNewConnection}  />
      <Toast className={'toast-bottom pulseit alert-primary'} show={showToast}>
        <Toast.Body>Scroll to see more!</Toast.Body>
      </Toast>
      <div id={"editor"} className={"react-codemirror2"} />
      <StatusBar userList={users} />

      {/* Image Preview Modal */}
      <Modal show={showImageModal} onHide={() => setShowImageModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Image Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {modalImageUrl && <img src={modalImageUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '70vh' }} />}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowImageModal(false)}>
            Close
          </Button>
          {/* Download Button - Render as an anchor tag */}
          <Button as="a" variant="primary" href={modalImageUrl || '#'} target="_blank" download>
            Download
          </Button>
          {/* Remove Button */}
          <Button variant="danger" onClick={() => {
            // Access editor via the ref's current property
            const currentEditor = editorRef.current;
            if (modalImageRange && currentEditor) { // Ensure range and editor exist
              currentEditor.operation(() => { // Use operation for atomic change
                 currentEditor.replaceRange('', modalImageRange.from, modalImageRange.to);
              });
              setShowImageModal(false); // Close modal after removing
            } else {
              console.error("Cannot remove image: range or editor not available.");
              // Optionally show an error to the user
            }
          }}>
            Remove
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) - 50 &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

declare let module: Record<string, unknown>;

export default hot(module)(App);
