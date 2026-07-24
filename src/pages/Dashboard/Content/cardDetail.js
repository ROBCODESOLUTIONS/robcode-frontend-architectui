import React, { Fragment } from "react";
import { Card, CardBody, CardTitle, CardSubtitle, Button, Row, Col, CardImg } from "reactstrap";
import { Link } from "react-router-dom";

class ContentCardDetail extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            error: null,
            rowData: {},
            defaultWidth: 200,
            defaultHeight: 200,
            defaultImage: 'https://placehold.co/400x200?text=No+Image'
        };

    }

    render() {
        const { link_tinkercad } = this.props.rowData;

        const cardBody = (
            <CardBody>
                <CardImg
                    top
                    maxwidth={(this.props.rowData.width || this.state.defaultWidth) + "px"}
                    maxheight={(this.props.rowData.height || this.state.defaultHeight) + "px"}
                    src={this.props.rowData.file || this.state.defaultImage}
                    alt={this.props.rowData.title || "Card image"}
                    className="mx-1 my-1"
                />
                <CardTitle className="my-1 mb-0 text-center">
                    <h3 className="card-title">
                        {this.props.rowData.title}
                    </h3>
                </CardTitle>
                <CardSubtitle className="mb-2 text-muted">
                    {this.props.rowData.subtitle}
                </CardSubtitle>
            </CardBody>
        );

        return (
            <Fragment>
                <div className={this.props.className || ''}>
                    <Card>
                        {link_tinkercad ? (
                            <a href={link_tinkercad} target="_blank" rel="noreferrer">
                                {cardBody}
                            </a>
                        ) : (
                            <Link to={this.props.linkPath || ""}>
                                {cardBody}
                            </Link>
                        )}
                    </Card>
                </div>
            </Fragment>
        );
    }
}

export default ContentCardDetail;