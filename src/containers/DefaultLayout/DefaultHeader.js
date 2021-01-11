import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Badge, UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem } from 'reactstrap';
import PropTypes from 'prop-types';

import { AppAsideToggler, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import logo from '../../assets/img/company-logo.png'
import sygnet from '../../assets/img/brand/sygnet.svg'

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {
  
  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          full={{ src: logo, width: 85, height: 24, alt: 'Link Tree Logo' }}
          minimized={{ src: sygnet, width: 30, height: 30, alt: 'Link Tree Logo' }}
        />
        {/* <AppSidebarToggler className="d-lg-none" display="md" /> */}

        <Nav className="d-md-down-none pt-1 ml-1" navbar>
          <NavItem className="px-2">
            <Link to="/todos" className="nav-link">
              ToDos
            </Link>
          </NavItem>
        </Nav>
        <Nav className="ml-auto pt-1" navbar>
          <UncontrolledDropdown nav direction="down" className="mr-3 ml-1">
            <DropdownToggle nav>
              <img src={'../../assets/img/user-img-default.png'} className="img-avatar mr-1" alt="User Img" />
              <i className="fa fa-caret-down"></i>
            </DropdownToggle>
            <DropdownMenu right className="mt-2">
            <DropdownItem>
              <Link to="/profile-preview"><i className="fa fa-user"></i> Profile</Link>
              </DropdownItem>
              <DropdownItem onClick={e => this.props.onLogout(e)}><i className="fa fa-power-off"></i> Logout</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
        {/* <AppAsideToggler className="d-md-down-none" /> */}
        {/*<AppAsideToggler className="d-lg-none" mobile />*/}
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
