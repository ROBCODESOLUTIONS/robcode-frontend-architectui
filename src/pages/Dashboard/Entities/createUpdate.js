import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Swal from "sweetalert2";

import { createEntity, getEntities, updateEntity } from "../../../reducers/entities/reducer";

import defaultImageUrl from "../../../assets/utils/images/originals/interconnected.jpg";

class EntitiesCreateUpdate extends React.Component {

    constructor(props) {
        super(props);

        const { access_token } = JSON.parse(this.props.accessToken);

        this.state = {
            entity: {
                id: '',
                name: "",
                image: defaultImageUrl,
                description: "",
            },
            isLoading: false,
            error: null,
        };

        const { match } = this.props;
        if (match.params.entityId) {
            this.state.entity.id = match.params.entityId;
        }
    }

    componentDidMount() {
        if (this.props.entities.length === 0) {
            this.fetchEntities();
        } else {
            this.populateEntityFromProps();
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.accessToken !== prevProps.accessToken || this.props.entities !== prevProps.entities) {
            this.fetchEntities();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.isLoading !== this.state.isLoading ||
            nextState.error !== this.state.error ||
            nextState.entity !== this.state.entity;
    }

    async fetchEntities() {
        try {
            this.setState({ isLoading: true, error: null });
            const { access_token } = JSON.parse(this.props.accessToken);
            await this.props.getEntities(access_token);
            this.populateEntityFromProps();
        } catch (error) {
            console.error("Error fetching entities: ", error);
            this.setState({ error: "Error al obtener las entidades." });
        } finally {
            this.setState({ isLoading: false });
        }
    }

    populateEntityFromProps() {
        if (this.state.entity.id) {
            const matchedEntity = this.props.entities.find(entity => entity.id.toString() === this.state.entity.id);
            if (matchedEntity) {
                this.setState({ entity: matchedEntity });
            }
        }
    }

    handleFileUploadChange = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            this.setState({ entity: { ...this.state.entity, image: reader.result } });
        };

        if (file) {
            reader.readAsDataURL(file);
        } else {
            this.setState({ entity: { ...this.state.entity, image: defaultImageUrl } });
        }
    };

    onSubmitForm = async (e) => {
        e.preventDefault();
        const { access_token } = JSON.parse(this.props.accessToken);

        if (!this.state.entity.name || !this.state.entity.image) {
            Swal.fire({
                title: "Error",
                icon: "error",
                text: `Ha ocurrido un error a la hora de obtener los datos del formulario,
                valida que todos los campos hayan sido diligenciados correctamente.`,
            });
            return;
        }
        this.setState({ isLoading: true });
        const data = {
            name: this.state.entity.name,
            image: this.state.entity.image,
            description: this.state.entity.description ?? "",
        };

        try {
            if (this.state.entity.id) {
                await this.props.updateEntity(access_token, data, this.state.entity.id);
            } else {
                await this.props.createEntity(access_token, data);
            }
            // Recargar entidades y navegar tras éxito
            await this.props.getEntities(access_token);
            this.props.history.push("/pages/dashboard/entities");
        } catch (err) {
            Swal.fire({
                title: "Error",
                icon: "error",
                text: "No se pudo guardar la entidad.",
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
                            <Link to={"/pages/dashboard/entities"} className="">
                                <i className="pe-7s-angle-left-circle icon-gradient bg-mean-fruit"></i>
                            </Link>
                        </div>
                        <div>
                            <h1>Entidades</h1>
                            <div className="page-title-subheading">
                                {this.state.entity.id ? 'Editar' : 'Crear nueva'} entidad
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container-fluid my-2 ">
                <div className="row">
                    <div className="col-12">
                        <div className="main-card mb-3 card">
                            <div className="card-body">
                                <img
                                    src={this.state.entity.image}
                                    alt={`Logo ${this.state.entity.name}`}
                                    style={{ width: 300, height: 200 }}
                                    className="my-2"
                                />
                                <form onSubmit={this.onSubmitForm} encType="multipart/form-data" className="row">
                                    <div className="form-group">
                                        <label htmlFor="name">Nombre</label>
                                        <input
                                            type="text"
                                            placeholder="Nombre"
                                            className="form-control my-2"
                                            name="name"
                                            autoComplete="off"
                                            value={this.state.entity.name}
                                            onChange={(e) => this.setState({ entity: { ...this.state.entity, name: e.target.value } })}
                                            disabled={this.state.isLoading}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="image">Imagen</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            placeholder="Imagen"
                                            className="form-control my-2"
                                            name="image"
                                            id="image"
                                            onChange={this.handleFileUploadChange}
                                            disabled={this.state.isLoading}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="description">Descripción</label>
                                        <textarea
                                            placeholder="Descripción"
                                            className="form-control my-2"
                                            name="description"
                                            autoComplete="off"
                                            value={this.state.entity.description}
                                            onChange={(e) => this.setState({ entity: { ...this.state.entity, description: e.target.value } })}
                                            disabled={this.state.isLoading}
                                        />
                                    </div>
                                    <div className="col-12">
                                        <button
                                            className="btn btn-outline-primary my-2"
                                            type="submit"
                                            disabled={this.state.isLoading}
                                        >
                                            {this.state.entity.id ? "Actualizar" : "Crear "}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    }
}
const mapStateToProps = (state) => ({
    accessToken: state.RobcodeService.accessToken,
    entities: state.Entities?.rowData ?? [],
});

const mapDispatchToProps = {
    getEntities,
    createEntity,
    updateEntity,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EntitiesCreateUpdate));
