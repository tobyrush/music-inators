/* global alert,window,document,Tone,initializeBMViewers,MouseEvent: true */
/* jshint -W084 */
/* jshint esversion: 6 */

// ****************************************************
// *
// *  INATOR EXAMPLE
// *  
// ****************************************************

class Example extends Inator {
    constructor(whichCanvas) {
        var eventRegistry = {        
            
            pointermove: (e) => { // when the mouse moves over the inator...
                let epos = this.getEventPosition(e);
                this.mouseLocation = Math.round(epos.x) + ', ' + Math.round(epos.y); // ...set this.mouseLocation to show mouse coordinates...
                this.draw(); // ...and redraw the screen
            },
            keydown: (e) => { // when a key on the computer keyboard is pressed...
                this.keypress = e.code; // ...set this.keypress to show the keycode...
                this.draw(); // ...and redraw the screen
            }
        };
        super(whichCanvas, eventRegistry);
        
        this.mySynth = new Tone.Synth().toDestination(); // set up a basic synthesizer
        this.myStaff = this.addStaff(60, 30, 20, 15, 'treble', 0); // draw a treble clef staff
        this.myKeyboard = this.addKeyboard(5, 38, 50, 16, 53, true, this.noteOn.bind(this), this.noteOff.bind(this), 21); // draw a 3-octave keyboard
        this.magnification = 0.5; // set the initial waveform magnification value
        this.myMagSlider = this.addSmallSlider(35, 88, 30, 10, this.magnification*100, true, this.red, this.magChange.bind(this)); // create a magnification slider
        this.volume = 1; // set the initial volume value
        this.myVolSlider = this.addSlider(5, 68, 3, 16, this.volume*100, true, this.volChange.bind(this)); // create a volume slider
        this.keypress = '';
        this.mouseLocation = '';
        
        this.draw(); // draw the screen for the first time
    }
    
    magChange(val) { // the magnification slider has changed! Let's...
        this.magnification = val/100; // ...set the magnification value accordingly...
        this.draw(); // ...and redraw the screen
    }
    
    volChange(val) { // the volume slider has changed! Let's...
        this.volume = val/100; // ...set the volume level accordingly...
        this.draw(); // and redraw the screen
    }
    
    noteOn(midiNote) { // a key on the piano keyboard has been pressed! Let's...
        this.midiNote = midiNote; // store the value of the key pressed,
        this.freq = this.midiToFreq(midiNote); // calculate the corresponding sound frequency,
        this.mySynth.triggerAttack(this.freq, 0, this.volume); // tell the synth to start playing that note, and
        this.draw(); // redraw the screen.
    }
    
    noteOff(midiNote) { // a key on the piano keyboard has been released! Let's...
        this.mySynth.triggerRelease(); // tell the synth to stop playing, and
        this.draw(); // redraw the screen.
    }
    
    draw() { // Hey, let's draw the visual interface!
        this.clear(); // first we erase the whiteboard
        super.draw(); // we have to call this to let the inator draw custom controls
        
        this.drawRect(1, 1, 98, 98, this.gray, 0.1); // draw a nice border around the inator
        this.drawText(5, 10, 'Music-inator Example', 8, 'left', 'bold', this.blue, null, null, null, 'sans-serif'); // title text
        this.drawText(5, 20, 'keyboard: ' + this.keypress, 4, 'left', 'bold', this.darkGray, null, null, null, 'sans-serif'); // current keyboard state
        this.drawText(5, 26, 'mouse: ' + this.mouseLocation, 4, 'left', 'bold', this.darkGray, null, null, null, 'sans-serif'); // current mouse state
        
        // now we're going to create a function to send to the graph, it's just a sine wave based on frequency and volume
        var f = this.freq/100*this.magnification;
        var v = this.volume;
        var drawFunc = function(x) {
            return Math.sin(f*x)*v;
        }
        this.plotFunction([[drawFunc, this.red, 0.2]], 12, 65, 78, 20); // now we draw the graph using the function we made
        if (this.midiNote>0) {
            this.addMIDINote(this.myStaff, 7, this.midiNote, true, 'quarter'); // finally, we're going to display the note on the treble staff
        }
    }
}

// this line is always required to connect the Inator above with the canvas object on the HTML page.
window.inators.push(new Example(document.querySelector('#example')));


