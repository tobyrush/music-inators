/* global alert,window,document,Tone,initializeBMViewers,MouseEvent: true */
/* jshint -W084 */
/* jshint esversion: 6 */

// ****************************************************
// *
// *  INATOR TEMPLATE
// *  Interactive musical figures for any web page
// *
// *  Overview:
// *
// *  Add code to initialize the object in constructor(), after the super() block
// *  Add code to handle user events in the super() block
// *  Add code to draw the object's interface in draw()
// *  Add other functions as necessary
// *
// *  
// ****************************************************

class InatorName extends Inator {                                              // replace InatorName with a unique name 
    constructor(whichCanvas) {                                                 // and then add it to the last line of this file
        var eventRegistry = {
                
            ///// add code below to respond to specific user events
            ///// remember to call this.draw() to refresh the inator's canvas if necessary
            
            pointerdown: (e) => {                                            // pointerdown occurred at epos.x, epos.y
                let epos = this.getEventPosition(e);
                
                // your code here
                
                
                // this.myWindow.addEventListener('pointerup', (e) => {      // use this code to track if the user has
                //     this.mouseIsDown = false;                           // released the mouse button outside the inator
                // });
                this.mouseIsDown = true;
            },
            pointermove: (e) => {                                            // mouse has moved to epos.x, epos.y
                let epos = this.getEventPosition(e);
                
                // your code here
                
            },
            pointerup: (e) => {                                              // pointerup occurred at epos.x, epos.y
                let epos = this.getEventPosition(e);
                
                // your code here
                
            },
            
            ///// key presses are important to make inators accessible!
            ///// provide keyboard shortcuts to all visual controls and describe them in the inator's alt text.
            ///// In the code below, use this.setAriaStatus('message') to provide screenreader responses to keypresses.
            
            keydown: (e) => {                                              // key with code e.keyCode was pressed
                if (this.keyIsDown) return;                                // remove this to allow held keys to auto-repeat
                this.keyIsDown = true;
                // e.preventDefault();                                     // use this to prevent the keypress from passing through
                switch (e.code) {
                
                ///// use https://www.toptal.com/developers/keycode/table to find other codes.
                    
                    case "Enter":
                        
                        break;
                    case "Space":
                        
                        break;
                    case "ArrowLeft":
                        
                        break;
                    case "ArrowUp":
                        
                        break;
                    case "ArrowRight":
                       
                        break;
                    case "ArrowDown":
                        
                        break;
                }
            },
            keyup: (e) => {                                                // key with code e.keyCode was released
                this.keyIsDown = false;
                // e.preventDefault();                                     // use this to prevent the keypress from passing through
                switch (e.code) {
                    case "Space":
                        
                        break;
                }
            }
        };
        super(whichCanvas, eventRegistry);
        
        ///// ****************** YOUR INITIALIZATION CODE HERE ******************
        
        
        
        
        ///// *******************************************************************
        
        ///// code above will run when page loads.
        
        ///// AVAILABLE PREBUILT CONTROLS
        ///// see draw() below for coordinates and dimensions like LEFT, TOP, WIDTH, HEIGHT
        
        ///// creates a synthesizer and connects it to audio output (see USING TONE.JS below)
        // this.mySynth = new Tone.Synth().toDestination();
        
        ///// creates an audio player and connects it to audio output (see USING TONE.JS below)
        ///// (this.resourcesDirectory returns the URL for a file placed in /js/inators/_resources/)
        // this.myPlayerIndex = new Tone.Player(this.resourcesDirectory('AUDIO.MP3')).toDestination();
        
        ///// creates an onscreen interactive piano keyboard
        ///// NUM-WHITE-KEYS is optional and will override WIDTH if used
        // this.myKeyboardIndex = this.addKeyboard(LEFT, TOP, WIDTH, HEIGHT, STARTING-NOTE, ENABLED, this.noteOn.bind(this), this.noteOff.bind(this), NUM-WHITE-KEYS);
        
        ///// creates an onscreen slider controls which returns a value from 0 to 100
        // this.mySliderIndex = this.addSlider(LEFT, TOP, WIDTH, HEIGHT, INITIAL-VALUE, ENABLED, this.sliderChange.bind(this));
        // this.mySmallSliderIndex = this.addSmallSlider(LEFT, TOP, WIDTH, HEIGHT, INITIAL-VALUE, ENABLED, this.sliderChange.bind(this));
        
        ///// creates an onscreen power button (see INATOR POWER below)
        // this.addPowerButton(LEFT, TOP);
        
        ///// INATOR POWER:
        ///// this.power is a boolean variable that can be used or ignored by the inator.
        /////
        ///// - if the inator is static and only reacts to user interaction, this.power can be ignored.
        ///// - if the inator is resource-heavy (showing persistent animation like a level meter), then this.power should be used
        ///// - if the inator plays sound even without user interaction, this.power MUST be used.
        ///// 
        ///// to use this.power:
        /////
        ///// - check this.power in your functions and in draw() to determine whether controls are enabled or disabled.
        ///// - add code to powerOn() and powerOff() below to run code when inator's power status changes
        ///// - use this.addPowerButton above to add a power button for users to turn the inator on and off
        ///// - or turn power on and off programmatically with this.power = true or this.power = false (not recommended)
        ///// - or you can set this.autoPowerOn = true to automatically turn the inator on when it scrolls into view (not recommended)
        ///// - whether or not you set this.autoPowerOn = true, inator will automatically power off when it scrolls out of view.
        /////
        
        ///// USING TONE.JS
        ///// if you use Tone.js, you must include a call Tone.start() in a function that runs in response to a user action
        ///// for example, in powerOn() if you include a power button in your interface
        ///// or in noteOn() if you are using a piano keyboard
         
        ///// AVAILABLE BUILT-IN FUNCTIONS
        ///// these can be used at any time
        
        ///// returns the URL for a file located in /js/inators/_resources/
        ///// which is the preferred location for inator-supporting media
        // this.myResourceFile = this.resourceURL(FILENAME);
        
        ///// returns the value of a parameter included in the <canvas> tag. This is a useful option for
        ///// multipurpose inators to have configuration options in their parent HTML page
        // this.paramValue = getParam(PARAM-NAME);
        
        ///// sets the canvas' WAI-ARIA status, providing feedback that will be announced by screenreaders
        // this.setAriaStatus(MESSAGE);
        
        ///// returns the distance, measured as a percentage of the canvas width, between (X1,Y1) and (X2,Y2)
        // this.myDistance = this.distance(X1, Y1, X2, Y2);
        
        ///// returns the frequency in hertz of a given MIDI note value
        // this.myFrequency = this.midiToFreq(MIDI-NOTE-VALUE);
        
        ///// sets the value of slider SLIDER-INDEX to the given value
        // this.setSlider(SLIDER-INDEX, VALUE);
        // this.setSmallSlider(SLIDER-INDEX, VALUE);
        
        ///// enables or disables slider SLIDER-INDEX or keyboard KEYBOARD-INDEX
        // this.enableSlider(SLIDER-INDEX);
        // this.disableSlider(SLIDER-INDEX);
        // this.enableSmallSlider(SLIDER-INDEX);
        // this.disableSmallSlider(SLIDER-INDEX);
        // this.enableKeyboard(SLIDER-INDEX);
        // this.disableKeyboard(SLIDER-INDEX);
        
        ///// sets a callback for mousewheel movement
        ///// CALLBACK is a function which gets passed (DELTA-X,DELTA-Y), representing the relative movement of the mouse
        ///// RESOLUTION is a scaling vector applied to mouse movements; if omitted, it defaults to 1
        /////      higher values exaggerate mousewheel movements, lower values inhibit them
        /////      a value of 0 suppresses them completely, and negative values reverse direction
        // this.enableMouseWheel(CALLBACK, RESOLUTION);
        
        ///// the command below should appear after initialization, it draws the interface for the first time
        
        this.setAriaLabel('Accessible description');                           // provide screenreader-compatible instructions
        this.draw();                                                           // refresh the inator's visual interface
    }
    
    powerOn() {                                                                // power has been turned on
        
        // your code here
        
    }
    
    powerOff() {                                                               // user switched power button to 'off'
    
        // your code here
    
    }
    
    ///// ****************** ADD ANY CUSTOM FUNCTIONS HERE ******************
    
    
    
    
    
    ///// *******************************************************************
    
    ///// add other functions above as necessary
    
    ///// COMMON FUNCTIONS:
    
    ///// noteOn() and noteOff() can be used to capture piano keyboard input if this.addKeyboard is used above
    ///// keyboards show visual feedback even if you don't call this.draw() in these functions
    //
    noteOn(midiNote) {
        // let hz = this.midiToFreq(midiNote);                                 // in case you need frequency in hertz
        // this.mySynth.triggerAttack(hz);                                    // connects keyboard to synth
    
        // your code here
    
    }
    
    noteOff(midiNote) {
        // let hz = this.midiToFreq(midiNote);                                 // in case you need frequency in hertz
        // this.mySynth.triggerRelease();                                     // connects keyboard to synth
    
        // your code here
    
    }
    
    ///// sliderChange can be used to capture slider changes if this.addSlider or this.addSmallSlider is used above
    ///// note that multiple sliders should call different functions
    //
    // sliderChange(val) {                                                     // slider value is from 0 to 100
    //     
    //     
    //     this.draw();                                                        // call this to update inator's canvas
    // }
    
    draw() {
        this.clear();                                                          // clears the canvas
        super.draw();                                                          // draws keyboards, sliders, power button
        
        ///// ****************** DRAW YOUR INTERFACE HERE ******************
        
        
        
        
        ///// **************************************************************
        
        ///// build the inator's interface in the area above.
        ///// if you need something to appear behind keyboards, sliders or power button,
        ///// place the code BEFORE super.draw().
        
        ///// INATOR COORDINATES AND MEASUREMENTS
        ///// all coordinates and measurements in these functions are expressed as percentages of canvas height or width,
        ///// so 0,0 is the upper left corner and 100,100 is lower right corner.
        ///// canvas size for each inator is specified in main.css; default size is a rectangle with a 1:2.5 ratio
        ///// parameters like lineWidth or radius which are not tied to height or width are percentages of canvas width.
        
        ///// INATOR COLORS
        ///// all COLOR parameters can be a hex code (e.g., "#FF0" or "#ef652a") but for consistency, standard colors are defined:
        /////
        /////       this.red             this.lightRed             this.darkRed              this.black
        /////       this.orange          this.lightOrange          this.darkOrange           this.darkGray
        /////       this.green           this.lightGreen           this.darkGreen            this.gray
        /////       this.blue            this.lightBlue            this.darkBlue             this.lightGray
        /////       this.purple          this.lightPurple          this.darkPurple           this.darkWhite
        /////       this.pink            this.lightPink            this.darkPink             this.white
        /////
        ///// transparent versions have 50% opacity, and frosted versions have 93% opacity:
        /////
        /////       this.transparentRed             this.frostedRed
        /////       this.transparentOrange          this.frostedOrange
        /////       this.transparentGreen           this.frostedGreen
        /////       this.transparentBlue            this.frostedBlue
        /////       this.transparentPurple          this.frostedPurple
        /////       this.transparentPink            this.frostedPink
        /////       this.transparentBlack           this.frostedBlack
        /////       this.transparentWhite           this.frostedWhite
        
        ///// AVAILABLE DRAWING FUNCTIONS:
        
        ///// draws a line from (X1, Y1) to (X2, Y2)
        // this.drawLine(X1, Y1, X2, Y2, COLOR, LINE-WIDTH);
        
        ///// draws a rectangle of dimensions (WIDTH, HEIGHT) with upper left at (LEFT, TOP)
        // this.drawRect(LEFT, TOP, WIDTH, HEIGHT, COLOR, LINE-WIDTH);
        
        ///// like above, but draws a square (so you don't have to worry about height/width ratio)
        // this.drawSquare(LEFT, TOP, WIDTH, COLOR, LINE_WIDTH);
        
        ///// like above, but rounds corners at particular radius
        // this.drawRoundRect(LEFT, TOP, WIDTH, HEIGHT, RADIUS, COLOR, LINE-WIDTH);
        
        ///// like above, but draws a square (so you don't have to worry about height/width ratio)
        // this.drawRoundSquare(LEFT, TOP, WIDTH, RADIUS, COLOR, LINE_WIDTH);
        
        ///// draws a circle with the center at (X, Y) and the given radius
        // this.drawCircle(X, Y, RADIUS, COLOR, LINE-WIDTH);
        
        ///// draws a simple shape following the given array of points
        ///// - CLOSE-PATH is a boolean value indicating if the last point should be connected with the first;
        /////     if omitted, it defaults is "false"
        // this.drawShape( [[X1,Y1],[X2,Y2],...[Xn,Yn]], COLOR, LINE-WIDTH, CLOSE-PATH);
        
        ///// draws a complex shape following the given array of Bezier curves
        ///// - (CXn,CYn) and (DXn,DYn) are the first and second control points
        ///// - (Xn,Yn) is the end point of each curve
        ///// - note that the starting point is a simple coordinate pair with no control points
        ///// - CLOSE-PATH is a boolean value indicating if the last point should be connected with the first;
        /////     if omitted, it defaults is "false"
        // this.drawBezierShape([[X1,Y1],[CX2,CY2,DX2,DY2,X2,Y2],...[CXn,CYn,DXn,DYn,Xn,Yn]], COLOR, LINE-WIDTH);
        
        ///// draws a circle segment based on the center (X, Y) clockwise from START to FINISH
        ///// START and FINISH are expressed in degrees, where 0 is the top ("12 o'clock"), 90 is the right ("3 o'clock") and so on
        // this.drawArc(X, Y, R, START, END, COLOR, LINE-WIDTH);
        
        ///// same as the above functions, but fills with color instead of just drawing the outline
        // this.fillRect(LEFT, TOP, WIDTH, HEIGHT, COLOR);
        // this.fillSquare(LEFT, TOP, WIDTH, COLOR);
        // this.fillRoundRect(LEFT, TOP, WIDTH, HEIGHT, RADIUS, COLOR);
        // this.fillRoundSquare(LEFT, TOP, WIDTH, RADIUS, COLOR);
        // this.fillCircle(X, Y, RADIUS, COLOR);
        // this.fillShape( [[X1,Y1],[X2,Y2],...[Xn,Yn]], COLOR);
        // this.fillBezierShape([[X1,Y1],[CX2,CY2,DX2,DY2,X2,Y2],...[CXn,CYn,DXn,DYn,Xn,Yn]], COLOR);
        // this.fillArc(X, Y, R, START, END, COLOR);
        
        ///// draw text TEXT-STRING with the upper left corner at (X, Y)
        ///// - SIZE is a measurement based on percentage of canvas height
        ///// - ALIGN can be "left", "center", or "right"; if omitted, it defaults to "left"
        ///// - STYLE can be any CSS font style, weight or variant; if omitted, it defaults to "normal"
        ///// - ROTATE-AMOUNT is the number of degrees to rotate the text clockwise; it omitted, it defaults to 0
        ///// - ROTATE-X and ROTATE-Y are the coordinates of a point the text should rotate around. if omitted, text rotates
        /////        around the point (X,Y)
        ///// - FONT-NAME describes the font family to be used. If omitted, it defaults to "Fira Sans Condensed," Music Theory 21c's
        /////        standard font.
        ///// - WIDTH is the maximum width to be used for the text screen; text strings longer than this will be truncated.
        ///// - RESIZE-TEXT is a boolean value; if WIDTH is given and RESIZE-TEXT is "true", font-size will be reduced to fit within
        /////        the indicated width.
        /////
        // this.drawText(X, Y, TEXT-STRING, SIZE, ALIGN, STYLE, COLOR, ROTATE-AMOUNT, ROTATE-X, ROTATE-Y, FONT-NAME, WIDTH, RESIZE-TEXT);
        
        ///// returns the width, as a percentage of canvas width, of a string of text in the given size, style and font
        ///// if omitted, STYLE and FONT-NAME are "normal" and "Fira Sans Condensed", respectively
        // textWidth = this.getTextWidth(TEXT-STRING, SIZE, STYLE, FONT-NAME);
        
        ///// draw a degrees-based waveform diagram to plot one or more given functions
        ///// - FUNCn is a function that returns a Y value for a given value of X
        ///// - COLORn and LINE-WIDTHn indicate the color and width of the specified curve; if omitted, they default to red and 0.2
        ///// - LEFT, TOP, WIDTH and HEIGHT specify the location and size of the diagram on the canvas
        ///// - START-X and END-X specify the X values for the left and right edges, respectively. The X axis is drawn at X = 0.
        /////        If omitted, these values default to 0 and 360
        ///// - Y-SCALE specifies the Y value for the top of the graph. If omitted, it defaults to 1 (displaying Y values from 1 to -1)
        ///// - AXIS-LINE-WIDTH indicated of width of the axis lines. If omitted, it defaults to 0.2
        ///// - AXIS-IN-FRONT indicates that the curves should appear behind the axis. If omitted, it defaults to "true"
        /////
        // this.plotFunction([[FUNC1, COLOR1, LINE-WIDTH1],...,[FUNCn, COLORn, LINE-WIDTHn]], LEFT, TOP, WIDTH, HEIGHT, START-X, END-X, Y-SCALE, AXIS-LINE-WIDTH, AXIS-IN-FRONT);
        
        
    }
}

// replace InatorName with the class name on line 20 above, and #classname with the class you're using for the canvas

window.inators.push(new InatorName(document.querySelector('#classname')));     


