import lamejs from 'lamejs';

let mp3Encoder;
let mp3Data = [];
let sampleBlockSize = 1152;

self.onmessage = function(e){
    switch (e.data.cmd){
        case 'init':
            init();
            break;
        case 'encode':
            encode(e.data.buf);
            break;
        case 'stop':
            console.log('mp3worker stop');
            stop();
        default:
            break;
    }
}

/**
 *
 */
function init(){
    mp3Encoder = new lamejs.Mp3Encoder(1, 44100, 128);
    if(mp3Encoder){
        self.postMessage({cmd: 'initSuccess'});
    }else{
        self.postMessage({cmd: 'Error'});
    }

}

/**
 * emcode and push in array a chunk of audio data
 * @param f32Buffer
 */
function encode(f32Buffer){
    let length = f32Buffer.length;
    let samples = new Int16Array(length);
    let s = 0;
    let sampleChunk = [];

    //
    for(let i = 0; i < length; i++){
        s = f32Buffer[i];
        if (s < 0) {
            if(s > -1){
                samples[i] = 0x8000 * s;
            }else{
                samples[i] = -1;
            }
        } else {
            if(s < 1){
                samples[i] = 0x7FFF * s;
            }else{
                samples[i] = 1;
            }
        }
    }

    for (let i = 0; i < length; i += sampleBlockSize) {
        sampleChunk = samples.subarray(i, i + sampleBlockSize);
        let mp3Buffer = mp3Encoder.encodeBuffer(sampleChunk);
        if (mp3Buffer.length > 0) {
            mp3Data.push(mp3Buffer);
        }
    }
    self.postMessage({cmd: 'processingArrayComplete'});
}

function stop() {
    let mp3Buffer = mp3Encoder.flush(); //finish writing mp3
    if (mp3Buffer.length > 0) {
        mp3Data.push(new Int8Array(mp3Buffer));
    }
    self.postMessage({cmd: 'response', buf: mp3Data});
}
