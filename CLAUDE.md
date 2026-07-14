# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Descripción del proyecto

Frontend de **ROBC** (sistema.robcoderobot.com), construido sobre **ArchitectUI** (plantilla admin dashboard React + Bootstrap 5, DashboardPack, edición FREE). Es un React 18 CRA (Create React App) "ejectado" vía `react-app-rewired`, con Redux clásico (no Redux Toolkit) para el estado de dominio y un `AuthContext` aparte para el token de sesión.

## Comandos

```bash
npm install        # instalar dependencias
npm run start       # dev server (react-app-rewired start) -> http://localhost:3000
npm run build        # build de producción (react-app-rewired build)
npm run test          # tests (react-app-rewired test, Jest vía CRA)
npm run eject          # eject CRA (evitar salvo necesidad real)
```

No hay lint script propio; ESLint usa el preset `react-app` definido en `package.json` (`eslintConfig.extends`).

Para ejecutar un único test, usar la sintaxis estándar de CRA/Jest, p. ej.:
```bash
npm run test -- StudentsIndex
```

### Docker

```bash
docker-compose up    # levanta robc-web en el puerto 3000, monta el código como volumen
```

## Variables de entorno

Definidas en `.env` (con prefijo obligatorio `REACT_APP_` para ser expuestas al bundle):
- `NODE_PATH=./src` — permite imports absolutos desde `src/` (ej. `import Main from "pages/Main"`).
- `REACT_APP_API_URL` — URL base del backend (API de ROBC). Cambiar a `http://localhost:8001` para desarrollo local contra backend local (línea comentada en `.env`).
- `REACT_APP_VERSION`

## Arquitectura

### Bootstrap de la app
`src/index.js` monta `<Main />` dentro de `Provider` (Redux) + `HashRouter` (react-router-dom v5, por eso las rutas usan `#/...`). El store se crea en `src/config/configureStore.js` combinando todos los reducers de `src/reducers/index.js` con `redux-thunk` como único middleware.

### Enrutamiento anidado
El routing es jerárquico vía `<Route>` de react-router v5, no `react-router-dom` v6 (`Switch`/`Routes` no se usan así):
- `pages/Main` → `pages/Layout/AppMain` decide entre `UserPages` (login/registro) y `Dashboard` según autenticación.
- `pages/Dashboard/index.js` monta `AppHeader` + `AppSidebar` y declara las rutas hijas (`students`, `teachers`, `courses`, `resources`, `games`, `entities`, `material`, etc.), todas bajo `match.url`.
- `pages/UserPages/index.js` declara las rutas de login/registro/recuperación de contraseña.

### Estado: dos mecanismos conviven
1. **Redux** (`src/reducers/*`): un reducer por dominio (`Students`, `Teachers`, `Courses`, `Books`, `Seasons`, `Projects`, `Entities`, `RobcodeService`, `ThemeOptions`). Cada carpeta de dominio (ej. `reducers/students/reducer.js`) mezcla en el mismo archivo: action types, action creators (thunks que hacen `fetch` directo al backend), y la función reducer — no hay separación en archivos `actions.js`/`types.js`. `RobcodeService` maneja login/logout/token vía Redux además del `AuthContext`.
2. **AuthContext** (`src/context/authContext.jsx`): contexto React aparte que persiste el token en `localStorage` (`login`/`logout`/`authToken`). Al tocar autenticación, revisar si el flujo pasa por `RobcodeService` (Redux), `authContext` (Context) o `services/authService.js` (fetch directo) — actualmente hay solapamiento entre los tres, no una única fuente de verdad.

### Patrón de llamadas a la API
No hay cliente HTTP centralizado (no axios, no wrapper de fetch). Cada action creator de cada reducer de dominio repite el mismo patrón manualmente:
```js
const API_URL = process.env.REACT_APP_API_URL;
const myHeaders = new Headers();
myHeaders.append("Accept", "application/json");
myHeaders.append("Authorization", `Bearer ${accessToken}`);
fetch(`${API_URL}/api/<recurso>`, { method, headers: myHeaders, body })
```
Los errores se manejan con `sweetalert2` (`Swal.fire`) dentro del propio thunk, y se despacha una acción `SET_*_ERROR` en el reducer correspondiente. Al agregar un nuevo recurso, seguir el mismo patrón que `reducers/students/reducer.js` salvo que se decida introducir un cliente HTTP compartido (sugerencia a evaluar con el usuario, no aplicar de oficio).

### Tablas de datos
Las vistas de listado (`Students`, `Teachers`, `Courses`, etc.) usan `ag-grid-react`. Los componentes compartidos de grid están en `src/pages/components/agGrid/` (`genericTable.js`, `ActionsRow.jsx`, `ResourcesRow.jsx`).

### Estilos
SCSS en `src/assets/` (`base.scss`, `custom.scss`, más subcarpetas `layout/`, `themes/`, `components/`, `elements/`, `pages/`, `widgets/`, `applications/`, `demo-ui/`). Bootstrap 5 + Sass, no CSS-in-JS salvo `styled-components`/`aphrodite` usados puntualmente por dependencias heredadas de la plantilla.

### Polyfills / webpack
`config-overrides.js` (usado por `react-app-rewired`) agrega polyfills de Node (`buffer`, `crypto`, `stream`, `vm`, etc.) porque algunas dependencias de la plantilla asumen entorno Node. `src/polyfills.js` se importa antes que nada en `src/index.js`.

## Contenido heredado de la plantilla (DemoPages)

`src/DemoPages/` contiene páginas de demostración de ArchitectUI (Dashboards, Charts, Forms, Tables, Widgets genéricos) que no forman parte del dominio de negocio de ROBC. El código de negocio real vive en `src/pages/Dashboard/{Students,Teachers,Courses,Resources,Games,Entities,Material}`. Al buscar dónde implementar una feature de negocio, ignorar `DemoPages` salvo que se esté reutilizando un componente de UI genérico de ahí.