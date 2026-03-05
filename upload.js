// upload.js

// Firebase v9 Compat (matches the <script> tags in your HTML)
const firebaseConfig = {
  apiKey: "AIzaSyCZ-QeZrs6qJlDk4ZMs9LP2iQ4wjJ2vcF8",
  authDomain: "artkart-69692.firebaseapp.com",
  projectId: "artkart-69692",
  storageBucket: "artkart-69692.appspot.com",
  messagingSenderId: "1067935304156",
  appId: "1:1067935304156:web:d8c50769ecb9797f8d6719"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// DOM elements
const form = document.getElementById("uploadForm");
const submitBtn = document.getElementById("submitBtn");
const formError = document.getElementById("formError");
const imageInput = document.getElementById("image");
const imagePreview = document.getElementById("imagePreview");
const imagePreviewWrapper = document.getElementById("imagePreviewWrapper");
const imagePlaceholder = document.getElementById("imagePlaceholder");

const progressContainer = document.getElementById("progressContainer");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

// Image preview
imageInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    formError.textContent = "Please select a valid image file.";
    return;
  }

  const reader = new FileReader();
  reader.onload = (ev) => {
    imagePreview.src = ev.target.result;
    imagePreview.style.display = "block";
    imagePlaceholder.style.display = "none";
    imagePreviewWrapper.classList.add("has-image");
    formError.textContent = "";
  };
  reader.readAsDataURL(file);
});

imagePreviewWrapper.addEventListener("click", () => imageInput.click());

// Form submission with progress bar
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  formError.textContent = "";
  submitBtn.disabled = true;
  submitBtn.textContent = "Uploading...";

  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const price = Number(document.getElementById("price").value);
  const category = document.getElementById("category").value;
  const file = imageInput.files[0];

  if (!title || isNaN(price) || price <= 0 || !file) {
    formError.textContent = "Please fill all required fields (title, price, image).";
    resetButton();
    return;
  }

  // Show progress bar
  progressContainer.style.display = "block";
  progressBar.style.width = "0%";
  progressText.textContent = "Uploading... 0%";

  try {
    // 1. Upload image to Cloudinary with progress
    const imageUrl = await uploadToCloudinary(file);

    // 2. Check authentication
    const user = auth.currentUser;
    if (!user) throw new Error("You must be signed in to upload.");

    // 3. Save artwork metadata to Firestore
    await db.collection("arts").add({
      title,
      description: description || null,
      price,
      category: category || null,
      imageUrl,
      artistId: user.uid,
      artistName: user.displayName || "Anonymous Artist",
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      likeCount: 0,
      views: 0
    });

    // Success → show message and redirect to home after short delay
    alert("Artwork uploaded successfully! 🎉\nRedirecting to home...");

    // Optional: you can remove the alert and just redirect silently
    // setTimeout(() => location.href = "index.html", 1500);

    setTimeout(() => {
      location.href = "home.html";
    }, 1200);

  } catch (err) {
    console.error("Upload error:", err);
    formError.textContent = err.message || "Upload failed. Please try again.";
  } finally {
    resetButton();
  }
});

function resetButton() {
  submitBtn.disabled = false;
  submitBtn.textContent = "Upload Artwork";
  progressContainer.style.display = "none";
}

// ────────────────────────────────────────────────
// Cloudinary upload with REAL progress tracking via XMLHttpRequest
// ────────────────────────────────────────────────
function uploadToCloudinary(file) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "artkart_unsigned"); // ← your Cloudinary unsigned preset

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.cloudinary.com/v1_1/dmtzk2dsw/image/upload", true);

    // Progress tracking
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        progressBar.style.width = percent + "%";
        progressText.textContent = `Uploading... ${percent}%`;
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        if (data.secure_url) {
          resolve(data.secure_url);
        } else {
          reject(new Error("No secure_url returned from Cloudinary"));
        }
      } else {
        reject(new Error(`Cloudinary error: ${xhr.status} ${xhr.statusText}`));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during upload"));

    xhr.send(formData);
  });
}

// Protect the upload page — redirect to login if not signed in
auth.onAuthStateChanged((user) => {
  if (!user) {
    location.href = "login.html";
  }
});

// Bottom navigation (consistent with other pages)
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    const page = item.getAttribute('data-page');
    if (page === 'home')       location.href = 'home.html';
    if (page === 'explore')    location.href = 'explore.html';
    // profile is already part of the flow
  });
});