const taskName = document.querySelector('.task-name');
const taskDescription = document.querySelector('.task-description');
const taskCategory = document.querySelector('select');
const form = document.querySelector('form');
const showTask = document.querySelector('#show-task');
const editTaskBox = document.querySelector('#edit-task');
const editForm = document.querySelector('#edit-task-form');

let taskArr = JSON.parse(localStorage.getItem('task')) || [];

let currentEditIndex = null;

const statusColors = {
    complete: '#98FB98',
    pending: '#F0E68C',
    reject: '#F88379',
};

const statusLabels = {
    complete: 'COMPLETE',
    pending: 'PENDING',
    reject: 'REJECT',
};

const categoryBanner = {
    Personal: 'https://i.pinimg.com/1200x/55/a3/14/55a3148a17ba9402bfc413acb437fd42.jpg',
    Gym: 'https://i.pinimg.com/1200x/2d/67/27/2d67274f2eda4927568112345e95beba.jpg',
    Office: 'https://i.pinimg.com/1200x/8a/44/50/8a44501a5b9ab3db1380a47201fbc4af.jpg',
    Spiritual: 'https://i.pinimg.com/1200x/ae/e0/b4/aee0b466269425c99b2d3598b9bea7de.jpg',
}

const ui = ()=>{
    showTask.innerHTML = '';
    taskArr.forEach((elem,index)=>{
        const backgroundColor = statusColors[elem.status];
        const label = statusLabels[elem.status];
        const isComplete = elem.status === 'complete';
        const taskCat = categoryBanner[elem.tCategory];

        showTask.innerHTML += `<div class="task-box" style = "background-color: ${backgroundColor};">
        <div class="img-category">
            <img src="${taskCat}" alt="">
        </div>
        <div class="task-name">
            <h4 style="${isComplete ? 'text-decoration: line-through' : ''}">${elem.tName.toUpperCase()}<span>${label}</span></h4>
            <p>${elem.tDescription}</p>
        </div>
        <div class="task-status">
            <i class="ri-edit-fill" title="Edit" onclick="editTask('${index}')"></i>
            <i class="ri-delete-bin-fill" title="Delete" onclick="dltTask(${index})"></i>
            <i class="ri-check-line" title="Task Complete" onclick="completeTask(${index})"></i>
            <i class="ri-error-warning-fill" title="Task Pending" onclick="pendingTask(${index})"></i>
            <i class="ri-close-circle-fill" title="Task Reject" onclick="rejectTask(${index})"></i>
        </div>
    </div>`;
    })
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    let taskN = taskName.value;
    let taskD = taskDescription.value;
    let taskC = taskCategory.value;

    if(taskN.trim() === '' || taskD.trim() === '' || taskC.trim() === '') return;

    taskArr.push(
        {
            tName: taskN,
            tDescription: taskD,
            tCategory: taskC,
            status: 'pending',
        }
    );
    localStorage.setItem("task", JSON.stringify(taskArr));
    ui();
    form.reset();
});

editForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const clickedBtn = e.submitter;

    if (clickedBtn.classList.contains('cncl-btn')) {
        editTaskBox.style.display = 'none';
        currentEditIndex = null;
        return;
    }

    if (clickedBtn.classList.contains('edit-btn')) {
        taskArr[currentEditIndex].tName = editForm[0].value;
        taskArr[currentEditIndex].tDescription = editForm[1].value;
        taskArr[currentEditIndex].tCategory = editForm[2].value;
        localStorage.setItem("task", JSON.stringify(taskArr));
        ui();
        editTaskBox.style.display = 'none';
        currentEditIndex = null;
    }
});

const dltTask = (index)=>{
    taskArr.splice(index,1);
    localStorage.setItem("task", JSON.stringify(taskArr));
    ui();
}

const editTask = (index)=>{
    // const main = document.createElement('main');
    // main.append(editTaskBox);
    editTaskBox.style.display = 'block';
    currentEditIndex = index;
    const result = taskArr[index];
    editForm[0].value = result.tName;
    editForm[1].value = result.tDescription;
    editForm[2].value = result.tCategory;
}

const completeTask = (index)=>{
    taskArr[index].status = 'complete';
    ui();
}

const pendingTask = (index)=>{
    taskArr[index].status = 'pending';
    ui();
}

const rejectTask = (index)=>{
    taskArr[index].status = 'reject';
    ui();
}

const rstTask = ()=>{
    taskArr = [];
    localStorage.setItem("task", JSON.stringify(taskArr));
    ui();
}
