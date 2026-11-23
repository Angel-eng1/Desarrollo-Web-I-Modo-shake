import { createRouter, createWebHistory } from 'vue-router'

// Cada vista se carga al visitarla; meta.title alimenta el título del navegador.
const routes = [
  { path: '/', name: 'inicio', component: () => import('../views/InicioView.vue'), meta: { title: 'Inicio' } },
  { path: '/categorias', name: 'categorias', component: () => import('../views/CategoriasView.vue'), meta: { title: 'Categorías' } },
  { path: '/productos', name: 'productos', component: () => import('../views/ProductosView.vue'), meta: { title: 'Productos' } },
  { path: '/productos/:id', name: 'producto-detalle', component: () => import('../views/DetalleProductoView.vue'), meta: { title: 'Detalle del producto' } },
  { path: '/carrito', name: 'carrito', component: () => import('../views/CarritoView.vue'), meta: { title: 'Carrito' } },
  { path: '/perfil', name: 'perfil', component: () => import('../views/PerfilView.vue'), meta: { title: 'Perfil' } },
  { path: '/nosotros', name: 'nosotros', component: () => import('../views/NosotrosView.vue'), meta: { title: 'Nosotros' } },
  { path: '/contacto', name: 'contacto', component: () => import('../views/ContactoView.vue'), meta: { title: 'Contacto' } },
  { path: '/:pathMatch(.*)*', name: 'no-encontrada', component: () => import('../views/NoEncontradaView.vue'), meta: { title: 'Página no encontrada' } },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.afterEach((to) => {
  document.title = `${to.meta.title} | Modo Shake`
})

export default router
