import React, { Fragment } from "react";
import { connect } from "react-redux";
import { withRouter, Redirect } from "react-router-dom";
import { logout } from "../../../../reducers/RobcodeService";

import {
  DropdownToggle,
  DropdownMenu,
  Button,
  UncontrolledButtonDropdown,
} from "reactstrap";

import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import 'react-toastify/dist/ReactToastify.css';
import city3 from "../../../../assets/utils/images/dropdown-header/city3.jpg";
import avatar1 from "../../../../assets/utils/images/avatars/guest.png";

class UserBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      user: {},
    };
  }

  handleLogout = () => {
    this.props.logout();
    this.props.history.push("/pages/login");
  };

  render() {
    const { accessToken } = this.props;
    if (!accessToken) {
      return <Redirect to="/pages/login" />;
    } else {
      const { user } = JSON.parse(accessToken);
      this.state.user = user;
    }

    return (
      <Fragment>
        <div className="header-btn-lg pe-0">
          <div className="widget-content p-0">
            <div className="widget-content-wrapper">
              <div className="widget-content-left">
                <UncontrolledButtonDropdown>
                  <DropdownToggle color="link" className="p-0">
                    <img width={42} className="rounded-circle" src={avatar1} alt="" />
                    <FontAwesomeIcon
                      className="ms-2 opacity-8"
                      icon={faAngleDown}
                    />
                  </DropdownToggle>
                  <DropdownMenu end className="rm-pointers dropdown-menu-lg">
                    <div className="dropdown-menu-header">
                      <div className="dropdown-menu-header-inner bg-info">
                        <div className="menu-header-image opacity-2"
                          style={{
                            backgroundImage: "url(" + city3 + ")",
                          }} />
                        <div className="menu-header-content text-start">
                          <div className="widget-content p-0">
                            <div className="widget-content-wrapper">
                              <div className="widget-content-left me-3">
                                <img width={42} className="rounded-circle" src={avatar1} alt="" />
                              </div>
                              <div className="widget-content-left">
                                <div className="widget-heading">
                                  {this.state.user.name}
                                </div>
                                <div className="widget-subheading opacity-8">
                                  {this.state.user.email}
                                </div>
                              </div>
                              <div className="widget-content-right me-2">
                                <Button className="btn-pill btn-shadow btn-shine" color="focus" onClick={this.handleLogout}>
                                  Logout
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DropdownMenu>
                </UncontrolledButtonDropdown>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  accessToken: state.RobcodeService.accessToken,
});

const mapDispatchToProps = {
  logout
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserBox));