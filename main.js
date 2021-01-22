'use strict'

function $(id) {
	return document.getElementById(id);
}

$('go').addEventListener('click', () => {
	clearFlags();
});

function generateFlags(table) {
	let row
	const seed = Math.floor(Math.random() * 9999989);
	for (let i = 0; i < 36; i++) {
		if (i % 6 == 0) {
			row = document.createElement('tr');
			row.style.margin = '2em';
			table.appendChild(row);
		}
		const box = document.createElement('td');
		box.style.margin = '4em';
		const flag = createAvatar(seed + i);
		box.appendChild(flag)
		row.appendChild(box)
	}
}

function clearFlags() {
	$('flags').remove()
	const flags = document.createElement('table');
	flags.id = 'flags';
	$('content').appendChild(flags);
	generateFlags(flags);
}
