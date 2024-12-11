import React, { Fragment } from "react";
import GenericTable from "../../components/agGrid/genericTable";
import { Link } from "react-router-dom";

export default class TeachersIndex extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            columnDefs: [
                { headerName: 'Make', field: 'make' },
                { headerName: 'Model', field: 'model' },
                { headerName: 'Price', field: 'price' }
            ],
            rowData: [
                { make: 'Toyota', model: 'Celica', price: 35000 },
                { make: 'Ford', model: 'Mondeo', price: 32000 },
                { make: 'Porsche', model: 'Boxter', price: 72000 }
            ]
        };
    }

    render() {
        return <Fragment>
            <div className="app-page-title mb-4" style={{ margin: "0" }}>
                <div className="page-title-wrapper">
                    <div className="page-title-heading">
                        <div className="page-title-icon">
                            <i className="pe-7s-coffee icon-gradient bg-mean-fruit"></i>
                        </div>
                        <div>
                            <h1>Profesores</h1>
                            <div className="page-title-subheading">
                                <Link to={"/pages/dashboard/teachers/create"} className="btn btn-info my-2">
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