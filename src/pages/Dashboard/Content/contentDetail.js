import React, { Fragment } from "react";
import { getContentDetail } from "../../../reducers/content/reducer";
import { withRouter } from "react-router-dom/cjs/react-router-dom";
import { connect } from "react-redux";
import ContentRenderer from "./ContentRenderer";
import styles from './ContentDetail.module.css';
class ContentDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rowData: [],
            isLoading: true,
            error: null,
            content: {},
            children: [],
            selectedContent: 0
        };
    }

    componentDidMount() {
        this.fetchContent();
    }

    componentDidUpdate(prevProps) {
        if (
            this.props.accessToken !== prevProps.accessToken ||
            this.props.content !== prevProps.content ||
            this.props.children !== prevProps.children
        ) {
            this.fetchContent();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            nextState.isLoading !== this.state.isLoading ||
            nextState.error !== this.state.error ||
            nextState.content !== this.state.content ||
            nextState.children !== this.state.children ||
            nextState.selectedContent !== this.state.selectedContent
        );
    }

    beforeUnmount() {

    }

    fetchContent() {
        const { id } = this.props.match.params;
        console.log('ID:', id);

        // Buscar padre en lista principal (cache)
        const parent = this.props.content?.find(element =>
            parseInt(element.id) === parseInt(id)
        );
        console.log('Padre encontrado:', parent);

        this.setState({
            content: parent || {},
            isLoading: false
        });

        // Si no hay hijos cargados, pedir a API
        // if (!this.props.children || this.props.children.length === 0) {
        this.fetchContentDetail(id);
        // }
    }

    async fetchContentDetail(id) {
        if (id) {
            try {
                this.setState({ isLoading: true, error: null });
                const { access_token } = JSON.parse(this.props.accessToken);
                await this.props.getContentDetail(access_token, id);

                // Usar children del Redux store
                this.setState({
                    children: this.props.children || []
                });
            } catch (error) {
                console.error("Error fetching content: ", error);
                this.setState({
                    error: "Error al obtener los hijos del contenido.",
                });
            } finally {
                this.setState({ isLoading: false });
            }
        }
    }

    handleContentClick = (index) => {
        this.setState({ selectedContent: index });
    };

    render() {
        const { children, accessToken } = this.props;
        const { selectedContent } = this.state;

        let userRole = 'guest';
        try {
            const tokenData = JSON.parse(accessToken);
            if (tokenData?.user?.roles?.[0]?.name) {
                userRole = tokenData.user.roles[0].name;
            }
        } catch (e) {
            console.warn('Error parsing accessToken:', e);
        }

        const isStudent = userRole === 'Student';

        // Filtrar PDFs para estudiantes
        const visibleChildren = children.filter(child =>
            !(isStudent && child.type === 'pdf')
        );

        const activeChildIndex = Math.min(selectedContent, visibleChildren.length - 1);
        const activeChild = visibleChildren[activeChildIndex];

        return (
            <Fragment>
                <div className="app-page-title mb-4" style={{ margin: "0" }}>
                    <div className="page-title-wrapper">
                        <div className="page-title-heading">
                            <div className="page-title-icon">
                                <i className="pe-7s-coffee icon-gradient bg-mean-fruit"></i>
                            </div>
                            <div>
                                <h1>{this.state.content.title || "Título no disponible"}</h1>
                                <div
                                    className="page-title-subheading"
                                    dangerouslySetInnerHTML={{ __html: this.state.content.body || '' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container">
                    <div className="row">
                        {/* Navegación lateral */}
                        <div className="col-lg-2 col-md-3 col-sm-12">
                            <div className="flex-column align-items-stretch pe-4 border-end">
                                <nav className="nav nav-pills flex-column">
                                    {visibleChildren.map((child, index) => (
                                        <a
                                            href="#"
                                            key={child.id}
                                            className={`nav-link ${selectedContent === index ? "active" : "text-secondary text-opacity-50"}`}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                this.handleContentClick(index);
                                            }}
                                        >
                                            {child.title}
                                        </a>
                                    ))}
                                </nav>
                            </div>
                        </div>

                        {/* Contenido principal */}
                        <div className="contentContainer col-lg-10 col-md-9 col-sm-12">
                            {this.state.isLoading ? (
                                <div>Cargando...</div>
                            ) : this.state.error ? (
                                <div className="alert alert-danger">{this.state.error}</div>
                            ) : activeChild ? (
                                <ContentRenderer
                                    key={`child-${this.state.selectedContent}-${activeChild.id}`}
                                    content={activeChild}
                                />
                            ) : (
                                <div>No hay contenido disponible</div>
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
    content: state.Content.rowData,      // Lista principal (padres)
    children: state.Content.children,    // Hijos del detalle
    error: state.Content.error,
});

const mapDispatchToProps = {
    getContentDetail,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ContentDetail));
