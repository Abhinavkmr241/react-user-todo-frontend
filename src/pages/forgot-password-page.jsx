import React, { Component } from 'react';
import { forgotPassword } from '../http/http-calls';
import { Col, Container, Row, Carousel, CarouselIndicators, CarouselItem, CarouselCaption, Button, Form, Input, FormGroup, Label } from 'reactstrap';
import { ToastsStore } from "react-toasts";
import { connect } from "react-redux";
import { showLoader, hideLoader } from "../redux/actions/loader-data";

const items = [
  {
    header: 'Title',
    caption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam mattis bibendum orci sit amet aliquam.',
  },
];

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      user: {
        email: ''
      },
      isDirty: {
        email: false
      },
      errors: {}
    };
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.goToIndex = this.goToIndex.bind(this);
    this.onExiting = this.onExiting.bind(this);
    this.onExited = this.onExited.bind(this);
  }

  onExiting() {
    this.animating = true;
  }

  onExited() {
    this.animating = false;
  }

  next() {
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === items.length - 1 ? 0 : this.state.activeIndex + 1;
    this.setState({ activeIndex: nextIndex });
  }

  previous() {
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === 0 ? items.length - 1 : this.state.activeIndex - 1;
    this.setState({ activeIndex: nextIndex });
  }

  goToIndex(newIndex) {
    if (this.animating) return;
    this.setState({ activeIndex: newIndex });
  }

  login = (e, temp) => {
    e.preventDefault();
    if (temp) {
      let isDirty = {
        email: true
      }
      this.setState({ isDirty }, () => {
        let errors = this._validateMail();
        if (!errors) {
          let data = {
            handle: this.state.user.email
          };
          this.props.showLoader();
          forgotPassword(data).then((resp) => {
            this.props.hideLoader();
            console.log("Reset password link resp here :- ", resp);
            ToastsStore.success("Reset password link sent to mail successfully...");
            this.setState({
              user: {
                email: ''
              },
              isDirty: {
                email: false
              },
              errors: {}
            });
            this.props.history.push('/login')
          }).catch((err) => {
            this.props.hideLoader();
            ToastsStore.error("Sending reset password link failed :- " + err.reason);
          });
        }
      });
    } else {
      this.props.history.push('/login')
    }
  }

  _handleInput = (field, value) => {
    const { user, isDirty } = this.state;
    user[field] = value;
    isDirty[field] = true;
    this.setState({ user, isDirty }, () => {
      this._validateMail();
    });
  }

  _validateMail = () => {
    const { user, errors, isDirty } = this.state;
    if (isDirty.email) {
      if (!user.email.trim().length) {
        errors.email = "*Required";
      } else if (
        user.email.trim().length &&
        !new RegExp(
          "^[a-zA-Z0-9]{1}[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,3}$"
        ).test(user.email)
      ) {
        errors.email = "Enter a valid email ID";
      } else {
        delete errors.email;
        isDirty.email = false;
      }
    }
    this.setState({ errors });
    return Object.keys(errors).length ? errors : null;
  }

  render() {
    const { activeIndex } = this.state;

    const slides2 = items.map((item) => {
      return (
        <CarouselItem
          onExiting={this.onExiting}
          onExited={this.onExited}
          key={item.src}
        >
          <CarouselCaption captionText={item.caption} captionHeader={item.header} />
        </CarouselItem>
      );
    });

    return (
      <div className="app flex-row animated fadeIn">
        <Container fluid>
          <Row>
            <Col md="6" lg="6" className="loginPgLeftSide lightBlueBg">
              {/* don't remove the below div */}
              <div style={{ visibility: 'hidden' }}>
                <h3 className="pl-4">Link Tree</h3>
              </div>

              <img src={'assets/img/forgot-password-img.svg'} alt="Forgot Password Img" className="img-fluid loginImg"></img>

              <div className="loginContentLeftSide">
                <Carousel activeIndex={activeIndex} next={this.next} previous={this.previous}>
                  {/* <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={this.goToIndex} /> */}
                  {slides2}
                </Carousel>
              </div>
            </Col>

            <Col md="6" lg="6" className="loginPgRightSide">
              <div className="d-flex justify-content-between align-items-center pr-2 pl-3">
                <img src={'assets/img/company-logo.png'} alt="Login Img" className="projectLogo" />

                <a href="javascript:void(0)" className="backToLogin" onClick={(e) => this.login(e, false)}>Back to Login</a>
              </div>


              <div className="w-100 justify-content-center d-flex flex-column align-items-center">
                <Form className="loginFormWrapper">
                  <h4>Forgot Password?</h4>
                  <FormGroup>
                    <Label>Email</Label>
                    <Input type="email" placeholder="Your Email"
                      value={this.state.user.email}
                      onChange={(e) =>
                        this._handleInput("email", e.target.value)
                      }
                    />
                    {this.state.errors && (
                      <small style={{ color: "red" }}>{this.state.errors.email}</small>
                    )}
                  </FormGroup>

                  <Button className="recruitechThemeBtn loginBtn" onClick={(e) => this.login(e, true)}>Reset Password</Button>
                </Form>
              </div>

              {/* Footer */}
              <div>
                <div className="loginFooterLinks pl-3">
                  <a href="javascript:void(0)">Terms</a>
                  <a href="javascript:void(0)">Privacy</a>
                  <a href="javascript:void(0)">Support</a>
                </div>
                <div className="copyrightWrap pl-3">
                  Link Tree &#169; 2020.
                  <div>
                    Powered By: <a href="https://www.logic-square.com/" target="_blank" className="lsWebsite">
                      Logic Square
                    </a>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loaderData: state.loaderData
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showLoader: (loaderData) => dispatch(showLoader(loaderData)),
    hideLoader: (loaderData) => dispatch(hideLoader(loaderData)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);

