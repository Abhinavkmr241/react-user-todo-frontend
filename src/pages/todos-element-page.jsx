import React from 'react';
import { Button, CustomInput, Input } from 'reactstrap';
import { editTodo, deleteTodo } from '../http/http-calls';

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

    return (
        <div className={`addedLinksWrap ${todo._id}`}>
            <div className={`moveLink ${todo._id}`}>
                <i className="fa fa-ellipsis-v"></i>
            </div>
            <div className={`addedLinkDetails ${todo._id}`}>
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