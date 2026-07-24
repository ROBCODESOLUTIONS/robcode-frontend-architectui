import React, { Fragment } from "react";
import EventCalendar from "./calendar";
import { connect } from "react-redux";

import { getEvents, deleteEvent, createEvent, updateEvent } from "../../../reducers/events/reducer";
import { getEntities } from "../../../reducers/entities/reducer";
import { Modal, Button } from "react-bootstrap";
import Swal from "sweetalert2";

const versionApp = process.env.REACT_APP_VERSION

class HomeIndex extends React.Component {
    constructor(props) {
        super(props);

        const { user } = JSON.parse(this.props.accessToken);
        const roles = user.roles || [];
        const role = roles.length > 0 ? roles[0].name.toLowerCase() : "guest";
        const isAdmin = role === "admin";
        const isTeacher = role === "teacher";
        const teacherClassroom = user.teacher?.classrooms?.[0];
        const teacherEntityId = teacherClassroom?.entity_id ?? teacherClassroom?.entity?.id ?? "";

        this.state = {
            versionApp,
            isModalOpen: false,
            isSubmitting: false,
            editingEventId: null,
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

    componentDidMount() {
        this.fetchEvents();
        if (this.state.isAdmin && this.props.entities.length === 0) {
            const { access_token } = JSON.parse(this.props.accessToken);
            this.props.getEntities(access_token);
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.accessToken !== prevProps.accessToken || this.props.events !== prevProps.events) {
            this.fetchEvents();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.isLoading !== this.state.isLoading ||
            nextState.error !== this.state.error ||
            nextState.events !== this.state.events ||
            nextState.isModalOpen !== this.state.isModalOpen ||
            nextState.isSubmitting !== this.state.isSubmitting ||
            nextState.newEvent !== this.state.newEvent ||
            nextState.editingEventId !== this.state.editingEventId ||
            nextProps.entities !== this.props.entities;
    }

    async fetchEvents() {
        try {
            this.setState({ isLoading: true, error: null });
            const { access_token } = JSON.parse(this.props.accessToken);
            await this.props.getEvents(access_token);
            this.setState({ events: this.props.events });
        } catch (error) {
            console.error("Error fetching events: ", error);
            this.setState({ error: "Error al obtener los eventos.", events: [] });
        } finally {
            this.setState({ isLoading: false });
        }
    }

    openCreateEventModal = () => {
        const { isTeacher, teacherEntityId } = this.state;
        this.setState({
            isModalOpen: true,
            editingEventId: null,
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

    openEditEventModal = (event) => {
        const toLocalInput = (date) => {
            if (!date) return "";
            const pad = (n) => String(n).padStart(2, "0");
            return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
        };

        this.setState({
            isModalOpen: true,
            editingEventId: event.id,
            newEvent: {
                name: event.title || "",
                start: toLocalInput(event.start),
                end: toLocalInput(event.end),
                description: event.extendedProps?.description || "",
                location: event.extendedProps?.location || "",
                entity_id: event.extendedProps?.entity_id || "",
            },
        });
    };

    closeCreateEventModal = () => {
        this.setState({ isModalOpen: false, editingEventId: null });
    };

    handleChangeNewEvent = (e) => {
        const { name, value } = e.target;
        this.setState((prevState) => ({
            newEvent: {
                ...prevState.newEvent,
                [name]: value,
            },
        }));
    };

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
            const { editingEventId } = this.state;
            if (editingEventId) {
                await this.props.updateEvent(access_token, editingEventId, this.state.newEvent);
            } else {
                await this.props.createEvent(access_token, this.state.newEvent);
            }
            this.closeCreateEventModal();
            this.fetchEvents();
        } catch (err) {
            console.error(err);
        } finally {
            this.setState({ isSubmitting: false });
        }
    };

    handleDeleteEvent = async () => {
        const { editingEventId } = this.state;
        if (!editingEventId) {
            return;
        }

        const confirmation = await Swal.fire({
            title: "¿Eliminar evento?",
            text: "Esta acción no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar",
        });
        if (!confirmation.isConfirmed) {
            return;
        }

        this.setState({ isSubmitting: true });
        try {
            const { access_token } = JSON.parse(this.props.accessToken);
            await this.props.deleteEvent(access_token, editingEventId);
            this.closeCreateEventModal();
            this.fetchEvents();
        } catch (err) {
            console.error(err);
        } finally {
            this.setState({ isSubmitting: false });
        }
    };

    render() {
        return <Fragment>
            <div className="app-page-title mb-4" style={{ margin: "0" }}>
                <div className="page-title-wrapper">
                    <div className="page-title-heading">
                        <div className="page-title-icon">
                            <i className="pe-7s-coffee icon-gradient bg-mean-fruit"></i>
                        </div>
                        <div>
                            <h1>Inicio</h1>
                            <div className="page-title-subheading">
                                Bienvenido al sistema Robcode, el cual es un sistema de gestión de cursos de Robótica.
                                <br />
                                Aquí podrás ver todas las actividades que se realizaron en los cursos, así como las
                                actividades que se realizaron para los estudiantes.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                show={this.state.isModalOpen}
                onHide={this.closeCreateEventModal}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>{this.state.editingEventId ? "Editar evento" : "Crear evento"}</Modal.Title>
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
                            {this.state.editingEventId && (
                                <Button variant="danger" onClick={this.handleDeleteEvent} className="me-auto" disabled={this.state.isSubmitting}>
                                    Eliminar
                                </Button>
                            )}
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
            <div className="container">
                <h1>Eventos y Anuncios</h1>
                <EventCalendar
                    events={this.props.events}
                    height={550}
                    createButtonText="Crear Evento"
                    onCreateEvent={this.openCreateEventModal}
                    canCreateRoles={['admin', 'Teacher']}
                    onEditEvent={this.openEditEventModal}
                    canEditRoles={['admin', 'Teacher']}
                />
            </div>
        </Fragment>
    }
}

const mapStateToProps = (state) => ({
    accessToken: state.RobcodeService.accessToken,
    events: state.Events.events,
    entities: state.Entities?.rowData ?? [],
});

const mapDispatchToProps = {
    getEvents,
    deleteEvent,
    createEvent,
    updateEvent,
    getEntities,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeIndex);