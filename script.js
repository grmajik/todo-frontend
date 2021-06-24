"use strict";

const add = document.getElementById('add');
const task = document.getElementById('task-name');
const answersWrapper = document.querySelector('.answers-wrapper');
const counter = document.querySelector('.counter');
const appControls = document.querySelector('.app-controls');
const clearTasks = document.querySelector('.completed');

/////////////////////////////////
///// BEGIN THEME SWITCHER //////
/////////////////////////////////

const iconMoon = document.querySelector('.icon-moon');
const iconSun = document.querySelector('.icon-sun');
const tog = document.querySelector('.toggle');
const body = document.getElementById('body');
const img1 = document.querySelector('.img--1');
const img2 = document.querySelector('.img--2');
let currentTheme = localStorage.getItem("theme");
let answers;

function darkTheme() {
	iconMoon.classList.remove('show');
	iconMoon.classList.add('hide');
	iconSun.classList.remove('hide');
	iconSun.classList.add('show');

	body.classList.remove('light');
	body.classList.add('dark');
	task.style.backgroundColor = "#25273c";
	task.style.color = "hsl(236, 9%, 61%)";

	img1.classList.remove('show-image');
	img1.classList.add('hide-image');
	img2.classList.remove('hide-image');
	img2.classList.add('show-image');

	if (answers == null) {
		return;
	} else if (answers) {
		answers.forEach(answer => {
			answer.style.backgroundColor = "#25273c";
			answer.style.color = "#b6b8d0";
			answer.style.borderBottom = "1px solid #323449";
		})
	}
}

function lightTheme() {
	iconMoon.classList.remove('hide');
	iconMoon.classList.add('show');
	iconSun.classList.remove('show');
	iconSun.classList.add('hide');
	body.classList.remove('dark');
	body.classList.add('light');
	task.style.backgroundColor = "hsl(0, 0%, 98%)";
	task.style.color = "hsl(236, 9%, 61%)";

	img2.classList.remove('show-image');
	img2.classList.add('hide-image');
	img1.classList.remove('hide-image');
	img1.classList.add('show-image');

	if (answers == null) {
		return;
	} else if (answers) {
		answers.forEach(answer => {
			answer.style.backgroundColor = "#ffffff";
			answer.style.color = "#616276";
			answer.style.borderBottom = "1px solid #CCCCCC";
		})
	}
}

tog.addEventListener('click', (e) => {
	e.preventDefault();
	if (body.classList.contains('dark')) {
		lightTheme();
		currentTheme = "light";
		localStorage.setItem("theme", currentTheme);
	} else if (body.classList.contains('light')) {
		darkTheme();
		currentTheme = "dark"
		localStorage.setItem("theme", currentTheme);
	}
})

function checkTheme(theme) {
	if (theme == "light") {
		lightTheme();
	} else if (theme == "dark") {
		darkTheme();
	}
}

checkTheme(currentTheme);

/////////////////////////////////
///// END OF THEME SWITCHER /////
/////////////////////////////////

//////////////////////////////////////
//// BEGIN SORTABLE FUNCTIONALITY ////
//////////////////////////////////////

// Listen in for drag events globally since
// the only thing that can be dragged is each task

const container = document.querySelector('.answers-wrapper');

document.addEventListener('dragstart', e => {
	e.target.classList.add('dragging');
})

document.addEventListener('dragend', e => {
	e.target.classList.remove('dragging');
})

container.addEventListener('dragover', e => {
	e.preventDefault();
	const afterElement = getDragAfterElement(container, e.clientY);
	const draggable = document.querySelector('.dragging');
	if (afterElement == null) {
		container.appendChild(draggable);
	} else {
		container.insertBefore(draggable, afterElement);
	}
})

function getDragAfterElement(container, y) {
	const draggableElements = [...container.querySelectorAll('.answer-input:not(.dragging)')];
	return draggableElements.reduce((closest, child) => {
		const box = child.getBoundingClientRect();
		const offset = y - box.top - box.height / 2;
		if (offset < 0 && offset > closest.offset) {
			return { offset: offset, element: child }
		} else {
			return closest;
		}
	}, { offset: Number.NEGATIVE_INFINITY }).element;
}

//////////////////////////////////////////////
//////// END OF SORTABLE FUNCTIONALITY ///////
//////////////////////////////////////////////


//////////////////////////////////////////////
///////// BEGIN BASIC FUNCTIONALITY  /////////
//////////////////////////////////////////////

let checkboxes;

const LOCALSTORAGE_KEY = "answers";

function saveToLocalStorage() {
	if (answers) {
		const answersAsTextArray = Array.from(answers).map(
			(answer) => answer.value
		);
		localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(answersAsTextArray));
	}
}

function fetchFromLocalStorage() {
	const answersAsTextArray = localStorage.getItem(LOCALSTORAGE_KEY);
	if (answersAsTextArray) {
		JSON.parse(answersAsTextArray).forEach((answer) => {
			const newDiv = generateNewItem(answer);
			answersWrapper.appendChild(newDiv);
		});
	}
}

function generateNewItem(value) {
	const newDiv = document.createElement("div");
	newDiv.className = "answer-input";
	newDiv.draggable = true;
	const newCheckbox = document.createElement("input");
	newCheckbox.type = "checkbox";
	const newText = document.createElement("input");
	newText.type = "text";
	newText.className = "text draggable";
	newText.value = value;
	newText.readOnly = true;
	if (body.classList.contains("dark")) {
		newText.style.backgroundColor = "#25273c";
		newText.style.borderBottom = "1px solid #323449";
		newText.style.color = "#b6b8d0";
	} else if (body.classList.contains("light")) {
		newText.style.backgroundColor = "#ffffff";
		newText.style.borderBottom = "1px solid #CCCCCC";
		newText.style.color = "#616276";
	}
	const newButton = document.createElement("input");
	newButton.type = "button";
	newButton.value = "Remove";
	newDiv.appendChild(newCheckbox);
	newDiv.appendChild(newText);
	newDiv.appendChild(newButton);
	return newDiv;
}

add.addEventListener('click', (e) => {
	e.preventDefault();
	const newDiv = generateNewItem(task.value);
	answersWrapper.appendChild(newDiv);
	task.value = '';
	answers = document.querySelectorAll('.draggable');
	checkboxes = document.querySelectorAll('.answer-input input[type="checkbox"]');
	saveToLocalStorage();
})

fetchFromLocalStorage();

// window.onload ()

///////////////////////////////////////
///// END OF BASIC FUNCTIONALITY //////
///////////////////////////////////////

// let divsCounter = 0;

// function checkControlsState(divsCounter) {
// 	if (divsCounter > 0) {
// 		appControls.style.display = "flex";
// 	} else {
// 		appControls.style.display = "none";
// 	}
// }

clearTasks.addEventListener('click', (e) => {
	const arr = [...answersWrapper.childNodes];
	for (let i = 0; i < arr.length; i++) {
		if (arr[i].firstChild.checked) {
			answersWrapper.removeChild(arr[i]);
		}
	}
	// checkControlsState(divsCounter);
})

answersWrapper.addEventListener('click', e => {
	if (e.target.type === "button") {
		// if (e.target.parentElement.firstChild.checked) {
		// 	counter.textContent = `${divsCounter} items left`;
		// } else {
		// 	counter.textContent = `${divsCounter -= 1} items left`;
		// }
		answersWrapper.removeChild(e.target.parentElement);
	}
	// checkControlsState(divsCounter);
});

// answersWrapper.addEventListener('change', (e) => {
// 	if (e.target.checked) {
// 		counter.textContent = `${divsCounter -= 1} items left`
// 	} else if (e.target.checked === false) {
// 		counter.textContent = `${divsCounter += 1} items left`
// 	}
// })

// checkControlsState(divsCounter);