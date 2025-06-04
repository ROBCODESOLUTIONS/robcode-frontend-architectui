import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import Swal from "sweetalert2";

import { createEntity, getEntities, updateEntity } from "../../../reducers/entities/reducer";

import defaultImageUrl from "../../../assets/utils/images/originals/interconnected.jpg";

class EntitiesCreateUpdate extends React.Component {

    constructor(props) {
        super(props);

        const { access_token } = JSON.parse(this.props.accessToken)

        this.state = {
            entity: {
                id: '',
                name: "",
                image: defaultImageUrl,
                description: "",
            },
            isLoading: false,
            rowData: [],
        };

        const { match } = this.props;
        console.log(match.params.entityId)
        if (match.params.entityId) {
            this.state.entity.id = match.params.entityId;
        }
    }

    componentDidMount() {
        console.log(this.props.entities.length === 0, this.props.entities)
        if (this.props.entities.length === 0) {
            this.fetchEntities();
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.accessToken !== prevProps.accessToken || this.props.entities !== prevProps.entities) {
            this.fetchEntities();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.loading !== this.state.loading ||
            nextState.error !== this.state.error ||
            nextState.rowData !== this.state.rowData;
    }

    async fetchEntities() {
        try {
            this.setState({ loading: true, error: null });
            const { access_token } = JSON.parse(this.props.accessToken);
            await this.props.getEntities(access_token);
            const matchedEntity = this.props.entities.find(entity => entity.id.toString() === this.state.entity.id);
            if (matchedEntity) {
                this.setState({ entity: matchedEntity, entities: this.props.entities });
            }
        } catch (error) {
            console.error("Error fetching entities: ", error);
            this.setState({ error: "Error al obtener las entidades.", rowData: [] });
        } finally {
            this.setState({ loading: false });
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
            this.setState({ entity: { ...this.state.entity, image: defaultImageUrl } })
        }
    };


    onSubmitForm = (e) => {
        e.preventDefault();
        if (!this.state.entity.name || !this.state.entity.image) {
            console.error("Form Data:", this.state.entity);
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

        if (this.state.entity.id) {
            updateEntity(this.state.access_token, data, this.state.entity.id);
        } else {
            createEntity(this.state.access_token, data);
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
                                {(this.state.entity.id.length === '' ? 'Crear nueva' : 'Editar')} entidad
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
                                            onChange={(e) => this.handleFileUploadChange(e)}
                                            disabled={this.state.isLoading}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="description">Descripción</label>
                                        <textarea
                                            type="text"
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
    getEntities
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EntitiesCreateUpdate));

