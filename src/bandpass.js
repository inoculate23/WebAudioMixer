p5.sound.js-example-filter-bandpassconsole.log('p5.sound.js v' + p5sound.VERSION);
console.log('please report issues at https://github.com/processing/p5.sound.js');

// expected behavior:
// white noise is filtered with a
// bandpass filter, its center frequency
// and its bandwidth controlled by the mouse

// retrieve the buttons from the DOM
let startAudioButton = document.getElementById('startAudioButton');
let stopAudioButton = document.getElementById('stopAudioButton');

// add event listeners
startAudioButton.addEventListener('click', function () {
  getAudioContext().resume();
  noise.start();
});

stopAudioButton.addEventListener('click', function () {
  getAudioContext().suspend();
});

let noise;
let fft;

let bandPassFilter, bandPassFilterFreq, bandPassFilterWidth;


  function setup() {
    var myCanvas = createCanvas(710, 256);
   myCanvas.id(pfive)
  fill(255, 40, 255);

  bandPassFilter = new BandPass();

  noise = new Noise();

  // disconnect noise from master output
  noise.disconnect(); 
  
  // connect to filter so we'll only hear BandPass.
  bandPassFilter.process(noise); 

  fft = new AnalyzerFFT();
}

function draw() {
  background(30);

  // Map mouseX to a bandpass freq from the FFT spectrum range: 10Hz - 22050Hz
  bandPassFilterFreq = map(mouseX, 0, width, 10, 22050);
  // Map mouseY to resonance/width
  bandPassFilterWidth = map(mouseY, 0, height, 0, 90);
  // set filter parameters
  
  bandPassFilter.set(bandPassFilterFreq, bandPassFilterWidth);

  // Draw every value in the FFT spectrum analysis where
  // x = lowest (10Hz) to highest (22050Hz) frequencies,
  // h = energy / amplitude at that frequency
  let spectrum = fft.analyze();
  noStroke();
  for (let i = 0; i < spectrum.length; i++) {
    let x = map(i, 0, spectrum.length, 0, width);
    let h = -height + map(spectrum[i], 0, 255, height, 0);
    rect(x, height, width / spectrum.length, h);
  }
}