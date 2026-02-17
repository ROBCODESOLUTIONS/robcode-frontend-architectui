
import React, { Fragment } from "react";
import { Card, CardBody } from "reactstrap";
import { getContentSections, deleteContent } from "../../../reducers/content/reducer";
import { withRouter } from "react-router-dom/cjs/react-router-dom";
import { connect } from "react-redux";
import ContentCardDetail from "./cardDetail";

class ContentIndex extends React.Component {
    constructor(props) {
        super(props);
        // const { user } = JSON.parse(this.props.accessToken);
        this.state = { rowData: [], isLoading: true, error: null };
    }

    componentDidMount() {
        this.fetchContent();
    }

    componentDidUpdate(prevProps) {
        if (
            this.props.accessToken !== prevProps.accessToken ||
            this.props.books !== prevProps.books
        ) {
            this.fetchContent();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            nextState.isLoading !== this.state.isLoading ||
            nextState.error !== this.state.error ||
            nextState.rowData !== this.state.rowData
        );
    }

    async fetchContent() {
        try {
            this.setState({ isLoading: true, error: null });
            const { access_token } = JSON.parse(this.props.accessToken);
            await this.props.getContentSections(access_token, 16);
        } catch (error) {
            console.error("Error fetching content: ", error);
            this.setState({
                error: "Error al obtener el contenido educativo.",
                rowData: [],
            });
        } finally {
            this.setState({ isLoading: false });
        }
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
                            <h1>Contenido Educativo</h1>
                            <div className="page-title-subheading">
                                Aquí puede consultar los recursos didácticos disponibles, según el curso.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="row">
                    {
                        this.props.content.map((element) => {
                            return <ContentCardDetail key={element.id} className="col-5 my-3 mx-auto" linkPath={`/pages/dashboard/content/detail/${element.id}`} rowData={element}/>
                        })
                    }
                </div>
            </div>
        </Fragment>
    }
}

const mapStateToProps = (state) => ({
    accessToken: state.RobcodeService.accessToken,
    content: state.Content.rowData,
});

const mapDispatchToProps = {
    getContentSections,
    deleteContent,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ContentIndex));