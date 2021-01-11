import config  from '../config';
import { makePostRequest, makeGetRequest, makePutRequest, makeDeleteRequest } from './http-service';
const BASE_URL = config.BASE_URL; // create a config.js to maintain the BASE_URL;

export const signUp = signupData => {
  console.log('BASE_URL :', BASE_URL);
  return new Promise((resolve, reject) => {
    makePostRequest(
      BASE_URL + "/signup",
      false,
      signupData
    )
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const login = loginData => {
  return new Promise((resolve, reject) => {
    makePostRequest(
      BASE_URL + "/login",
      false,
      loginData
    )
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const forgotPassword = handleData => {
  return new Promise((resolve, reject) => {
    makePostRequest(
      BASE_URL + "/forgotPassword",
      false,
      handleData
    )
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const userDetails = () => {
  return new Promise((resolve, reject) => {
    makeGetRequest(
      BASE_URL + "/user",
      true
    )
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const updateUser = (userData, id) => {
  return new Promise((resolve, reject) => {
    makePutRequest(
      BASE_URL + `/user/${id}`,
      true,
      userData
    ).then(res => {
      resolve(res);
    })
    .catch(e => {
      console.log("API call error: ", e);
      reject(e);
    });
  });
}

export const deleteUser = () => {
  return new Promise((resolve, reject) => {
    makeDeleteRequest(
      BASE_URL + `/user`,
      true
    ).then(res => {
      resolve(res);
    })
    .catch(e => {
      console.log("API call error: ", e);
      reject(e);
    });
  });
}

export const todoList = () => {
  return new Promise((resolve, reject) => {
    makeGetRequest(
      BASE_URL + "/todos",
      true
    )
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const addTodo = todoData => {
  return new Promise((resolve, reject) => {
    makePostRequest(
      BASE_URL + "/todo",
      true,
      todoData
    )
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const editTodo = (todoData, id) => {
  return new Promise((resolve, reject) => {
    makePutRequest(
      BASE_URL + `/todo/${id}`,
      true,
      todoData
    )
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const deleteTodo = (id) => {
  return new Promise((resolve, reject) => {
    makeDeleteRequest(
      BASE_URL + `/todo/${id}`,
      true
    ).then(res => {
      resolve(res);
    })
    .catch(e => {
      console.log("API call error: ", e);
      reject(e);
    });
  });
}