import React, { Component, Fragment } from "react";
import GenericTable from "../../components/agGrid/genericTable";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getBooks, deleteBook } from "../../../reducers/books/reducer";
import ResourcesRow from "../../components/agGrid/ResourcesRow";
import ActionsRow from "../../components/agGrid/ActionsRow";

const eventListeners = {
    studentDeleted: [],
};

class BooksComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rowData: [],
            isLoading: true,
            error: null,
        };

        this.columnDefs = [
            { headerName: "Material", field: "title", flex: 1 },
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
            }
        ];
    }

    componentDidMount() {
        this.fetchBooks();
    }

    componentDidUpdate(prevProps) {
        if (this.props.accessToken !== prevProps.accessToken || this.props.books !== prevProps.books) {
            this.fetchBooks();
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return nextState.isLoading !== this.state.isLoading ||
            nextState.error !== this.state.error ||
            nextState.rowData !== this.state.rowData;
    }
    async fetchBooks() {
        try {
            this.setState({ isLoading: true, error: null });
            const { access_token } = JSON.parse(this.props.accessToken);
            await this.props.getBooks(access_token);
            this.setState({ rowData: this.props.books });
        } catch (error) {
            console.error("Error fetching books: ", error);
            this.setState({ error: "Error al obtener los libros.", rowData: [] });
        } finally {
            this.setState({ isLoading: false });
        }
    }

    render() {
        return (
            <Fragment>
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
    books: state.Books.rowData,
});

const mapDispatchToProps = {
    getBooks,
    deleteBook,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BooksComponent));
