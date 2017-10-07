function find_mid(low, high){
    return (high + low) / 2.;
}

function propose_test_val(low, high){
    return find_mid(low, high)
}

function play_noise(test_frequency){
    make_sound(test_frequency);
    heard = window.confirm("now playing " + test_frequency + ". can you hear it?" );
    //heard = true;
    console.log(test_frequency + " was heard: " + heard);
    return heard;
}

function try_again(low, high, final_err){
    current_width = high - low;
    return current_width > final_err;
}

function run_bisect(low, high, region_width){
    var continue_testing = true;
    for(var count=0; continue_testing; ++count){
        test_frequency = propose_test_val(low, high);
        heard = play_noise(test_frequency);
        if(heard){
            if(test_frequency > low){
                low = test_frequency;
            }
        }else{
            if(test_frequency < high){
                high = test_frequency;
            }
        }
        continue_testing = try_again(low, high, region_width);
    }
    return [low, high];
}

function run_regional_search(low, high, n_tests){
    var further_tested_vals = Array();
    for(var i=0; i < n_tests; ++i){
        var rand =  Math.random();
        var test_frequency = low + rand * (high - low);
        var heard = play_noise(test_frequency);
        further_tested_vals.push([test_frequency, heard]);
    }
    return [low, high, further_tested_vals];
}

function sum_array(array, index){
    var sum = array.reduce(function(pv, cv) { return pv + cv[index]; }, 0);
    return sum;
}

function calc_threshold(low, high, tested_vals){
    var sorted_freqs = tested_vals.sort(function(x){return x[0]});
    var last_definite_heard_idx = 0;
    for (var index in sorted_freqs){
        var [freq, heard] = sorted_freqs[index];
        if (! heard) break;
        last_definite_heard_idx += 1;
    }
    var first_definite_not_heard_idx = sorted_freqs.length + 1;
    for (var index in sorted_freqs.reverse()){
        var [freq, heard] = sorted_freqs[index];
        if(heard) break;
        first_definite_not_heard_idx -= 1;
    }
    last_definite_heard_idx -= 1;
    central = sorted_freqs.slice(last_definite_heard_idx, first_definite_not_heard_idx);
    if (! central){
        if(last_definite_heard_idx == sorted_freqs.length - 1){
            central = [sorted_freqs[-1], (high, false)];
        }else{
            central = [(low, true), sorted_freqs[0]];
        }
    }
    var summed = sum_array(central, 0);
    var mid = summed / central.length;
    return mid;
}

function run_test(low, high, region_width, region_checks){
    // create web audio api context
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    var [low, high] = run_bisect(low, high, region_width);
    console.log("Switching to region check, region: " + low + ", " + high);
    var [low, high, further_tested_vals] = run_regional_search(low, high, region_checks);
    var threshold_value = calc_threshold(low, high, further_tested_vals);
    console.log("your threshold is:", threshold_value);
    return threshold_value;
}

