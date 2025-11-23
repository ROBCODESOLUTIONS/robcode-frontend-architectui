import React, { Fragment } from "react";
import { Animated } from "react-animated-css";

export default class GamesIndex extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            games: {
                "juego-1": {
                    title: "1. El despegue.",
                    body:
                        "<iframe class='phaser-game' src='/games/step-1/index.html' width='100%' style='min-height: 500px' allowFullScreen></iframe>",
                },
                "juego-2": {
                    title: "2. Sensores y el Poder de la Percepción.",
                    body:
                        "<iframe class='phaser-game' src='/games/step-2/index.html' width='100%' style='min-height: 500px' allowFullScreen></iframe>",
                },
                "juego-3": {
                    title: "3. El lenguaje de los Robots.",
                    body:
                        "<iframe class='phaser-game' src='/games/step-3/index.html' width='100%' style='min-height: 500px' allowFullScreen></iframe>",
                },
                "juego-4": {
                    title: "4. Construcción de Robots - Planeta MechaPrime",
                    body:
                        "<iframe class='phaser-game' src='/games/step-4/index.html' width='100%' style='min-height: 500px' allowFullScreen></iframe>",
                },
                "juego-5": {
                    title:
                        "5. Circuitos y Energía en la Robótica - Planeta Voltaris",
                    body:
                        "<iframe class='phaser-game' src='/games/step-5/index.html' width='100%' style='min-height: 500px' allowFullScreen></iframe>",
                },
                "juego-6": {
                    title: "6. Inteligencia Artificial y Robótica Autónoma - Planeta Nexa-7",
                    body:
                        "<iframe class='phaser-game' src='/games/step-6/index.html' width='100%' style='min-height: 500px' allowFullScreen></iframe>",
                },
                "juego-7": {
                    title: "7. Exploración del Espacio Profundo",
                    body:
                        "<iframe class='phaser-game' src='/games/step-7/index.html' width='100%' style='min-height: 500px' allowFullScreen></iframe>",
                },
                "juego-8": {
                    title: "8. Ingeniería de Precisión y Fabricación Robótica",
                    body:
                        "<iframe class='phaser-game' src='/games/step-8/index.html' width='100%' style='min-height: 500px' allowFullScreen></iframe>",
                },
                "juego-9": {
                    title: "9. Biomecatrónica y Cibernética",
                    body:
                        "<iframe class='phaser-game' src='/games/step-9/index.html' width='100%' style='min-height: 500px' allowFullScreen></iframe>",
                },
                "juego-10": {
                    title: "10. Materiales Inteligentes y Nanotecnología",
                    body:
                        "<iframe class='phaser-game' src='/games/step-10/index.html' width='100%' style='min-height: 500px' allowFullScreen></iframe>",
                },
                "juego-11": {
                    title: "11. La Singularidad de la IA - Planeta Omega-1",
                    body:
                        "<iframe class='phaser-game' src='/games/step-11/index.html' width='100%' style='min-height: 500px' allowFullScreen></iframe>",
                },
                "juego-12": {
                    title: "12. El Desafío Supremo",
                    body:
                        "<iframe class='phaser-game' src='/games/step-12/index.html' width='100%' style='min-height: 500px' allowFullScreen></iframe>",
                },
                "juego-13": {
                    title: "13. Héroes de TechnoGalaxia",
                    body:
                        "<iframe class='phaser-game' src='/games/step-13/index.html' width='100%' style='min-height: 500px' allowFullScreen></iframe>",
                },
            },
            // Mostrará el primer juego al entrar
            selectedContent: 0,
        };
    }

    handleContentClick = (index) => {
        this.setState({ selectedContent: index });
    };

    render() {
        const gameKeys = Object.keys(this.state.games);
        const selectedKey = gameKeys[this.state.selectedContent];
        const selectedGame = this.state.games[selectedKey];

        return (
            <Fragment>
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
                            <div className="h-100 flex-column align-items-stretch pe-4 border-end">
                                <nav className="nav nav-pills flex-column">
                                    {gameKeys.map((key, idx) => (
                                        <button
                                            type="button"
                                            key={key}
                                            className={
                                                "nav-link " +
                                                (this.state.selectedContent === idx
                                                    ? "active"
                                                    : "text-secondary text-opacity-50")
                                            }
                                            onClick={() => this.handleContentClick(idx)}
                                            data-id={`content-${idx}`}
                                            aria-current={this.state.selectedContent === idx ? "page" : undefined}
                                            style={{ background: "none", border: "none", borderRadius: 0, textAlign: "left", padding: 0, width: "100%" }}
                                        >
                                            {this.state.games[key]?.title}
                                        </button>
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
                                {/* Renderiza solo el contenido del juego seleccionado */}
                                <Animated
                                    animationIn="bounceIn"
                                    animationOut="fadeOut"
                                    isVisible={true}
                                    key={selectedKey}
                                    id={"content-" + this.state.selectedContent}
                                >
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: selectedGame?.body ?? "",
                                        }}
                                    />
                                </Animated>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}
