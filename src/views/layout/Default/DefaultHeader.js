import React from 'react';
import {Link, NavLink, useHistory} from 'react-router-dom';
import {Badge, UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem} from 'reactstrap';
import PropTypes from 'prop-types';

import {AppAsideToggler, AppNavbarBrand, AppSidebarToggler} from '@coreui/react';
import logo from '../../../assets/img/brand/logo.png'
import logoOnly from '../../../assets/img/brand/logo_only.svg'
import auth from "../../../auth";

const propTypes = {
    children: PropTypes.node,
};


const defaultProps = {};

function DefaultHeader(props) {
    const history = useHistory();

    // eslint-disable-next-line
    const {children, ...attributes} = props;
    return (
        <React.Fragment>
            <AppSidebarToggler className="d-lg-none" display="md" mobile/>
            <AppNavbarBrand
                full={{src: logo, width: 89, height: 25, alt: 'Avesbox Logo'}}
                minimized={{src: logoOnly, width: 30, height: 30, alt: 'Avesbox Logo'}}
            />
            <AppSidebarToggler className="d-md-down-none" display="lg"/>

            <Nav className="d-md-down-none" navbar>
            <NavItem className="px-3">
                {
                    auth.getSession().type === 'owner' ? 
                    <div><b>Peternakan</b> : {auth.getSession().company} </div>:
                    <b>ADMIN</b>
                }
            </NavItem>
            </Nav>
            <Nav className="ml-auto" navbar>
                <NavItem className="d-md-down-none">
                    <b>Hi, {auth.getSession().name}</b>
                </NavItem>
                <UncontrolledDropdown nav direction="down">
                    <DropdownToggle nav>
                        <img src={auth.getSession().photo ? auth.getSession().photo : logoOnly } className="img-avatar"
                            alt={auth.getSession().name}/>
                    </DropdownToggle>
                    <DropdownMenu right>
                        <DropdownItem header tag="div" className="text-center"><strong>Akun</strong></DropdownItem>
                        {
                            auth.getSession().type === 'owner' ? 
                            <DropdownItem onClick={e => history.push('profile')}><i className="fa fa-user"></i> Profil</DropdownItem> :
                            <DropdownItem onClick={e => history.push('/adm/profile')}><i className="fa fa-user"></i> Profil</DropdownItem>
                        }
                        <DropdownItem onClick={e => props.onLogout(e)}><i
                            className="fa fa-sign-out"></i> Logout</DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
            </Nav>
        </React.Fragment>
    );
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
