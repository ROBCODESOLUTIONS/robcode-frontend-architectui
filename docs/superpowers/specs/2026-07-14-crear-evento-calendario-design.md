# Diseño: formulario de creación de eventos del calendario

## Contexto

El módulo Home (`src/pages/Dashboard/Home/index.js`) muestra un calendario (`FullCalendar`, vía `src/pages/Dashboard/Home/calendar.js`) alimentado por `reducers/events/reducer.js`. Ya existe un botón "Crear Evento" (controlado por `canCreateRoles={['admin', 'Teacher']}` en `calendar.js`) que dispara `onCreateEvent`, pero solo abre un placeholder de prueba (`MODAL PRUEBA`). Hay un `Modal` de `react-bootstrap` ya esbozado pero comentado, con campos incompletos respecto al modelo real de BD.

Tabla `events` en BD:

| columna | tipo | requerido |
|---|---|---|
| entity_id | bigint | sí |
| name | varchar(255) | sí |
| location | text | no |
| description | text | no |
| start | datetime | sí |
| end | datetime | sí |

El objeto `user` embebido en el access token (`localStorage.token`) no trae `entity_id` propio; para un admin no hay asociación directa a una entidad, para un profesor la entidad debe salir de `user.teacher`.

## Objetivo

Hacer funcional la creación de eventos desde el modal del calendario, respetando el modelo de datos real y el rol del usuario.

## Diseño

### Resolución de `entity_id` por rol

- **admin**: se muestra un `<select>` con las entidades disponibles. Se cargan con `getEntities(access_token)` (reducer `entities`, ya existente) si `this.props.entities.length === 0`, igual patrón que `pages/Dashboard/Entities/createUpdate.js`.
- **teacher**: no se muestra selector; `entity_id` se resuelve automáticamente y de forma defensiva desde el token:
  ```js
  const entityId = user.teacher?.entity_id ?? user.teacher?.entity?.id ?? "";
  ```
- **otros roles**: el botón "Crear Evento" ya no se renderiza (`canCreateRoles` en `calendar.js` sigue controlando esto), por lo que el modal nunca se abre para ellos.

### Campos del formulario

| campo | tipo de input | requerido | notas |
|---|---|---|---|
| name | text | sí | reemplaza el antiguo campo "título" |
| start | datetime-local | sí | |
| end | datetime-local | sí | debe ser >= start |
| description | textarea | no | |
| location | text | no | |
| entity_id | select (admin) / oculto-automático (teacher) | sí | ver arriba |

### `pages/Dashboard/Home/index.js`

- Eliminar el bloque placeholder `MODAL PRUEBA`.
- Activar el `Modal` de `react-bootstrap` (descomentar y adaptar campos).
- En el constructor/`componentDidMount`, derivar `role`, `teacher` y `entityId` desde `JSON.parse(accessToken).user`, igual que hace `calendar.js`.
- Si `role === 'admin'`, disparar `getEntities` en `componentDidMount` si `this.props.entities.length === 0`.
- Estado `newEvent` inicial: `{ name: "", start: "", end: "", description: "", location: "", entity_id: "" }`; si es teacher, `entity_id` se precarga con el valor resuelto y el campo no se muestra en el formulario.
- Validación antes de enviar (usando `Swal.fire`, mismo patrón que `Entities/createUpdate.js`):
  - `name` no vacío.
  - `start` y `end` presentes.
  - `end >= start`.
  - `entity_id` presente.
- Corregir la llamada al action creator: `this.props.createEvent(access_token, data)` (orden correcto según la firma del reducer; actualmente está invertido y por eso crear un evento nunca funcionaría).
- `isLoading` en el submit para deshabilitar el botón "Guardar" mientras se envía la petición.
- Tras éxito: cerrar modal, `fetchEvents()` para refrescar el calendario, resetear `newEvent` al estado inicial.

### `reducers/events/reducer.js`

- En `createEvent`, eliminar `Redirect('/pages/dashboard/students')` dentro del `.then` (es un componente de `react-router`, no una función; no tiene efecto ahí y es código muerto). El thunk simplemente resuelve tras el `fetch` exitoso; el componente decide qué hacer (cerrar modal + refetch).
- Sin cambios en `getEvents` ni `deleteEvent`.

### `reducers/entities/reducer.js`

Sin cambios; se reutiliza tal cual para poblar el `<select>` de entidades cuando el rol es admin.

## Fuera de alcance

- Edición o eliminación de eventos desde el calendario.
- Clic/selección directa sobre el calendario (`dateClick`/`select` de FullCalendar) para precargar fechas.
- Campo de tipo/color de evento.
- Cambios a `calendar.js` (el botón y el control de roles ya existen y funcionan).
