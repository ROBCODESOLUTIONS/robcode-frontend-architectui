import React, { Fragment } from "react";
import GenericTable from "../../components/agGrid/genericTable";
import ResourcesRow from "../../components/agGrid/ResourcesRow";

export default class MaterialIndex extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            columnDefs: [
                { headerName: "Descripción", field: "descripcion", flex: 1, },
                { headerName: "Link teoricos", field: "link_teorico", flex: 1, cellRenderer: ResourcesRow },
                { headerName: "Videos de apoyo", field: "video_apoyo", flex: 1, cellRenderer: ResourcesRow }
            ],
            rowData: [
                { descripcion: "Links teóricos y videos grado SEXTO", link_teorico: "https://riunet.upv.es/bitstream/10251/174666/1/Pascual%20-%20Diseno%20y%20construccion%20de%20un%20brazo%20robotico%20controlado%20mediante%20Arduino.pdf", video_apoyo: "https://www.youtube.com/watch?v=GwQ7WoC_pIo", },
                { descripcion: "Links teóricos y videos grado SÉPTIMO", link_teorico: "https://riunet.upv.es/bitstream/10251/174666/1/Pascual%20-%20Diseno%20y%20construccion%20de%20un%20brazo%20robotico%20controlado%20mediante%20Arduino.pdf", video_apoyo: "https://www.youtube.com/watch?v=GwQ7WoC_pIo", },
                { descripcion: "Links teóricos y videos grado OCTAVO", link_teorico: "https://todosobretrafico.files.wordpress.com/2014/03/semaforos.pdf", video_apoyo: "https://www.youtube.com/watch?v=shvSliqzcCE", },
                { descripcion: "Links teóricos y videos grado NOVENO", link_teorico: "https://todosobretrafico.files.wordpress.com/2014/03/semaforos.pdf", video_apoyo: "https://www.youtube.com/watch?v=shvSliqzcCE", },
                { descripcion: "Links teóricos y videos grado DÉCIMO", link_teorico: "https://dspace.ups.edu.ec/bitstream/123456789/10401/1/UPS-GT001444.pdf", video_apoyo: "https://www.youtube.com/watch?v=NMhn1rJv_jg&t=8s", },
                { descripcion: "Links teóricos y videos grado ONCE", link_teorico: "https://www.redalyc.org/pdf/852/85200804.pdf", video_apoyo: "https://www.youtube.com/watch?v=RzEjqJHW-NU", }
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
                            <h1>Material de apoyo</h1>
                            <div className="page-title-subheading">
                                Aquí puede consultar los materiales de apoyo disponibles para estudiantes, según el curso.
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