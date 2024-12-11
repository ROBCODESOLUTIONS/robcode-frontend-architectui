import React, { Fragment } from "react";
import GenericTable from "../../components/agGrid/genericTable";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getEntities, deleteEntity } from "../../../reducers/entities/reducer";
import ResourcesRow from "../../components/agGrid/ResourcesRow";
import ActionsRow from "../../components/agGrid/ActionsRow";

const eventListeners = {
    entityDeleted: [],
};

class EntitiesIndex extends React.Component {
    constructor(props) {
        super(props);

        const { access_token } = JSON.parse(this.props.accessToken)
        console.log(access_token)

        this.state = {
            columnDefs: [
                { headerName: '#', field: 'id' },
                { headerName: 'Nombre', field: 'name' },
                { headerName: 'Logo', field: 'image', cellRenderer: ResourcesRow },
                {
                    headerName: 'Acciones', field: 'id', 
                    cellRenderer: (params) =>
                        ActionsRow({
                            value: params.value,
                            eventName: "entityDeleted",
                            deleteDispatcher: null,
                            authToken: access_token,
                            eventListeners,
                            editUrl: `/pages/entities/${params.value}/edit`
                        }),
                }
            ],
            rowData: this.props.entities
        };

        this.props.getEntities(access_token)
            .then(() => {
                console.log(this.props.entities)
            })
            .catch((error) => console.error("Error getting entities ", error));
    }

    render() {
        return <Fragment>
            <div className="app-page-title mb-4" style={{ margin: "0" }}>
                <div className="page-title-wrapper">
                    <div className="page-title-heading">
                        <div className="page-title-icon">
                            <i className="pe-7s-culture icon-gradient bg-mean-fruit"></i>
                        </div>
                        <div>
                            <h1>Entidades</h1>
                            <div className="page-title-subheading">
                                <Link to={"/pages/dashboard/create/entity"} className="btn btn-info my-2">
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
                        <GenericTable columnDefs={this.state.columnDefs} rowData={this.state.rowData} />
                    </div>
                </div>
            </div>
        </Fragment>
    }
}

const mapStateToProps = (state) => ({
    accessToken: state.RobcodeService.accessToken,
    entities: state.Entities.entities
});

const mapDispatchToProps = {
    getEntities,
    deleteEntity
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EntitiesIndex));