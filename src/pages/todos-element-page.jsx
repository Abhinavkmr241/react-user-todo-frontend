import React from 'react';
import { ToastsStore } from 'react-toasts';
import { Button, CustomInput, Input, Label } from 'reactstrap';
import { editTodo, deleteTodo, addTodoImages, deleteTodoImage } from '../http/http-calls';
import '../../node_modules/font-awesome/css/font-awesome.min.css';

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
        });
        reload();
    }

    const deleteImage = (id) => {
        deleteTodoImage(id).then((resp) => {
            console.log("Todo Image delete resp :- ", resp);
        }).catch((err) => {
            console.log("Todo Image delete failed :- " + err.reason);
        });
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
                        Add Photos
                        <input type="file" name='images' multiple
                            style={{ display: 'none' }}
                            onChange={(e) => uploadTodoImages(e)}
                            disabled={!todo.isActive}
                        />
                    </Label> {/* Add Photos</input> */}
                    <div className="todoSelectedImgWrapper" style={{ padding: "10px", display: "flex", alignContent: "space-around" }}>
                        {todo._todoImages.length ?
                            todo._todoImages.map((file) => (
                                <div>
                                    <i class="fa fa-times" aria-hidden="true"
                                        style={{ display: "flex", "flex-direction": "row-reverse" }}
                                        onClick={() => deleteImage(file._id)}
                                        disabled={!todo.isActive}
                                    >
                                        <img src={`data:image/jpeg;base64,${file.base64}`} className="img-avatar mr-1" alt="User Img"
                                            style={{ height: "80px", width: "80px" }}
                                        />
                                    </i>
                                </div>
                                // <img src={`http://localhost:3000/uploads/${file.filename}`} className="img-avatar mr-1" alt="User Img" />
                            ))
                            : <img src={'../../assets/img/user-img-default.png'} className="img-avatar mr-1" alt="User Img" />
                        }
                    </div>
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