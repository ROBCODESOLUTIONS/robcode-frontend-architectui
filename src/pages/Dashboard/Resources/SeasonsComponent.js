import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { getSeasons, deleteSeason } from "../../../reducers/seasons/reducer";
import { Animated } from "react-animated-css";

const eventListeners = {
    studentDeleted: [],
};

class SeasonsComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rowData: [],
            isLoading: true,
            error: null,
            selectedContent: null,
        };

        this.elements = React.createRef();
    }

    handleContentClick = (index) => {
        this.setState({ selectedContent: index }, () => {
            console.log(this.state.selectedContent, index);
        });
    };

    componentDidMount() {
        this.fetchSeasons();
    }

    componentDidUpdate(prevProps) {
        if (this.props.accessToken !== prevProps.accessToken || this.props.seasons !== prevProps.seasons) {
            this.fetchSeasons();
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return nextState.isLoading !== this.state.isLoading ||
            nextState.error !== this.state.error ||
            nextState.rowData !== this.state.rowData ||
            nextState.selectedContent !== this.state.selectedContent;
    }
    async fetchSeasons() {
        try {
            this.setState({ isLoading: true, error: null });
            const { access_token } = JSON.parse(this.props.accessToken);
            await this.props.getSeasons(access_token);
            this.setState({ rowData: this.props.seasons });
        } catch (error) {
            console.error("Error fetching seasons: ", error);
            this.setState({ error: "Error al obtener las sesiones digitales.", rowData: [] });
        } finally {
            this.setState({ isLoading: false });
        }
    }

    render() {
        return (
            <Fragment>
                <div className="row">
                    <div className="col-2">
                        {/* Estructura de navegación de Bootstrap */}
                        <div className="h-100 flex-column align-items-stretch pe-4 border-end">
                            <nav className="nav nav-pills flex-column">
                                {this.props.seasons && typeof this.props.seasons === 'object' && Object.keys(this.props.seasons).map((content, index) => (
                                    <a
                                        href="#"
                                        key={index}
                                        className={
                                            "nav-link " +
                                            (this.state.selectedContent == index
                                                ? "active"
                                                : "text-secondary text-opacity-50")
                                        }
                                        onClick={(e) => {
                                            e.preventDefault();
                                            console.log("Index: " +index)
                                            this.handleContentClick(index)
                                        }}
                                        data-id={`content-${index}`}
                                    >
                                        {this.props.seasons[content]?.title}
                                    </a>
                                ))}
                            </nav>
                        </div>
                    </div>

                    <div className="col-8">
                        <div
                            data-bs-spy="scroll"
                            data-bs-target="#navbar-example3"
                            data-bs-smooth-scroll="true"
                            className="scrollspy-example-2"
                            tabIndex="0"
                        >
                            {Object.keys(this.props.seasons).map((content, index) => (
                                <Animated
                                    animationIn="bounceIn"
                                    animationOut="fadeOut"
                                    isVisible={true}
                                    key={index}
                                    id={"content-" + index}
                                    ref={this.elements}
                                    className={`${this.state.selectedContent === index ? "" : "d-none"}`}
                                >
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: this.props.seasons[content]?.body ?? "",
                                        }}
                                    />
                                </Animated>
                            ))}
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    accessToken: state.RobcodeService.accessToken,
    seasons: state.Seasons.seasons,
});

const mapDispatchToProps = {
    getSeasons,
    deleteSeason,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SeasonsComponent));
