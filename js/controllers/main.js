//TODOLIST
import Task from "./../models/Task.js";
import TaskService from "./../services/TaskService.js";

const validation = new Validation();
const task = new TaskService();
//tạo hàm dom tới ID
const getEle = (id) => document.getElementById(id);

//tạo hàm render
const renderTask = (list) => {
  return list.reduce((contentHTML, item) => {
    return (contentHTML += `
        <li>            
            <button class="complete" onclick="updTask(${item.id})"><i class="far fa-check-circle"></i></button>            
            <span>${item.text}</span>            
            <button class="remove" onclick="delTask(${item.id})"><i class="fa fa-trash-alt"></button>            
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
        } else {
          pending.push(list);
          console.log(pending);
        }

        //đưa data đã có ra UI
        getEle("newTask").value = ""; //xoá nhập liệu
        getEle("todo").innerHTML = renderTask(pending); //đưa list pending ra HTML
        getEle("complete").innerHTML = renderTask(final); //đưa list final ra HTML
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
fetchData();

// tạo hàm thêm task mới vào list
getEle("addItem").addEventListener("click", () => {
  let newTask = getEle("newTask").value;

  let taskList = new Task(newTask, false);

  //   let isValid = true;
  //   isValid &= validation.testEmpty(
  //     newTask,
  //     "divErr",
  //     "Please enter an activity"
  //   );

  task
    .callApi("TODOLIST", "POST", taskList)
    .then((result) => {
      fetchData();
    })
    .catch((err) => {
      console.log(err);
    });
});

// window.newTask = newTask;
