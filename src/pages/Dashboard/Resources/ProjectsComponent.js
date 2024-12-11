import React, { Fragment } from "react";
import { connect } from "react-redux";
import { getProjects } from "../../../reducers/projects/reducer";
import ResourcesRow from "../../components/agGrid/ResourcesRow";
import GenericTable from "../../components/agGrid/genericTable";

class ProjectsComponent extends React.Component {
    constructor(props) {
        super(props);

        const { access_token } = JSON.parse(this.props.accessToken)

        this.state = {
            columnDefs: [
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
            ],
            rowData: this.props.projects
        };

        this.props.getProjects(access_token)
            .then(() => {
                console.log("Fetch:", this.props.projects)
            })
            .catch((error) => console.error("Error getting projects ", error));
    }

    render() {
        return <Fragment>
            <GenericTable columnDefs={this.state.columnDefs} rowData={this.state.rowData} />
        </Fragment>
    }
}

const mapStateToProps = (state) => ({
    accessToken: state.RobcodeService.accessToken,
    projects: state.Projects.projects
});

const mapDispatchToProps = {
    getProjects
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectsComponent);