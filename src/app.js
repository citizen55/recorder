import getUserMediaPolyfill from './getUserMediaPolyfill';
import RecorderMp3 from './recordermp3';
import Visualiser from './visualiser';
import {UI} from './UI';


var Recorder = {

    settings: Object.create(null),

    create(sets){

        this.settings =  {
            container: sets.container,
                recorder: {
                width: sets.recorder.width || 250
            },
            visualiser: {
                show: sets.visualiser.show,
                    width: sets.visualiser.width || 250,
                    height: sets.visualiser.height || 70
            }
        };

        // Update to use promise-based version of getUserMedia
        getUserMediaPolyfill();

        // navigator.getUserMedia(constraints, successCallback, errorCallback);
        navigator.mediaDevices.getUserMedia({audio: true}).then((stream) => {
                let container = document.getElementById(this.settings.container);
                if(!container){
                    console.error("Not found record's parent");
                    return;
                }
               // UI.mainParent = recParent;
                let recMp3 = new RecorderMp3(stream, container, Object.assign({}, this.settings.recorder));

                if(this.settings.visualiser.show){
                    let visualiser = new Visualiser(stream, container, Object.assign({}, this.settings.visualiser));
                    visualiser.drawFrequency();
                }
            }, (err) => {
                console.log('The error occured: ' + err);
            }
        );
    },

}

window.Recorder = Recorder;


