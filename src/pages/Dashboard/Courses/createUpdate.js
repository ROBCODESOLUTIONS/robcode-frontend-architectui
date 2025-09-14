import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Swal from "sweetalert2";

import { createCourse, getCourses, updateCourse } from "../../../reducers/courses/reducer";

class CoursesCreateUpdate extends React.Component {

    constructor(props) {
        super(props);

        const { access_token } = JSON.parse(this.props.accessToken);

        this.state = {
            course: {
                id: '',
                name: "",
                group: "",
                students: [],
            },
            isLoading: false,
            error: null,
        };

        const { match } = this.props;
        if (match.params.courseId) {
            this.state.course.id = match.params.courseId;
        }
    }

    componentDidMount() {
        if (this.props.courses.length === 0) {
            this.fetchCourses();
        } else {
            this.populateCourseFromProps();
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.accessToken !== prevProps.accessToken || this.props.courses !== prevProps.courses) {
            this.fetchCourses();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.isLoading !== this.state.isLoading ||
            nextState.error !== this.state.error ||
            nextState.course !== this.state.course;
    }

    async fetchCourses() {
        try {
            this.setState({ isLoading: true, error: null });
            const { access_token } = JSON.parse(this.props.accessToken);
            await this.props.getCourses(access_token);
            this.populateCourseFromProps();
        } catch (error) {
            console.error("Error fetching courses: ", error);
            this.setState({ error: "Error al obtener los cursos." });
        } finally {
            this.setState({ isLoading: false });
        }
    }

    populateCourseFromProps() {
        if (this.state.course.id) {
            const matchedCourse = this.props.courses.find(course => course.id.toString() === this.state.course.id);
            if (matchedCourse) {
                this.setState({ course: matchedCourse });
            }
        }
    }

    onInputChange = (e) => {
        const { name, value } = e.target;
        this.setState({ course: { ...this.state.course, [name]: value } });
    };

    onSubmitForm = async (e) => {
        e.preventDefault();
        const { access_token } = JSON.parse(this.props.accessToken);

        if (!this.state.course.name || !this.state.course.group) {
            Swal.fire({
                title: "Error",
                icon: "error",
                text: "Valida que todos los campos hayan sido diligenciados correctamente.",
            });
            return;
        }
        this.setState({ isLoading: true });
        const data = {
            name: this.state.course.name,
            group: this.state.course.group,
            students: this.state.course.students ?? [],
        };

        try {
            if (this.state.course.id) {
                await this.props.updateCourse(access_token, data, this.state.course.id);
            } else {
                await this.props.createCourse(access_token, data);
            }
            await this.props.getCourses(access_token);
            this.props.history.push("/pages/dashboard/courses");
        } catch (err) {
            Swal.fire({
                title: "Error",
                icon: "error",
                text: "No se pudo guardar el curso.",
            });
        } finally {
            this.setState({ isLoading: false });
        }
    }

    render() {
        return <Fragment>
            <div className="app-page-title mb-4" style={{ margin: "0" }}>
                <div className="page-title-wrapper">
                    <div className="page-title-heading">
                        <div className="page-title-icon">
                            <Link to={"/pages/dashboard/courses"} className="">
                                <i className="pe-7s-angle-left-circle icon-gradient bg-mean-fruit"></i>
                            </Link>
                        </div>
                        <div>
                            <h1>Cursos</h1>
                            <div className="page-title-subheading">
                                {this.state.course.id ? 'Editar' : 'Crear nuevo'} curso
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container-fluid my-2 ">
                <div className="row">
                    <div className="col-12">
                        <div className="main-card mb-3 card">
                            <div className="card-body">
                                <form onSubmit={this.onSubmitForm} className="row">
                                    <div className="form-group">
                                        <label htmlFor="name">Grado</label>
                                        <input
                                            type="text"
                                            placeholder="Nombre del curso"
                                            className="form-control my-2"
                                            name="name"
                                            autoComplete="off"
                                            value={this.state.course.name}
                                            onChange={this.onInputChange}
                                            disabled={this.state.isLoading}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="group">Grupo de recursos</label>
                                        <input
                                            type="text"
                                            placeholder="Grupo"
                                            className="form-control my-2"
                                            name="group"
                                            autoComplete="off"
                                            value={this.state.course.group}
                                            onChange={this.onInputChange}
                                            disabled={this.state.isLoading}
                                        />
                                    </div>
                                    {/* Opcional: si necesitas gestión visual de estudiantes */}
                                    {/* <div className="form-group">
                                         <label htmlFor="students">Estudiantes (IDs separados por coma)</label>
                                         <input
                                             type="text"
                                             placeholder="1,2,3"
                                             className="form-control my-2"
                                             name="students"
                                             autoComplete="off"
                                             value={this.state.course.students.join(",")}
                                             onChange={(e) => this.setState({
                                                 course: {
                                                     ...this.state.course,
                                                     students: e.target.value.split(",").map(str => str.trim())
                                                 }
                                             })}
                                             disabled={this.state.isLoading}
                                         />
                                    </div> */}
                                    <div className="col-12">
                                        <button
                                            className="btn btn-outline-primary my-2"
                                            type="submit"
                                            disabled={this.state.isLoading}
                                        >
                                            {this.state.course.id ? "Actualizar" : "Crear"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    }
}
const mapStateToProps = (state) => ({
    accessToken: state.RobcodeService.accessToken,
    courses: state.Courses?.rowData ?? [],
});

const mapDispatchToProps = {
    getCourses,
    createCourse,
    updateCourse,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CoursesCreateUpdate));
