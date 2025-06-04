import React, { Fragment } from "react";
import { Animated } from "react-animated-css";

export default class GamesIndex extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            games: {
                "juego-1": {
                    title: "1. El despegue.",
                    body: "<iframe class='phaser-game' src='/games/step-1/index.html' width='100%' style='min-height: 500px' allowFullScreen></iframe>",
                },
                "juego-2": {
                    title: "2. Sensores y el Poder de la Percepción.",
                    body: "<iframe class='phaser-game' src='/games/step-2/index.html' width='100%' style='min-height: 500px' allowFullScreen></iframe>",
                },
                "juego-3": {
                    title: "3. El lenguaje de los Robots.",
                    body: "<iframe class='phaser-game' src='/games/step-3/index.html' width='100%' style='min-height: 500px' allowFullScreen></iframe>",
                },
                "juego-4": {
                    title: "4. Construcción de Robots - Planeta MechaPrime",
                    // title: "4. Construcción de Robots.",
                    body: "<iframe class='phaser-game' src='/games/step-4/index.html' width='100%' style='min-height: 500px' allowFullScreen></iframe>",
                }
            },
            selectedContent: null,
        };

        this.elements = React.createRef();
    }

    handleContentClick = (index) => {
        this.setState({ selectedContent: index }, () => {
            console.log(this.state.selectedContent, index);
        });
    };

    render() {
        return <Fragment>
            <div className="app-page-title mb-4" style={{ margin: "0" }}>
                <div className="page-title-wrapper">
                    <div className="page-title-heading">
                        <div className="page-title-icon">
                            <i className="pe-7s-coffee icon-gradient bg-mean-fruit"></i>
                        </div>
                        <div>
                            <h1>Juegos Interactivos</h1>
                            <div className="page-title-subheading">
                                Accede a nuestras sesiones de juegos interactivos.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-2">
                        {/* Estructura de navegación de Bootstrap */}
                        <div className="h-100 flex-column align-items-stretch pe-4 border-end">
                            <nav className="nav nav-pills flex-column">
                                {this.state.games && typeof this.state.games === 'object' && Object.keys(this.state.games).map((content, index) => (
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
                                            console.log("Index: " + index)
                                            this.handleContentClick(index)
                                        }}
                                        data-id={`content-${index}`}
                                    >
                                        {this.state.games[content]?.title}
                                    </a>
                                ))}
                            </nav>
                        </div>
                    </div>

                    <div className="col-10">
                        <div
                            data-bs-spy="scroll"
                            data-bs-smooth-scroll="true"
                            tabIndex="0"
                        >
                            {Object.keys(this.state.games).map((content, index) => (
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
                                            __html: this.state.games[content]?.body ?? "",
                                        }}
                                    />
                                </Animated>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    }
}