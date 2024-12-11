import React, { Fragment } from "react";
const versionApp = process.env.REACT_APP_VERSION

export default class HomeIndex extends React.Component {
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
            ],
            versionApp
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
                            <h1>Inicio</h1>
                            <div className="page-title-subheading">
                                Bienvenido al sistema Robcode, el cual es un sistema de gestión de cursos de Robótica.
                                <br />
                                Aquí podrás ver todas las actividades que se realizaron en los cursos, así como las
                                actividades que se realizaron para los estudiantes.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="card mt-5">
                            <div className="card-body">
                                <h5 className="card-title fw-semibold mb-4">Acerca de</h5>
                                <p>Versión {this.state.versionApp}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    }
}