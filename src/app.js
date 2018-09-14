import RecorderMp3 from './recordermp3';
import getUserMediaPolyfill from './getUserMediaPolyfill';
import Visualiser from './visualiser';

function Recorder(setting){

    // Update to use promise-based version of getUserMedia
    getUserMediaPolyfill();

    // navigator.getUserMedia(constraints, successCallback, errorCallback);
    navigator.mediaDevices.getUserMedia({audio: true}).then((stream) => {
            let recParent = document.getElementById('webrecorder');
            if(!recParent){
                console.error("Not found record's parent");
                return;
            }
            let recMp3 = new RecorderMp3(stream, recParent, setting.recorder.width || 250);

            if(setting.visualiser instanceof Object){
                let visualiser = new Visualiser(stream, setting.visualiser.width, setting.visualiser.height);
                visualiser.drawFrequency();
            }else if(setting.visualiser === true){
                let visualiser = new Visualiser(stream, 250, 70);
                visualiser.drawFrequency();
            }
        }, (err) => {
            console.log('The error occured: ' + err);
        }
    );
}

window.Recorder = Recorder;


