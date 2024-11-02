import React, { Fragment, Component } from "react";

import Slider from "react-slick";

import bg1 from "../../../assets/utils/images/originals/login_1.png";
import bg2 from "../../../assets/utils/images/originals/login_2.png";
import bg3 from "../../../assets/utils/images/originals/login_3.png";

import authService from "../../../services/authService";
import {useAuth} from "../../../context/authContext";

import { Col, Row, Button, Form, FormGroup, Label, Input } from "reactstrap";

export default class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    }
  }

  attemptLogin = (email, password) => {
    authService
      .login(email, password)
      .then((response) => {
        const data = response;
        this.authContext.login(data);
        this.authContext.redirect("/pages/about");
      })
      .catch((error) => {
        console.error("Error en la solicitud:", error);
      });
  };

  handleChangeEmail = (e) => {
    this.setState({ email: e.target.value });
  };

  handleChangePassword = (e) => {
    this.setState({ password: e.target.value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.attemptLogin(this.state.email, this.state.password);
  };

  // const { login, authToken } = useAuth();

  render() {
    let settings = {
      dots: true,
      infinite: true,
      speed: 500,
      arrows: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      fade: true,
      initialSlide: 0,
      autoplay: true,
      adaptiveHeight: true,
    };
    return (
      <Fragment>
        <div className="h-100">
          <Row className="h-100 g-0">
            <Col lg="4" className="d-none d-lg-block">
              <div className="slider-light">
                <Slider {...settings}>
                  <div className="h-100 d-flex justify-content-center align-items-center bg-plum-plate">
                    <div className="slide-img-bg"
                      style={{
                        backgroundImage: "url(" + bg1 + ")",
                      }} />
                    <div className="slider-content">
                      <h3>SISTEMA ROBCODE</h3>
                      <p>
                        El SISTEMA ROBCODE, integra Ciencia, Tecnología, Ingeniería, Arte, Matemáticas y Humanidades
                        para crear experiencias educativas innovadoras que preparan a los estudiantes
                        para los desafíos del futuro.
                      </p>
                    </div>
                  </div>
                  <div className="h-100 d-flex justify-content-center align-items-center bg-premium-dark">
                    <div className="slide-img-bg"
                      style={{
                        backgroundImage: "url(" + bg3 + ")",
                      }} />
                    <div className="slider-content">
                      <h3>SISTEMA ROBCODE</h3>
                      <p>
                        El Sistema ROBCODE facilita proyectos educativos que combinan diversas áreas del conocimiento, permitiendo a los estudiantes aplicar habilidades prácticas en situaciones del mundo real.
                      </p>
                    </div>
                  </div>
                  <div className="h-100 d-flex justify-content-center align-items-center bg-sunny-morning">
                    <div className="slide-img-bg opacity-6"
                      style={{
                        backgroundImage: "url(" + bg2 + ")",
                      }} />
                    <div className="slider-content">
                      <h3>SISTEMA ROBCODE</h3>
                      <p>
                        Accede al contenido multimedia, sesiones digitales y libros interactivos del Sistema ROBCODE, diseñados para enriquecer el aprendizaje de robótica y programación.
                      </p>
                    </div>
                  </div>
                </Slider>
              </div>
            </Col>
            <Col lg="8" md="12" className="h-100 d-flex bg-white justify-content-center align-items-center">
              <Col lg="9" md="10" sm="12" className="mx-auto app-login-box">
                <div className="app-logo" />
                <h4 className="mb-0">
                  <div>Bienvenido de vuelta,</div>
                  <span>Por favor ingresa a tu cuenta.</span>
                </h4>
                {/* <h6 className="mt-3">
                  No account?{" "}
                  <a href="https://colorlib.com/" onClick={(e) => e.preventDefault()} className="text-primary">
                    Sign up now
                  </a>
                </h6> */}
                <Row className="divider" />
                <div>
                  <Form onSubmit={this.handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="email">Correo</Label>
                          <Input type="email" name="email" value={this.state.email} onChange={this.handleChangeEmail} id="email" placeholder="Correo aquí..." />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label for="password">Contraseña</Label>
                          <Input type="password" value={this.state.password} onChange={this.handleChangePassword} name="password" id="password" placeholder="Contraseña aquí..." />
                        </FormGroup>
                      </Col>
                    </Row>
                    {/* <FormGroup check>
                      <Input type="checkbox" name="check" id="exampleCheck" />
                      <Label for="exampleCheck" check>
                        Keep me logged in
                      </Label>
                    </FormGroup> */}
                    <Row className="divider" />
                    <div className="d-flex align-items-center">
                      <div className="ms-auto">
                        {/* <a href="https://colorlib.com/" onClick={(e) => e.preventDefault()} className="btn-lg btn btn-link" >
                          Recover Password
                        </a>{" "} */}
                        <Button color="primary" size="lg" type="submit">
                          Ingresar al Sistema
                        </Button>
                      </div>
                    </div>
                  </Form>
                </div>
              </Col>
            </Col>
          </Row>
        </div>
      </Fragment>
    );
  }
}

Login.authContext = useAuth;