export default class Recorder{
    constructor(stream){

        this.stream = stream;

        this.audioCtx = {};
        this.audioData = [];
       // this.mediaRecorder = {};

        this.mp3Encoder = {};
        this.mp3Data = [];
        this.samples;
        this.mp3Buf;
        this.btnRecord;
        this.btnPause;
        this.btnResume;
        this.btnStop;

        this.receivedAudioContainer;

        this.init();
    }
    init(){

        this.btnRecord = document.getElementById('record');
        this.btnPause = document.getElementById('pause');
        this.btnResume = document.getElementById('resume');
        this.btnStop = document.getElementById('stop');
        

        this.btnRecord.addEventListener('click', this.record.bind(this));
        this.btnPause.addEventListener('click', this.pause.bind(this));
        this.btnResume.addEventListener('click', this.resume.bind(this));
        this.btnStop.addEventListener('click', this.stop.bind(this));

        this.btnPause.disabled = true;
        this.btnResume.disabled = true;
        this.btnStop.disabled = true;

        this.webRecoder = document.getElementById('webrecorder');

        let row = document.createElement('div');
        row.classList.add('row');

        this.receivedAudioContainer = document.createElement('div');
        this.receivedAudioContainer.setAttribute('id', 'audiocontainer');
        this.receivedAudioContainer.classList.add('col-12');

        row.appendChild(this.receivedAudioContainer);

        this.webRecoder.appendChild(row);

        let options = {mimeType: 'audio/webm'};
        this.mediaRecorder = new MediaRecorder(this.stream, options);
        this.mediaRecorder.onstop = this.onStopMediaRecorder.bind(this);

        this.mediaRecorder.ondataavailable = (e) => {
            this.audioData.push(e.data);
        }
    };

    /**
     * 
     */
    record() {
        console.log('record');
        this.mediaRecorder.start();
        this.btnRecord.disabled = true;
        this.btnStop.disabled = false;
        this.btnPause.disabled = false;
    }

    /** 
     * 
    */
    stop(){
        console.log('stop');
        this.mediaRecorder.stop();
        this.btnRecord.disabled = false;
        this.btnPause.disabled = true;
        this.btnStop.disabled = true;
        this.btnResume.disabled = true;
    }

    pause(){
        console.log('pause');
        this.btnResume.disabled = false; // on
        this.btnPause.disabled = true; // off
    }

    resume(){
        console.log('resume');
        this.btnResume.disabled = true; //off
        this.btnPause.disabled = false; // on
    }

    /**
     *
     */
    onStopMediaRecorder(e){
        let audio = document.createElement('audio');
        audio.setAttribute('controls', '');
        audio.controls = true;
        this.receivedAudioContainer.appendChild(audio);
        let blob = new Blob(this.audioData, {'type' : 'audio/webm;codecs=opus'});
        this.audioData = [];
        let audioUrl = window.URL.createObjectURL(blob);
        audio.src = audioUrl;
    }
}
