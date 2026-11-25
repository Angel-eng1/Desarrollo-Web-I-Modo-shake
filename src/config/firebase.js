import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

// La configuración web identifica el proyecto; la identidad la valida Firebase Authentication.
const entorno = import.meta.env ?? {}
const configuracion = {
  apiKey: entorno.VITE_FIREBASE_API_KEY,
  authDomain: entorno.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: entorno.VITE_FIREBASE_PROJECT_ID,
  appId: entorno.VITE_FIREBASE_APP_ID,
}

export const googleDisponible = Object.values(configuracion).every(Boolean)
export const authGoogle = googleDisponible
  ? getAuth(getApps().length ? getApp() : initializeApp(configuracion))
  : null
