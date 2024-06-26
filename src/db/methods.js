// Open database
export const openDB = (dbName, dbVersion, storeName) => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, dbVersion);

    request.onerror = () => {
      reject("Error opening database");
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "userName" });
      }
    };
  });
};

// Add data
export const addData = (db, storeName, data) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], "readwrite");
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.add(data);

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject("Duplicate UserName");
    };
  });
};

// Read data
export const readData = (db, storeName, id) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName]);
    const objectStore = transaction.objectStore(storeName);
    const request = id ? objectStore.get(id) : objectStore.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject("Error reading data");
    };
  });
};

// Update data
export const updateData = (db, storeName, data) => {
  const transaction = db.transaction([storeName], "readwrite");
  const objectStore = transaction.objectStore(storeName);
  const request = objectStore.get(data.userName);
  return new Promise((resolve, reject) => {
    request.onsuccess = (event) => {
      const existingEntry = event.target.result;
      if (!existingEntry) {
        // Entry not found, create a new entry with score 0 and isPlaying set
        const newEntry = { username, score: 0, isPlaying };
        objectStore.put(newEntry).onsuccess = resolve;
        objectStore.put(newEntry).onerror = reject;
        return;
      }

      // Entry found, update score (if provided) and add isPlaying field
      const updatedEntry = {
        ...existingEntry,
        ...data,
      };

      objectStore.put(updatedEntry).onsuccess = resolve;
      objectStore.put(updatedEntry).onerror = reject;
    };

    request.onerror = reject;
  });
};

// Delete data
export const deleteData = (db, storeName, id) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], "readwrite");
    const objectStore = transaction.objectStore(storeName);
    const request = objectStore.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject("Error deleting data");
    };
  });
};
