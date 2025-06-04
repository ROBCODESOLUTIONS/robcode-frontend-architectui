import React, { Component, Fragment } from "react";
import GenericTable from "../../components/agGrid/genericTable";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getStudents, deleteStudent } from "../../../reducers/students/reducer";
import ResourcesRow from "../../components/agGrid/ResourcesRow";
import ActionsRow from "../../components/agGrid/ActionsRow";

const eventListeners = {
    studentDeleted: [],
};

class StudentsIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rowData: [],
            isLoading: true,
            error: null,
        };
        this.columnDefs = [
            { headerName: "Nombre", field: "name", flex: 1 },
            { headerName: "Correo", field: "email", flex: 1 },
            {
                headerName: "Institución",
                field: "student.classrooms.entity.name",
                flex: 1,
            },
            { headerName: "Clase", field: "student.classrooms.name", flex: 1 },
            {
                headerName: 'Acciones', field: 'id',
                cellRenderer: (params) =>
                    ActionsRow({
                        value: params.value,
                        eventName: "studentDeleted",
                        deleteDispatcher: this.props.deleteEntity,
                        authToken: JSON.parse(this.props.accessToken).access_token,
                        eventListeners,
                        editUrl: `/pages/dashboard/edit/students/${params.value}/`
                    }),
            }
        ]
    }

    componentDidMount() {
        this.fetchStudents();
    }

    componentDidUpdate(prevProps) {
        if (this.props.accessToken !== prevProps.accessToken || this.props.students !== prevProps.students) {
            this.fetchStudents();
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return nextState.isLoading !== this.state.isLoading ||
            nextState.error !== this.state.error ||
            nextState.rowData !== this.state.rowData;
    }
    async fetchStudents() {
        try {
            this.setState({ isLoading: true, error: null });
            const { access_token } = JSON.parse(this.props.accessToken);
            await this.props.getStudents(access_token);
            this.setState({ rowData: this.props.students });
        } catch (error) {
            console.error("Error fetching students: ", error);
            this.setState({ error: "Error al obtener los estudiantes.", rowData: [] });
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
                                <h1>Estudiantes</h1>
                                <div className="page-title-subheading">
                                    <Link to={"/pages/dashboard/create/student"} className="btn btn-info my-2">
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
    students: state.Students.rowData,
});

const mapDispatchToProps = {
    getStudents,
    deleteStudent,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StudentsIndex));
