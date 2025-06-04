import React, { Component, Fragment } from "react";
import GenericTable from "../../components/agGrid/genericTable";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getProjects, deleteProject } from "../../../reducers/projects/reducer";
import ResourcesRow from "../../components/agGrid/ResourcesRow";
import ActionsRow from "../../components/agGrid/ActionsRow";

class ProjectsIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rowData: [],
            isLoading: true,
            error: null,
        };

        this.columnDefs = [
            { headerName: "Curso", field: "title", },
            { headerName: "Proyecto", field: "body", },
            {
                headerName: "Guía Descargable",
                field: "file",
                cellRenderer: ResourcesRow,
            },
            {
                headerName: "Link Tinkercad",
                field: "link_tinkercad",
                cellRenderer: ResourcesRow,
            },
            {
                headerName: "Video",
                field: "video",
                cellRenderer: ResourcesRow,
            },
        ];
    }

    componentDidMount() {
        this.fetchProjects();
    }

    componentDidUpdate(prevProps) {
        if (this.props.accessToken !== prevProps.accessToken || this.props.projects !== prevProps.projects) {
            this.fetchProjects();
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return nextState.isLoading !== this.state.isLoading ||
            nextState.error !== this.state.error ||
            nextState.rowData !== this.state.rowData;
    }
    async fetchProjects() {
        try {
            this.setState({ isLoading: true, error: null });
            const { access_token } = JSON.parse(this.props.accessToken);
            await this.props.getProjects(access_token);
            this.setState({ rowData: this.props.projects });
        } catch (error) {
            console.error("Error fetching projects: ", error);
            this.setState({ error: "Error al obtener los estudiantes.", rowData: [] });
        } finally {
            this.setState({ isLoading: false });
        }
    }

    render() {
        return (
            <Fragment>
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
    projects: state.Projects.rowData,
});

const mapDispatchToProps = {
    getProjects,
    deleteProject,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProjectsIndex));
