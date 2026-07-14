import React, { Fragment } from "react";
import EventCalendar from "./calendar";
import { connect } from "react-redux";

import { getEvents, deleteEvent, createEvent } from "../../../reducers/events/reducer";
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
            nextState.events !== this.state.events;
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
        console.log('openCreateEventModal called');
        this.setState({ isModalOpen: true });
    };

    closeCreateEventModal = () => {
        console.log('closeCreateEventModal called');
        this.setState({ isModalOpen: false });
    };

    handleChangeNewEvent = (e) => {
        console.log('handleChangeNewEvent called');
        const { name, value } = e.target;
        this.setState((prevState) => ({
            newEvent: {
                ...prevState.newEvent,
                [name]: value,
            },
        }));
    };

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

    render() {

        console.log('render HomeIndex, isModalOpen:', this.state.isModalOpen);
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
            <div className="container">
                <h1>Eventos y Anuncios</h1>
                <EventCalendar
                    events={this.props.events}
                    height={550}
                    createButtonText="Crear Evento"
                    onCreateEvent={this.openCreateEventModal}
                    canCreateRoles={['admin', 'Teacher']}
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
    getEntities,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeIndex);