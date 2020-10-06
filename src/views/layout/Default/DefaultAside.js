import React, {Component} from 'react';
import {Nav, NavItem, NavLink, TabContent, TabPane} from 'reactstrap';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {AppSwitch} from '@coreui/react'
import logo from '../../../assets/img/brand/logo_only.svg';

const propTypes = {
    children: PropTypes.node,
};

const defaultProps = {};

class DefaultAside extends Component {

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            activeTab: '2',
        };
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab,
            });
        }
    }

    render() {
        const {children, ...attributes} = this.props;
        return (
            <React.Fragment>
                <Nav tabs>
                    <NavItem>
                        <NavLink className={classNames({active: this.state.activeTab === '2'})}
                                 onClick={() => {
                                     this.toggle('2');
                                 }}>
                        </NavLink>
                    </NavItem>
                </Nav>
            </React.Fragment>
        );
    }
}

DefaultAside.propTypes = propTypes;
DefaultAside.defaultProps = defaultProps;

export default DefaultAside;
