import { defineStore } from 'pinia'
import { ref } from 'vue'
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { authGoogle, googleDisponible } from '../config/firebase.js'

const CLAVE_PERFILES = 'modo-shake-perfiles'
const CLAVE_ACTIVO = 'modo-shake-perfil-activo'

function leer(clave, inicial) {
  try {
    const dato = JSON.parse(localStorage.getItem(clave))
    return dato === null ? inicial : dato
  } catch {
    return inicial
  }
}

// Estos perfiles son una demostración local: no verifican identidad ni usan contraseñas.
export const usePerfilStore = defineStore('perfil', () => {
  const guardados = leer(CLAVE_PERFILES, [])
  const perfiles = ref(Array.isArray(guardados)
    ? guardados.filter((item) => item && typeof item.nombre === 'string' && typeof item.correo === 'string')
    : [])
  const correoActivo = leer(CLAVE_ACTIVO, '')
  const actual = ref(perfiles.value.find((item) => item.correo === correoActivo) || null)
  const pendienteId = ref(null)
  const aviso = ref('')
  const googleCargando = ref(false)

  // Firebase restaura la sesión Google; el carrito usa su UID, separado del perfil local.
  function activarUsuarioGoogle(usuario) {
    if (!usuario?.uid) return false
    try { localStorage.removeItem(CLAVE_ACTIVO) } catch { /* La sesión Google no depende de esta clave. */ }
    actual.value = {
      nombre: usuario.displayName || usuario.email || 'Cuenta Google',
      correo: usuario.email || '',
      proveedor: 'google',
      carritoClave: `google:${usuario.uid}`,
    }
    aviso.value = `Entraste con Google como ${actual.value.nombre}.`
    return true
  }

  if (authGoogle) {
    onAuthStateChanged(authGoogle, (usuario) => {
      if (usuario) activarUsuarioGoogle(usuario)
      else if (actual.value?.proveedor === 'google') actual.value = null
    }, () => { aviso.value = 'No se pudo recuperar la sesión de Google.' })
  }

  async function entrarGoogle() {
    if (!authGoogle) {
      aviso.value = 'El acceso con Google aún no está configurado.'
      return false
    }
    googleCargando.value = true
    try {
      const credencial = await signInWithPopup(authGoogle, new GoogleAuthProvider())
      return activarUsuarioGoogle(credencial.user)
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        aviso.value = 'Se canceló el acceso con Google.'
      } else if (error.code === 'auth/popup-blocked') {
        aviso.value = 'El navegador bloqueó la ventana de Google. Permite ventanas emergentes e inténtalo de nuevo.'
      } else if (error.code === 'auth/unauthorized-domain') {
        aviso.value = 'Este dominio aún no está autorizado en Firebase.'
      } else {
        aviso.value = 'No se pudo entrar con Google. Inténtalo de nuevo.'
      }
      return false
    } finally {
      googleCargando.value = false
    }
  }

  async function cerrarGoogle() {
    if (!authGoogle || actual.value?.proveedor !== 'google') return false
    try {
      await signOut(authGoogle)
      actual.value = null
      pendienteId.value = null
      aviso.value = 'Sesión de Google cerrada.'
      return true
    } catch {
      aviso.value = 'No se pudo cerrar la sesión de Google.'
      return false
    }
  }

  function guardar(clave, valor) {
    try {
      localStorage.setItem(clave, JSON.stringify(valor))
      return true
    } catch {
      aviso.value = 'El navegador no permitió guardar el perfil.'
      return false
    }
  }

  function activar(perfil) {
    if (!guardar(CLAVE_ACTIVO, perfil.correo)) return false
    actual.value = perfil
    aviso.value = `Entraste como ${perfil.nombre}.`
    return true
  }

  function registrar(nombre, correo) {
    const nombreLimpio = nombre.trim()
    const correoLimpio = correo.trim().toLowerCase()
    if (nombreLimpio.length < 3) {
      aviso.value = 'Escribe un nombre de al menos tres caracteres.'
      return false
    }
    if (perfiles.value.some((item) => item.correo === correoLimpio)) {
      aviso.value = 'Ya existe un perfil con ese correo en este navegador. Usa Entrar.'
      return false
    }
    const nuevo = { nombre: nombreLimpio, correo: correoLimpio }
    const siguientes = [...perfiles.value, nuevo]
    if (!guardar(CLAVE_PERFILES, siguientes)) return false
    perfiles.value = siguientes
    return activar(nuevo)
  }

  function entrar(correo) {
    const perfil = perfiles.value.find((item) => item.correo === correo.trim().toLowerCase())
    if (!perfil) {
      aviso.value = 'No hay un perfil con ese correo en este navegador. Regístrate primero.'
      return false
    }
    return activar(perfil)
  }

  function cerrar() {
    if (actual.value?.proveedor === 'google') return false
    try {
      localStorage.removeItem(CLAVE_ACTIVO)
      actual.value = null
      pendienteId.value = null
      aviso.value = 'Sesión local cerrada.'
      return true
    } catch {
      aviso.value = 'No se pudo cerrar la sesión local.'
      return false
    }
  }

  function eliminar() {
    if (!actual.value || actual.value.proveedor === 'google') return false
    const correo = actual.value.correo
    const restantes = perfiles.value.filter((item) => item.correo !== correo)
    try {
      localStorage.setItem(CLAVE_PERFILES, JSON.stringify(restantes))
      localStorage.removeItem(`modo-shake-carrito:${correo}`)
      localStorage.removeItem(CLAVE_ACTIVO)
      perfiles.value = restantes
      actual.value = null
      pendienteId.value = null
      aviso.value = 'Perfil y carrito local eliminados de este navegador.'
      return true
    } catch {
      aviso.value = 'No se pudo eliminar completamente el perfil local.'
      return false
    }
  }

  return {
    perfiles, actual, pendienteId, aviso, googleDisponible, googleCargando,
    registrar, entrar, entrarGoogle, cerrar, cerrarGoogle, eliminar,
  }
})
