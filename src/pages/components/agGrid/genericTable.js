import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

export default class GenericTable extends Component {
    constructor(props) {
        super(props);
        console.log(props)

        this.state = {
            columnDefs: this.props.columnDefs,
            rowData: this.props.rowData,
            defaultColDef: {
                // sortable: true,
                // resizable: true,
                // filter: true,
                // floatingFilter: true,
                // floatingFilterComponentParams: {
                //     debounceMs: 1000,
                // },
                cellStyle: {
                    'textAlign': 'left',
                    'padding': '5px',
                    'fontSize': '14px',
                },
            },
        };
    }

    render() {
        return (
            <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
                <AgGridReact
                    columnDefs={this.state.columnDefs}
                    rowData={this.state.rowData}
                    defaultColDef={this.state.defaultColDef}
                />
            </div>
        );
    }
}