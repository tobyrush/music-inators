// /* global alert,window,document,Tone,initializeBMViewers,MouseEvent: true */
/* jshint -W084 */
/* jshint esversion: 6 */

var bravuraFont = new FontFace('Bravura', 'url(font/bravura/Bravura.woff');
document.fonts.add(bravuraFont);
var isOpera, isFirefox, isSafari, isIE, isEdge, isChrome, isEdgeChromium, isBlink;
window.inators = [];

function initialize() {
	setBrowserVars();
}

class Inator {
	constructor(whichCanvas,eventRegistry) {
		this.myCanvas = whichCanvas;
		this.myDocument = this.myCanvas.ownerDocument;
		this.myWindow = this.myDocument.defaultView;
		this.ctx = whichCanvas.getContext("2d");
		this.myCanvas.width = this.myCanvas.clientWidth;
		this.myCanvas.height = this.myCanvas.clientHeight;
		this.myCanvas.tabIndex = 0;
		this.myCanvas.addEventListener('touchstart', function(e) { e.preventDefault(); });
		for (let e in eventRegistry) {
			this.myCanvas.addEventListener(e,eventRegistry[e]);
		}
		if (this.myDocument.querySelector('#main')) {
			this.myDocument.querySelector('#main').addEventListener('scroll', this.scrolled.bind(this));
		}
		this.mouseIsDown = false;
		this.keyIsDown = false;
		this.ariaStatus = this.myCanvas.getRootNode().createElement('span');
		this.myCanvas.appendChild(this.ariaStatus);
		this.ariaStatus.setAttribute('role','status');
		this.keyboards = [];
		this.sliders = [];
		this.smallSliders = [];
		this.staves = [];
		this.powerButton; this.powerButtonWidth = 5;
		this.soundButton; this.soundButtonWidth = 5;
		this.pow = false;
		this.sou = false;
		this.autoPowerOn = false;
		this.midiIsAvailable = false;
		this.images = {};
		
		this.myWindow.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', this.setDarkMode.bind(this));
		this.darkMode = (this.myWindow.matchMedia && this.myWindow.matchMedia('(prefers-color-scheme: dark)').matches);
		this.setColors();
		this.setStrings();
		
	}
	async loadBravura() {
		if (bravuraFont) {
			await bravuraFont.load();
			this.draw();
		}
	}
	setDarkMode() {
		this.darkMode = (this.myWindow.matchMedia && this.myWindow.matchMedia('(prefers-color-scheme: dark)').matches);
		this.setColors();
		this.draw();
	}
	setColors() {
		let d = this.darkMode;
		
		this.black = d ? "#fff" : "#000";
		this.transparentBlack = d ? "#ffffff88" : "#00000088";
		this.frostedBlack = "#ffffffee";
		this.darkGray = d ? "#ddd" : "#444";
		this.gray = "#999";
		this.lightGray = d ? "#666" : "#bbb";
		this.white = d ? "#333" : "#fff";
		this.darkWhite = d ? "#bbb" : "#eee";
		this.transparentWhite = d ? "#33333388" : "#ffffff88";
		this.frostedWhite = d ? "#333333ee" : "#ffffffee";
		this.darkBlue = d ? "#7f8db0" : "#253459";
		this.blue = d ? "#6895ff" : "#3666e0";
		this.lightBlue = d ? "#253459" : "#7f8db0";
		this.transparentBlue = "#3666e088";
		this.frostedBlue = "#3666e0ee";
		this.darkPurple = d ? "#7d76a0" : "#2d264f";
		this.purple = "#5e0de0";
		this.lightPurple = d ? "#2d264f" : "#7d76a0";
		this.transparentPurple = "#5e0de088";
		this.frostedPurple = "#5e0de0ee";
		this.darkPink = d ? "#c58ab1" : "#61264d";
		this.pink = "#f71bda";
		this.lightPink = d ? "#61264d" : "#c58ab1";
		this.transparentPink = "#f71bda88";
		this.frostedPink = "#f71bdaee";
		this.darkRed = d ? "#df8683" : "#6e1513";
		this.red = d ? "#f0313a" : "#e0260d";
		this.lightRed = d ? "#6e1513" : "#df8683";
		this.transparentRed = "#e0260d88";
		this.frostedRed = "#e0260dee";
		this.darkOrange = d ? "#f5bc8c" : "#7a4110";
		this.orange = "#fc820f";
		this.lightOrange = d ? "#7a4110" : "#f5bc8c";
		this.transparentOrange = "#fc820f88";
		this.frostedOrange = "#fc820fee";
		this.darkYellow = d ? "#ffe880" : "#a88b00";
		this.yellow = "#ffd200";
		this.lightYellow = d ? "#a88b00" : "#ffe880";
		this.transparentYellow = "#ffd20088";
		this.frostedYellow = "#ffd200ee";
		this.darkGreen = d ? "#6e8d67" : "#213b1b";
		this.green = d ? "#53de34" : "#4d8c18";
		this.lightGreen = d ? "#213b1b" : "#6e8d67";
		this.transparentGreen = "#4d8c1888";
		this.frostedGreen = "#4d8c18ee";
		this.notationFigureColor = "#000000";
		this.notationBackgroundColor = d ? "#bbbbbb" : "#ffffff";
		this.keyboardBackgroundColor = d ? "#888888" : "#ffffff";
	}
	setStrings() {
		this.flatSymbol = '\ue260';
		this.naturalSymbol = '\ue261';
		this.sharpSymbol = '\ue262';
		this.doubleSharpSymbol = '\ue263';
		this.doubleFlatSymbol = '\ue264';
	}
	resourceURL(filename) {
		return this.resourcesDirectory+filename;
	}
	getParam(paramName) {
		let val = this.myCanvas.dataset[paramName];
		if (val) {
			if (val.charAt(0) == '[') {
				return JSON.parse(val);
			} else {
				return [val];
			}
		} else {
			return [];
		}
	}
	set power(val) {
		if (val) {
			this.pow = true;
			if (typeof this.powerOn === "function") { this.powerOn(); }
		} else {
			this.pow = false;
			if (typeof this.powerOff === "function") { this.powerOff(); }
		}
	}
	get power() {
		return this.pow;
	}
	set sound(val) {
		if (val) {
			this.sou = true;
			if (typeof this.soundOn === "function") { this.soundOn(); }
		} else {
			this.sou = false;
			if (typeof this.soundOff === "function") { this.soundOff(); }
		}
	}
	get sound() {
		return this.sou;
	}
	scrolled(e) {
		// turn power off when canvas is scrolled off-screen
		let r = this.myCanvas.getBoundingClientRect();
		if (this.power && (r.bottom<0 || r.top - (Math.max(this.myDocument.documentElement.clientHeight, window.innerHeight)) >= 0)) {
			this.power = false;
			this.draw();
		}
		if (this.autoPowerOn && !this.power && !(r.bottom<0 || r.top - (Math.max(this.myDocument.documentElement.clientHeight, window.innerHeight)) >= 0)) {
			this.power = true;
			this.draw();
		}
	}
	setAriaStatus(message, brailleText = '') {
		this.ariaStatus.innerHTML = message;
		if (brailleText) {
			this.ariaStatus.setAttribute('aria-braillelabel',brailleText);
		} else {
			this.ariaStatus.removeAttribute('aria-braillelabel');
		}
	}
	setAriaLabel(message) {
		this.myCanvas.setAttribute('aria-label',message);
	}
	x(val) { // convert percentage to real
		return (this.width()*val)/100;
	}
	y(val) { // convert percentage to real
		return (this.height()*val)/100;
	}
	unx(val) { // convert real to percentage
		return (val*100)/this.width();
	}
	uny(val) { // convert real to percentage
		return (val*100)/this.height();
	}
	scaleXToY(val) { // convert an X percentage to the equivalent Y percentage
		return this.uny(this.x(val));
	}
	scaleYToX(val) { // convert an Y percentage to the equivalent X percentage
		return this.unx(this.y(val));
	}
	width() {
		return this.myCanvas.width;
	}
	height() {
		return this.myCanvas.height;
	}
	distance(x1,y1,x2,y2) { // return visual distance as percentage of x-axis (variables passed as percentages)
		return this.unx(Math.abs(Math.sqrt(Math.pow(this.x(x2-x1),2)+Math.pow(this.y(y2-y1),2))));
	}
	midiToFreq(midiNote,a4 = 440) {
		return a4 * Math.pow(2,(midiNote-69)/12);
	}
	midiToNoteName(midiNote) {
		return ['C','C sharp','D','D sharp','E','F','F sharp','G','G sharp','A','A sharp','B'][midiNote % 12]
	}
	midiToDiatonicPitchClass(midiNote,sharp=true) {
		if (sharp) {
			return [0,0,1,1,2,3,3,4,4,5,5,6][midiNote % 12];
		} else {
			return [0,1,1,2,2,3,4,4,5,5,6,6][midiNote % 12];
		}
	}
	midiToAccidental(midiNote) {
		return [0,1,0,1,0,0,1,0,1,0,1,0][midiNote % 12] == 1;
	}
	midiToNoteOctave(midiNote) {
		return Math.floor(midiNote/12)-1;
	}
	getEventPosition(e) {
		let rect = this.myCanvas.getBoundingClientRect();
		return {
			x: this.unx(e.clientX - rect.left),
			y: this.uny(e.clientY - rect.top)
		};
	}
	isEventPositionInRect(e,left,top,width,height) {
		let p = this.getEventPosition(e);
		return (p.x>=left && p.y>=top && p.x<=left+width && p.y<=top+height);
	}
	isEventPositionInCircle(e,x,y,r) {
		let p = this.getEventPosition(e);
		return (this.distance(p.x,p.y,x,y)<=r);
	}
	isEventPositionInTriangle(e,x1,y1,x2,y2,x3,y3) {
		let p = this.getEventPosition(e);
		let ta = 0.5 * Math.abs(((x2*y1)-(x1*y2)) + ((x3*y2)-(x2*y3)) + ((x1*y3) - (x3*y1)));
		let t1 = 0.5 * Math.abs(((x1*p.y)-(p.x*y1)) + ((x3*y1)-(x1*y3)) + ((p.x*y3) - (x3*p.y)));
		let t2 = 0.5 * Math.abs(((x3*p.y)-(p.x*y3)) + ((x2*y3)-(x3*y2)) + ((p.x*y2) - (x2*p.y)));
		let t3 = 0.5 * Math.abs(((x2*p.y)-(p.x*y2)) + ((x1*y2)-(x2*y1)) + ((p.x*y1) - (x1*p.y)));
		return (t1+t2+t3)<=ta;
	}
	isEventPositionInQuadrilateral(e,x1,y1,x2,y2,x3,y3,x4,y4) {
		let p = this.getEventPosition(e);
		let qa = 0.5 * (((x1*y2)+(x2*y3)+(x3*y4)+(x4*y1))-((x2*y1)+(x3*y2)+(x4*y3)+(x1*y4)));
		let t1 = 0.5 * Math.abs(((x1*p.y)-(p.x*y1)) + ((x4*y1)-(x1*y4)) + ((p.x*y4) - (x4*p.y)));
		let t2 = 0.5 * Math.abs(((x4*p.y)-(p.x*y4)) + ((x3*y4)-(x4*y3)) + ((p.x*y3) - (x3*p.y)));
		let t3 = 0.5 * Math.abs(((x3*p.y)-(p.x*y3)) + ((x2*y3)-(x3*y2)) + ((p.x*y2) - (x2*p.y)));
		let t4 = 0.5 * Math.abs(((x2*p.y)-(p.x*y2)) + ((x1*y2)-(x2*y1)) + ((p.x*y1) - (x1*p.y)));
		return (t1+t2+t3+t4)<=qa;
	}
	initializeMIDI(noteOnFunc,noteOffFunc,successFunc=null) {
		if (navigator.requestMIDIAccess) {
			this.midiIsAvailable = true;
			this.midiNoteOnFunc = noteOnFunc;
			this.midiNoteOffFunc = noteOffFunc;
			this.midiSuccessFunc = successFunc;
			navigator.requestMIDIAccess().then(this.onMIDISuccess.bind(this),this.onMIDIFailure.bind(this));
			return true;
		} else {
			this.midiIsAvailable = false;
			return false;
		}
	}
	onMIDISuccess(midiSystem) {
		this.midiSystem = midiSystem;
		for (var input of midiSystem.inputs.values()) {
			input.onmidimessage = this.getMIDIMessage.bind(this);
		}
		if (this.midiSuccessFunc) {
			this.midiSuccessFunc(true);
		}
	}
	onMIDIFailure() {
		this.midiIsAvailable = false;
		this.midiSystem = null;
		if (this.midiSuccessFunc) {
			this.midiSuccessFunc(false);
		}
	}
	getMIDIMessage(midiMessage) {
		if (this.myDocument.activeElement==this.myCanvas) {
			if (midiMessage.data[0]>>4 == 8) {
				this.midiNoteOffFunc(midiMessage.data[1]);
			} else if (midiMessage.data[0]>>4 == 9) {
				if (midiMessage.data[2] == 0) {
					this.midiNoteOffFunc(midiMessage.data[1]);
				} else {
					this.midiNoteOnFunc(midiMessage.data[1],midiMessage.data[2]);
				}
			}
		}
	}
	clear(notationBackground=false) {
		this.ctx.fillStyle = notationBackground ? this.notationBackgroundColor : this.white;
		this.ctx.fillRect(0,0,this.width(),this.height());
	}
	drawImage(url,left,top,width,height) {
		let t = this;
		if (!t.images[url]) {
			t.images[url] = new Image();
			t.images[url].src = url;
		}
		let i = setInterval(() => {
			if (t.images[url].complete) {
				clearInterval(i);
				// requestAnimationFrame(f => {
					t.ctx.drawImage(t.images[url], t.x(left), t.y(top), t.x(width), t.y(height));
				// });
			}
		},100);
	}
	drawLine(x1,y1,x2,y2,color,lineWidth,removeBlurring = false) {
		let t = this;
		t.ctx.strokeStyle = color;
		if (removeBlurring) {
			t.ctx.save();
			t.ctx.translate(0.5,0.5);
			t.ctx.beginPath();
			t.ctx.moveTo(Math.floor(t.x(x1)),Math.floor(t.y(y1)));
			t.ctx.lineTo(Math.floor(t.x(x2)),Math.floor(t.y(y2)));
			t.ctx.lineWidth = t.x(lineWidth);
			//t.ctx.closePath();
			t.ctx.stroke();
			t.ctx.restore();
		} else {
			t.ctx.beginPath();
			t.ctx.moveTo(t.x(x1),t.y(y1));
			t.ctx.lineTo(t.x(x2),t.y(y2));
			t.ctx.lineWidth = t.x(lineWidth);
			//t.ctx.closePath();
			t.ctx.stroke();
		}
	}
	fillRect(left,top,width,height,color) {
		let t = this;
		t.ctx.fillStyle = color;
		t.ctx.fillRect(t.x(left),t.y(top),t.x(width),t.y(height));
	}
	drawRect(left,top,width,height,color,lineWidth) {
		let t = this;
		t.ctx.strokeStyle = color;
		t.ctx.beginPath();
		t.ctx.moveTo(t.x(left),t.y(top));
		t.ctx.lineTo(t.x(left)+t.x(width),t.y(top));
		t.ctx.lineTo(t.x(left)+t.x(width),t.y(top)+t.y(height));
		t.ctx.lineTo(t.x(left),t.y(top)+t.y(height));
		t.ctx.lineTo(t.x(left),t.y(top));
		t.ctx.lineTo(t.x(left)+t.x(width),t.y(top)); // so the top left join looks right
		t.ctx.lineWidth = t.x(lineWidth);
		// t.ctx.closePath();
		t.ctx.stroke(); 
	}
	fillSquare(left,top,width,color) {
		let t = this;
		t.ctx.fillStyle = color;
		t.ctx.fillRect(t.x(left),t.y(top),t.x(width),t.x(width));
	}
	drawSquare(left,top,width,color,lineWidth) {
		let t = this;
		t.ctx.strokeStyle = color;
		t.ctx.beginPath();
		t.ctx.moveTo(t.x(left),t.y(top));
		t.ctx.lineTo(t.x(left)+t.x(width),t.y(top));
		t.ctx.lineTo(t.x(left)+t.x(width),t.y(top)+t.x(width));
		t.ctx.lineTo(t.x(left),t.y(top)+t.x(width));
		t.ctx.lineTo(t.x(left),t.y(top));
		t.ctx.lineTo(t.x(left)+t.x(width),t.y(top)); // so the top left join looks right
		t.ctx.lineWidth = t.x(lineWidth);
		// t.ctx.closePath();
		t.ctx.stroke(); 
	}
	drawRoundRect(left,top,width,height,radius,color,lineWidth) {
		let t = this,
			x = t.x(left),
			y = t.y(top),
			w = t.x(width),
			h = t.y(height),
			r = t.x(radius);
		t.ctx.strokeStyle = color;
		t.ctx.beginPath();
		t.ctx.moveTo(x + r, y);
		t.ctx.lineTo(x + w - r, y);
		t.ctx.quadraticCurveTo(x + w, y, x + w, y + r);
		t.ctx.lineTo(x + w, y + h - r);
		t.ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
		t.ctx.lineTo(x + r, y + h);
		t.ctx.quadraticCurveTo(x, y + h, x, y + h - r);
		t.ctx.lineTo(x, y + r);
		t.ctx.quadraticCurveTo(x, y, x + r, y);
		// t.ctx.closePath();
		t.ctx.lineWidth = t.x(lineWidth);
		t.ctx.stroke();
	}
	fillRoundRect(left,top,width,height,radius,color) {
		let t = this,
			x = t.x(left),
			y = t.y(top),
			w = t.x(width),
			h = t.y(height),
			r = t.x(radius);
		t.ctx.fillStyle = color;
		t.ctx.beginPath();
		t.ctx.moveTo(x + r, y);
		t.ctx.lineTo(x + w - r, y);
		t.ctx.quadraticCurveTo(x + w, y, x + w, y + r);
		t.ctx.lineTo(x + w, y + h - r);
		t.ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
		t.ctx.lineTo(x + r, y + h);
		t.ctx.quadraticCurveTo(x, y + h, x, y + h - r);
		t.ctx.lineTo(x, y + r);
		t.ctx.quadraticCurveTo(x, y, x + r, y);
		// t.ctx.closePath();
		t.ctx.fill();
	}
	drawRoundSquare(left,top,width,radius,color,lineWidth) {
		let t = this,
			x = t.x(left),
			y = t.y(top),
			w = t.x(width),
			r = t.x(radius);
		t.ctx.strokeStyle = color;
		t.ctx.beginPath();
		t.ctx.moveTo(x + r, y);
		t.ctx.lineTo(x + w - r, y);
		t.ctx.quadraticCurveTo(x + w, y, x + w, y + r);
		t.ctx.lineTo(x + w, y + w - r);
		t.ctx.quadraticCurveTo(x + w, y + w, x + w - r, y + w);
		t.ctx.lineTo(x + r, y + w);
		t.ctx.quadraticCurveTo(x, y + w, x, y + w - r);
		t.ctx.lineTo(x, y + r);
		t.ctx.quadraticCurveTo(x, y, x + r, y);
		// t.ctx.closePath();
		t.ctx.lineWidth = t.x(lineWidth);
		t.ctx.stroke();
	}
	fillRoundSquare(left,top,width,radius,color) {
		let t = this,
			x = t.x(left),
			y = t.y(top),
			w = t.x(width),
			r = t.x(radius);
		t.ctx.fillStyle = color;
		t.ctx.beginPath();
		t.ctx.moveTo(x + r, y);
		t.ctx.lineTo(x + w - r, y);
		t.ctx.quadraticCurveTo(x + w, y, x + w, y + r);
		t.ctx.lineTo(x + w, y + w - r);
		t.ctx.quadraticCurveTo(x + w, y + w, x + w - r, y + w);
		t.ctx.lineTo(x + r, y + w);
		t.ctx.quadraticCurveTo(x, y + w, x, y + w - r);
		t.ctx.lineTo(x, y + r);
		t.ctx.quadraticCurveTo(x, y, x + r, y);
		// t.ctx.closePath();
		t.ctx.fill();
	}
	getTextWidth(text,size,style="normal",fontName='"Fira Sans Condensed"') {
		let t = this;
		t.ctx.font=style+" "+t.y(size)+"px "+fontName;
		return t.unx(t.ctx.measureText(text).width);
	}
	drawBraille(x,y,textString,height,color=this.black,backgroundColor=null,smallDots=false) {
		let t = this;
		let chars = [0,46,16,60,43,41,47,4,55,62,33,44,32,36,40,12,52,2,6,18,50,34,22,54,38,20,49,48,35,63,28,57,8,1,3,9,25,17,11,27,19,10,26,5,7,13,29,21,15,31,23,14,30,37,39,58,45,61,53,42,51,59,24,56];
		let h = t.y(height);
		let tx = textString.split('');
		let col = [h*0.222,h*0.444];
		let row = [h*0.25, h*0.50, h*0.75];
		let rad = [(smallDots ? h*0.025 : 0), h*0.075];
		let cx = t.x(x);
		let cy = t.y(y);
		let cir = 2*Math.PI;
		let char = 0;
		
		tx.forEach((c) => {
			if (c != " ") {
				if (backgroundColor) {
					t.ctx.fillStyle = backgroundColor;
					t.ctx.fillRect(cx, cy, h*0.666, h);
				}
				t.ctx.fillStyle = color;
				char = chars[c.charCodeAt()-32];
				t.ctx.beginPath();
				t.ctx.arc(cx+col[0],cy+row[0],rad[char & 1 ? 1 : 0],0,cir,false);
				t.ctx.fill();
				t.ctx.beginPath();
				t.ctx.arc(cx+col[0],cy+row[1],rad[char & 2 ? 1 : 0],0,cir,false);
				t.ctx.fill();
				t.ctx.beginPath();
				t.ctx.arc(cx+col[0],cy+row[2],rad[char & 4 ? 1 : 0],0,cir,false);
				t.ctx.fill();
				t.ctx.beginPath();
				t.ctx.arc(cx+col[1],cy+row[0],rad[char & 8 ? 1 : 0],0,cir,false);
				t.ctx.fill();
				t.ctx.beginPath();
				t.ctx.arc(cx+col[1],cy+row[1],rad[char & 16 ? 1 : 0],0,cir,false);
				t.ctx.fill();
				t.ctx.beginPath();
				t.ctx.arc(cx+col[1],cy+row[2],rad[char & 32 ? 1 : 0],0,cir,false);
				t.ctx.fill();
			}
			cx = cx + (h*0.666);
		});
		return t.unx(cx)-x;
	}
	drawText(x,y,text,size,align="left",style="normal",color=this.black,rotateDegrees=0,rotX=null,rotY=null,fontName='"Fira Sans Condensed"',width=0, resizeText=false, textBaseline='top') {
		let t = this;
		rotX = (rotX===null ? x : rotX);
		rotY = (rotY===null ? y : rotY);
		if (!fontName) {
			fontName = '"Fira Sans Condensed"';
		}
		t.ctx.fillStyle=color;
		t.ctx.textAlign=align;
		t.ctx.textBaseline=textBaseline;
		let ay = y - ((textBaseline=='top' && isSafari) ? size*0.2 : 0);
		t.ctx.font=style+" "+t.y(size)+"px "+fontName;
		t.ctx.save();
		t.ctx.translate(t.x(rotX),t.y(rotY));
		t.ctx.rotate(rotateDegrees*Math.PI/180);
		t.ctx.translate(0-t.x(rotX),0-t.y(rotY));
		let truncText = text;
		if (width>0) {
			if (resizeText) {
				while (t.ctx.measureText(truncText).width>t.x(width)) {
					size -= 0.1;
					t.ctx.font=style+" "+t.y(size)+"px "+fontName;
				}
			} else {
				while (t.ctx.measureText(truncText).width>t.x(width)) {
					if (truncText.length>1) {
						truncText = truncText.replace(/(\u2026)$/, '').slice(0,-1) + "\u2026";
					} else {
						truncText = '';
					}
				}
			}
		}
		t.ctx.fillText(truncText,t.x(x),t.y(ay));
		t.ctx.restore();
	}
	drawBezierShape(pointArray,color,lineWidth,closePath = false) {
		let t=this;
		t.ctx.strokeStyle = color;
		t.ctx.beginPath();
		t.ctx.moveTo(t.x(pointArray[0][0]),t.y(pointArray[0][1]));
		for (let i=1; i<pointArray.length; i++) {
			t.ctx.bezierCurveTo(t.x(pointArray[i][0]), // first control point
								t.y(pointArray[i][1]),
								t.x(pointArray[i][2]), // second control point
								t.y(pointArray[i][3]),
								t.x(pointArray[i][4]), // end point
								t.y(pointArray[i][5]),
								);
		}
		if (closePath) {
			t.ctx.closePath();
		}
		t.ctx.lineWidth = t.x(lineWidth);
		t.ctx.stroke();
	}
	fillBezierShape(pointArray,color) {
		let t=this;
		t.ctx.fillStyle = color;
		t.ctx.beginPath();
		t.ctx.moveTo(t.x(pointArray[0][0]),t.y(pointArray[0][1]));
		for (let i=1; i<pointArray.length; i++) {
			t.ctx.bezierCurveTo(t.x(pointArray[i][0]), // first control point
								t.y(pointArray[i][1]),
								t.x(pointArray[i][2]), // second control point
								t.y(pointArray[i][3]),
								t.x(pointArray[i][4]), // end point
								t.y(pointArray[i][5]),
								);
		}
		t.ctx.closePath();
		t.ctx.fill();
	}
	drawShape(pointArray,color,lineWidth,closePath = false) {
		let t=this;
		t.ctx.strokeStyle = color;
		t.ctx.beginPath();
		t.ctx.moveTo(t.x(pointArray[0][0]),t.y(pointArray[0][1]));
		for (let i=1; i<pointArray.length; i++) {
			t.ctx.lineTo(t.x(pointArray[i][0]),t.y(pointArray[i][1]));
		}
		if (closePath) {
			t.ctx.closePath();
		}
		t.ctx.lineWidth = t.x(lineWidth);
		t.ctx.stroke();
	}
	fillShape(pointArray,color) {
		let t=this;
		t.ctx.fillStyle = color;
		t.ctx.beginPath();
		t.ctx.moveTo(t.x(pointArray[0][0]),t.y(pointArray[0][1]));
		for (let i=1; i<pointArray.length; i++) {
			t.ctx.lineTo(t.x(pointArray[i][0]),t.y(pointArray[i][1]));
		}
		t.ctx.closePath();
		t.ctx.fill();
	}
	drawArc(x,y,r,start,end,color,lineWidth,closePath=false) { // start and end are in degrees with 0 on top and 90 on the right
		let t=this;
		t.ctx.strokeStyle = color;
		t.ctx.beginPath();
		t.ctx.arc(t.x(x),t.y(y),t.x(r),(start-90)*(Math.PI/180),(end-90)*(Math.PI/180));
		t.ctx.lineWidth = t.x(lineWidth);
		if (closePath) {
			t.ctx.closePath();
		}
		t.ctx.stroke();
	}
	fillArc(x,y,r,start,end,color) { // start and end are in degrees with 0 on top and 90 on the right
		let t=this;
		t.ctx.fillStyle = color;
		t.ctx.beginPath();
		t.ctx.arc(t.x(x),t.y(y),t.x(r),(start-90)*(Math.PI/180),(end-90)*(Math.PI/180));
		t.ctx.closePath();
		t.ctx.fill();
	}
	drawCircle(x,y,r,color,lineWidth) {
		let t=this;
		t.ctx.strokeStyle = color;
		t.ctx.beginPath();
		t.ctx.arc(t.x(x),t.y(y),t.x(r),0,2*Math.PI);
		// t.ctx.closePath();
		t.ctx.lineWidth = t.x(lineWidth);
		t.ctx.stroke();
	}
	fillCircle(x,y,r,color) {
		let t=this;
		t.ctx.fillStyle = color;
		t.ctx.beginPath();
		t.ctx.arc(t.x(x),t.y(y),t.x(r),0,2*Math.PI);
		// t.ctx.closePath();
		t.ctx.fill();
	}
	plotFunction(functions,left,top,width,height,startX=0,endX=360,yScale=1,axisLineWidth=0.2,axisInFront = true) {
		// functions: [[func1,color1,lineWidth1],...,[funcN,colorN,lineWidthN]]
		// startX and endX are in degrees, not radians, because I have a liberal arts degree
		let x,t=this;
		let lf = t.x(left);
		let tp = t.y(top);
		let wd = t.x(width);
		let ht = t.y(height);
		let stX = startX*(Math.PI/180);
		let enX = endX*(Math.PI/180);
		let xSc = (enX-stX)/wd;
		let ySc = ht/(yScale*2);
		
		if (!axisInFront) {
			t.ctx.strokeStyle = t.black;
			t.ctx.beginPath();
			t.ctx.moveTo(lf,tp+(ht/2));
			t.ctx.lineTo(lf+wd,tp+(ht/2)); // x axis
			t.ctx.moveTo(((stX*(-1))/xSc)+lf,tp);
			t.ctx.lineTo(((stX*(-1))/xSc)+lf,tp+ht); // y axis
			// t.ctx.closePath();
			t.ctx.lineWidth = t.x(axisLineWidth);
			t.ctx.stroke();
		}
		
		functions.forEach(f => {
			t.ctx.strokeStyle = f.length>1 ? f[1] : t.red;
			t.ctx.lineWidth = f.length>2 ? t.x(f[2]) : t.x(0.2);
			t.ctx.beginPath();
			t.ctx.moveTo(lf,ht-(((f[0](stX))*ySc)+(ht/2))+tp);
			for (x=lf+1; x<(lf+wd); x+=1) {
				t.ctx.lineTo(x,ht-(((f[0](((x-lf)*xSc)+stX))*ySc)+(ht/2))+tp);
			}
			// t.ctx.closePath();
			t.ctx.stroke();
		});
		
		if (axisInFront) {
			t.ctx.strokeStyle = t.black;
			t.ctx.beginPath();
			t.ctx.moveTo(lf,tp+(ht/2));
			t.ctx.lineTo(lf+wd,tp+(ht/2)); // x axis
			t.ctx.moveTo(((stX*(-1))/xSc)+lf,tp);
			t.ctx.lineTo(((stX*(-1))/xSc)+lf,tp+ht); // y axis
			// t.ctx.closePath();
			t.ctx.lineWidth = t.x(axisLineWidth);
			t.ctx.stroke();
		}
	}
	addPowerButton(left,top) {
		let t = this;
		t.powerButton = {x: left, y: top};
		t.myCanvas.addEventListener('pointerdown', (e) => {
			let epos = t.getEventPosition(e);
			if (epos.x>left && epos.x<left+t.powerButtonWidth && epos.y>top && epos.y<top+t.scaleXToY(t.powerButtonWidth)) {
				t.power = !t.power;
				t.draw();
			}
		});
	}
	addSoundButton(left,top) {
		let t = this;
		t.soundButton = {x: left, y: top};
		t.myCanvas.addEventListener('pointerdown', (e) => {
			let epos = t.getEventPosition(e);
			if (epos.x>left && epos.x<left+t.soundButtonWidth && epos.y>top && epos.y<top+t.scaleXToY(t.soundButtonWidth)) {
				t.sound = !t.sound;
				t.draw();
			}
		});
	}
	addSlider(left,top,width,height,value,enabled,changeFunc) {
		let t = this;
		let sliderNum = t.sliders.length;
		let s = {x: left, y: top, w: width, h: height, value: value, enabled: enabled, active: false, changeFunc: changeFunc, isVertical: t.x(width) < t.y(height)};
		t.sliders.push(s);
		// let knobX = function() {
		//     return left+(width*(value/100));
		// };
		t.myCanvas.addEventListener('pointerdown', (e) => {
			t.mouseIsDown = true;
			let epos = t.getEventPosition(e);
			let v = (s.isVertical ? (1-(s.value/100)) : (s.value/100));
			if (s.enabled && (!s.isVertical && (epos.x>(s.x+(s.w*v))-2 && epos.x<(s.x+(s.w*v))+2 && epos.y>s.y && epos.y<s.y+6)) || (s.isVertical && (epos.y>(s.y+(s.h*v))-2 && epos.y<(s.y+(s.h*v))+2 && epos.x>s.x && epos.x<s.x+6))) {
				s.active = true;
				t.draw();
			}
		});
		t.myCanvas.addEventListener('pointermove', (e) => {
			if (t.mouseIsDown) {
				let epos = t.getEventPosition(e);
				if (s.active) {
					s.value = (s.isVertical ? 100-(Math.min(Math.max((((epos.y-s.y)/s.h)*100),0),100)) : (Math.min(Math.max((((epos.x-s.x)/s.w)*100),0),100)));
					changeFunc(s.value);
					e.preventDefault();
					t.draw();
				}
			}
		});
		t.myCanvas.addEventListener('pointerup', (e) => {
			if (s.enabled) {
				t.mouseIsDown = false;
				s.active = false;
				t.draw();
			}
		});
		return sliderNum;
		
	}
	setSlider(index,val) {
		this.sliders[index].value = val;
		this.sliders[index].changeFunc(val);
		this.draw();
	}
	disableSlider(index) {
		this.sliders[index].enabled = false;
		this.draw();
	}
	enableSlider(index) {
		this.sliders[index].enabled = true;
		this.draw();
	}
	addSmallSlider(left,top,width,height,value,enabled,color,changeFunc) {
		let t = this;
		let sliderNum = t.smallSliders.length;
		let s = {x: left, y: top, w: width, h: height, value: value, enabled: enabled, active: false, color: color, changeFunc: changeFunc, isVertical: t.x(width) < t.y(height)};
		t.smallSliders.push(s);
		t.myCanvas.addEventListener('pointerdown', (e) => {
			t.mouseIsDown = true;
			let epos = t.getEventPosition(e);
			let v = (s.isVertical ? (1-(s.value/100)) : (s.value/100));
			if (s.enabled && (!s.isVertical && (epos.x>(s.x+(s.w*v))-2 && epos.x<(s.x+(s.w*v))+2 && epos.y>s.y && epos.y<s.y+6)) || (s.isVertical && (epos.y>(s.y+(s.h*v))-2 && epos.y<(s.y+(s.h*v))+2 && epos.x>s.x && epos.x<s.x+6))) {
				s.active = true;
				t.draw();
			}
		});
		t.myCanvas.addEventListener('pointermove', (e) => {
			if (t.mouseIsDown) {
				let epos = t.getEventPosition(e);
				if (s.active) {
					s.value = (s.isVertical ? 100-(Math.min(Math.max((((epos.y-s.y)/s.h)*100),0),100)) : (Math.min(Math.max((((epos.x-s.x)/s.w)*100),0),100)));
					changeFunc(s.value);
					t.draw();
				}
			}
		});
		t.myCanvas.addEventListener('pointerup', (e) => {
			if (s.enabled) {
				t.mouseIsDown = false;
				s.active = false;
				t.draw();
			}
		});
		return sliderNum;
		
	}
	setSmallSlider(index,val) {
		this.smallSliders[index].value = val;
		this.smallSliders[index].changeFunc(val);
		this.draw();
	}
	disableSmallSlider(index) {
		this.smallSliders[index].enabled = false;
		this.draw();
	}
	enableSmallSlider(index) {
		this.smallSliders[index].enabled = true;
		this.draw();
	}
	addStaff(left, top, width, height, clef='', keySignature=0, visible=true, color=this.notationFigureColor) {
		let t = this;
		let staffNum = t.staves.length;
		t.loadBravura();
		let s = { x: left, y: top, w: width, h: height, visible: visible, spx: t.scaleYToX(height/4), spy: height/4, clef: clef, keySignature: keySignature, color: color, symbols: [] };
		t.staves.push(s);
		t.setClef(staffNum,clef);
		t.setKey(staffNum,keySignature);
		return staffNum;
	}
	clearStaff(staffIndex, clearKey=false, clearClef=false) {
		let sl = this.staves[staffIndex].symbols.filter(symbol => symbol[6]=='key' || symbol[6]=='clef');
		if (clearKey) {
			sl = sl.filter(symbol => symbol[6]!='key');
		}
		if (clearClef) {
			sl = sl.filter(symbol => symbol[6]!='clef');
		}
		this.staves[staffIndex].symbols = sl;
	}
	setKey(staffIndex,keySignature) {
		let sharps = [];
		let flats = [];
		let sl = this.staves[staffIndex].symbols.filter(symbol => symbol[6]!='key');
		switch (this.staves[staffIndex].clef) {
			case 'treble':
				sharps.push(0, 1.5, -0.5, 1, 2.5, 0.5, 2);
				flats.push(2, 0.5, 2.5, 1, 3, 1.5, 3.5);
				break;
			case 'alto':
				sharps.push(0.5, 2, 0, 1.5, 3, 1, 2.5);
				flats.push(2.5, 1, 3, 1.5, 3.5, 2, 4);
				break;
			case 'tenor':
				sharps.push(3, 1, 2.5, 0.5, 2, 0, 1.5, -0.5);
				flats.push(1.5, 0, 2, 0.5, 2.5, 1, 3);
				break;
			case 'bass':
				sharps.push(1, 2.5, 0.5, 2, 3.5, 1.5, 3);
				flats.push(3, 1.5, 3.5, 2, 4, 2.5, 4.5);
				break;
			case 'unpitched':
			case 'percussion':
				break;
		}
		let i;
		let y=4.25;
		if (keySignature>0) {
			for (i=0; i<Math.min(keySignature,sharps.length); i++) {
				sl.push([true, i<keySignature-7 ? this.doubleSharpSymbol : this.sharpSymbol, y, sharps[i], 1, 'left', 'key']);
				y = y + 1.2;
			}
		} else if (keySignature<0) {
			for (i=0; i<Math.min(keySignature*(-1),flats.length); i++) {
				sl.push([true, i<(keySignature*(-1))-7 ? this.doubleFlatSymbol : this.flatSymbol, y, flats[i], 1, 'left', 'key']);
				y = y + ((i<(keySignature*(-1))-7) ? 2.0 : 1.2);
			}
		}
		this.staves[staffIndex].keySignature = keySignature;
		this.staves[staffIndex].symbols = sl;
	}
	setClef(staffIndex,clef) {
		let sl = this.staves[staffIndex].symbols.filter(symbol => symbol[6]!='clef');
		switch (clef) {
			case 'treble':
				sl.push([true, '\ue050', 0.75, 3, 1, 'left','clef']);
				break;
			case 'alto':
				sl.push([true, '\ue05b', 0.75, 2, 1, 'left','clef']);
				break;
			case 'tenor':
				sl.push([true, '\ue05b', 0.75, 1, 1, 'left','clef']);
				break;
			case 'bass':
				sl.push([true, '\ue061', 0.75, 1, 1, 'left','clef']);
				break;
			case 'unpitched':
			case 'percussion':
				sl.push([true, '\ue068', 0.75, 2, 1, 'left','clef']);
				break;
		}
		this.staves[staffIndex].symbols = sl;
		this.staves[staffIndex].clef = clef;
		this.setKey(staffIndex,this.staves[staffIndex].keySignature);
	}
	addMIDINote(staffIndex,staffX,midiNote,useSharps,noteType,numberOfDots=0,forceStemDirection=0,noteColor=this.notationFigureColor,accidentalOffset=0) {
		var offset = 41;
		switch (this.staves[staffIndex].clef) {
			case 'alto':
				offset = 35;
			case 'tenor':
				offset = 33;
			case 'bass':
				offset = 29;
		}
		var staffY = ((this.midiToNoteOctave(midiNote)+1)*7)+this.midiToDiatonicPitchClass(midiNote,useSharps)-offset;
		var acc = this.midiToAccidental(midiNote) ? (useSharps ? 'sharp' : 'flat') : '';
		this.addNote(staffIndex, staffX, staffY, noteType, numberOfDots, acc, forceStemDirection, noteColor, accidentalOffset);
	}
	addNote(staffIndex,staffX,staffY,noteType,numberOfDots=0,accidental='',forceStemDirection=0,noteColor=this.notationFigureColor,accidentalOffset=0) {
		let t = this;
		let s = t.staves[staffIndex];
		let noteheadType = 'quarter';
		let addStem = false;
		let stemOffset = 0;
		let numberOfFlags = 0;
		switch (noteType) {
			case 'oneHundredTwentyEighth':
				noteheadType = 'black';
				addStem = true;
				numberOfFlags = 5;
				break;
			case 'sixtyFourth':
				noteheadType = 'black';
				addStem = true;
				numberOfFlags = 4;
				break;
			case 'thirtySecond':
				noteheadType = 'black';
				addStem = true;
				numberOfFlags = 3;
				break;
			case 'sixteenth':
				noteheadType = 'black';
				addStem = true;
				numberOfFlags = 2;
				break;
			case 'eighth':
				noteheadType = 'black';
				addStem = true;
				numberOfFlags = 1;
				break;
			case 'quarter':
				noteheadType = 'black';
				addStem = true;
				break;
			case 'quarterStemless':
				noteheadType = 'black';
				addStem = false;
				break;
			case 'half':
				noteheadType = 'half';
				addStem = true;
				break;
			case 'halfStemless':
				noteheadType = 'half';
				addStem = false;
				break;
			case 'whole':
				noteheadType = 'whole';
				addStem = false;
				break;
			case 'doubleWhole':
				noteheadType = 'doubleWhole';
				addStem = false;
				break;
			case 'doubleWholeSquare':
				noteheadType = 'doubleWholeSquare';
				addStem = false;
				break;
			case 'x':
				noteheadType = 'x';
				addStem = true;
				stemOffset = -0.5;
				break;
			case 'xstemless':
				noteheadType = 'x';
				addStem = false;
				break;
			case 'triangle':
				noteheadType = 'triangle';
				addStem = true;
				stemOffset = 0.5;
				break;
			case 'trianglestemless':
				noteheadType = 'triangle';
				addStem = false;
				break;
		}
		let nhw = t.addNotehead(staffIndex, staffX, staffY, noteheadType, 0, noteColor);
		if (addStem) {
			t.addStem(staffIndex, staffX, staffY, noteheadType, numberOfFlags, forceStemDirection, stemOffset, noteColor);
		}
		if (accidental) {
			t.addAccidental(staffIndex, staffX-accidentalOffset, staffY, accidental, noteheadType, noteColor);
		}
		if (numberOfDots) {
			t.addDots(staffIndex, staffX, staffY, numberOfDots, noteheadType, noteColor);
		}
		return nhw;
	}
	addDots(staffIndex,staffX,staffY,numberOfDots,noteheadType,dotColor=this.notationFigureColor) {
		let t = this;
		if (dotColor=='') {dotColor = t.notationFigureColor};
		let s = t.staves[staffIndex];
		// let x = t.getXFromStaffX(staffIndex, staffX);
		// let y = t.getYFromStaffY(staffIndex, staffY);
		let nd = t.getNoteheadData(noteheadType, s.h);
		let dotX = t.getXFromStaffX(staffIndex, staffX)+(nd[1]*1.6);
		let dotY = t.getYFromStaffY(staffIndex, (Math.floor(staffY/2)*2)+1);
		for (let i = 0; i<numberOfDots; i++) {
			t.drawText(dotX+(s.spx*i), dotY, '\ue1e7', s.h*0.7, 'center', 'normal', dotColor, undefined, undefined, undefined, 'Bravura', undefined, undefined, 'alphabetic');
		}
	}
	addAccidental(staffIndex,staffX,staffY,accidental,noteheadType,accidentalColor=this.notationFigureColor) {
		let t = this;
		if (accidentalColor=='') {accidentalColor = t.notationFigureColor};
		let s = t.staves[staffIndex];
		let x = t.getXFromStaffX(staffIndex, staffX);
		let y = t.getYFromStaffY(staffIndex, staffY);
		let nd = t.getNoteheadData(noteheadType, s.h);
		let accText = {
			'flat':t.flatSymbol,
			'natural':t.naturalSymbol,
			'sharp':t.sharpSymbol,
			'doubleSharp':t.doubleSharpSymbol,
			'doubleFlat':t.doubleFlatSymbol
		}[accidental];
		t.drawText(x-nd[1], y, accText, s.h, 'right', 'normal', accidentalColor, undefined, undefined, undefined, 'Bravura', undefined, undefined, 'alphabetic');
	}
	addStem(staffIndex,staffX,staffY,noteheadType,numberOfFlags,forceDirection=0,stemVerticalOffset=0,stemColor=this.notationFigureColor) {
		let t = this;
		if (stemColor=='') {stemColor = t.notationFigureColor};
		let s = t.staves[staffIndex];
		let x = t.getXFromStaffX(staffIndex, staffX);
		let y = t.getYFromStaffY(staffIndex,staffY);
		let vo = (s.h/4)*stemVerticalOffset;
		let nd = t.getNoteheadData(noteheadType, s.h);
		let uf = ['','\ue240','\ue242','\ue244','\ue246','\ue248','\ue24a','\ue24c','\ue24e'];
		let df = ['','\ue241','\ue243','\ue245','\ue247','\ue249','\ue24b','\ue24d','\ue24f'];
		let stemX;
		if ((staffY<0 && forceDirection==0) || forceDirection==1) {
			stemX = x+(nd[1]/2);
			t.drawLine(stemX, y+vo, stemX, Math.min(y-(s.spy*3.5),s.y+(s.h/2)), '#000000', s.h/75, true);
			t.drawText(stemX, Math.min(y-(s.spy*3.5),s.y+(s.h/2)), uf[numberOfFlags], s.h, 'left', 'normal', stemColor, undefined, undefined, undefined, 'Bravura', undefined, undefined, 'alphabetic');
		} else {
			stemX = x-(nd[1]/2);
			t.drawLine(stemX, y-vo, stemX, Math.max(y+(s.spy*3.5),s.y+(s.h/2)), '#000000', s.h/75, true);
			t.drawText(stemX, Math.max(y+(s.spy*3.5),s.y+(s.h/2)), df[numberOfFlags], s.h, 'left', 'normal', stemColor, undefined, undefined, undefined, 'Bravura', undefined, undefined, 'alphabetic');
		}
	}
	addNotehead(staffIndex,staffX,staffY,noteheadType,offset=0,noteheadColor=this.notationFigureColor) {
		let t = this;
		if (noteheadColor=='') {noteheadColor = t.notationFigureColor};
		let s = t.staves[staffIndex];
		let x = t.getXFromStaffX(staffIndex, staffX);
		let nd = t.getNoteheadData(noteheadType, s.h);
		if (Math.abs(staffY)>5) {
			let sign = staffY>0 ? 1 : -1;
			let noteY = t.getYFromStaffY(staffIndex, staffY);
			let noteX = x+(nd[1]*offset);
			let y;
			if (staffY>0) {
				for (y=s.y-s.spy; y>noteY-(s.spy/4); y=y-s.spy) {
					t.drawLine(noteX-nd[1], y, noteX+nd[1], y, noteheadColor, s.h/100, true);
				}
			} else {
				for (y=s.y+s.h+s.spy; y<noteY+(s.spy/4); y=y+s.spy) {
					t.drawLine(noteX-nd[1], y, noteX+nd[1], y, noteheadColor, s.h/100, true);
				}
			}
			
		}
		t.drawText(x+(nd[1]*offset), t.getYFromStaffY(staffIndex, staffY), nd[0], s.h, 'center', 'normal', noteheadColor, undefined, undefined, undefined, 'Bravura', undefined, undefined, 'alphabetic');
		return nd[1];
	}
	getXFromStaffX(staffIndex,staffX) { // staffX is the number of staff space units from the left edge of the staff
		let s = this.staves[staffIndex];
		return s.x+(this.scaleYToX(s.h/4)*staffX);
	}
	getStaffXFromX(staffIndex,x) {
		let s = this.staves[staffIndex];
		return (x-s.x)/(this.scaleYToX(s.h/4));
	}
	getYFromStaffY(staffIndex,staffY) { // staffY is an integer representing diatonic steps above the middle staff line
		let s = this.staves[staffIndex];
		return s.y+(s.h/2)+((s.h/8)*staffY*(-1));
	}
	getStaffYFromY(staffIndex,y) {
		let s = this.staves[staffIndex];
		return (y-(s.y+(s.h/2)))/(-1*(s.h/8));
	}
	getNoteheadData(noteheadType,staffHeight) {
		let spx = this.scaleYToX(staffHeight/4);
		return {
			'doubleWhole':['\ue0a0',spx*2.2],
			'doubleWholeSquare':['\ue0a1',spx*1.85],
			'whole':['\ue0a2',spx*1.4],
			'half':['\ue0a3',spx*1.1],
			'black':['\ue0a4',spx*1.1],
			'x':['\ue0a9',spx*1.3],
			'triangle':['\ue0bd',spx*1.3]
		}[noteheadType];
	}
	showStaff(staffIndex) {
		this.staves[staffIndex].visible = true;
	}
	hideStaff(staffIndex) {
		this.staves[staffIndex].visible = false;
	}
	setStaffColor(staffIndex,color) {
		this.staves[staffIndex].color = color;
	}
	addKeyboard(left,top,width,height,startingNote,enabled,keyDownFunc,keyUpFunc,numWhiteKeys=0,isPolyphonic='false',showFeedback='true') {
		let t = this;
		let kbNum = t.keyboards.length;
		let diatonicPos = [0,1,1,2,2,3,4,4,5,5,6,6][startingNote % 12];
		let startingOctave = Math.floor(startingNote/12);
		let ln = (startingOctave*12)+([0,2,2,4,4,5,7,7,9,9,11,11][startingNote % 12]);
		
		let getMIDINote = ((x,y) => {
			let ww = t.scaleYToX(height/4);
			let bh = height*0.6;
			let ox = 0-(diatonicPos*ww);
			let pc;
			if (y>bh) {
				pc = [0,2,4,5,7,9,11][((Math.floor((x % (ww*7))/ww)-(7-diatonicPos))+7)%7];
			} else {
				pc = [0,0,0,1,1,2,2,3,3,4,4,4,5,5,5,6,6,7,7,8,8,9,9,10,10,11,11,11][((Math.floor((x % (ww*7))/(ww/4))-((7-diatonicPos)*4))+28)%28];
			}
			return (Math.floor(startingNote/12)*12)+((Math.floor((x-ox)/(ww*7))*12))+pc;
			
		});
		
		let adjWidth = (numWhiteKeys>0) ? (numWhiteKeys * t.scaleYToX(height/4)) : width;
		let k = {x: left, y: top, w: adjWidth, h: height, lowNote: ln, dp: diatonicPos, notesOn: new Set(), enabled: enabled, keyDownFunction: keyDownFunc, keyUpFunction: keyUpFunc, isPolyphonic: isPolyphonic, showFeedback: showFeedback, keyFills: [], keyMarks: [] };
		t.keyboards.push(k);
		// t.keyboardIsPolyphonic[kbNum] = isPolyphonic;
		
		t.myCanvas.addEventListener('pointerdown', (e) => {
			t.mouseIsDown = true;
			let epos = t.getEventPosition(e);
			if (k.enabled && epos.x>left && epos.x<left+adjWidth && epos.y>top && epos.y<top+height) {
				let midiNote = getMIDINote(epos.x-left,epos.y-top);
				k.notesOn.add(midiNote);
				keyDownFunc(midiNote);
				t.draw();
			}
		});
		
		t.myCanvas.addEventListener('pointermove', (e) => {
			if (t.mouseIsDown) {
				let epos = t.getEventPosition(e);
				if (k.enabled && epos.x>left && epos.x<left+adjWidth && epos.y>top && epos.y<top+height) {
					let midiNote = getMIDINote(epos.x-left,epos.y-top);
					if (!k.notesOn.has(midiNote)) {
						k.notesOn.forEach((n) => {
							keyUpFunc(n);
						});
						k.notesOn.clear();
						k.notesOn.add(midiNote);
						keyDownFunc(midiNote);
						t.draw();
					}
				} else {
					k.notesOn.forEach((n) => {
						keyUpFunc(n);
					});
					k.notesOn.clear();
					t.draw();
				}
			}
		});
		
		t.myCanvas.addEventListener('pointerleave', (e) => {
			k.notesOn.forEach((n) => {
				keyUpFunc(n);
			});
			k.notesOn.clear();
			t.draw();
		});
		
		t.myCanvas.addEventListener('pointerup', (e) => {
			if (k.enabled) {
				t.mouseIsDown = false;
				k.notesOn.forEach((n) => {
					keyUpFunc(n);
				});
				k.notesOn.clear();
				t.draw();
			}
		});
		
		return kbNum;
	}
	pressKeyboardKey(index, midiNote) {
		this.keyboards[index].notesOn.add(midiNote);
		this.keyboards[index].keyDownFunction(midiNote);
		this.draw();
	}
	releaseKeyboardKey(index, midiNote) {
		if (this.keyboards[index].isPolyphonic) {
			this.keyboards[index].notesOn.delete(midiNote);
			this.keyboards[index].keyUpFunction(midiNote);
		} else {
			this.keyboards[index].notesOn.forEach((n) => {
				this.keyboards[index].keyUpFunction(n);
			});
			this.keyboards[index].notesOn.clear();
		}
		this.draw();
	}
	enableKeyboard(index) {
		this.keyboards[index].enabled = true;
		this.draw();
	}
	disableKeyboard(index) {
		this.keyboards[index].enabled = false;
		this.draw();
	}
	fillKeyboardKey(index, midiNote, fillColor, blackKeyFillColor = null) {
		if (!blackKeyFillColor) { blackKeyFillColor = fillColor }
		this.keyboards[index].keyFills[midiNote] = [fillColor, blackKeyFillColor];
		this.draw();
	}
	clearKeyboardKey(index, midiNote) {
		this.keyboards[index].keyFills[midiNote] = '';
		this.draw();
	}
	markKeyboardKey(index, midiNote, markColor, blackKeyMarkColor = null) {
		if (!blackKeyMarkColor) { blackKeyMarkColor = markColor }
		this.keyboards[index].keyMarks[midiNote] = [markColor, blackKeyMarkColor];
		this.draw();
	}
	unmarkKeyboardKey(index, midiNote) {
		this.keyboards[index].keyMarks[midiNote] = '';
		this.draw();
	}
	enableMouseWheel(callback, resolution = 1) {
		this.mouseWheelCallback = callback;
		this.mouseWheelResolution = resolution;
		this.myCanvas.addEventListener("mousewheel",this.doMouseWheelCallback.bind(this),false);
		this.myCanvas.addEventListener("DOMMouseScroll",this.doMouseWheelCallback.bind(this),false);
	}
	doMouseWheelCallback(e) {
		var deltaX=0;
		var deltaY=0;
		switch (e.axis) {
			case 1: // horizontal (Firefox only)
				deltaX = e.detail * this.mouseWheelResolution;
				break;
			case 2: // vertical (Firefox only)
				deltaY = e.detail * this.mouseWheelResolution;
				break;
			default: // not Firefox
				deltaX = -e.wheelDeltaX * this.mouseWheelResolution;
				deltaY = -e.wheelDeltaY * this.mouseWheelResolution;
		}
					
		this.mouseWheelCallback(0-this.unx(deltaX),0-this.uny(deltaY));
		e.preventDefault();
		return false;
	}
	draw() {
		let t=this;
		if (t.powerButton) {
			let px = t.powerButton.x;
			let py = t.powerButton.y;
			let pw = t.powerButtonWidth;
			let ph = t.scaleXToY(t.powerButtonWidth);
			if (t.power) {
				t.fillRect(px, py, pw, ph, t.green);
			} else {
				t.fillRect(px, py, pw, ph, t.lightGray);
			}
			t.drawRect(px, py, pw, ph, t.white, 0.1);
			t.drawArc(px+(pw/2), py+(ph/2), pw/4, 30, 330, t.white, 0.25);
			t.drawLine(px+(pw/2), py+(ph/6), px+(pw/2), py+(2*ph/5), t.white, 0.25);
		}
		if (t.soundButton) {
			let sx = t.soundButton.x;
			let sy = t.soundButton.y;
			let sw = t.soundButtonWidth;
			let sh = t.scaleXToY(t.soundButtonWidth);
			if (t.sound) {
				t.fillRect(sx, sy, sw, sh, t.blue);
			} else {
				t.fillRect(sx, sy, sw, sh, t.lightGray);
			}
			t.drawRect(sx, sy, sw, sh, t.white, 0.1);
			t.fillShape([[sx+(sw*0.32), sy+(sh*0.40)],
						 [sx+(sw*0.48), sy+(sh*0.40)],
						 [sx+(sw*0.66), sy+(sh*0.24)],
						 [sx+(sw*0.66), sy+(sh*0.76)],
						 [sx+(sw*0.48), sy+(sh*0.60)],
						 [sx+(sw*0.32), sy+(sh*0.60)]], t.white);
		}
		t.sliders.forEach((s) => {
			// {x: left, y: top, w: width, h: height, value: value, enabled: enabled, active: false, isVertical: false}
			let lineColor = (s.enabled ? t.darkGray : t.lightGray);
			let knobFillColor = (s.enabled ? (s.active ? t.red : t.white) : t.lightGray);
			let knobStrokeColor = (s.enabled ? t.black : t.gray);
			let center = (s.isVertical ? s.x+(s.w/2) : s.y+(s.h/2));
			if (s.isVertical) {
				t.drawLine(center, s.y, center, s.y+s.h, lineColor, 0.5); // line
				t.fillCircle(center, s.y+(s.h*(1-(s.value/100))), 1, knobFillColor); // knob fill
				t.drawCircle(center, s.y+(s.h*(1-(s.value/100))), 1, knobStrokeColor, 0.25); // knob stroke
			} else {
				t.drawLine(s.x, center, s.x+s.w, center, lineColor, 0.5); // line
				t.fillCircle(s.x+(s.w*(s.value/100)), center, 1, knobFillColor); // knob fill
				t.drawCircle(s.x+(s.w*(s.value/100)), center, 1, knobStrokeColor, 0.25); // knob stroke
			}
		});
		t.smallSliders.forEach((s) => {
			// {x: left, y: top, w: width, h: height, value: value, enabled: true, active: false, color: color, isVertical: false}
			if (s.enabled) { // disabled small sliders are just not drawn
				let lineColor = s.color;
				let center = (s.isVertical ? s.x+(s.w/2) : s.y+(s.h/2));
				if (s.isVertical) {
					t.drawLine(center, s.y, center, s.y+s.h, lineColor, 0.25); // line
					t.fillCircle(center, s.y+(s.h*(1-(s.value/100))), 0.5, lineColor); // knob
				} else {
					t.drawLine(s.x, center, s.x+s.w, center, lineColor, 0.25); // line
					t.fillCircle(s.x+(s.w*(s.value/100)), center, 0.5, lineColor); // knob
				}
			}
		});
		t.staves.forEach((s) => {
			if (s.visible) {
				for (let i=0; i<5; i++) {
					t.drawLine(s.x, s.y+((s.h/4)*i), s.x+s.w, s.y+((s.h/4)*i), s.color, s.h/100, true);
				}
				let spy = s.h/4;
				let spx = t.scaleYToX(spy);
				s.symbols.forEach((sym) => {
					t.drawText(s.x+(spx*sym[2]), s.y+(spy*sym[3]), sym[1], s.h*sym[4], sym[5], 'normal', s.color, undefined, undefined, undefined, sym[0] ? 'Bravura' : undefined, undefined, undefined, 'alphabetic');
				});
			}
		});
		t.keyboards.forEach((k) => {
			let tww, ww = t.scaleYToX(k.h/4);
			let bh = k.h*0.6;
			let sc = k.dp;
			let keyNum = k.lowNote;
			let keyColor = (k.enabled ? '#000000' : t.gray);
			let keyBackgroundColor = (t.keyboardBackgroundColor)
			let keyFillColor = (k.enabled ? t.red : (t.keyboardBackgroundColor));
			// let keyBackgroundColor = (t.darkMode ? '#888888' : '#ffffff')
			// let keyFillColor = (k.enabled ? t.red : (t.darkMode ? '#888888' : '#ffffff'));
			let firstKey = true;
			for (let x=k.x; x<k.x+k.w-0.1; x+=ww) {
				tww = Math.min(ww,(k.x+k.w)-x);
				if (k.notesOn.has(keyNum) && k.showFeedback) {
					t.fillRect(x, k.y, tww, k.h, keyFillColor);
				} else {
					if (k.keyFills[keyNum]) {
						t.fillRect(x, k.y, tww, k.h, k.keyFills[keyNum][0]);	
					} else {
						t.fillRect(x, k.y, tww, k.h, keyBackgroundColor);
					}
				}
				if (k.keyMarks[keyNum]) {
					t.fillCircle(x+(tww/2), k.y+(k.h*0.85), k.h*0.015, k.keyMarks[keyNum][0]);
				}
				t.drawRect(x, k.y, tww, k.h, keyColor, 0.1);
				tww = Math.min(ww/2,(k.x+k.w)-(x-(ww/4)));
				if ((sc==1 || sc==2 || sc==4 || sc==5 || sc==6) && !firstKey) {
					if (k.notesOn.has(keyNum-1) && k.showFeedback) {
						t.fillRect(x-(ww/4), k.y, tww, bh, keyFillColor);
					} else {
						if (k.keyFills[keyNum-1]) {
							t.fillRect(x-(ww/4), k.y, tww, bh, k.keyFills[keyNum-1][1]);
						} else {
							t.fillRect(x-(ww/4), k.y, tww, bh, keyColor);
						}
					}
					if (k.keyMarks[keyNum-1]) {
						t.fillCircle(x, k.y+(k.h*0.45), k.h*0.015, k.keyMarks[keyNum-1][1]);
					}
					t.drawRect(x-(ww/4), k.y, tww, bh, keyColor, 0.1);
				}
				if (sc==0 || sc==1 || sc==3 || sc==4 || sc==5) {
					keyNum+=2;
				} else {
					keyNum+=1;
				}
				sc = (sc==6 ? 0 : sc+1);
				firstKey = false;
			}
		});
	}
}

function setBrowserVars() {
	isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0; // Opera 8.0+
	isFirefox = typeof InstallTrigger !== 'undefined'; // Firefox 1.0+
	isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && window['safari'].pushNotification)); // Safari 3.0+ "[object HTMLElementConstructor]" 
	isIE = /*@cc_on!@*/false || !!document.documentMode; // Internet Explorer 6-11
	isEdge = !isIE && !!window.StyleMedia; // Edge 20+
	isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime); // Chrome 1 - 79
	isEdgeChromium = isChrome && (navigator.userAgent.indexOf("Edg") != -1); // Edge (based on chromium) detection
	isBlink = (isChrome || isOpera) && !!window.CSS; // Blink engine detection
}