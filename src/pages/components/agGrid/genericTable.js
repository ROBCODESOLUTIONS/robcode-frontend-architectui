import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";

class GenericTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            columnDefs: this.props.columnDefs,
            defaultColDef: {
                cellStyle: {
                    'textAlign': 'left',
                    'padding': '5px',
                    'fontSize': '14px',
                },
            },
            rowData: this.props.rowData
        };

        console.log(this.props.rowData, this.state)
    }

    componentDidUpdate(prevProps) {
      if (this.props.rowData !== prevProps.rowData) {
        this.setState({rowData: this.props.rowData})
      }
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

const mapStateToProps = (state) => ({
    accessToken: state.RobcodeService.accessToken,
});

const mapDispatchToProps = {
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GenericTable));
