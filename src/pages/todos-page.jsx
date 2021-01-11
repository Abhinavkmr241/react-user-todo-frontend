import React, { Component } from 'react';
import { Col, Container, Row, Button, Card, CardBody, FormGroup, Label, Input, CustomInput } from 'reactstrap';
import { todoList, addTodo, userDetails, editTodo } from '../http/http-calls';
import { ToastsStore } from 'react-toasts';
import { connect } from "react-redux";
import { showLoader, hideLoader } from "../redux/actions/loader-data";
import { TodoElement } from "./todos-element-page";

class Todos extends Component {
  state = {
    message: '',
    userName: '',
    todoList: [],
    selectedType: '',
    marked: false
  }

  componentDidMount() {
    this.props.showLoader();
    userDetails().then((resp) => {
      this.props.hideLoader();
      console.log("User details resp here :- ", resp);
      this.setState({
        userName: resp.user.name.full
      });
    }).catch((err) => {
      this.props.hideLoader();
      ToastsStore.error("User details loading failed :- " + err.reason);
    });
    this._getTodoList();
  }

  _getTodoList = () => {
    this.props.showLoader();
    todoList().then((resp) => {
      this.props.hideLoader();
      console.log("Todo list resp here :- ", resp);
      this.setState({
        todoList: resp.todos
      });
    }).catch((err) => {
      this.props.hideLoader();
      ToastsStore.error("Todo list loading failed :- " + err.reason);
    });
  }

  _setSelectedType = (type) => {
    if (type === "Active") {
      this.setState({ selectedType: "Active" });
    } else if (type === "Completed") {
      this.setState({ selectedType: "Completed" });
    } else {
      this.setState({ selectedType: "All" });
    }
  }

  _showTodoList = (type) => {
    let listArray = '';
    let { todoList } = this.state;
    if (todoList.length) {
      if (type === "Active") {
        listArray = todoList.map((todo) => {
          if (todo.isActive) {
            return (
              <div>
                <TodoElement key={todo._id} todo={todo} reload={() => this._getTodoList()} />
              </div>
            )
          }
        });
      } else if (type === "Completed") {
        listArray = todoList.map((todo) => {
          if (!todo.isActive) {
            return (
              <div>
                <TodoElement key={todo._id} todo={todo} reload={() => this._getTodoList()} />
              </div>
            )
          }
        });
      } else {
        listArray = todoList.map((todo) => {
          return (
            <div>
              <TodoElement key={todo._id} todo={todo} reload={() => this._getTodoList()} />
            </div>
          )
        });
      }
    } else {
      listArray += "No Todo yet!!!";
    }
    return listArray;
  }

  _handleOnChange = (value) => {
    this.setState({ message: value });
  }

  _addTodo = (e) => {
    e.preventDefault();
    const { message } = this.state;
    if ((message !== undefined) && (message !== null)) {
      let todoData = {
        message: message
      };
      this.props.showLoader();
      addTodo(todoData).then((resp) => {
        this.props.hideLoader();
        console.log("Adding todo resp here :- ", resp);
        ToastsStore.success("Todo added successfully...");
        this.setState({
          message: ''
        });
        this._getTodoList();
      }).catch((err) => {
        this.props.hideLoader();
        ToastsStore.error("Adding Todo failed :- " + err.reason);
      });
    } else {
      ToastsStore.error("No message to add!!!");
    }
  }

  _markAll = (temp) => {
    if (temp) {
      let todoData = {
        isActive: false
      };
      this.state.todoList.map((todo) => {
        editTodo(todoData, todo._id).then((resp) => {
          console.log(resp);
          this._getTodoList();
        }).catch((err) => {
          console.log(err);
        });
      });
      this.setState({ marked: true });
    } else {
      let todoData = {
        isActive: true
      };
      this.state.todoList.map((todo) => {
        editTodo(todoData, todo._id).then((resp) => {
          console.log(resp);
          this._getTodoList();
        }).catch((err) => {
          console.log(err);
        });
      });
      this.setState({ marked: false });
    }
  }

  render() {
    return (
      <div className="app flex-row animated fadeIn innerPagesBg">
        <Container>
          <Row>
            <Col md="12">
              <div className="addedLinksWrapper">
                <div className="d-flex justify-content-between align-items-center my-3">
                  <h4 className="pg-title">ToDos</h4>
                </div>

                <Card className="userDetails mb-4">
                  <CardBody>
                    <div style={{display: "flex", alignItems: "center", justifyContent: "space-around"}}>
                      <div>
                        <CustomInput type="switch" id="exampleCustomSwitch" name="customSwitch"
                          label={this.state.marked ? "Unmark All" : "Mark All"}
                          className="disableLink" onClick={(e) => this._markAll(e.target.checked)}
                        />
                      </div>
                      <div>
                        <Button className="modalBtnSave"
                          onClick={() => this._setSelectedType("All")}
                        >
                          All
                        </Button>
                      </div>
                      <div>
                        <Button className="modalBtnSave"
                          onClick={() => this._setSelectedType("Active")}
                        >
                          Active
                        </Button>
                      </div>
                      <div>
                        <Button className="modalBtnSave"
                          onClick={() => this._setSelectedType("Completed")}
                        >
                          Completed
                        </Button>
                      </div>
                    </div>
                    {this._showTodoList(this.state.selectedType)}
                  </CardBody>
                </Card>
              </div>

              <div className="profilePreviewWrap">
                <div>
                  <div className="text-center">
                    <h5>{`Welcome ${this.state.userName}`}</h5>
                  </div>
                  <div className="mt-4">
                    <FormGroup>
                      <Label>Message</Label>
                      <Input type="text" placeholder="Enter what to do..."
                        value={this.state.message}
                        onChange={(e) => this._handleOnChange(e.target.value)}
                      />
                      <Button className="modalBtnSave"
                        onClick={(e) => this._addTodo(e)}
                      >
                        Add
                      </Button>
                    </FormGroup>
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

export default connect(mapStateToProps, mapDispatchToProps)(Todos);
