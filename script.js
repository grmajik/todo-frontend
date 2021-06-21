"use strict";

const add = document.getElementById('add');
const task = document.getElementById('task-name');
const answersWrapper = document.querySelector('.answers-wrapper');
const counter = document.querySelector('.counter');
const appControls = document.querySelector('.app-controls');
const clearTasks = document.querySelector('.completed a');

let divsCounter = 0;

function checkControlsState(divsCounter) {
	if (divsCounter != 0) {
		appControls.style.display = "flex";
	} else {
		appControls.style.display = "none";
	}
}

clearTasks.addEventListener('click', (e) => {
	const arr = [...answersWrapper.childNodes];
	for (let i = 0; i < arr.length; i++) {
		console.log(arr[i].firstChild.checked);
		if (arr[i].firstChild.checked) {
			answersWrapper.removeChild(arr[i]);
		}
	}
	checkControlsState(divsCounter);
})

add.addEventListener('click', () => {
	// if (task.value == "") {
	// 	alert('Please enter a task!');
	// 	return;
	// } else {}
	const newDiv = document.createElement('div');
	newDiv.className = "answer-input";
	const newCheckbox = document.createElement('input');
	newCheckbox.type = "checkbox";
	const newText = document.createElement('input');
	newText.type = "text";
	newText.className = "text";
	newText.value = task.value;
	const newButton = document.createElement('input');
	newButton.type = 'button';
	newButton.value = 'Αφαίρεση';
	newButton.id = "remove";
	newDiv.appendChild(newCheckbox);
	newDiv.appendChild(newText);
	newDiv.appendChild(newButton);
	answersWrapper.appendChild(newDiv);
	task.value = '';
	counter.textContent = `${divsCounter+= 1} items left`;
	checkControlsState(divsCounter);
})

answersWrapper.addEventListener('click', (e) => {
	if (e.target.type === "button") {
		answersWrapper.removeChild(e.target.parentElement);
		counter.textContent = `${divsCounter -= 1} items left`;
		checkControlsState(divsCounter);
	} else {
		return;
	}
})

answersWrapper.addEventListener('change', (e) => {
	if (e.target.checked) {
		counter.textContent = `${divsCounter -= 1} items left`
	} else if (e.target.checked === false) {
		counter.textContent = `${divsCounter += 1} items left`
	}
})

checkControlsState(divsCounter);