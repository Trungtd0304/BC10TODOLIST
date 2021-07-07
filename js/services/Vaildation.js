function Validation() {
  // tài khoản không được để trống
  this.testEmpty = function (input, divID, mess) {
    if (input.trim() === "") {
      getEle(divID).innerHTML = mess;
      getEle(divID).className = "alert alert-danger";
      return false;
    }
    getEle(divID).innerHTML = "";
    getEle(divID).className = "";
    return true;
  };
}
