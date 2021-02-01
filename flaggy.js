const svgNameSpace = 'http://www.w3.org/2000/svg';

function bigChungus(input) {
	//
	//                   DO NOT ROLL YOUR OWN CRYPTO
	//
	//               DO NOT USE THIS FOR ANYTHING IMPORTANT
	//
	// the sum of the 4 components is less than 9 * 10 ** 15, aka BigInt.
	// the sum is always greater than 10**7, so 9_999_991 is a prime that is less
	// than that.
	//
	// this function has slightly different output in chrome v firefox
	//
	const num = Math.floor(input);
	const val = Math.floor( ( ((21 ** (0.5)) ** (11 + (num % 13)))
													+ ((7 ** (1 / 4)) ** (26 + (num % 47)))
													+ ((2 ** (1 / 4)) ** (96 + (num % 109)))
													+	((2 ** (1 / 8)) ** (187 + (num % 223)))
													) % 9999991
												);
	return val;
}

function createSvg() {
	const svg = document.createElementNS(svgNameSpace, 'svg');
	svg.setAttribute('version', '1.1');
	svg.setAttribute('baseProfile', 'full');
	return svg;
}

function setBg(seed, color) {
	const svg = createSvg();
	const determiner = (bigChungus(seed) + 93) % 101;
	svg.isCircle = false;
	const dimensions = [];
	if (determiner < 39) {
		dimensions.push(50);
		dimensions.push(50);
	} else if (determiner < 49) {
		dimensions.push(59);
		dimensions.push(42);
	} else if (determiner < 59) {
		dimensions.push(42);
		dimensions.push(59);
	} else if (determiner < 69) {
		dimensions.push(67);
		dimensions.push(37);
	} else {
		dimensions.push(56);
		dimensions.push(56);
		svg.style.borderRadius = '28px';
		svg.isCircle = true;
	}
	svg.setAttribute('width', dimensions[0]);
	svg.setAttribute('height', dimensions[1]);
	const bgLayer = drawRect(dimensions[0], dimensions[1], color);
	bgLayer.setAttribute('transform', `translate(${dimensions[0]/2},${dimensions[1]/2})`);
	svg.appendChild(bgLayer);
	return svg;
}

function drawCircle(radius, inputColor) {
	const circle = document.createElementNS(svgNameSpace, 'circle');
	const color = `hsl(${inputColor[0]}, ${inputColor[1]}%, ${inputColor[2]}%)`;
	circle.setAttribute('r', radius);
	circle.setAttribute('fill', color);
	return circle;
}

function drawLine(start, finish, thickness, inputColor) {
	const line = document.createElementNS(svgNameSpace, 'line');
	const color = `hsl(${inputColor[0]}, ${inputColor[1]}%, ${inputColor[2]}%)`;
	line.setAttribute('x1', start[0]);
	line.setAttribute('y1', start[1]);
	line.setAttribute('x2', finish[0]);
	line.setAttribute('y2', finish[1]);
	line.setAttribute('stroke-width', thickness);
	line.setAttribute('stroke', color);
	return line;
}

function drawRect(width, height, inputColor) {
	const rect = document.createElementNS(svgNameSpace, 'rect');
	const color = `hsl(${inputColor[0]}, ${inputColor[1]}%, ${inputColor[2]}%)`;
	rect.setAttribute('x', -width / 2);
	rect.setAttribute('y', -height / 2);
	rect.setAttribute('width', width);
	rect.setAttribute('height', height);
	rect.setAttribute('fill', color);
	return rect;
}

function drawRhombus(axisX, axisY, inputColor) {
	const rhom = document.createElementNS(svgNameSpace, 'polygon');
	const color = `hsl(${inputColor[0]}, ${inputColor[1]}%, ${inputColor[2]}%)`;
	const points = [
		`0,${-axisY / 2}`,
		`${axisX / 2},0`,
		`0,${axisY / 2}`,
		`${-axisX / 2},0`
	];
	rhom.setAttribute('points', points.join(' '));
	rhom.setAttribute('fill', color);
	return rhom;
}

function drawTriangle(sideLength, inputColor) {
	const triangle = document.createElementNS(svgNameSpace, 'polygon');
	const color = `hsl(${inputColor[0]}, ${inputColor[1]}%, ${inputColor[2]}%)`;
	const pt1 = `0,${sideLength / (3 ** 0.5)}`;
	const pt2 = `${sideLength / 2},${-(sideLength / (2 * (3 ** 0.5)))}`;
	const pt3 = `${-(sideLength / 2)},${-(sideLength / (2 * (3 ** 0.5)))}`;
	triangle.setAttribute('points', pt1 + ' ' + pt2 + ' ' + pt3);
	triangle.setAttribute('fill', color);
	return triangle;
}

function drawPent(sideLength, inputColor) {
	const pent = document.createElementNS(svgNameSpace, 'polygon');
	const color = `hsl(${inputColor[0]}, ${inputColor[1]}%, ${inputColor[2]}%)`;
	const points = [
		`0,${-sideLength * 0.85}`,
		`${sideLength * 0.81},${-sideLength * 0.26}`,
		`${sideLength / 2},${sideLength * 0.69}`,
		`${-sideLength / 2},${sideLength * 0.69}`,
		`${-sideLength * 0.81},${-sideLength * 0.26}`
	];
	pent.setAttribute('points', points.join(' '));
	pent.setAttribute('fill', color);
	return pent;
}

function drawStar(sideLength, inputColor) {
	const pent = document.createElementNS(svgNameSpace, 'polygon');
	const color = `hsl(${inputColor[0]}, ${inputColor[1]}%, ${inputColor[2]}%)`;
	// sideLength in this case refers to distance from star-end to neighboring
	// (non-connected) end.  aka, the length of one point edge plus a central
	// pentagon edge.  aka, one point edge * 1.618
	const points = [
		`0,${-sideLength * 0.85}`,
		`${sideLength / 2},${sideLength * 0.69}`,
		`${-sideLength * 0.81},${-sideLength * 0.26}`,
		`${sideLength * 0.81},${-sideLength * 0.26}`,
		`${-sideLength / 2},${sideLength * 0.69}`
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
	let colorCount = 0;
	// sometimes this loop will run with no effect.  it's not count i up to num
	for (let i = 0; colors.length < num; i++) {
		const determiner = bigChungus(seed + 809 + i) % 241;
		if ((determiner < 39) && (!colors.includes('black'))) {
			colors.push('black');
		} else if ((determiner < 66) && (!colors.includes('white'))) {
			colors.push('white');
		} else if ((determiner < 84) && (!colors.includes('gray'))) {
			colors.push('gray');
		} else if (determiner < (241 - (colorCount * 52))) {
			// colorCount decreases the chances of multiple colors being selected
			colorCount++;
			colors.push('color');
		}
		if (i > 49) { break; }
	}
	const shuffleDeterminer = bigChungus(seed + 5) % 6;
	const shuffledColors = [];
	// * chef's kiss *
	shuffledColors.push(colors.splice((shuffleDeterminer % 3), 1)[0]);
	shuffledColors.push(colors.splice((shuffleDeterminer % 2), 1)[0]);
	shuffledColors.push(colors[0]);
	return shuffledColors;
}

function selectHues(inputColors, seed) {
	// only guanateed to pass when you have less than 4 hues to select.
	// (you could get more if you narrowed the hue contrast.
	// current min contrast val = 59)
	const colors = [];
	const hues = [];
	for (let index = 0; index < inputColors.length; index++) {
		if        (inputColors[index] === 'white') {
			colors.push([0, 0, 100]);
		} else if (inputColors[index] === 'black') {
			colors.push([0, 0, 0]);
		} else if (inputColors[index] === 'gray') {
			colors.push([0, 0, 25 + (bigChungus(seed + 19 + index) % 47)]);
		} else {
			// colors, presumably
			// if no hues exist yet
			if (hues[0] === undefined) {
				let val = (bigChungus(seed + 931 + index) % 360);
				hues.push(val);
			} else {
				// generate new hue with minimum hue contrast
				const huesNeeded = hues.length + 1;
				for (let salt = 0; hues.length < huesNeeded; salt++) {
					const hue = bigChungus(seed + 613 + (index * 100) + salt) % 360;
					let hueAllowed = true;
					const minContrast = 55;
					hues.forEach((oldHue) => {
						if ( ( (hue > (oldHue - minContrast       )  )
								 &&(hue < (oldHue + minContrast       )  )  )
							 ||( (hue > (oldHue - minContrast + 360)  )
								 &&(hue < (oldHue + minContrast + 360)  )  )
							 ||( (hue > (oldHue - minContrast - 360)  )
								 &&(hue < (oldHue + minContrast - 360)  )  )
							 ) {
							hueAllowed = false;
						}
					});
					if (hueAllowed) {
						hues.push(hue);
					}
					if (salt > 99) {
						colors[index][0] = hue;
						hues.push(699);
						console.log('hue selection broke somehow');
						break;
					}
				}
			}
			const saturation = 100 - (bigChungus(seed + 17 + index) % 53);
			const lightness = 25 + (bigChungus(seed + 33 + index) % 47);
			colors.push([ hues[hues.length - 1], saturation, lightness ]);
		}
	}
	let salt = 0;
	// lightness contrast
	for (let i = 0; i + 1 < colors.length; i++) {
		if (Math.abs(colors[i][2] - colors[i + 1][2]) < 25) {
			colors[i + 1][2] = 20 + (bigChungus(seed + 3 + salt) % 61);
			i--;
		}
		salt++;
	}
	return colors;
}

function selectColors(seed) {
	const lightVals = selectLightness(seed, 3);
	const colors = selectHues(lightVals, seed);
	return colors;
}

function selectTriColorLayer(seed, dimensions, color1, color2) {
	let smallestSide = dimensions[0];
	if (dimensions[0] > dimensions[1]) { smallestSide = dimensions[1]; }
	const determiner = (bigChungus(seed) + 411) % 599;
	const layerGroup = document.createElementNS(svgNameSpace, 'g');
	if        (determiner < 100) {
		// horizontal bands
		const middle = drawRect(dimensions[0], dimensions[1] * (2 / 3), color2);
		const upper = drawRect(dimensions[0], dimensions[1] * (1 / 3), color1);
		middle.setAttribute('transform', `translate(${dimensions[0] / 2}, ${dimensions[1] / 3})`);
		upper.setAttribute('transform', `translate(${dimensions[0] / 2}, ${dimensions[1] / 6})`);
		layerGroup.appendChild(middle);
		layerGroup.appendChild(upper);
	} else if (determiner < 200) {
		// vertical bands
		const middle = drawRect(dimensions[0] * (2 / 3), dimensions[1], color2);
		const upper = drawRect(dimensions[0] * (1 / 3), dimensions[1], color1);
		middle.setAttribute('transform', `translate(${dimensions[0] / 3}, ${dimensions[1] / 2})`);
		upper.setAttribute('transform', `translate(${dimensions[0] / 6}, ${dimensions[1] / 2})`);
		layerGroup.appendChild(middle);
		layerGroup.appendChild(upper);
	} else if (determiner < 280) {
		//console.log('half diagonal');
		const bgThickness = (((dimensions[0] ** 2) + (dimensions[1] ** 2)) ** 0.5) / 2
		const bgLayer = drawLine([-dimensions[0] / 2, dimensions[1]], [dimensions[0], -dimensions[1] / 2], bgThickness, color1);
		const bandThickness = 6 + ((bigChungus(seed + 4) % 49669) / (49669 / 19));
		const bandLayer = drawLine([0, dimensions[1]], [dimensions[0], 0], bandThickness, color2);
		layerGroup.appendChild(bgLayer);
		layerGroup.appendChild(bandLayer);
	} else if (determiner < 360) {
		//console.log('half other diagonal');
		const bgThickness = (((dimensions[0] ** 2) + (dimensions[1] ** 2)) ** 0.5) / 2
		const bgLayer = drawLine([0, -dimensions[1] / 2], [dimensions[0] * 3 / 2, dimensions[1]], bgThickness, color1);
		const bandThickness = 6 + ((bigChungus(seed + 4) % 49669) / (49669 / 19));
		const bandLayer = drawLine([0, 0], [dimensions[0], dimensions[1]], bandThickness, color2);
		layerGroup.appendChild(bgLayer);
		layerGroup.appendChild(bandLayer);
	} else if (determiner < 460) {
		//console.log('diagonal crosses');
		const thickness = 6 + ((bigChungus(seed + 1) % 31) / 1.77);
		let upperThickness = thickness / 2;
		if ((bigChungus(seed + 30223) % 53791) > 27000) {
			upperThickness *= 0.828;
		}
		const lineMiddle1 = drawLine([0, 0], [dimensions[0], dimensions[1]], thickness, color1);
		const lineMiddle2 = drawLine([dimensions[0], 0], [0, dimensions[1]], thickness, color1);
		const lineUpper1 = drawLine([0, 0], [dimensions[0], dimensions[1]], upperThickness, color2);
		const lineUpper2 = drawLine([dimensions[0], 0], [0, dimensions[1]],upperThickness, color2);
		layerGroup.appendChild(lineMiddle1)
		layerGroup.appendChild(lineMiddle2)
		layerGroup.appendChild(lineUpper1)
		layerGroup.appendChild(lineUpper2)
	} else {
		//console.log('ortho crosses');
		let lineX = [[0, dimensions[1] / 2], [dimensions[0] * 3 / 2, dimensions[1] / 2]];
		let lineY = [[dimensions[0] / 2, 0], [dimensions[0] / 2, dimensions[1] * 3 / 2]];
		const underThickness = 6 + (bigChungus(seed + 4) % 17);
		let overThickness = underThickness / 2;
		const bandDeterminer = bigChungus(seed + 16) % 191;
		if (bandDeterminer < 111) {
			overThickness *= 0.828;
		}
		const positionDeterminer = (bigChungus(seed + 27098) % 68351);
		if (positionDeterminer > 31000) {
			// determine if we have a wide rect or tall rect
			if (dimensions[0] > dimensions[1]) {
				layerGroup.setAttribute('transform', `translate(-${(dimensions[0] / 2) - (dimensions[1] / 2)}, 0)`);
			} else {
				layerGroup.setAttribute('transform', `translate(0, -${(dimensions[1] / 2) - (dimensions[0] / 2)})`);
			}
		}
		const under1 = drawLine(lineX[0], lineX[1], underThickness, color1);
		const under2 = drawLine(lineY[0], lineY[1], underThickness, color1);
		const over1 = drawLine(lineX[0], lineX[1], overThickness, color2);
		const over2 = drawLine(lineY[0], lineY[1], overThickness, color2);
		layerGroup.appendChild(under1);
		layerGroup.appendChild(under2);
		layerGroup.appendChild(over1);
		layerGroup.appendChild(over2);
	}
	return layerGroup;
}

function selectMonoColorLayer(seed, dimensions, color, isCircle) {
	let smallestSide = dimensions[0];
	if (dimensions[0] > dimensions[1]) { smallestSide = dimensions[1]; }
	if (isCircle) {smallestSide *= 0.8}
	const determiner = (bigChungus(seed) + 883) % 1009;
	const layerGroup = document.createElementNS(svgNameSpace, 'g');
	layerGroup.noEmblem = false;
	if        (determiner < 160) {
		//console.log('half horizontal band');
		const layer = drawRect(dimensions[0], dimensions[1] / 2, color);
		layer.setAttribute('transform', `translate(${dimensions[0] / 2}, ${dimensions[1] / 4})`);
		layerGroup.appendChild(layer);
	} else if (determiner < 320) {
		//console.log('half vertical band');
		const layer = drawRect(dimensions[0] / 2, dimensions[1], color);
		layer.setAttribute('transform', `translate(${dimensions[0] / 4}, ${dimensions[1] / 2})`);
		layerGroup.appendChild(layer);
	} else if (determiner < 480) {
		//console.log('half diagonal');
		const thickness = (((dimensions[0] ** 2) + (dimensions[1] ** 2)) ** 0.5) / 2
		const layer = drawLine([-dimensions[0] / 2, dimensions[1]], [dimensions[0], -dimensions[1] / 2], thickness, color);
		layerGroup.appendChild(layer);
	} else if (determiner < 640) {
		//console.log('half other diagonal');
		const thickness = (((dimensions[0] ** 2) + (dimensions[1] ** 2)) ** 0.5) / 2
		const layer = drawLine([0, -dimensions[1] / 2], [dimensions[0] * 3 / 2, dimensions[1]], thickness, color);
		layerGroup.appendChild(layer);
	} else if (determiner < 820) {
		//console.log('ortho crosses');
		let lineX = [[0, dimensions[1] / 2], [dimensions[0], dimensions[1] / 2]];
		let lineY = [[dimensions[0] / 2, 0], [dimensions[0] / 2, dimensions[1]]];
		const posDeterminer = bigChungus(seed + 6888) % 28711;
		if (posDeterminer < 13000) {
			layerGroup.noEmblem = true;
			if (smallestSide === dimensions[0]) {
				lineX[0][1] = dimensions[0] / 2;
				lineX[1][1] = dimensions[0] / 2;
			} else {
				lineY[0][0] = dimensions[1] / 2;
				lineY[1][0] = dimensions[1] / 2;
			}
		}
		const thickness = 6 + (bigChungus(seed + 10076) % 16631) / (16631 / 8);
		const horizontal = drawLine(lineX[0], lineX[1], thickness, color);
		const vertical = drawLine(lineY[0], lineY[1], thickness, color);
		layerGroup.appendChild(horizontal);
		layerGroup.appendChild(vertical);
	} else {
		//console.log('diagonal bands and crosses');
		let a = [0, dimensions[1]];
		let b = [dimensions[0], 0];
		const thickness = 3 + (bigChungus(seed + 1) % 31);
		const miniDeterminer = (bigChungus(seed + 289) % 643);
		if (miniDeterminer < 200) {
			const layer = drawLine([0, 0], [b[0], a[1]], thickness, color);
			layerGroup.appendChild(layer);
		} else if (miniDeterminer < 400) {
			const layer = drawLine(a, b, thickness, color);
			layerGroup.appendChild(layer);
		} else {
			const layer = drawLine([0, 0], [b[0], a[1]], (thickness / 3) + 3, color);
			const second = drawLine(a, b, (thickness / 3) + 3, color);
			layerGroup.appendChild(second);
			layerGroup.appendChild(layer);
		}
	}
	if ((bigChungus(seed) + 3108) % 52391 > 41000) {layerGroup.noEmblem = true}
	return layerGroup;
}

function selectEmblem(seed, dimensions, color, bgIsCircle) {
	let smallestSide = dimensions[0];
	if (dimensions[0] > dimensions[1]) { smallestSide = dimensions[1]; }
	emblemSide = smallestSide
	if (bgIsCircle) { emblemSide *= 0.82; }
	emblemSide *= 0.91;
	const sizeDeterminer = (bigChungus(seed) + 7155) % 30529;
	const sizeVariance = 1.6
	const sizeLimit = 2.1
	emblemSide *= 1 + ((((sizeDeterminer - 15264) / (15264 / sizeVariance)) ** 3) / (sizeLimit * (sizeVariance ** 3)))
	const rotateDeterminer = (bigChungus(seed) + 4677) % 74897;
	const determiner = (bigChungus(seed) + 303) % 997;
	const layerGroup = document.createElementNS(svgNameSpace, 'g');
	let emblem;
	if        (determiner < 150) {
		//console.log('circle');
		emblem = drawCircle((emblemSide * 0.28), color);
		emblem.setAttribute('transform', `translate(${dimensions[0]/2},${dimensions[1]/2})`);
	} else if (determiner < 220) {
		//console.log('hex');
		emblem = drawHex((emblemSide * 0.3), color);
		let degrees = 0;
		if (rotateDeterminer > 37500) {degrees = 30}
		emblem.setAttribute('transform', `
			translate(${dimensions[0]/2},${dimensions[1]/2})
			rotate(${degrees})`);
	} else if (determiner < 290) {
		//console.log('pent');
		emblem = drawPent((emblemSide * 0.39), color);
		let degrees = 0;
		if (rotateDeterminer > 37500) {degrees = 36}
		emblem.setAttribute('transform', `
			translate(${dimensions[0]/2},${dimensions[1]/2})
			rotate(${degrees})`);
	} else if (determiner < 450) {
		//console.log('rhomb root 3');
		emblem = drawRhombus((emblemSide * 0.43), (emblemSide * 0.74), color);
		let degrees = 0;
		if (rotateDeterminer > 37500) {degrees = 90}
		emblem.setAttribute('transform', `
			translate(${dimensions[0]/2},${dimensions[1]/2})
			rotate(${degrees})`);
	} else if (determiner < 510) {
		//console.log('rhomb root 2');
		emblem = drawRhombus((emblemSide * 0.47), (emblemSide * 0.67), color);
		let degrees = 0;
		if (rotateDeterminer > 37500) {degrees = 90}
		emblem.setAttribute('transform', `
			translate(${dimensions[0]/2},${dimensions[1]/2})
			rotate(${degrees})`);
	} else if (determiner < 730) {
		//console.log('star');
		emblem = drawStar((emblemSide * 0.44), color);
		let degrees = 0;
		if (rotateDeterminer > 37500) {degrees = 36}
		if (rotateDeterminer % 19 > 13) {degrees += 90}
		emblem.setAttribute('transform', `
			translate(${dimensions[0]/2},${dimensions[1]/2})
			rotate(${degrees})`);
	} else if (determiner < 820) {
		//console.log('square');
		emblem = drawRect((emblemSide * 0.56), (emblemSide * 0.56), color);
		let degrees = 0;
		if (rotateDeterminer > 37500) {degrees = 45}
		emblem.setAttribute('transform', `
			translate(${dimensions[0]/2},${dimensions[1]/2})
			rotate(${degrees})`);
	} else {
		//console.log('triangle');
		emblem = drawTriangle((emblemSide * 0.65), color);
		let degrees = 0;
		if (rotateDeterminer > 37500) {degrees = 60}
		if (rotateDeterminer % 19 > 12) {degrees += 90}
		emblem.setAttribute('transform', `
			translate(${dimensions[0]/2},${dimensions[1]/2})
			rotate(${degrees})`);
	}
	const outlineDeterminer = (bigChungus(seed) + 11207) % 66883;
	if (outlineDeterminer < 24212) {
		emblem.setAttribute('stroke', `hsl(${color[0]}, ${color[1]}%, ${color[2]}%)`);
		emblem.setAttribute('stroke-width', (smallestSide * 0.04));
		emblem.setAttribute('fill-opacity', 0);
	}
	layerGroup.appendChild(emblem);
	return layerGroup; 
}

function selectFormat(seed, dimensions, colors, isCircle) {
	const determiner = (bigChungus(seed) + 93) % 397;
	const layerGroup = document.createElementNS(svgNameSpace, 'g');
	if (determiner < 130) {
		const layer = selectTriColorLayer(seed, dimensions, colors[1], colors[2]);
		layerGroup.appendChild(layer);
	} else if (determiner < 191) {
		// emblem with no bg layer
		const emblem = selectEmblem(seed, dimensions, colors[1], isCircle);
		layerGroup.appendChild(emblem);
	} else {
		// emblem plus mono layer
		const layer = selectMonoColorLayer(seed, dimensions, colors[1], isCircle);
		layerGroup.appendChild(layer);
		if (!layer.noEmblem) {
			const emblem = selectEmblem(seed, dimensions, colors[2], isCircle);
			layerGroup.appendChild(emblem);
		}
	}
	return layerGroup;
}

function createAvatar(inputID) {
	const seed = bigChungus(inputID);
	const colors = selectColors(seed, 3);
	console.log('these are the colors', colors);
	const svg = setBg(seed, colors[0]);
	const width = svg.width.baseVal.value;
	const height = svg.height.baseVal.value;
	const dimensions = [width, height];
	svg.appendChild(selectFormat(seed, dimensions, colors, svg.isCircle));
	return svg;
}










