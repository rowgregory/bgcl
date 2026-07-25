import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyC07c5h94kzM9Hby-YN2phrLDWhwJ2oPE0',
  authDomain: 'boys-and-girls-club-of-l-a2ad0.firebaseapp.com',
  projectId: 'boys-and-girls-club-of-l-a2ad0',
  storageBucket: 'boys-and-girls-club-of-l-a2ad0.firebasestorage.app',
  messagingSenderId: '985578092646',
  appId: '1:985578092646:web:076a4990ed0aee34f3d5a7',
  measurementId: 'G-G3ZWK8B1MD'
}

const app = initializeApp(firebaseConfig)
const storage = getStorage(app)

export { storage }
