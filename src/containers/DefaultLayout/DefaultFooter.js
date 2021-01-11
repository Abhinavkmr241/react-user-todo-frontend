import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultFooter extends Component {
  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <div className="d-flex justify-content-start align-items-center">
          <span className="d-inline-block mr-2">&copy; 2020 Link Tree.</span>
          <Button color="link">
            Terms
          </Button>
          <Button color="link">
            Privacy
          </Button>
        </div>
        <div>
          Powered By 
          <img src={'../../assets/img/ls-logo.png'} className="ls-logo" /> <a href="https://logic-square.com" target="_blank">Logic Square</a>
        </div>
      </React.Fragment>
    );
  }
}

DefaultFooter.propTypes = propTypes;
DefaultFooter.defaultProps = defaultProps;

export default DefaultFooter;
