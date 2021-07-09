//TODOLIST
import Task from "./../models/Task.js";
import TaskService from "./../services/TaskService.js";

const task = new TaskService();
//tạo hàm dom tới ID
const getEle = (id) => document.getElementById(id);

//tạo hàm render
const renderTask = (list) => {
  return list.reduce((contentHTML, item) => {
    return (contentHTML += `
        <li>            
            <button class="complete" onclick="updTask(${item.id})"><span class="far fa-check-circle"></span></button>            
            <span>${item.text}</span>            
            <div>            
              <button class="remove" onclick="ediTask(${item.id})"><span class="fas fa-wrench"></span></button> 
              <button class="remove" onclick="delTask(${item.id})"><span class="fa fa-trash-alt"></button>            
            </div>
        </li>
    `);
  }, "");
};

// tạo hàm lấy data
const fetchData = () => {
  task
    .callApi("TODOLIST", "GET", null)
    .then((result) => {
      /**
       * tạo 2 mảng hứng data từ API
       * pend chứa data chưa hoàn thành hoặc mới tạo
       * final chứa data đã hoàn thành
       * đưa 2 data ra UI theo 2 class trên HTML đã có sẵn
       */
      let pending = [];
      let final = [];
      //tạo vòng lập check data từ API
      result.data.forEach((list) => {
        if (list.checked) {
          final.push(list);
          // console.log(final);
        } else {
          pending.push(list);
          // console.log(pending);
        }
      });
      //đưa data đã có ra UI
      getEle("newTask").value = ""; //xoá nhập liệu
      getEle("todo").innerHTML = renderTask(pending); //đưa list pending ra HTML
      getEle("completed").innerHTML = renderTask(final); //đưa list final ra HTML

      //sắp sếp a-z
      getEle("two").addEventListener("click", () => {
        pending.sort((a, b) => a.text.localeCompare(b.text));
        final.sort((a, b) => a.text.localeCompare(b.text));
        getEle("todo").innerHTML = renderTask(pending);
        getEle("completed").innerHTML = renderTask(final);
      });
      //sắp sếp z-a
      getEle("three").addEventListener("click", () => {
        pending.sort((a, b) => b.text.localeCompare(a.text));
        final.sort((a, b) => b.text.localeCompare(a.text));
        getEle("todo").innerHTML = renderTask(pending);
        getEle("completed").innerHTML = renderTask(final);
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
fetchData();

// tạo hàm thêm task mới vào list
const addTask = () => {
  let newTask = getEle("newTask").value;

  let taskList = new Task(newTask, false);
  if (newTask.trim() !== "") {
    task
      .callApi("TODOLIST", "POST", taskList)
      .then((result) => {
        fetchData();
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
window.addTask = addTask;

// tạo hàm update task final hoặc chưa hoàn thành
const updTask = (id) => {
  task
    .callApi(`TODOLIST/${id}`, "GET", null)
    .then((result) => {
      let isCheck = false;
      if (isCheck === result.data.checked) {
        isCheck = true;
        console.log(isCheck);
      }
      let taskList = new Task(result.data.text, isCheck, id);
      console.log(isCheck);
      task
        .callApi(`TODOLIST/${taskList.id}`, "PUT", taskList)
        .then((result) => {
          fetchData();
        })
        .catch((err) => {
          console.log(err);
        });
    })

    .catch((err) => {
      console.log(err);
    });
};
window.updTask = updTask;

// tạo hàm xoá task
const delTask = (id) => {
  task
    .callApi(`TODOLIST/${id}`, "DELETE", null)
    .then((result) => {
      fetchData();
    })
    .catch((err) => {
      console.log(err);
    });
};
window.delTask = delTask;

// tạo hàm chỉnh sửa task
const ediTask = (id) => {
  task
    .callApi(`TODOLIST/${id}`, "GET", null)
    .then((result) => {
      getEle("newTask").value = result.data.text;
      getEle(
        "addItem"
      ).innerHTML = `<i class="fa fa-plus" onclick="changeTask(${id})" title="Add Task"></i>`;
    })
    .catch((err) => {
      console.log(err);
    });
};
window.ediTask = ediTask;

// tạo hàm chinh sua text task
const changeTask = (id, checked) => {
  let newTask = getEle("newTask").value;

  let taskList = new Task(newTask, checked, id);
  if (newTask.trim() !== "") {
    task
      .callApi(`TODOLIST/${taskList.id}`, "PUT", taskList)
      .then((result) => {
        fetchData();
        getEle(
          "addItem"
        ).innerHTML = `<i class="fa fa-plus" onclick="addTask()"></i>`;
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
window.changeTask = changeTask;

// tạo loading khi trang web kéo dữ liệu về

$(window).on("load", function () {
  $("body").removeClass("preloading");
  $(".lds-spinner").fadeOut("fast");
});
