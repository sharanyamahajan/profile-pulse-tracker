PrivacyPulse 🛡️

PrivacyPulse is a secure, privacy-first React application designed to provide ethical profile analytics. It allows users to track who has viewed their profile internally within the platform by linking their Instagram handle.

Unlike deceptive "profile tracker" apps, PrivacyPulse is transparent about Meta's API restrictions and focuses on reciprocal, consented tracking between platform members.

🌟 Key Features

Instagram Handle Linking: Users can initialize their profile by simply entering their Instagram username. No passwords or private data are ever requested.

Internal Search & Discovery: A secure directory to find other platform users by their handles.

Reciprocal View Tracking: If you view someone's profile, they can see you visited. In return, you can see who visited your profile.

Security Diagnostics: A mock security scanner that educates users on the "Meta Privacy Lock" and why external Instagram tracking is a security risk.

GDPR Compliance: Built-in tools for data transparency and a "Danger Zone" to wipe all user activity and logs permanently.

🛠️ Tech Stack

Frontend: React.js, Tailwind CSS

Icons: Lucide-React

Backend: Firebase (Authentication & Firestore)

Deployment: Optimized for single-page application environments

🚀 Getting Started

1. Prerequisites

Node.js (v14+)

npm or yarn

A Firebase Project

2. Installation

# Clone the repository
git clone [https://github.com/sharanyamahajan/profile-pulse-tracker.git](https://github.com/sharanyamahajan/profile-pulse-tracker.git)
cd privacypulse

# Install dependencies
npm install firebase tailwindcss lucide-react


3. Firebase Configuration

Ensure your Firebase project has Anonymous Authentication and Firestore enabled. Create a src/firebase.js file with your credentials:

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};


4. Firestore Security Rules

To maintain the required path structure, use the following rules:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /artifacts/{appId}/public/data/{collectionName}/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}


📂 Project Structure

App.js: Main entry point handling authentication and tab-based navigation.

ProfileLink.js: Component for linking and managing the Instagram handle.

SearchTool.js: User discovery and view-recording logic.

ViewersList.js: Real-time list of users who viewed your profile.

Diagnostics.js: Educational tool for privacy status and security scanning.

SecurityHub.js: Privacy documentation and data management.

⚖️ Privacy & Ethics

PrivacyPulse operates on a Closed Loop philosophy.

No Third-Party Access: We do not connect to external Instagram/Meta servers to fetch private data.

Consented Tracking: Users are informed that their visits are logged only when they opt-in to the platform's ecosystem.

Data Minimization: We only store what is necessary for the reciprocal view feature to function.

📝 License

Distributed under the MIT License. See LICENSE for more information.
