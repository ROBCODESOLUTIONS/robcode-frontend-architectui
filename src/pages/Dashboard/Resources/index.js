import React, { Fragment } from "react";
import TabsComponent from './TabsComponent'


export default class ResourcesIndex extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
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
                            <h1>Recursos</h1>
                            <div className="page-title-subheading">
                                Aquí puede consultar los recursos didácticos disponibles, según el curso.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <TabsComponent />
                    </div>
                </div>
            </div>
        </Fragment>
    }
}