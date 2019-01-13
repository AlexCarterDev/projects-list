const CLS_MATERIAL_ICONS = "material-icons";
const CLS_DESCRIPTION = "description";
const CLS_BTN_REMOVE = "btn-remove";
const CLS_TASK = "task";
const CLS_UNSELECTABLE = "unselectable";
const CLS_CHECKBOX = "checkbox";
const CLS_BTN_DRAG = "btn-drag";

// KC - KeyCode
const KC_BACKSPACE = 8;
const KC_ENTER = 13;
const KC_UP = 38;
const KC_DOWN = 40;
const KS_LEFT = 37;
const KS_RIGHT = 39;

const POS_DESCR = 2;
const POS_CHECKBOX = 1;

var taskList = document.querySelector(".todo .task-container");
var percentage = document.querySelector(".todo .percentage");
var newTask = document.querySelector(".todo .new-task");

function load() {
    var aTasks = [];
    var loadedString = localStorage.getItem("tasks");

    if (loadedString != null) {
        aTasks = JSON.parse(loadedString);

        for (let i = 0; i < aTasks.length; i++) {
            var descr = aTasks[i].description;
            var isComplete = aTasks[i].isComplete;
            var task = createNewTask(descr, isComplete);
            taskList.appendChild(task);
        }
    }
}

function save() {
    var aTasks = [];    
    for (let i = 0; i < taskList.children.length; i++) {
        aTasks[i] = {
            description: taskList.children[i].children[POS_DESCR].innerHTML,
            isComplete: taskList.children[i].children[POS_CHECKBOX].state
        };
    }

    localStorage.setItem("tasks", JSON.stringify(aTasks));
}

function updatePercentage() {
    var taskCount = taskList.children.length;
    var completedTaskCount = 0;

    for (let i = 0; i < taskCount; i++) {
        var cb = taskList.children[i].children[POS_CHECKBOX];
        completedTaskCount += cb.state;
    }
    
    if (taskCount == 0) {
        percentage.innerHTML = "";
    } else {
        percentage.innerHTML = Math.round((completedTaskCount/taskCount)*100) + "%";
    }
}

function setCheckBoxState(checkBox, isDone) {
    checkBox.state = isDone;
    if (isDone) {
        checkBox.innerHTML = "check_box";
    } else {
        checkBox.innerHTML = "check_box_outline_blank";
    }
}


function updateStyle(task) {
    if (task.children[POS_CHECKBOX].state) {
        task.classList.add("completed");
    } else {
        task.classList.remove("completed");
    }
}

function getCheckBoxState(checkBox) {
    return checkBox.state;
}

function removeTask(task) {
    task.parentElement.removeChild(task);
    updatePercentage();
}

/* Function from stackoverflow */
function moveCursorToEnd(el) {
    el.focus();
    if (typeof window.getSelection != "undefined"
            && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(false);
        textRange.select();
    }
}

function focusOnLastDescr(taskList) {
    if (taskList.children.length > 0) {
        var lastDescr = taskList.lastChild.children[POS_DESCR];
        moveCursorToEnd(lastDescr);
    }    
}

function focusOnPrevDescr(task) {
    if (task.previousSibling !== null) {
        var prev = task.previousSibling.children[POS_DESCR];
        moveCursorToEnd(prev);
    }
}

function createNewTask(text, isComplete) {
    var task = document.createElement("li");
    task.className = CLS_TASK;

    var dragBtn = document.createElement("i");
    dragBtn.className = CLS_MATERIAL_ICONS + " " + CLS_UNSELECTABLE + " " + CLS_BTN_DRAG;
    dragBtn.innerHTML = "drag_indicator";

    var checkBox = document.createElement("i");
    setCheckBoxState(checkBox, isComplete);
    checkBox.className = CLS_MATERIAL_ICONS + " " + CLS_UNSELECTABLE + " " + CLS_CHECKBOX;
    checkBox.onclick = function() {
        setCheckBoxState(checkBox, !getCheckBoxState(checkBox));
        updateStyle(task);
        updatePercentage();
    };

    var descr = document.createElement("span");
    descr.className = CLS_DESCRIPTION;
    descr.innerHTML = text;
    descr.setAttribute("contenteditable", "true");
    descr.onkeydown = function(e) {
        if ((e.keyCode === KC_BACKSPACE) && ((e.target.innerHTML === "<br>") || (e.target.innerText.length === 0))) {
            if (task.previousSibling !== null) {
                focusOnPrevDescr(task);
                removeTask(task);
            }
            /* Do not delete last character from selected task */
            return false;
        }

        if ((e.keyCode === KC_ENTER) & (e.shiftKey === false)) {
            let t = createNewTask("", false);
            task.after(t);
            t.getElementsByClassName(CLS_DESCRIPTION)[0].focus();
            updatePercentage();
            return false;
        }

        if ((task.previousSibling !== null) && (e.keyCode === KC_UP) && (e.shiftKey === false)) {
                task.previousSibling.children[POS_DESCR].focus();
                return false;
        }

        if ((task.nextSibling !== null) && (e.keyCode === KC_DOWN) && (e.shiftKey === false)) {
                task.nextSibling.children[POS_DESCR].focus();
                return false;
        }
    }

    var removeBtn = document.createElement("i");
    removeBtn.className = CLS_MATERIAL_ICONS + " " + CLS_BTN_REMOVE + " " + CLS_UNSELECTABLE;
    removeBtn.innerHTML = "remove_circle";
    removeBtn.onclick = function() {
        removeTask(task);
    };

    task.appendChild(dragBtn);
    task.appendChild(checkBox);
    task.appendChild(descr);
    task.appendChild(removeBtn);
    
    updateStyle(task);

    return task;
}


newTask.onkeydown = function(e) {
    // Enter, Shift, Backspace, Up etc 
    var keyCodeIsSpecial = e.keyCode <= 47 | e.keyCode === 91 | e.keyCode === 144 | e.keyCode === 145;

    if ((e.keyCode === KC_BACKSPACE) && (e.target.value === "")) {
        focusOnLastDescr(taskList);
        return false;
    } else if (!keyCodeIsSpecial){
        let task = createNewTask("", false);
        if (taskList.children.length === 0) {
            taskList.appendChild(task);
        } else {
            taskList.lastChild.after(task);
        }
        task.children[POS_DESCR].focus();
        updatePercentage();
    }
}


var firstStart = 
    (localStorage.getItem("first_start") === null) || 
    (localStorage.getItem("first_start") === "true");

if (firstStart) {
    var task1 = createNewTask("Feed my cat", false);
    var task2 = createNewTask("Learn english", false);
    var task3 = createNewTask("Clean room", false);

    taskList.appendChild(task1);
    taskList.appendChild(task2);
    taskList.appendChild(task3);
    
    save();
    localStorage.setItem("first_start", "false");
} else {
    load();
}

window.addEventListener('beforeunload', function(event) {
    save();
  }, false);

updatePercentage();

var sortable = Sortable.create(taskList, {
    handle: ".btn-drag",
    animation: 100, 
    chosenClass: "todo-chosen-task",
    ghostClass: "todo-ghost-task",
});