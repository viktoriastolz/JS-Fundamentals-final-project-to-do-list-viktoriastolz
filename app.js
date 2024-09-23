document.addEventListener('DOMContentLoaded', () => {
    const listSelector = document.getElementById('list-selector');
    const listNameInput = document.getElementById('list-name');
    const newListButton = document.getElementById('new-list-btn');
    const deleteListButton = document.getElementById('delete-list-btn');
    const taskInput = document.getElementById('task-input');
    const addTaskButton = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const listTitle = document.getElementById('list-title');
    const clearCompletedButton = document.getElementById('clear-completed-btn');
    
    let lists = JSON.parse(localStorage.getItem('todoLists')) || {};

    // Initialize default list if empty
    if (Object.keys(lists).length === 0) {
        lists['My workday'] = [];
        localStorage.setItem('todoLists', JSON.stringify(lists));
    }

    let currentList = Object.keys(lists)[0] || 'My workday';

    function saveLists() {
        localStorage.setItem('todoLists', JSON.stringify(lists));
    }

    function renderListSelector() {
        listSelector.innerHTML = '';
        Object.keys(lists).forEach(list => {
            const option = document.createElement('option');
            option.value = list;
            option.textContent = list;
            if (list === currentList) {
                option.selected = true;
            }
            listSelector.appendChild(option);
        });
    }

    function renderTasks() {
        taskList.innerHTML = '';
        const tasks = lists[currentList];
        tasks.forEach((task, index) => {
            const li = document.createElement('li');

            // Checkbox
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', () => {
                task.completed = checkbox.checked;
                renderTasks();
                saveLists();
            });

            // Task Text
            const taskText = document.createElement('span');
            taskText.textContent = task.name;
            taskText.classList.add('task-text');
            if (task.completed) {
                taskText.classList.add('completed');
            } else {
                taskText.classList.remove('completed');
            }

            // Icons Container
            const iconsContainer = document.createElement('div');
            iconsContainer.classList.add('icons');

            // Edit Icon
            const editIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            editIcon.setAttribute('width', '18');
            editIcon.setAttribute('height', '18');
            editIcon.setAttribute('viewBox', '0 0 18 18');
            editIcon.setAttribute('fill', 'none');
            editIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            editIcon.innerHTML = `<path d="M8.67272 5.99106L2 12.6637V16H5.33636L12.0091 9.32736M8.67272 5.99106L11.0654 3.59837L11.0669 3.59695C11.3962 3.26759 11.5612 3.10261 11.7514 3.04082C11.9189 2.98639 12.0993 2.98639 12.2669 3.04082C12.4569 3.10257 12.6217 3.26735 12.9506 3.59625L14.4018 5.04738C14.7321 5.37769 14.8973 5.54292 14.9592 5.73337C15.0136 5.90088 15.0136 6.08133 14.9592 6.24885C14.8974 6.43916 14.7324 6.60414 14.4025 6.93398L14.4018 6.93468L12.0091 9.32736M8.67272 5.99106L12.0091 9.32736" stroke-linecap="round" stroke-linejoin="round"/>`;
            editIcon.classList.add('edit-icon');
            editIcon.addEventListener('click', () => {
                const newTaskName = prompt('Edit task:', task.name);
                if (newTaskName) {
                    task.name = newTaskName;
                    renderTasks();
                    saveLists();
                }
            });

            // Delete Icon
            const deleteIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            deleteIcon.setAttribute('width', '18');
            deleteIcon.setAttribute('height', '18');
            deleteIcon.setAttribute('viewBox', '0 0 18 18');
            deleteIcon.setAttribute('fill', 'none');
            deleteIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            deleteIcon.innerHTML = `<path d="M3.87414 7.61505C3.80712 6.74386 4.49595 6 5.36971 6H12.63C13.5039 6 14.1927 6.74385 14.1257 7.61505L13.6064 14.365C13.5463 15.1465 12.8946 15.75 12.1108 15.75H5.88894C5.10514 15.75 4.45348 15.1465 4.39336 14.365L3.87414 7.61505Z"/> <path d="M14.625 3.75H3.375" stroke-linecap="round"/> <path d="M7.5 2.25C7.5 1.83579 7.83577 1.5 8.25 1.5H9.75C10.1642 1.5 10.5 1.83579 10.5 2.25V3.75H7.5V2.25Z"/> <path d="M10.5 9V12.75" stroke-linecap="round"/> <path d="M7.5 9V12.75" stroke-linecap="round"/>`;
            deleteIcon.classList.add('delete-icon');
            deleteIcon.addEventListener('click', () => {
                lists[currentList].splice(index, 1);
                renderTasks();
                saveLists();
            });

            // Append elements
            iconsContainer.appendChild(editIcon);
            iconsContainer.appendChild(deleteIcon);
            li.appendChild(checkbox);
            li.appendChild(taskText);
            li.appendChild(iconsContainer);
            taskList.appendChild(li);
        });
    }

    function renderCurrentList() {
        listTitle.textContent = currentList;
        renderTasks();
    }

    function initialize() {
        renderListSelector();
        renderCurrentList();
        
        listSelector.addEventListener('change', (e) => {
            currentList = e.target.value;
            renderCurrentList();
        });

        newListButton.addEventListener('click', () => {
            const newListName = listNameInput.value.trim();
            if (newListName && !lists[newListName]) {
                lists[newListName] = [];
                currentList = newListName;
                listNameInput.value = '';
                renderListSelector();
                renderCurrentList();
                saveLists();
            }
        });

        deleteListButton.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this list?')) {
                delete lists[currentList];
                currentList = Object.keys(lists)[0] || '';
                renderListSelector();
                renderCurrentList();
                saveLists();
            }
        });

        addTaskButton.addEventListener('click', () => {
            const taskName = taskInput.value.trim();
            if (taskName) {
                lists[currentList].push({ name: taskName, completed: false });
                taskInput.value = '';
                renderTasks();
                saveLists();
            }
        });

        clearCompletedButton.addEventListener('click', () => {
            lists[currentList] = lists[currentList].filter(task => !task.completed);
            renderTasks();
            saveLists();
        });
    }

    initialize();
});

