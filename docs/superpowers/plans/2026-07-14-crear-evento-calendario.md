# Crear Evento del Calendario Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hacer funcional el modal "Crear Evento" del calendario del Home (`pages/Dashboard/Home/index.js`), guardando eventos reales vía `reducers/events/reducer.js` con los campos que exige la tabla `events` de la BD.

**Architecture:** React 18 (class components) + Redux clásico + `redux-thunk`. El formulario vive dentro del propio `HomeIndex` (mismo archivo que ya orquesta el calendario), reutilizando el patrón de action creators por dominio (`getEntities`, `createEvent`) que ya existe en el repo. `entity_id` se resuelve por rol: un `<select>` para admin (poblado con `getEntities`), automático desde el token para teacher.

**Tech Stack:** React 18, react-redux, redux-thunk, react-bootstrap (`Modal`, `Button`), sweetalert2 (`Swal`), FullCalendar (sin cambios).

## Global Constraints

- No se introduce infraestructura de testing nueva: el repo no tiene un solo archivo `*.test.js` ni `setupTests.js` configurado pese a que `@testing-library/*` está en `package.json`. Verificar cada tarea con `CI=true npx react-app-rewired build` (falla ante errores de compilación/ESLint, pero no ante warnings preexistentes que no toquemos) y con una pasada manual en el navegador (dev server ya corre en `http://localhost:3000`).
- Seguir el patrón de fetch manual (`Headers` + `fetch` + `Swal.fire` en catch) ya usado en todos los reducers de dominio — no introducir un cliente HTTP nuevo.
- Mantener el estilo de componentes de clase (no convertir a hooks) — el resto del archivo y del módulo `Dashboard` usa clases.
- Los campos del formulario deben mapear exactamente a las columnas de la tabla `events`: `entity_id`, `name`, `location`, `description`, `start`, `end` (ver spec `docs/superpowers/specs/2026-07-14-crear-evento-calendario-design.md`).

---

## Task 1: Corregir el bug de `createEvent` en el reducer de eventos

**Files:**
- Modify: `src/reducers/events/reducer.js:38-70`

**Interfaces:**
- Consumes: nada nuevo.
- Produces: `createEvent(accessToken, data)` (thunk) sigue exportado igual, pero su `.then` final ya no ejecuta código muerto. Las tareas 2 y 3 llamarán a `this.props.createEvent(access_token, data)` en ese orden exacto.

El bug: dentro del `.then` final de `createEvent`, se invoca `Redirect('/pages/dashboard/students')` — `Redirect` es un componente de `react-router`, no una función, así que esa línea no hace nada (código muerto) y además el import de `Redirect` ya no se usará en este archivo tras quitarla.

- [ ] **Step 1: Editar `createEvent` para quitar el `Redirect` muerto**

Abre `src/reducers/events/reducer.js`. Reemplaza:

```js
        return fetch(`${API_URL}/api/events`, {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(data)
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error creando evento.");
                }
                return response.json();
            })
            .then((data) => {
                Redirect('/pages/dashboard/students')
            })
            .catch((error) => {
```

por:

```js
        return fetch(`${API_URL}/api/events`, {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(data)
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error creando evento.");
                }
                return response.json();
            })
            .catch((error) => {
```

- [ ] **Step 2: Quitar el import de `Redirect` ya no usado**

En la parte superior del mismo archivo, reemplaza:

```js
import Swal from 'sweetalert2';
import { Redirect } from 'react-router';
```

por:

```js
import Swal from 'sweetalert2';
```

- [ ] **Step 3: Verificar que compila**

Run: `cd /home/jruedadev/DEV/ROBC/robc-frontend && CI=true npx react-app-rewired build 2>&1 | grep -A3 "events/reducer"`

Expected: sin salida (ningún error/warning referenciando `events/reducer.js`). Si aparece `'Redirect' is not defined` o similar, revisa que ambos cambios se aplicaron.

- [ ] **Step 4: Commit**

```bash
cd /home/jruedadev/DEV/ROBC/robc-frontend
git add src/reducers/events/reducer.js
git commit -m "Fix: remove dead Redirect() call in events createEvent thunk"
```

---

## Task 2: Resolver `entity_id` por rol y cargar entidades para admin

**Files:**
- Modify: `src/pages/Dashboard/Home/index.js:1-53` (imports, constructor, `componentDidMount`, `mapStateToProps`/`mapDispatchToProps`)

**Interfaces:**
- Consumes: `getEntities(accessToken)` (thunk) desde `src/reducers/entities/reducer.js` — ya existe, dispara `dispatch(setEntities(data))` sobre éxito. Estado resultante en `state.Entities.rowData` (array de `{ id, name, ... }`).
- Produces: `this.state.role` (string en minúsculas, ej. `"admin"`), `this.state.isAdmin` (bool), `this.state.isTeacher` (bool), `this.state.teacherEntityId` (string o `""`). La Tarea 3 los consume para decidir si mostrar el `<select>` de entidad y para prellenar `newEvent.entity_id`. También produce `this.props.entities` (array, vía `mapStateToProps`) que la Tarea 3 usa para poblar las `<option>`.

- [ ] **Step 1: Añadir el import de `getEntities`**

En `src/pages/Dashboard/Home/index.js`, reemplaza:

```js
import { getEvents, deleteEvent, createEvent } from "../../../reducers/events/reducer";
import { Modal, Button } from "react-bootstrap";
```

por:

```js
import { getEvents, deleteEvent, createEvent } from "../../../reducers/events/reducer";
import { getEntities } from "../../../reducers/entities/reducer";
import { Modal, Button } from "react-bootstrap";
import Swal from "sweetalert2";
```

- [ ] **Step 2: Calcular rol y `entity_id` de teacher en el constructor**

Reemplaza el constructor completo:

```js
    constructor(props) {
        super(props);

        this.state = {
            versionApp,
            isModalOpen: false,
            newEvent: {
                title: "",
                start: "",
                end: "",
            },
        };
    }
```

por:

```js
    constructor(props) {
        super(props);

        const { user } = JSON.parse(this.props.accessToken);
        const roles = user.roles || [];
        const role = roles.length > 0 ? roles[0].name.toLowerCase() : "guest";
        const isAdmin = role === "admin";
        const isTeacher = role === "teacher";
        const teacherEntityId = user.teacher?.entity_id ?? user.teacher?.entity?.id ?? "";

        this.state = {
            versionApp,
            isModalOpen: false,
            isSubmitting: false,
            role,
            isAdmin,
            isTeacher,
            teacherEntityId,
            newEvent: {
                name: "",
                start: "",
                end: "",
                description: "",
                location: "",
                entity_id: isTeacher ? teacherEntityId : "",
            },
        };
    }
```

- [ ] **Step 3: Cargar entidades en `componentDidMount` si el rol es admin**

Reemplaza:

```js
    componentDidMount() {
        this.fetchEvents();
    }
```

por:

```js
    componentDidMount() {
        this.fetchEvents();
        if (this.state.isAdmin && this.props.entities.length === 0) {
            const { access_token } = JSON.parse(this.props.accessToken);
            this.props.getEntities(access_token);
        }
    }
```

- [ ] **Step 4: Exponer `entities` en `mapStateToProps` y `getEntities` en `mapDispatchToProps`**

Al final del archivo, reemplaza:

```js
const mapStateToProps = (state) => ({
    accessToken: state.RobcodeService.accessToken,
    events: state.Events.events,
});

const mapDispatchToProps = {
    getEvents,
    deleteEvent,
    createEvent,
};
```

por:

```js
const mapStateToProps = (state) => ({
    accessToken: state.RobcodeService.accessToken,
    events: state.Events.events,
    entities: state.Entities?.rowData ?? [],
});

const mapDispatchToProps = {
    getEvents,
    deleteEvent,
    createEvent,
    getEntities,
};
```

- [ ] **Step 5: Verificar que compila**

Run: `cd /home/jruedadev/DEV/ROBC/robc-frontend && CI=true npx react-app-rewired build 2>&1 | grep -A5 "Dashboard/Home/index"`

Expected: sin errores nuevos referenciando este archivo (puede haber warnings preexistentes de otros archivos, ignóralos).

- [ ] **Step 6: Commit**

```bash
cd /home/jruedadev/DEV/ROBC/robc-frontend
git add src/pages/Dashboard/Home/index.js
git commit -m "Add role-based entity_id resolution for event creation"
```

---

## Task 3: Activar el modal de creación de evento con los campos reales

**Files:**
- Modify: `src/pages/Dashboard/Home/index.js` (handlers `openCreateEventModal`, `handleSubmitNewEvent`, nuevo `validateNewEvent`, y el JSX del `render`)

**Interfaces:**
- Consumes: `this.state.isAdmin`, `this.state.isTeacher`, `this.state.teacherEntityId`, `this.props.entities` (Tarea 2). `createEvent(accessToken, data)` (Tarea 1, ya sin el `Redirect` muerto).
- Produces: nada consumido por otras tareas — es la última pieza funcional.

- [ ] **Step 1: Reemplazar `openCreateEventModal` para resetear el formulario al abrir**

Reemplaza:

```js
    openCreateEventModal = () => {
        console.log('openCreateEventModal called');
        this.setState({ isModalOpen: true });
    };
```

por:

```js
    openCreateEventModal = () => {
        const { isTeacher, teacherEntityId } = this.state;
        this.setState({
            isModalOpen: true,
            newEvent: {
                name: "",
                start: "",
                end: "",
                description: "",
                location: "",
                entity_id: isTeacher ? teacherEntityId : "",
            },
        });
    };
```

- [ ] **Step 2: Quitar los `console.log` de depuración en `closeCreateEventModal` y `handleChangeNewEvent`**

Reemplaza:

```js
    closeCreateEventModal = () => {
        console.log('closeCreateEventModal called');
        this.setState({ isModalOpen: false });
    };

    handleChangeNewEvent = (e) => {
        console.log('handleChangeNewEvent called');
        const { name, value } = e.target;
```

por:

```js
    closeCreateEventModal = () => {
        this.setState({ isModalOpen: false });
    };

    handleChangeNewEvent = (e) => {
        const { name, value } = e.target;
```

- [ ] **Step 3: Añadir `validateNewEvent` y reescribir `handleSubmitNewEvent`**

Reemplaza:

```js
    handleSubmitNewEvent = async (e) => {
        console.log('handleSubmitNewEvent called');
        e.preventDefault();
        try {
            const { access_token } = JSON.parse(this.props.accessToken);
            await this.props.createEvent(this.state.newEvent, access_token);
            this.closeCreateEventModal();
            this.fetchEvents();
        } catch (err) {
            console.error(err);
        }
    };
```

por:

```js
    validateNewEvent = () => {
        const { name, start, end, entity_id } = this.state.newEvent;

        if (!name.trim()) {
            Swal.fire({ title: "Error", icon: "error", text: "El nombre del evento es obligatorio." });
            return false;
        }
        if (!start || !end) {
            Swal.fire({ title: "Error", icon: "error", text: "Debes indicar fecha de inicio y fin." });
            return false;
        }
        if (new Date(end) < new Date(start)) {
            Swal.fire({ title: "Error", icon: "error", text: "La fecha de fin no puede ser anterior a la de inicio." });
            return false;
        }
        if (!entity_id) {
            Swal.fire({ title: "Error", icon: "error", text: "Debes seleccionar una entidad." });
            return false;
        }
        return true;
    };

    handleSubmitNewEvent = async (e) => {
        e.preventDefault();
        if (!this.validateNewEvent()) {
            return;
        }
        this.setState({ isSubmitting: true });
        try {
            const { access_token } = JSON.parse(this.props.accessToken);
            await this.props.createEvent(access_token, this.state.newEvent);
            this.closeCreateEventModal();
            this.fetchEvents();
        } catch (err) {
            console.error(err);
        } finally {
            this.setState({ isSubmitting: false });
        }
    };
```

- [ ] **Step 4: Quitar el placeholder rojo y activar el `Modal` real**

Reemplaza todo este bloque:

```js
            {this.state.isModalOpen && (
                <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, background: 'red', color: '#fff', padding: 10 }}>
                    MODAL PRUEBA
                    <button onClick={this.closeCreateEventModal}>Cerrar</button>
                </div>
            )}

            {/* <Modal
                show={this.state.isModalOpen}
                onHide={this.closeCreateEventModal}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Crear evento</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={this.handleSubmitNewEvent}>
                        <div className="form-group mb-3">
                            <label>Título</label>
                            <input
                                type="text"
                                name="title"
                                className="form-control"
                                value={this.state.newEvent.title}
                                onChange={this.handleChangeNewEvent}
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label>Fecha inicio</label>
                            <input
                                type="datetime-local"
                                name="start"
                                className="form-control"
                                value={this.state.newEvent.start}
                                onChange={this.handleChangeNewEvent}
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label>Fecha fin</label>
                            <input
                                type="datetime-local"
                                name="end"
                                className="form-control"
                                value={this.state.newEvent.end}
                                onChange={this.handleChangeNewEvent}
                            />
                        </div>
                        <div className="d-flex justify-content-end">
                            <Button variant="secondary" onClick={this.closeCreateEventModal} className="me-2">
                                Cancelar
                            </Button>
                            <Button type="submit" variant="primary">
                                Guardar
                            </Button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal> */}
```

por:

```js
            <Modal
                show={this.state.isModalOpen}
                onHide={this.closeCreateEventModal}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Crear evento</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={this.handleSubmitNewEvent}>
                        <div className="form-group mb-3">
                            <label htmlFor="name">Nombre</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="form-control"
                                value={this.state.newEvent.name}
                                onChange={this.handleChangeNewEvent}
                                disabled={this.state.isSubmitting}
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="start">Fecha inicio</label>
                            <input
                                type="datetime-local"
                                id="start"
                                name="start"
                                className="form-control"
                                value={this.state.newEvent.start}
                                onChange={this.handleChangeNewEvent}
                                disabled={this.state.isSubmitting}
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="end">Fecha fin</label>
                            <input
                                type="datetime-local"
                                id="end"
                                name="end"
                                className="form-control"
                                value={this.state.newEvent.end}
                                onChange={this.handleChangeNewEvent}
                                disabled={this.state.isSubmitting}
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="location">Ubicación</label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                className="form-control"
                                value={this.state.newEvent.location}
                                onChange={this.handleChangeNewEvent}
                                disabled={this.state.isSubmitting}
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="description">Descripción</label>
                            <textarea
                                id="description"
                                name="description"
                                className="form-control"
                                value={this.state.newEvent.description}
                                onChange={this.handleChangeNewEvent}
                                disabled={this.state.isSubmitting}
                            />
                        </div>
                        {this.state.isAdmin && (
                            <div className="form-group mb-3">
                                <label htmlFor="entity_id">Entidad</label>
                                <select
                                    id="entity_id"
                                    name="entity_id"
                                    className="form-control"
                                    value={this.state.newEvent.entity_id}
                                    onChange={this.handleChangeNewEvent}
                                    disabled={this.state.isSubmitting}
                                >
                                    <option value="">Selecciona una entidad</option>
                                    {this.props.entities.map((entity) => (
                                        <option key={entity.id} value={entity.id}>{entity.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <div className="d-flex justify-content-end">
                            <Button variant="secondary" onClick={this.closeCreateEventModal} className="me-2" disabled={this.state.isSubmitting}>
                                Cancelar
                            </Button>
                            <Button type="submit" variant="primary" disabled={this.state.isSubmitting}>
                                Guardar
                            </Button>
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
```

- [ ] **Step 5: Quitar el `console.log` de depuración en `render`**

Reemplaza:

```js
    render() {

        console.log('render HomeIndex, isModalOpen:', this.state.isModalOpen);
        return <Fragment>
```

por:

```js
    render() {
        return <Fragment>
```

- [ ] **Step 6: Verificar que compila**

Run: `cd /home/jruedadev/DEV/ROBC/robc-frontend && CI=true npx react-app-rewired build 2>&1 | grep -A5 "Dashboard/Home/index"`

Expected: sin errores nuevos referenciando este archivo.

- [ ] **Step 7: Commit**

```bash
cd /home/jruedadev/DEV/ROBC/robc-frontend
git add src/pages/Dashboard/Home/index.js
git commit -m "Wire real event creation form into calendar modal"
```

---

## Task 4: Verificación manual end-to-end

**Files:** ninguno (solo verificación, no hay tests automatizados en el repo — ver Global Constraints).

- [ ] **Step 1: Confirmar que el dev server está corriendo con los cambios**

Si el dev server (`npx react-app-rewired start`) sigue corriendo desde antes, reinícialo para asegurarte de que toma los últimos cambios (Ctrl+C y volver a correr `npm start`, o `npx react-app-rewired start`). Espera el mensaje `Compiled successfully!` en la terminal.

- [ ] **Step 2: Login como admin y crear un evento**

1. Abre `http://localhost:3000` en el navegador, inicia sesión con un usuario con rol `admin`.
2. Ve a la vista Home (`/#/pages/dashboard/main` o donde esté montado `HomeIndex`).
3. Click en "Crear Evento". Verifica que aparece el modal con campos: Nombre, Fecha inicio, Fecha fin, Ubicación, Descripción, **Entidad** (select).
4. Deja el nombre vacío y da "Guardar" → debe aparecer un `Swal` de error "El nombre del evento es obligatorio." y el modal debe seguir abierto.
5. Completa Nombre, Fecha inicio, Fecha fin (fin antes que inicio) y Entidad → debe aparecer el error de fechas.
6. Completa todos los campos correctamente (fin >= inicio, entidad seleccionada) y da "Guardar".
7. Verifica en la pestaña Network del navegador que la petición `POST /api/events` se envió con `Authorization: Bearer <token>` y un body JSON con `name`, `start`, `end`, `location`, `description`, `entity_id`.
8. Si el backend responde 200/201: el modal debe cerrarse y el evento debe aparecer en el `FullCalendar`.
9. Si el backend responde error: debe aparecer un `Swal` de error y el modal permanece abierto con los datos ingresados (no se pierden).

- [ ] **Step 3: Login como teacher (si hay un usuario de prueba disponible) y repetir**

1. Inicia sesión con un usuario con rol `teacher`.
2. Click en "Crear Evento" → el modal **no** debe mostrar el `<select>` de Entidad.
3. Completa Nombre, Fecha inicio, Fecha fin y guarda.
4. Verifica en Network que el body incluye `entity_id` con el valor resuelto automáticamente desde `user.teacher` (revisa el token en `localStorage` con las devtools si quieres confirmar el valor exacto esperado).

- [ ] **Step 4: Confirmar que un rol sin permiso no ve el botón**

1. Inicia sesión con un usuario que no sea `admin` ni `teacher` (o revisa el código: `canCreateRoles={['admin', 'Teacher']}` en la llamada a `EventCalendar` dentro de `HomeIndex`).
2. Verifica que el botón "Crear Evento" no se renderiza para ese rol.

- [ ] **Step 5: Reportar resultado**

Si todos los pasos anteriores pasan, la feature está lista para revisión de código. Si algo fallara (ej. el backend no expone `/api/events` con esos campos exactos, o `user.teacher` tiene una forma distinta a la asumida), documenta el hallazgo — puede requerir ajustar el mapeo de campos o la ruta de resolución de `entity_id` antes de dar la tarea por cerrada.
