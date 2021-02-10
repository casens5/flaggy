'use strict'

function $(id) {
	return document.getElementById(id);
}

$('generateFlagGrid').addEventListener('click', () => {
	clearFlags();
});

function testy() {
	const seed = bigChungus(169);
	const cols = selectColors(seed);
	const test = setBg(seed, cols[0])
	const width = test.width.baseVal.value;
	const height = test.height.baseVal.value;
	const group = document.createElementNS(svgNameSpace, 'g');
	const rhom = drawRect(width * .4, .943 * width * .4, cols[1]);
	rhom.setAttribute('transform', `
			skewX(19.5)`);
	group.setAttribute('transform', `
		translate(${width / 2}, ${height / 2})
		rotate(-35.25)`);
	group.appendChild(rhom);
	test.appendChild(group);
	$('test').appendChild(test);
}

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
