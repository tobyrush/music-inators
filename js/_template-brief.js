/* global alert,window,document,Tone,initializeBMViewers,MouseEvent: true */
/* jshint -W084 */
/* jshint esversion: 6 */

// INATOR TEMPLATE
// see template-annotated.js for a much more descriptive template

class InatorName extends Inator {
    constructor(whichCanvas) {
        super(whichCanvas, {
            // create event registry (mouse events, keyboard events, etc.)
        });
        // initialize variables & built-in widgets (keyboards, sliders, etc.)
        this.draw();
    }
    
    draw() {
        this.clear();
        super.draw();
        // draw interface
    }
}

window.inators.push(new InatorName(document.querySelector('#classname')));     