// scripts/cleanup.js
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK using Application Default Credentials (ADC)
// Ensure you have run `gcloud auth application-default login`
// or are running in a GCP environment (Cloud Functions, GCE, etc.)
// The SDK will automatically detect the project ID from the environment.
// If it cannot, you might need to specify it explicitly:
// admin.initializeApp({ projectId: 'livepad-c8b42' });
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

admin.initializeApp(firebaseConfig);

// If you need to target a specific storage bucket different from the default one
// associated with the project ID detected via ADC, you can specify it:
// const storage = admin.storage().bucket("your-specific-bucket-name.appspot.com");

const firestore = admin.firestore();
const storage = admin.storage().bucket(); // Get default bucket

async function clearSessions() {
  console.log('Starting cleanup for sessions older than 2 days...');
  // IMPORTANT: Replace 'sessions' with the actual name of your Firestore collection for sessions
  // IMPORTANT: This modified version assumes session document IDs are Unix timestamps (milliseconds)
  // and uses the ID to determine age, as 'createdAt' field is missing.
  const sessionsRef = firestore.collection('sessions');
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  // No need for Firestore timestamp comparison now
  // const timestampTwoDaysAgo = admin.firestore.Timestamp.fromDate(twoDaysAgo);

  console.log(`Fetching all sessions to check their IDs (as timestamps) against ${twoDaysAgo.toISOString()}...`);
  // Fetch all documents in the collection
  const snapshot = await sessionsRef.get();

  if (snapshot.empty) {
    console.log('No sessions older than 2 days found to delete.');
    return;
  }

  console.log(`Found ${snapshot.size} total sessions. Checking IDs...`);
  let deletedCount = 0;
  let checkedCount = 0;
  // Firestore batches have a limit of 500 operations.
  let batch = firestore.batch();
  let operationsInBatch = 0;

  // Use a for...of loop to handle async batch commits correctly
  for (const doc of snapshot.docs) {
    checkedCount++;
    // Attempt to parse the document ID as a timestamp
    const docIdTimestamp = parseInt(doc.id, 10);
    if (isNaN(docIdTimestamp)) {
      console.log(`Skipping document with non-numeric ID: ${doc.id}`);
      continue; // Skip to the next document
    }

    const sessionDate = new Date(docIdTimestamp);
    const isOlder = sessionDate < twoDaysAgo;

    // --- DEBUG LOGGING START ---
    console.log(`  [Debug] Doc ID: ${doc.id}`);
    console.log(`  [Debug] Parsed Timestamp: ${docIdTimestamp}`);
    console.log(`  [Debug] Session Date: ${sessionDate.toISOString()} (${sessionDate.getTime()})`);
    console.log(`  [Debug] Target Date (2 days ago): ${twoDaysAgo.toISOString()} (${twoDaysAgo.getTime()})`);
    console.log(`  [Debug] Is Session Older? ${isOlder}`);
    // --- DEBUG LOGGING END ---

    // Check if the session date (from ID) is older than two days ago
    if (isOlder) {
      console.log(`Scheduling deletion for session: ${doc.id} (Created approx: ${sessionDate.toISOString()})`);
      batch.delete(doc.ref);
      operationsInBatch++;
      deletedCount++;

      // Commit batch if it reaches the limit and start a new one
      if (operationsInBatch >= 499) {
        console.log(`Committing batch of ${operationsInBatch} deletions...`);
        await batch.commit(); // Now 'await' works correctly in the async function context
        batch = firestore.batch(); // Start a new batch
        operationsInBatch = 0;
        console.log('Starting new batch.');
      }
    } else {
       // Optional: Log sessions that are not old enough
       // console.log(`Skipping session (not old enough based on ID): ${doc.id} (Created approx: ${sessionDate.toISOString()})`);
    }
  } // End of for...of loop

  // Commit any remaining operations in the last batch
  if (operationsInBatch > 0) {
     console.log(`Committing final batch of ${operationsInBatch} deletions...`);
     await batch.commit();
  }

  console.log(`Checked ${checkedCount} sessions. Successfully deleted ${deletedCount} sessions older than 2 days (based on ID).`);
}

async function clearImages() {
  console.log('Starting cleanup for images older than 2 days...');
  // IMPORTANT: Replace 'images/' with the actual path/prefix in your Firebase Storage bucket where images are stored
  const prefix = 'images/'; // Make sure this ends with '/' if it's a folder
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  console.log(`Checking for images in '${prefix}' created before ${twoDaysAgo.toISOString()}...`);
  const [files] = await storage.getFiles({ prefix: prefix });

  if (files.length === 0) {
    console.log(`No images found in the specified path '${prefix}'.`);
    return;
  }

  console.log(`Found ${files.length} total files in '${prefix}'. Checking creation dates...`);
  let deletedCount = 0;
  const deletePromises = [];

  for (const file of files) {
    try {
      // Fetch metadata to get the creation time
      const [metadata] = await file.getMetadata();
      const timeCreated = new Date(metadata.timeCreated);

      if (timeCreated < twoDaysAgo) {
        console.log(`Scheduling deletion for image: ${file.name} (Created: ${timeCreated.toISOString()})`);
        deletePromises.push(file.delete());
        deletedCount++;
      } else {
        // Optional: Log files that are skipped
        // console.log(`Skipping image (not old enough): ${file.name} (Created: ${timeCreated.toISOString()})`);
      }
    } catch (error) {
        console.error(`Failed to get metadata or schedule deletion for ${file.name}:`, error);
        // Decide if you want to stop or continue on metadata errors
    }
  }


  if (deletePromises.length === 0) {
      console.log("No images older than 2 days found to delete.");
      return;
  }

  console.log(`Attempting to delete ${deletePromises.length} images older than 2 days...`);
  // Use Promise.allSettled to attempt all deletions even if some fail
  const results = await Promise.allSettled(deletePromises);

  let successfulDeletions = 0;
  results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
          successfulDeletions++;
      } else {
          // The file object might not be easily accessible here, log the index or error
          console.error(`Failed to delete image at index ${index}:`, result.reason);
      }
  });

  console.log(`Successfully deleted ${successfulDeletions} out of ${deletePromises.length} targeted images older than 2 days.`);
  if (successfulDeletions !== deletePromises.length) {
      console.warn("Some image deletions failed. Check logs above.");
  }
}

async function runCleanup() {
  try {
    // You might want to add confirmation prompts here in a real-world scenario
    // using libraries like 'inquirer' before proceeding with deletion.
    console.log('--- Starting Manual Cleanup ---');
    await clearSessions();
    console.log('---');
    await clearImages();
    console.log('--- Manual Cleanup Completed Successfully ---');
  } catch (error) {
    console.error('Error during manual cleanup:', error);
    process.exit(1); // Exit with error code
  }
}

// Make sure firebase-admin is installed: yarn add firebase-admin
// Run the script using: yarn cleanup:manual
runCleanup();