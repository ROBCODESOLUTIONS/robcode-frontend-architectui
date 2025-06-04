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
                { descripcion: "Links teóricos y videos Grado SEXTO", link_teorico: "https://www.automatismosglobal.com/controles-de-acceso/que-es-una-talanquera-vehicular-y-como-funciona/?srsltid=AfmBOoqme6csiEWscaYMqZV6KhixSUZ9c2Qxk0AXGBJYbgXCqkAo8v5r", video_apoyo: "https://www.youtube.com/watch?v=0y24vQyj1Qk", },
                { descripcion: "Links teóricos y videos Grado SÉPTIMO", link_teorico: "https://www.wenglor.com/es/Principio-de-funcionamiento-y-tecnologia-de-un-sensor-de-ultrasonidos/s/Funktionsprinzip+und+Technologie+eines+Ultraschall-Sensors?BranchenundIndustrienlinks=%3A1&BranchenundIndustrienrechts=%3A1", video_apoyo: "https://www.youtube.com/watch?v=ouZ9nDQoczE", },
                { descripcion: "Links teóricos y videos Grado OCTAVO", link_teorico: "https://latam.kaspersky.com/resource-center/preemptive-safety/smart-home-security?srsltid=AfmBOorx7ww45T2mEX82ICwGuRHQpCw_HK1CiIXFj8lH0yyv_DY7vsA7", video_apoyo: "https://www.youtube.com/watch?v=iWWGn2Yi1Ek", },
                { descripcion: "Links teóricos y videos Grado NOVENO", link_teorico: "https://www.automatizacionparatodos.com/sensor-de-humedad-de-suelo-con-arduino/", video_apoyo: "https://www.youtube.com/watch?v=gfY_il4CW_M", },
                { descripcion: "Links teóricos y videos Grado DÉCIMO", link_teorico: "https://tecnopatafisica.com/tecno3eso/teoria/robotica/104-arduino-sensor-infrarrojos-para-robot-siguelineas", video_apoyo: "https://www.youtube.com/watch?v=p88E8GOHzxQ ", },
                { descripcion: "Links teóricos y videos Grado ONCE", link_teorico: "https://as.com/meristation/2018/04/11/betech/1523477857_869374.html", video_apoyo: "https://www.youtube.com/watch?v=Zd1dugifvOo&t=20s ", }
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