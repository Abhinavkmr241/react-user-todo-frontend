import React from 'react';
import { ToastsStore } from 'react-toasts';
import { Button, CustomInput, Input, Label } from 'reactstrap';
import { editTodo, deleteTodo, addTodoImages } from '../http/http-calls';

export const TodoElement = ({ todo, reload }) => {

    const updateText = (value) => {
        if (!!value.trim().length) {
            let todoData = {
                message: value
            };
            editTodo(todoData, todo._id).then((resp) => {
                console.log("Update message resp here :- ", resp);
                reload();
            }).catch((err) => {
                console.log(err.reason);
            });
        }
    }

    const markTodo = (temp) => {
        let todoData = {
            isActive: true
        };
        if (temp) {
            todoData = {
                isActive: false
            };
            editTodo(todoData, todo._id).then((resp) => {
                console.log(resp);
                reload();
            }).catch((err) => {
                console.log(err.reason);
            });
        } else {
            editTodo(todoData, todo._id).then((resp) => {
                console.log(resp);
                reload();
            }).catch((err) => {
                console.log(err.reason);
            });
        }
    }

    const removeToDo = () => {
        deleteTodo(todo._id).then((resp) => {
            console.log(resp);
            reload();
        }).catch((err) => {
            console.log(err.reason);
        });
    }

    const uploadTodoImages = (e) => {
        const fd = new FormData();
        for (let i = 0; i < e.target.files.length; i++) {
            fd.append('images', e.target.files[i]);
        }
        console.log("formdata here :- ", fd);
        addTodoImages(fd, todo._id).then((resp) => {
            console.log("Adding todo images resp here :- ", resp);
        }).catch((err) => {
            ToastsStore.error("Adding todo images failed :- " + err.reason);
        })
        reload();
    }

    return (
        <div className={`addedLinksWrap ${todo._id}`}>
            <div className={`moveLink ${todo._id}`}>
                <i className="fa fa-ellipsis-v"></i>
            </div>
            <div className={`addedLinkDetails ${todo._id}`}>
                <div className="mr-3 ml-1">
                    <Label className="btn uploadBtnProfile">
                        <input type="file" name='images' multiple
                            style={{ display: 'none' }}
                            onChange={(e) => uploadTodoImages(e)}
                        />
                        {todo._todoImages.length ?
                            todo._todoImages[0].images.map((file) => (
                                <img src={`http://localhost:3000/uploads/${file.filename}`} className="img-avatar mr-1" alt="User Img" />
                            ))
                            : <img src={'../../assets/img/user-img-default.png'} className="img-avatar mr-1" alt="User Img" />
                        }
                    </Label>
                </div>
                <Input type="text" defaultValue={todo.message}
                    onChange={(e) => updateText(e.target.value)}
                    disabled={!todo.isActive}
                />
                <div className={`actionBtnWrap ${todo._id}`}>
                    <CustomInput type="switch" id={`exampleCustomSwitch ${todo._id}`} name={`customSwitch ${todo._id}`}
                        className="disableLink" onClick={(e) => markTodo(e.target.checked)} checked={!todo.isActive}
                    />

                    <Button className="delLinkBtn" id={`delLinkBtn ${todo._id}`}>
                        <i className="fa fa-trash-o text-danger" onClick={() => removeToDo()}></i>
                    </Button>
                </div>
            </div>
        </div>
    );

}

export default TodoElement;