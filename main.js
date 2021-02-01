'use strict'

function $(id) {
	return document.getElementById(id);
}

$('generateFlagGrid').addEventListener('click', () => {
	clearFlags();
});

function generateFlagGrid() {
	const seed = Math.floor(Math.random() * 9999989);
  const flagGrid = $('flagGrid');
	for (let i = 0; i < 36; i++) {
		const container = document.createElement('div');
		container.classList.add('flag');
		const flag = createAvatar(seed + i);
		container.append(flag);
		flagGrid.append(container);
	}
}

function clearFlags() {
	$('flagGrid').remove()
	const flagGrid = document.createElement('div');
	flagGrid.id = 'flagGrid';
	flagGrid.classList.add('flag-grid');
	$('content').appendChild(flagGrid);
	generateFlagGrid();
}
