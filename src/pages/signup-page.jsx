import React, { Component } from 'react';
import { ToastsStore } from "react-toasts";
import { Col, Container, Row, Carousel, CarouselItem, CarouselCaption, Button, Form, Input, FormGroup, Label } from 'reactstrap';
import { signUp, login } from '../http/http-calls';
import { connect } from "react-redux";
import { addUser } from "../redux/actions/user-data";
import { showLoader, hideLoader } from "../redux/actions/loader-data";

const items = [
  {
    header: 'Title',
    caption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam mattis bibendum orci sit amet aliquam.',
  },
];

class RequestDemo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      user: {
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phone: ""
      },
      isDirty: {
        email: false,
        password: false,
        firstName: false,
        phone: false
      },
      errors: {},
      visibility: false
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
      const { user } = this.state;
      let isDirty = {
        email: true,
        password: true,
        firstName: true,
        phone: true
      };
      this.setState({ isDirty }, () => {
        let errors = this._validateForm();
        if (!errors) {
          let signupData = {
            email: user.email,
            phone: user.phone,
            password: user.password,
            name: {
              first: user.firstName,
              last: user.lastName ? user.lastName : ''
            }
          };
          this.props.showLoader();
          signUp(signupData).then((resp) => {
            this.props.hideLoader();
            console.log("Signup resp here :- ", resp);
            ToastsStore.success("Signup successfully...")
            let loginData = {
              handle: resp.user.email,
              password: user.password
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
                  email: "",
                  password: "",
                  firstName: "",
                  lastName: "",
                  phone: ""
                },
                isDirty: {
                  email: false,
                  password: false,
                  firstName: false,
                  phone: false
                },
                errors: {}
              });
              ToastsStore.success("Logged-In successfully...")
              this.props.history.push('/todos');
            }).catch((err) => {
              this.props.hideLoader();
              ToastsStore.error("Login failed :- " + err.reason);
            });
          }).catch((err) => {
            this.props.hideLoader();
            ToastsStore.error("Signup failed :- " + err.reason);
          });
        }
      });
    } else {
      this.props.history.push('/login')
    }
  }

  //handling input here
  _handleOnChange = (field, value) => {
    const { user, isDirty } = this.state;
    user[field] = value;
    if (field !== "lastName") {
      isDirty[field] = true;
    }
    this.setState({ user, isDirty }, () => {
      this._validateForm();
    });
  };

  //for validation
  _validateForm() {
    const { user, errors, isDirty } = this.state;
    Object.keys(user).forEach((each) => {
      if (each === "email" && isDirty.email) {
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
          delete errors[each];
          isDirty.email = false;
        }
      } else if (each === "password" && isDirty.password) {
        if (!user.password.trim().length) {
          errors[each] = "*Required";
        } else {
          delete errors[each];
          isDirty.password = false;
        }
      } else if (each === "firstName" && isDirty.firstName) {
        if (!user.firstName.trim().length) {
          errors[each] = "*Required";
        }
        else {
          delete errors[each];
          isDirty.firstName = false;
        }
      } else if (each === "phone" && isDirty.phone) {
        if (!user.phone.trim().length) {
          errors[each] = "*Required";
        } else if (user.phone.trim().length &&
          !user.phone.match(/^[0-9]{10}$/)) {
          errors[each] = "Enter valid phone number";
        } else {
          delete errors[each];
          isDirty.phone = false;
        }
      }
    });
    this.setState({ errors });
    return Object.keys(errors).length ? errors : null;
  }

  _handleVisibility = (e) => {
    e.preventDefault();
    let { visibility } = this.state;
    visibility = !visibility;
    this.setState({ visibility });
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

              <img src={'assets/img/signup-img.svg'} alt="Sign Up Img" className="img-fluid loginImg"></img>

              <div className="loginContentLeftSide">
                <Carousel activeIndex={activeIndex} next={this.next} previous={this.previous}>
                  {/* <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={this.goToIndex} /> */}
                  {slides2}
                </Carousel>
              </div>
            </Col>

            <Col md="6" lg="6" className="loginPgRightSide signupPgRightSide">
              <img src={'assets/img/company-logo.png'} alt="Login Img" className="projectLogo pl-3 mb-3" />

              <div className="w-100 justify-content-center d-flex flex-column align-items-center">
                <Form className="loginFormWrapper requestDemoForm">
                  <h4>Sign Up</h4>

                  <FormGroup>
                    <Label>Email</Label>
                    <Input type="email" placeholder="Enter Email"
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
                    <Label>First Name</Label>
                    <Input type="text" placeholder="Enter first name"
                      value={this.state.user.firstName}
                      onChange={(e) =>
                        this._handleOnChange("firstName", e.target.value)
                      }
                    />
                    {this.state.errors && (
                      <small style={{ color: "red" }}>{this.state.errors.firstName}</small>
                    )}
                  </FormGroup>

                  <FormGroup>
                    <Label>Last Name</Label>
                    <Input type="text" placeholder="Enter last name"
                      value={this.state.user.lastName}
                      onChange={(e) =>
                        this._handleOnChange("lastName", e.target.value)
                      }
                    />
                    {this.state.errors && (
                      <small style={{ color: "red" }}>{this.state.errors.lastName}</small>
                    )}
                  </FormGroup>

                  <FormGroup className="position-relative">
                    <Label>Password</Label>
                    <Input type={this.state.visibility ? "text" : "password"} placeholder="Enter Password" style={{ paddingRight: 35 }}
                      value={this.state.user.password}
                      onChange={(e) =>
                        this._handleOnChange("password", e.target.value)
                      }
                    />
                    {this.state.errors && (
                      <small style={{ color: "red" }}>{this.state.errors.password}</small>
                    )}
                    <span className="fa fa-eye-slash eyeIcon" onClick={(e) => this._handleVisibility(e)}></span>
                  </FormGroup>

                  <FormGroup className="position-relative">
                    <Label>Phone</Label>
                    <Input type="number" placeholder="phone" style={{ paddingRight: 35 }}
                      value={this.state.user.phone}
                      onChange={(e) =>
                        this._handleOnChange("phone", e.target.value)
                      }
                    />
                    {this.state.errors && (
                      <small style={{ color: "red" }}>{this.state.errors.phone}</small>
                    )}
                  </FormGroup>

                  <Button className="recruitechThemeBtn loginBtn" style={{ marginTop: 30 }} onClick={(e) => this.login(e, true)}>Get Started</Button>
                </Form>

                <div className="register mt-0 mb-3">
                  Already have an account? <a href="javascript:void(0)" onClick={(e) => this.login(e, false)}>Login</a>
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

export default connect(mapStateToProps, mapDispatchToProps)(RequestDemo);
