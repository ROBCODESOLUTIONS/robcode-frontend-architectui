// ProjectsComponent.js
import { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { fetchBooks } from "../../../services/ContentService";
import { useAuth } from "../../../context/AuthContext";

import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import ResourcesRow from "../../common/ag-grid/ResourcesRow";

const ProjectsComponent = () => {
  const { authToken } = useAuth();
    const [rowData, setRowData] = useState([]);

    const columns = [
        { headerName: "Material", field: "title", flex: 1 },
        // { headerName: "Body", field: "body", flex: 1 },
        {
            headerName: "Recurso Descargable",
            field: 'file',
            cellRenderer: ResourcesRow,
            flex: 1
          },
          {
            headerName: "Video",
            field: 'video',
            cellRenderer: ResourcesRow,
          },
    ];

    useEffect(() => {
        fetchBooks(authToken.access_token)
            .then(data => setRowData(data))
            .catch(error => console.error('Error loading projects:', error));
    }, [authToken]);

    // const onRowClicked = event => {
    //     const fileUrl = event.data.file;
    //     window.open(fileUrl, "_blank");
    // };

    return (
        <div className="ag-theme-quartz" style={{ height: "70vh", width: "100%", maxHeight: "500px" }}>
            {rowData.length > 0 ? (
                <AgGridReact
                    rowData={rowData}
                    columnDefs={columns}
                    // onRowClicked={onRowClicked}
                    domLayout="autoHeight"
                />
            ) : (
                <p>No se encontraron libros.</p>
            )}
        </div>
    );
};


export default ProjectsComponent;
