import React, { Component, Fragment } from "react";
import GenericTable from "../../components/agGrid/genericTable";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getTeachers, deleteTeacher } from "../../../reducers/teachers/reducer";
import ResourcesRow from "../../components/agGrid/ResourcesRow";
import ActionsRow from "../../components/agGrid/ActionsRow";

const eventListeners = {
    studentDeleted: [],
};

class TeachersIndex extends Component {
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
                field: "entity_name",
                valueGetter: (params) => {
                    return params.data.teacher.classrooms[0]?.entity.name ?? "No asignada.";
                },
                flex: 1,
            },
            {
                headerName: "Clases",
                field: "teacher.classrooms",
                valueGetter: (params) => {
                  let names = "";
                  for (const key in params.data.teacher.classrooms) {
                    if (Object.hasOwnProperty.call(params.data.teacher.classrooms, key)) {
                      const element = params.data.teacher.classrooms[key];
                      names += element.name + ", ";
                    }
                  }
                  return names.substring(0, names.length - 2);
                },
                flex: 1,
              },
            {
                headerName: 'Acciones', field: 'id',
                cellRenderer: (params) =>
                    ActionsRow({
                        value: params.value,
                        eventName: "teacherDeleted",
                        deleteDispatcher: this.props.deleteEntity,
                        authToken: JSON.parse(this.props.accessToken).access_token,
                        eventListeners,
                        editUrl: `/pages/dashboard/edit/teachers/${params.value}/`
                    }),
            }
        ]
    }

    componentDidMount() {
        this.fetchTeachers();
    }

    componentDidUpdate(prevProps) {
        if (this.props.accessToken !== prevProps.accessToken || this.props.teachers !== prevProps.teachers) {
            this.fetchTeachers();
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return nextState.isLoading !== this.state.isLoading ||
            nextState.error !== this.state.error ||
            nextState.rowData !== this.state.rowData;
    }
    async fetchTeachers() {
        try {
            this.setState({ isLoading: true, error: null });
            const { access_token } = JSON.parse(this.props.accessToken);
            await this.props.getTeachers(access_token);
            this.setState({ rowData: this.props.teachers });
        } catch (error) {
            console.error("Error fetching teachers: ", error);
            this.setState({ error: "Error al obtener los profesores.", rowData: [] });
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
                                <h1>Profesores</h1>
                                <div className="page-title-subheading">
                                    <Link to={"/pages/dashboard/create/teacher"} className="btn btn-info my-2">
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
    teachers: state.Teachers.rowData,
});

const mapDispatchToProps = {
    getTeachers,
    deleteTeacher,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TeachersIndex));
