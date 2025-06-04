import React, { Component, Fragment } from "react";
import GenericTable from "../../components/agGrid/genericTable";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getCourses, deleteCourse } from "../../../reducers/courses/reducer";
import ResourcesRow from "../../components/agGrid/ResourcesRow";
import ActionsRow from "../../components/agGrid/ActionsRow";

const eventListeners = {
    courseDeleted: [],
};

class CoursesIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rowData: [],
            isLoading: true,
            error: null,
        };
        this.columnDefs = [
            // { headerName: '#', field: 'id' },
            { headerName: "Grado", field: "name", flex: 1 },
            {
                headerName: "Estudiantes",
                field: "students",
                valueGetter: (params) => {
                    return params.data.students.length;
                },
                flex: 1,
            },
            { headerName: "Grupo de recursos", field: "group", flex: 1 },
            {
                headerName: 'Acciones', field: 'id',
                cellRenderer: (params) =>
                    ActionsRow({
                        value: params.value,
                        eventName: "courseDeleted",
                        deleteDispatcher: this.props.deleteCourse,
                        authToken: JSON.parse(this.props.accessToken).access_token,
                        eventListeners,
                        editUrl: `/pages/dashboard/edit/entities/${params.value}/`
                    }),
            }
        ]
    }

    componentDidMount() {
        this.fetchCourses();
    }

    componentDidUpdate(prevProps) {
        if (this.props.accessToken !== prevProps.accessToken || this.props.courses !== prevProps.courses) {
            this.fetchCourses();
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return nextState.isLoading !== this.state.isLoading ||
            nextState.error !== this.state.error ||
            nextState.rowData !== this.state.rowData;
    }
    async fetchCourses() {
        try {
            this.setState({ isLoading: true, error: null });
            const { access_token } = JSON.parse(this.props.accessToken);
            await this.props.getCourses(access_token);
            this.setState({ rowData: this.props.courses });
        } catch (error) {
            console.error("Error fetching courses: ", error);
            this.setState({ error: "Error al obtener los cursos.", rowData: [] });
        } finally {
            this.setState({ isLoading: false });
        }
    }

    render() {
        return (
            <Fragment>
                <div className="app-page-title mb-4" style={{ margin: "0" }}>
                    <div className="page-title-wrapper">
                        <div className="page-title-heading">
                            <div className="page-title-icon">
                                <i className="pe-7s-culture icon-gradient bg-mean-fruit"></i>
                            </div>
                            <div>
                                <h1>Cursos</h1>
                                <div className="page-title-subheading">
                                    <Link to={"/pages/dashboard/create/course"} className="btn btn-info my-2">
                                        Crear
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            {this.state.isLoading ? (
                                <div>Cargando...</div>
                            ) : this.state.error ? (
                                <div>{this.state.error}</div>
                            ) : (
                                <GenericTable
                                    columnDefs={this.columnDefs}
                                    rowData={this.state.rowData}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    accessToken: state.RobcodeService.accessToken,
    courses: state.Courses.rowData,
});

const mapDispatchToProps = {
    getCourses,
    deleteCourse,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CoursesIndex));
