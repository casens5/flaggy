// ==UserScript==
// @name         flaggy
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  generates avatars with deterministic pseudorandomness
// @author       ludant
// @homepage     https://github.com/ludant
// @match        https://www.metaculus.com/*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

	// JS CANNOT DO MODULAR ARITHMETIC on values greater than 9 * 10**15
	// aka BigInt
	//
	// it turns out that the math gives different results in chrome vs firefox.  
	// lol
	//
	// avatars won't display if you click 'load more comments',  can this script
	// trigger more loading on data.loadMoreData() or btnSubmit()?
	
	const svgNameSpace = 'http://www.w3.org/2000/svg';
	const commentUsernames = document.querySelectorAll('.comment__author');
	const authorUsername = document.querySelector('[auth-name]');

	// we could also do this with alpha strings too but that's not within scope 
	// of current intended use
	// 
	// this function has tiny differences between firefox and chrome.  and i'm 
	// fine with that!
	function bigChungus(input) {
		const num = Math.floor(input);
		const val = Math.floor( ( ((21 ** (0.5)) ** (11 + (num % 13))) +
															((7 ** (1/4)) ** (26 + (num % 47))) + 
															((2 ** (1/4)) ** (96 + (num % 109))) +
															((2 ** (1/8)) ** (187 + (num % 223)))
														) % 9999991
													);
		return val;
	}

	function movePredictions() {
		const predictions = document.querySelectorAll('.comment__prediction');
		predictions.forEach(elem => elem.style.top = '4em')
	}

	function createAvatar(inputID) {
		const seed = bigChungus(inputID);
		const colors = selectColors(seed, 4);
		console.log('these are the colors', colors);
		const svg = setBg(seed);
		const bg = drawRect('100%', '100%', colors[0]);
		svg.appendChild(bg);
		const width = svg.width.baseVal.value;
		const height = svg.height.baseVal.value;
		const dimensions = [width, height];
		const layer = selectLayer(seed, dimensions, colors[1], colors[2]);
		svg.appendChild(layer)
		const emblem = selectEmblem(seed, dimensions, colors[3], svg.isCircle, layer.isBlank);
		svg.appendChild(emblem)
		//const layerThree = selectLayer(seed, dimensions, colors[3]);
		//svg.appendChild(layerThree)
		return svg;
	}

	function createSvg() {
		const svg = document.createElementNS(svgNameSpace, 'svg');
		svg.setAttribute('version', '1.1');
		svg.setAttribute('baseProfile', 'full');
		svg.setAttribute('viewbox', '0 0 100 100');
		svg.setAttribute('width', 50);
		svg.setAttribute('height', 50);
		return svg;
	}

	function setBg(seed) {
		// i may just have to settle for rectangles and circles.  or you'll find out 
		// later!
		const svg = createSvg();
		const determiner = (bigChungus(seed) + 93) % 101;
		svg.isCircle = false;
		if (determiner < 39) {
			//console.log('square', determiner);
			//square; do nothing
		} else if (determiner < 49) {
			// x = 59, y = 42
			//console.log('root 2 long', determiner);
			// svg.setAttribute('viewbox', '0 0 100 100');
			svg.setAttribute('width', 59);
			svg.setAttribute('height', 42);
		} else if (determiner < 59) {
			// x = 42, y = 59
			//console.log('root 2 tall', determiner);
			// svg.setAttribute('viewbox', '0 0 100 100');
			svg.setAttribute('width', 42);
			svg.setAttribute('height', 59);
		} else if (determiner < 69) {
			// x = 67, y = 37
			//console.log('16/9 wide', determiner);
			// svg.setAttribute('viewbox', '0 0 100 100');
			svg.setAttribute('width', 67);
			svg.setAttribute('height', 37);
		} else {
			// circle
			svg.setAttribute('width', 56);
			svg.setAttribute('height', 56);
			svg.style.borderRadius = '28px'
			svg.isCircle = true;
			//console.log('circle', determiner);
		}
		return svg
	}

	function selectLayer(seed, dimensions, color1, color2) {
		let smallestSide = dimensions[0];
		if (dimensions[0] > dimensions[1]) { smallestSide = dimensions[1] }
		const determiner = (bigChungus(seed) + 883) % 1009;
		const layerGroup = document.createElementNS(svgNameSpace, 'g');
		const solidBg = drawRect('100%', '100%', color1);
		layerGroup.isBlank = false;
		let layer
		if (determiner < 180) {
			// half horizontal band 
			layerGroup.appendChild(solidBg);
			layer = drawRect(dimensions[0] * 3, dimensions[1], color2);
		} else if (determiner < 360) {
			// half vertical band
			layerGroup.appendChild(solidBg);
			layer = drawRect(dimensions[0], dimensions[1] * 3, color2);
		} else if (determiner < 800) {
			// diagonal bands and crosses
			layerGroup.appendChild(solidBg);
			let a = [0, dimensions[1]];
			let b = [dimensions[0], 0];
			const thickness = 3 + (bigChungus(seed + 1) % 31);
			const miniDeterminer = (bigChungus(seed + 289) % 643)
			if (miniDeterminer < 181) {
				layer = drawLine([0, 0], [b[0], a[1]], thickness, color2);
			} else if (miniDeterminer < 471) {
				layer = drawLine([0, 0], [b[0], a[1]], (thickness / 3) + 3, color2);
				const second = drawLine(a, b, (thickness / 3) + 3, color2);
				layerGroup.appendChild(second);
			} else {
				layer = drawLine(a, b, thickness, color2);
			}
		} else {
			// remember this ends at 1009 !!!
			// the null layer, for plain backgrounds.
			layer = drawRect(2 * dimensions[0], 2 * dimensions[1], color2);
			layerGroup.isBlank = true; // guarantees emblem
		}
		layerGroup.appendChild(layer)
		return layerGroup;
	}

	function selectEmblem(seed, dimensions, color, bgIsCircle, layerIsBlank) {
		let smallestSide = dimensions[0];
		if (dimensions[0] > dimensions[1]) { smallestSide = dimensions[1] }
		if (bgIsCircle) { smallestSide *= .82 }
		let modulus = 997
		if (layerIsBlank) { modulus = 750 }
		const determiner = (bigChungus(seed) + 883) % modulus;
		const layerGroup = document.createElementNS(svgNameSpace, 'g');
		let emblem
		if (determiner < 150) {
			// circle
			emblem = drawCircle((smallestSide * .28), color);
			emblem.setAttribute('transform', `translate(${dimensions[0]/2},${dimensions[1]/2})`);
		} else if (determiner < 220) {
			emblem = drawHex((smallestSide * .3), color);
			emblem.setAttribute('transform', `translate(${dimensions[0]/2},${dimensions[1]/2})`);
			//emblem.setAttribute("transform", 'rotate(60)');
		} else if (determiner < 290) {
			emblem = drawPent((smallestSide * .39), color);
			emblem.setAttribute('transform', `translate(${dimensions[0]/2},${dimensions[1]/2})`);
			//emblem.setAttribute("transform", 'rotate(60)');
		} else if (determiner < 350) {
			emblem = drawRhombus((smallestSide * .43), (smallestSide * .74), color);
			emblem.setAttribute('transform', `translate(${dimensions[0]/2},${dimensions[1]/2})`);
			//emblem.setAttribute("transform", 'rotate(60)');
		} else if (determiner < 410) {
			emblem = drawRhombus((smallestSide * .47), (smallestSide * .67), color);
			emblem.setAttribute('transform', `translate(${dimensions[0]/2},${dimensions[1]/2})`);
			//emblem.setAttribute("transform", 'rotate(60)');
		} else if (determiner < 530) {
			emblem = drawStar((smallestSide * .44), color);
			emblem.setAttribute('transform', `translate(${dimensions[0]/2},${dimensions[1]/2})`);
			//emblem.setAttribute("transform", 'rotate(60)');
		} else if (determiner < 620) {
			emblem = drawRect((smallestSide * .56), (smallestSide * .56), color);
			emblem.setAttribute('transform', `translate(${dimensions[0]/2},${dimensions[1]/2})`);
		} else if (determiner < 750) {
			emblem = drawTriangle((smallestSide * .65), color);
			emblem.setAttribute('transform', `translate(${dimensions[0]/2},${dimensions[1]/2})`);
		} else {
			// remember this ends at 997!!!
			// the null emblem.  if this is how it goes, there needs to be an object,
			// but it can be invisible.
			emblem = drawRect(0, 0, color);
		}
		layerGroup.appendChild(emblem)
		return layerGroup; 
	}

	function drawCircle(radius, inputColor) {
		const circle = document.createElementNS(svgNameSpace, 'circle');
		const color = `hsl(${inputColor[0]}, ${inputColor[1]}%, ${inputColor[2]}%)`
		circle.setAttribute('r', radius);
		circle.setAttribute('fill', color);
		return circle
	}

	function drawLine(start, finish, thickness, inputColor) {
		const color = `hsl(${inputColor[0]}, ${inputColor[1]}%, ${inputColor[2]}%)`;
		const line = document.createElementNS(svgNameSpace, 'line');
		line.setAttribute('x1', start[0]);
		line.setAttribute('y1', start[1]);
		line.setAttribute('x2', finish[0]);
		line.setAttribute('y2', finish[1]);
		line.setAttribute('stroke-width', thickness);
		line.setAttribute('stroke', color);
		return line;
	}

	function drawRect(width, height, inputColor) {
		const color = `hsl(${inputColor[0]}, ${inputColor[1]}%, ${inputColor[2]}%)`;
		const rect = document.createElementNS(svgNameSpace, 'rect');
		// supposedly the setAttribute on x and y gives an error.  but the engine
		// renders them correct anyway so brrrr
		rect.setAttribute('x', -width / 2);
		rect.setAttribute('y', -height / 2);
		rect.setAttribute('width', width);
		rect.setAttribute('height', height);
		rect.setAttribute('fill', color);
		return rect
	}

	function drawRhombus(axisA, axisB, inputColor) {
		const rhom = document.createElementNS(svgNameSpace, 'polygon');
		const color = `hsl(${inputColor[0]}, ${inputColor[1]}%, ${inputColor[2]}%)`;
		const points = [
			`0,${-axisA / 2}`,
			`${axisB / 2},0`,
			`0,${axisA / 2}`,
			`${-axisB / 2},0`,
		];
		rhom.setAttribute('points', points.join(' '));
		rhom.setAttribute('fill', color);
		return rhom;
	}

	function drawTriangle(sideLength, inputColor) {
		const triangle = document.createElementNS(svgNameSpace, 'polygon');
		const color = `hsl(${inputColor[0]}, ${inputColor[1]}%, ${inputColor[2]}%)`;
		const pt1 = `0,${sideLength / (3 ** 0.5)}`
		const pt2 = `${sideLength / 2},${-(sideLength / (2 * (3 ** 0.5)))}`
		const pt3 = `${-(sideLength / 2)},${-(sideLength / (2 * (3 ** 0.5)))}`
		triangle.setAttribute('points', pt1 + ' ' + pt2 + ' ' + pt3);
		triangle.setAttribute('fill', color);
		return triangle;
	}

	function drawPent(sideLength, inputColor) {
		const pent = document.createElementNS(svgNameSpace, 'polygon');
		const color = `hsl(${inputColor[0]}, ${inputColor[1]}%, ${inputColor[2]}%)`;
		const points = [
			`0,${-sideLength * .85}`,
			`${sideLength * 0.81},${-sideLength * .26}`,
			`${sideLength / 2},${sideLength * .69}`,
			`${-sideLength / 2},${sideLength * .69}`,
			`${-sideLength * 0.81},${-sideLength * .26}`
		]
		pent.setAttribute('points', points.join(' '));
		pent.setAttribute('fill', color);
		return pent;
	}

	function drawStar(sideLength, inputColor) {
		// sideLength in this case refers to distance from star-end to neighboring 
		// (non-connected) end.  aka, the length of one point edge plus an inner 
		// pentagon edge.  aka, one point edge * 1.618
		const pent = document.createElementNS(svgNameSpace, 'polygon');
		const color = `hsl(${inputColor[0]}, ${inputColor[1]}%, ${inputColor[2]}%)`;
		const points = [
			`0,${-sideLength * .85}`,
			`${sideLength / 2},${sideLength * .69}`,
			`${-sideLength * 0.81},${-sideLength * .26}`,
			`${sideLength * 0.81},${-sideLength * .26}`,
			`${-sideLength / 2},${sideLength * .69}`
		];
		pent.setAttribute('points', points.join(' '));
		pent.setAttribute('fill', color);
		return pent;
	}

	function drawHex(sideLength, inputColor) {
		const hex = document.createElementNS(svgNameSpace, 'polygon');
		const color = `hsl(${inputColor[0]}, ${inputColor[1]}%, ${inputColor[2]}%)`;
		const points = [
			`${-sideLength / 2},${-sideLength * (3 ** 0.5) / 2}`,
			`${sideLength / 2},${-sideLength * (3 ** 0.5) / 2}`,
			`${sideLength}, 0`,
			`${sideLength / 2},${sideLength * (3 ** 0.5) / 2}`,
			`${-sideLength / 2},${sideLength * (3 ** 0.5) / 2}`,
			`${-sideLength}, 0`
		];
		hex.setAttribute('points', points.join(' '));
		hex.setAttribute('fill', color);
		return hex;
	}

	function selectLightness(seed, num) {
		const colors = [];
		// this is not just a loop that runs from 0 to num!  sometimes the loop will run with no effect, which is important for *reasons*
		let colorCount = 0;
		for (let i = 0; colors.length < num; i++) {
			const determiner = bigChungus(seed + 809 + i) % 251
			if ((determiner < 32) && (!colors.includes('black'))) {
				colors.push('black');
			} else if ((determiner < 61) && (!colors.includes('white'))) {
				colors.push('white');
			} else if ((determiner < 81) && (!colors.includes('gray'))) {
				colors.push('gray');
				// now i want colors to be less frequent, respective to how many have 
				// been selected
			} else if (determiner < (250 - (colorCount * 43))) {
				colorCount++;
				colors.push('color');
			}
			if (i > 49) {break;}
		}
		return colors
	}

	function selectHues(input_colors, seed) {
		// only guanateed to pass when you have less than 5 hues to select.  
		// (you could get more if you narrowed the hue contrast.  
		// current min contrast val = 44)
		//
		// 2021-01-17  21:38:40 -0500 i think i'm gonna want some lightness contrast 
		// guarantee for colors.  damn.  or maybe hue contrast, and prevent more than
		// three colors ever being selected?  work on patterns first though.
		//
		// maybe not just color contrast, but also contrast against other 
		// blacks/whites/grays?
		//
		// or just stroke contrast for different shape types
		//
		const colors = input_colors
		const hueRanges = []
		for (let index = 0; index < colors.length; index++) {
			//console.log('hue progress: ', colors);
			if (colors[index] == 'white') {
				colors[index] = [0, 0, 100]
			} else if (colors[index] == 'black') {
				colors[index] = [0, 0, 0]
			} else if (colors[index] == 'gray') {
				colors[index] = [0, 0, 25 + (bigChungus(seed + 19 + index) % 47)]
			} else if (colors[index] == 'color' ) {
				// lightness
				colors[index] = [0, 0, 21 + (bigChungus(seed + 33 + index) % 59)]
				// saturation
				colors[index][1] = 100 - (bigChungus(seed + 17 + index) % 53);
				// if no hues exist yet
				if (hueRanges[0] == null) {
					const hue = bigChungus(seed + 931 + index) % 360;
					colors[index][0] = hue;
					hueRanges.push(
						[hue-44, hue+44],
						[360 + (hue-44), 360 + (hue+44)],
						[-360 + (hue-44), -360 + (hue+44)]
					);
				} else {
					// i know this looks like a crazy loop but i want an iterator number
					// for each loop step
					let huesNeeded = hueRanges.length + 3
					//console.log('begin hue diff');
					for (let i = 0; hueRanges.length < huesNeeded; i++) {
						const hue = bigChungus(seed + 613 + (index * 100) + i) % 360;
						// if hue is not in illegal range
						let hueAllowed = true;
						hueRanges.forEach((range) => {
							if ((hue > range[0]) && (hue < range[1])) {
								hueAllowed = false
							}
						});
						if (hueAllowed) {
							colors[index][0] = hue;
							//console.log('good hue bud', hueRanges, hue);
							hueRanges.push(
								[hue-45, hue+45],
								[360 + (hue-45), 360 + (hue+45)],
								[-360 + (hue-45), -360 + (hue+45)]
							);
						}
						if (i > 29) {
							hueRanges.push(['6','9'],['6','9'],['6','9']);
							console.log('fucky fuck');
							break;}
					}
					// console.log('end hue diff', colors);
				}
			}
		};
		let salt = 0
		for (let i = 0; i + 1 < colors.length; i++) {
			if (Math.abs(colors[i][2] - colors[i + 1][2]) < 15) {
				colors[i + 1][2] = 20 + (bigChungus(seed + 3 + salt) % 61);
				i--;
			}
			salt++;
		}
		return colors;
	}

	function selectColors(seed, layers) {
		//console.log('begin SelectColors', seed, layers);
		let colors = [];
		// console.log('wtf colors', colors);
		colors = selectLightness(seed, 4);
		// console.log('light/sat select done: ', colors);
		colors = selectHues(colors, seed);
		//console.log('done SelectColors', colors);
		return colors
	}

	function createAvatarContainer() {
		const div = document.createElement('div');
		div.style.width = 0
		div.style.height = 0
		return div
	}

	function styleComments() {
		commentUsernames.forEach(name => {
			let userID = name.href.match(/\d+\/$/)[0];
			userID = userID.slice(0, (userID.length - 1));
			let div = createAvatarContainer();
			console.log(name.innerText); // that's the user's username
			let avatar = createAvatar(userID);
			avatar.style.position = 'relative';
			avatar.style.right = `${avatar.width.baseVal.value + 16}px`;
			div.appendChild(avatar);
			name.prepend(div);
		});
	}

	function main() {
		styleComments();
		movePredictions();
	}

	main();

})();







