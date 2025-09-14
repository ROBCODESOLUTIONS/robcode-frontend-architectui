import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Swal from "sweetalert2";

import { createTeacher, getTeachers, updateTeacher } from "../../../reducers/teachers/reducer";

class TeachersCreateUpdate extends React.Component {

    constructor(props) {
        super(props);

        const { access_token } = JSON.parse(this.props.accessToken);

        this.state = {
            teacher: {
                id: '',
                name: "",
                email: "",
                classrooms: [],  // Se puede adaptar según necesites
            },
            isLoading: false,
            error: null,
        };

        const { match } = this.props;
        if (match.params.teacherId) {
            this.state.teacher.id = match.params.teacherId;
        }
    }

    componentDidMount() {
        if (this.props.teachers.length === 0) {
            this.fetchTeachers();
        } else {
            this.populateTeacherFromProps();
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.accessToken !== prevProps.accessToken || this.props.teachers !== prevProps.teachers) {
            this.fetchTeachers();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.isLoading !== this.state.isLoading ||
            nextState.error !== this.state.error ||
            nextState.teacher !== this.state.teacher;
    }

    async fetchTeachers() {
        try {
            this.setState({ isLoading: true, error: null });
            const { access_token } = JSON.parse(this.props.accessToken);
            await this.props.getTeachers(access_token);
            this.populateTeacherFromProps();
        } catch (error) {
            console.error("Error fetching teachers: ", error);
            this.setState({ error: "Error al obtener los profesores." });
        } finally {
            this.setState({ isLoading: false });
        }
    }

    populateTeacherFromProps() {
        console.log("Populating Teacher: " + this.state.teacher);
        if (this.state.teacher.id) {
            const matchedTeacher = this.props.teachers.find(t => t.id.toString() === this.state.teacher.id);
            if (matchedTeacher) {
                this.setState({ teacher: matchedTeacher });
            }
        }
    }

    onInputChange = (e) => {
        const { name, value } = e.target;
        this.setState({ teacher: { ...this.state.teacher, [name]: value } });
    };

    onSubmitForm = async (e) => {
        e.preventDefault();
        const { access_token } = JSON.parse(this.props.accessToken);

        if (!this.state.teacher.name || !this.state.teacher.email) {
            Swal.fire({
                title: "Error",
                icon: "error",
                text: "Por favor llena todos los campos requeridos correctamente.",
            });
            return;
        }
        this.setState({ isLoading: true });

        const data = {
            name: this.state.teacher.name,
            email: this.state.teacher.email,
            classrooms: this.state.teacher.classrooms ?? [],
        };

        try {
            if (this.state.teacher.id) {
                await this.props.updateTeacher(access_token, data, this.state.teacher.id);
            } else {
                await this.props.createTeacher(access_token, data);
            }
            await this.props.getTeachers(access_token);
            this.props.history.push("/pages/dashboard/teachers");
        } catch (err) {
            Swal.fire({
                title: "Error",
                icon: "error",
                text: "No se pudo guardar el profesor.",
            });
        } finally {
            this.setState({ isLoading: false });
        }
    };

    render() {
        if (this.state.teacher.id && !this.state.teacher.name && !this.state.isLoading) {
            return (
                <div className="container">
                    <div className="alert alert-warning mt-5">
                        No se encontró el profesor solicitado.
                    </div>
                </div>
            );
        }

        return (
            <Fragment>
                <div className="app-page-title mb-4" style={{ margin: "0" }}>
                    <div className="page-title-wrapper">
                        <div className="page-title-heading">
                            <div className="page-title-icon">
                                <Link to={"/pages/dashboard/teachers"} className="">
                                    <i className="pe-7s-angle-left-circle icon-gradient bg-mean-fruit"></i>
                                </Link>
                            </div>
                            <div>
                                <h1>Profesores</h1>
                                <div className="page-title-subheading">
                                    {this.state.teacher.id ? "Editar" : "Crear nuevo"} profesor
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-fluid my-2">
                    <div className="row">
                        <div className="col-12">
                            <div className="main-card mb-3 card">
                                <div className="card-body">
                                    <form onSubmit={this.onSubmitForm} className="row">
                                        <div className="form-group col-12 col-md-6">
                                            <label htmlFor="name">Nombre</label>
                                            <input
                                                type="text"
                                                placeholder="Nombre"
                                                className="form-control my-2"
                                                name="name"
                                                autoComplete="off"
                                                value={this.state.teacher.name}
                                                onChange={this.onInputChange}
                                                disabled={this.state.isLoading}
                                            />
                                        </div>
                                        <div className="form-group col-12 col-md-6">
                                            <label htmlFor="email">Correo</label>
                                            <input
                                                type="email"
                                                placeholder="Correo electrónico"
                                                className="form-control my-2"
                                                name="email"
                                                autoComplete="off"
                                                value={this.state.teacher.email}
                                                onChange={this.onInputChange}
                                                disabled={this.state.isLoading}
                                            />
                                        </div>
                                        {/* Implementa aquí UI para asignar/modificar classrooms si lo deseas */}
                                        <div className="col-12">
                                            <button
                                                className="btn btn-outline-primary my-2"
                                                type="submit"
                                                disabled={this.state.isLoading}
                                            >
                                                {this.state.teacher.id ? "Actualizar" : "Crear"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    accessToken: state.RobcodeService.accessToken,
    teachers: state.Teachers?.rowData ?? [],
});

const mapDispatchToProps = {
    getTeachers,
    createTeacher,
    updateTeacher,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TeachersCreateUpdate));
