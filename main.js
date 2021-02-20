'use strict'

const socialPosts = []

function $(id) {
	return document.getElementById(id);
}

function stringHash(str) {
	// if you think this is a hash you are mistaken
	let num = 0
	for (let i = 0; i < 6; i++) {
		num += str.charCodeAt(i) * (256 ** i)
	}
	return num
}

function addListeners() {
	$('selectDisplayFlags').addEventListener('click', () => {
		$('justFlagsDiv').classList.remove('hidden');
		$('socialDiv').classList.add('hidden');
	});
	$('selectDisplaySocial').addEventListener('click', () => {
		$('justFlagsDiv').classList.add('hidden');
		$('socialDiv').classList.remove('hidden');
	});
	$('generateNewPost').addEventListener('click', () => {
		clearPosts();
		generatePost();
	});
	$('generateFlagGrid').addEventListener('click', () => {
		clearFlags();
		generateFlagGrid();
	});
}

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
		flag.setAttribute('transform', 'scale(1.12)');
		container.append(flag);
		flagGrid.append(container);
	}
}

function clearFlags() {
	$('flagGrid').remove()
	const flagGrid = document.createElement('div');
	flagGrid.id = 'flagGrid';
	flagGrid.classList.add('flag-grid');
	$('justFlagsDiv').appendChild(flagGrid);
}

function loadPosts() {
	fetch("assets/posts.json")
		.then(response => response.json())
		.then(json => {
			json.forEach(post => socialPosts.push(post));
			generatePost();
		});
}

function generatePost() {
	const randomInt = Math.floor(Math.random() * socialPosts.length); 
	const postData = socialPosts[randomInt];
	const salt = Math.floor(Math.random() * 9999989);
	const containerDiv = $('postDisplay');
	for (let i = 0; i < postData.length; i++) {
		const postContainer = document.createElement('div');
		const textContainer = document.createElement('div');
		const avatarContainer = document.createElement('div');
		const postHead = document.createElement('div');
		const postText = document.createElement('p');
		const username = document.createElement('span');
		const time = document.createElement('time');
		const spacer = document.createElement('span');
		postContainer.classList.add('post');
		username.classList.add('username');
		textContainer.classList.add('post-text');
		const flag = createAvatar(stringHash(postData[i].user) + salt);
		avatarContainer.classList.add('avatar');
		avatarContainer.classList.add('flag');
		const timeObj = new Date(postData[i].timestamp)
		let timeString = timeObj.toLocaleDateString() + "  " + timeObj.toLocaleTimeString();
		spacer.textContent = "   ";
		postText.textContent = postData[i].content;
		username.textContent = postData[i].user;
		time.textContent = timeString;
		avatarContainer.appendChild(flag);
		postContainer.appendChild(avatarContainer);
		postHead.appendChild(username);
		postHead.appendChild(spacer);
		postHead.appendChild(time);
		textContainer.appendChild(postHead);
		if ('imageSrc' in postData[i]) {
			const image = document.createElement('img');
			image.src = postData[i].imageSrc;
			image.classList.add('image-post');
			postText.appendChild(image);
		}
		textContainer.appendChild(postText);
		postContainer.appendChild(textContainer);
		containerDiv.appendChild(postContainer);
	}
}

function clearPosts() {
	$('postDisplay').remove()
	const postDisplayDiv = document.createElement('div');
	postDisplayDiv.id = 'postDisplay';
	postDisplayDiv.classList.add('post-display');
	$('socialDiv').appendChild(postDisplayDiv);

}

function main() {
	addListeners();
	loadPosts();
	generateFlagGrid();
}

main();
