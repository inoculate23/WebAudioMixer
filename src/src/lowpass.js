let startAudioButton = document.getElementById('startAudioButton');
let stopAudioButton = document.getElementById('stopAudioButton');

startAudioButton.addEventListener('click', function () {
  getAudioContext().resume();
});

stopAudioButton.addEventListener('click', function () {
  getAudioContext().suspend();
});

let soundFile;
let fft;

let biquadFilter, biquadFilterFreq, biquadFilterRes;

function preload() {
  soundFormats('mp3', 'ogg');
  soundFile = loadSound('./assets/beat');
}

function setup() {
  createCanvas(710, 256);
  fill(255, 40, 255);

  // loop the sound file
  soundFile.loop();

  biquadFilter = new LowPass();

  // Disconnect soundfile from master output.
  // Then, connect it to the biquadFilter, so that we only hear the biquadFiltered sound
  soundFile.disconnect();
  soundFile.connect(biquadFilter);

  fft = new AnalyzerFFT();
}

function draw() {
  background(30);

  // Map mouseX to a the cutoff frequency from the lowest
  // frequency (10Hz) to the highest (22050Hz) that humans can hear
  biquadFilterFreq = map(mouseX, 0, width, 10, 22050);

  // Map mouseY to resonance (volume boost) at the cutoff frequency
  biquadFilterRes = map(mouseY, 0, height, 15, 5);

  // set biquadFilter parameters
  biquadFilter.set(biquadFilterFreq, biquadFilterRes);

  // Draw every value in the FFT spectrum analysis where
  // x = lowest (10Hz) to highest (22050Hz) frequencies,
  // h = energy (amplitude / volume) at that frequency
  let spectrum = fft.analyze();
  noStroke();
  for (let i = 0; i < spectrum.length; i++) {
    let x = map(i, 0, spectrum.length, 0, width);
    let h = -height + map(spectrum[i], 0, 255, height, 0);
    rect(x, height, width / spectrum.length, h);
  }
}