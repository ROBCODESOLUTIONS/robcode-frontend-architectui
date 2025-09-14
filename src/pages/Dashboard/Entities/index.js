import React, { Component, Fragment } from "react";
import GenericTable from "../../components/agGrid/genericTable";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getEntities, deleteEntity } from "../../../reducers/entities/reducer";
import ResourcesRow from "../../components/agGrid/ResourcesRow";
import ActionsRow from "../../components/agGrid/ActionsRow";

const eventListeners = {
    entityDeleted: [],
};

class EntitiesIndex extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rowData: [],
            isLoading: true,
            error: null,
        };

        this.columnDefs = [
            { headerName: '#', field: 'id' },
            { headerName: 'Nombre', field: 'name' },
            { headerName: 'Logo', field: 'image', cellRenderer: ResourcesRow },
            {
                headerName: 'Acciones', field: 'id',
                cellRenderer: (params) =>
                    ActionsRow({
                        value: params.value,
                        eventName: "entityDeleted",
                        deleteDispatcher: this.props.deleteEntity,
                        authToken: JSON.parse(this.props.accessToken).access_token,
                        eventListeners,
                        editUrl: `/pages/dashboard/edit/entities/${params.value}/`
                    }),
            }
        ];
    }

    componentDidMount() {
        this.fetchEntities();
    }

    componentDidUpdate(prevProps) {
        if (this.props.accessToken !== prevProps.accessToken || this.props.entities !== prevProps.entities) {
            this.fetchEntities();
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return nextState.isLoading !== this.state.isLoading ||
            nextState.error !== this.state.error ||
            nextState.rowData !== this.state.rowData;
    }
    async fetchEntities() {
        try {
            this.setState({ isLoading: true, error: null });
            const { access_token } = JSON.parse(this.props.accessToken);
            await this.props.getEntities(access_token);
            this.setState({ rowData: this.props.entities });
        } catch (error) {
            console.error("Error fetching entities: ", error);
            this.setState({ error: "Error al obtener las entidades.", rowData: [] });
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
    entities: state.Entities.rowData,
});

const mapDispatchToProps = {
    getEntities,
    deleteEntity,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EntitiesIndex));
