function make_sound(freq) {
    
    // create Oscillator node
    var oscillator = audioCtx.createOscillator();
    
    oscillator.type = 'sine';
    oscillator.frequency.value = Math.floor(freq); // value in hertz
    console.log("BEK", oscillator.frequency.value);
    oscillator.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(1);
    return;
}

function generate_random_frequency(min_range, max_range) {

    var rand = min_range + Math.random()*(max_range - min_range);
    var freq = Math.floor(rand);

    return freq;
}

function main() {
    
    // create web audio api context
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    make_sound(440);

    return;
}
