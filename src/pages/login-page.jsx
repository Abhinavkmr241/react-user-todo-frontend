import React, { Component } from 'react';
import { connect } from "react-redux";
import { addUser } from "../redux/actions/user-data";
import { showLoader, hideLoader } from "../redux/actions/loader-data";
import { login } from "../http/http-calls";
import { Col, Container, Row, Carousel, CarouselItem, CarouselCaption, Button, Form, Input, FormGroup, Label } from 'reactstrap';
import { ToastsStore } from "react-toasts";

const items = [
  {
    header: 'Title',
    caption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam mattis bibendum orci sit amet aliquam.',
  },
];

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      user: {
        email: '',
        password: ''
      },
      isDirty: {
        email: false,
        password: false
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

  forgotPassword = () => {
    this.props.history.push('/forgot-password')
  }

  requestDemo = () => {
    this.props.history.push('/signup')
  }

  users = () => {
    let isDirty = {
      email: true,
      password: true
    };
    this.setState({ isDirty }, () => {
      let errors = this._validateForm();
      if (!errors) {
        let loginData = {
          handle: this.state.user.email,
          password: this.state.user.password
        };
        this.props.showLoader();
        login(loginData).then((resp) => {
          this.props.hideLoader();
          console.log("Login resp here :- ", resp);
          let user = {
            token: resp.token
          };
          this.props.addUser({ user });
          this.setState({
            user: {
              email: '',
              password: ''
            },
            isDirty: {
              email: false,
              password: false
            },
            errors: {}
          });
          ToastsStore.success("Logged-In successfully...")
          this.props.history.push('/todos');
        }).catch((err) => {
          this.props.hideLoader();
          ToastsStore.error("Login failed :- "+ err.reason);
        });
      }
    });
  }

  //handling input here
  _handleOnChange = (field, value) => {
    const { user, isDirty } = this.state;
    user[field] = value;
    isDirty[field] = true;
    this.setState({ user, isDirty }, () => {
      this._validateForm();
    });
  };

  //for validation
  _validateForm() {
    const { user, errors, isDirty } = this.state;
    Object.keys(user).forEach((each) => {
      if (each === "password" && isDirty.password) {
        if (!user.password.trim().length) {
          errors[each] = "*Required";
        } else {
          delete errors[each];
          isDirty.password = false;
        }
      } else if (each === "email" && isDirty.email) {
        if (!user.email.trim().length) {
          errors[each] = "*Required";
        } else if (
          user.email.trim().length &&
          !new RegExp(
            "^[a-zA-Z0-9]{1}[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,3}$"
          ).test(user.email)
        ) {
          errors.email = "Enter a valid email ID";
        } else {
          delete errors[each];
          isDirty.email = false;
        }
      }
    });
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
                <h3 className="pl-4">My Todo</h3>
              </div>

              <img src={'assets/img/login-img.svg'} alt="Login Img" className="img-fluid loginImg"></img>

              <div className="loginContentLeftSide">
                <Carousel activeIndex={activeIndex} next={this.next} previous={this.previous}>
                  {/* <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={this.goToIndex} /> */}
                  {slides2}
                </Carousel>
              </div>
            </Col>

            <Col md="6" lg="6" className="loginPgRightSide">
              <img src={'assets/img/company-logo.png'} alt="Login Img" className="projectLogo pl-3" />

              <div className="w-100 justify-content-center d-flex flex-column align-items-center">
                <Form className="loginFormWrapper">
                  <h4>Login to your account</h4>
                  <FormGroup>
                    <Label>Email</Label>
                    <Input type="text" placeholder="Enter"
                      value={this.state.user.email}
                      onChange={(e) =>
                        this._handleOnChange("email", e.target.value)
                      }
                    />
                    {this.state.errors && (
                      <small style={{ color: "red" }}>{this.state.errors.email}</small>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <Label>Password</Label>
                    <Input type="password" placeholder="Enter"
                      value={this.state.user.password}
                      onChange={(e) =>
                        this._handleOnChange("password", e.target.value)
                      }
                    />
                    {this.state.errors && (
                      <small style={{ color: "red" }}>{this.state.errors.password}</small>
                    )}
                  </FormGroup>
                  <Button className="recruitechThemeBtn loginBtn" onClick={this.users}>Login</Button>
                </Form>

                <div className="registerWrap">
                  <div className="ml-3">
                    {/* <Input type="checkbox" id="rememberMe" />
                    <Label for="rememberMe" className="mb-0">Remember Me</Label> */}
                  </div>

                  <a href="javascript:void(0)" className="forgotPassword" onClick={this.forgotPassword}>Forgot Password?</a>
                </div>

                <div className="register">
                  Don't have an account? <a href="javascript:void(0)" onClick={this.requestDemo}>Sign Up!</a>
                </div>
              </div>

              {/* Footer */}
              <div>
                <div className="loginFooterLinks pl-3">
                  <a href="javascript:void(0)">Terms</a>
                  <a href="javascript:void(0)">Privacy</a>
                  <a href="javascript:void(0)">Support</a>
                </div>
                <div className="copyrightWrap pl-3">
                  My Todo &#169; 2021.
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
    userData: state.userData,
    loaderData: state.loaderData
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addUser: (user) => dispatch(addUser(user)),
    showLoader: (loaderData) => dispatch(showLoader(loaderData)),
    hideLoader: (loaderData) => dispatch(hideLoader(loaderData)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);