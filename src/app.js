import RecorderMp3 from './recordermp3';
import getUserMediaPolyfill from './getUserMediaPolyfill';
import Visualiser from './visualiser';

document.addEventListener('DOMContentLoaded', function () {

    // Update to use promise-based version of getUserMedia
    getUserMediaPolyfill();

    // navigator.getUserMedia(constraints, successCallback, errorCallback);
    navigator.mediaDevices.getUserMedia({audio: true}).then((stream) => {
        let recMp3 = new RecorderMp3(stream);
        let visualiser = new Visualiser(stream);
        visualiser.drawFrequency();
        }, (err) => {
            console.log('The error occured: ' + err);
        }
    );


});
