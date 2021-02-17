import React, { Component } from 'react';
import { Col, Container, Row, Button, Card, CardBody, FormGroup, Label, Input, CustomInput } from 'reactstrap';
import { connect } from "react-redux";
import { showLoader, hideLoader } from "../redux/actions/loader-data";
import { ToastsStore } from "react-toasts";
import { removeUser } from '../redux/actions/user-data';
import { deleteUser, updateUser, userDetails, addUserImage, updateUserImage } from '../http/http-calls';

class ProfilePreview extends Component {

    state = {
        user: {
            phone: '',
            name: ''
        },
        isDirty: {
            phone: false,
            name: false
        },
        errors: {},
        isActive: false,
        userId: '',
        selectedFile: '',
        userImage: ''
    }

    componentDidMount() {
        this._getUserDetails();
    }

    _getUserDetails = () => {
        this.props.showLoader();
        userDetails().then((resp) => {
            this.props.hideLoader();
            console.log("User details resp here :- ", resp);
            let user = {
                phone: resp.user.phone,
                name: resp.user.name.full
            };
            let isActive = resp.user.isActive;
            let userId = resp.user._id;
            let userImage = resp.user._userImage[0];
            this.setState({ user, isActive, userId, userImage });
        }).catch((err) => {
            this.props.hideLoader();
            ToastsStore.error("User details loading failed :- " + err.reason);
        });
    }

    _handleOnChange = (field, value) => {
        let { user, isDirty, isActive } = this.state;
        if (field === "isActive") {
            isActive = value;
            this.setState({ isActive });
        } else {
            user[field] = value;
            isDirty[field] = true;
            this.setState({ user, isDirty }, () => {
                this._validateForm();
            });
        }
    }

    _validateForm = () => {
        const { user, isDirty, errors } = this.state;
        Object.keys(user).forEach((each) => {
            if (each === "phone" && isDirty.phone) {
                if (!user.phone.trim().length) {
                    errors[each] = "*Required";
                } else if (user.phone.trim().length &&
                    !user.phone.match(/^[0-9]{10}$/)) {
                    errors[each] = "Enter valid phone number";
                } else {
                    delete errors[each];
                    isDirty.phone = false;
                }
            } else if (each === "name" && isDirty.name) {
                if (!user.name.trim().length) {
                    errors[each] = "*Required";
                } else {
                    delete errors[each];
                    isDirty.name = false;
                }
            }
        });
        this.setState({ errors });
        return Object.keys(errors).length ? errors : null;
    }

    _editUser = (e) => {
        e.preventDefault();
        let isDirty = {
            phone: true,
            name: true
        };
        this.setState({ isDirty }, () => {
            let errors = this._validateForm();
            if (!errors) {
                let userData = {
                    phone: this.state.user.phone,
                    isActive: this.state.isActive,
                    name: {
                        first: this.state.user.name.split(" ")[0],
                        last: this.state.user.name.split(" ")[1] ?
                            this.state.user.name.split(" ")[1] : ""
                    }
                }
                this.props.showLoader();
                updateUser(userData, this.state.userId).then((resp) => {
                    this.props.hideLoader();
                    console.log("Update user resp here :- ", resp);
                    ToastsStore.success("User updated successfully...");
                    this._getUserDetails();
                }).catch((err) => {
                    this.props.hideLoader();
                    ToastsStore.error("User updation failed!!!");
                })
            }
        });
    }

    _deleteUser = () => {
        this.props.showLoader();
        deleteUser().then((resp) => {
            this.props.hideLoader();
            ToastsStore.success("User deleted successfully...");
            console.log("User delete resp here :- ", resp);
            this.props.removeUser();
            localStorage.clear();
            this.props.history.push('/login');
        }).catch((err) => {
            this.props.hideLoader();
            ToastsStore.error("User deletion failed :- " + err.reason);
        });
    }

    _uploadImage = (e) => {
        this.setState({ selectedFile: e.target.files[0] }, () => {
            if (this.state.userImage) {
                const fd = new FormData();
                fd.append('imageUser', this.state.selectedFile);
                this.props.showLoader();
                updateUserImage(fd, this.state.userImage._id).then((resp) => {
                    this.props.hideLoader();
                    console.log("Updating user image response here :- ", resp);
                    this._getUserDetails();
                }).catch((err) => {
                    this.props.hideLoader();
                    ToastsStore.error("Updating user image failed :- " + err.reason);
                });
            } else {
                const fd = new FormData();
                fd.append('imageUser', this.state.selectedFile);
                this.props.showLoader();
                addUserImage(fd).then((resp) => {
                    this.props.hideLoader();
                    console.log("Adding user image response here :- ", resp);
                    this._getUserDetails();
                    
                }).catch((err) => {
                    this.props.hideLoader();
                    ToastsStore.error("Adding user image failed :- " + err.reason);
                });
            }
        });
    }

    render() {
        const { user, errors, isActive, userImage } = this.state;
        return (
            <div>
                <Container>
                    <Row>
                        <Col md="2">
                        </Col>
                        <Col md="8">
                            <Card>
                                <CardBody>
                                    <h4 style={{ fontWeight: 600, marginBottom: 0 }}>Profile</h4>
                                    <div className="text-center">
                                        <Label className="btn uploadBtnProfile">
                                            <input type="file" name='imageUser'
                                                style={{ display: 'none' }}
                                                onChange={(e) => this._uploadImage(e)}
                                            />
                                            {userImage ?
                                                <img alt="" className="" src={`data:image/jpeg;base64,${userImage.base64}`} />
                                                // <img alt="" className="" src={`http://localhost:3000/uploads/${userImage.imageUser.filename}`} />
                                                : <img alt="" className="" src={'assets/img/user-img-default.png'} />
                                            }
                                        </Label>
                                    </div>
                                    <FormGroup>
                                        <Label>Name</Label>
                                        <Input type="text" value={user.name}
                                            onChange={(e) => this._handleOnChange("name", e.target.value)}
                                        />
                                        {errors && (
                                            <small style={{ color: "red" }}>{errors.name}</small>
                                        )}
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>Phone</Label>
                                        <Input type="number" value={user.phone}
                                            onChange={(e) => this._handleOnChange("phone", e.target.value)}
                                        />
                                        {errors && (
                                            <small style={{ color: "red" }}>{errors.phone}</small>
                                        )}
                                    </FormGroup>
                                    <FormGroup>
                                        <Label>IsActive</Label>
                                        <CustomInput type="switch" id="exampleCustomSwitch" name="customSwitch" className="disableLink"
                                            onChange={(e) => this._handleOnChange("isActive", e.target.checked)}
                                            checked={isActive}
                                        />
                                    </FormGroup>
                                    <Button className="recruitechThemeBtn loginBtn"
                                        onClick={(e) => this._editUser(e)}
                                    >
                                        Update
                                    </Button>
                                    <Button className="recruitechThemeBtn loginBtn"
                                        onClick={() => this._deleteUser()}
                                    >
                                        Delete Account
                                    </Button>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        loaderData: state.loaderData,
        userData: state.userData
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        showLoader: (loaderData) => dispatch(showLoader(loaderData)),
        hideLoader: (loaderData) => dispatch(hideLoader(loaderData)),
        removeUser: () => dispatch(removeUser())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePreview);