import lamejs from 'lamejs';
import Worker from './mp3.worker';
import {DOMHelper} from './utils';

console.dir(Worker);

export default class RecorderMp3 {
    constructor(stream, parent, width){
        this.stream = stream;
        this.width = width;
        this.init();
        this.prepareUI(parent);

        this.mp3Data = [];
        this.mp3Encoder = new lamejs.Mp3Encoder(1, 44100, 128);
        this.sampleBlockSize = 1152;
        this.flagPause = false;
    }

    init(){
        try {
            this.audioCtx = new (window.AudioContext || webkitAudioContext)();
            this.mic = this.audioCtx.createMediaStreamSource(this.stream);
            if(!this.mic){
                throw new Error("not created media stream source");
            }
            this.audioProcessor = this.audioCtx.createScriptProcessor(16384, 1, 1);
            if(!this.audioProcessor){
                throw new Error("not created script processor");
            }
        } catch (error) {
            console.log(error);
        }

        this.worker = new Worker();
        
        this.worker.onmessage = (e) => {
            switch(e.data.cmd){
                case 'initSuccess':
                    console.log(e.data.cmd);
                    break;
                case 'Error':
                    console.log(e.data.cmd);
                    break;
                case 'response':
                    this.processingResponseOnStop(e.data.buf);
                    break;
                default:
                    break;
            }
        }

        this.worker.postMessage({cmd: 'init'});

        this.audioProcessor.onaudioprocess = (event) => {
            if(this.flagPause) return 0;

            let f32Buffer = event.inputBuffer.getChannelData(0);

            this.worker.postMessage({cmd: 'encode', buf: f32Buffer});
            //transferable  object
            //this.worker.postMessage(f32Buffer.buffer, [f32Buffer.buffer]);
        }
    }

    /**
     * 
     */
    record() {
        this.mic.connect(this.audioProcessor);
        this.audioProcessor.connect(this.audioCtx.destination);
        this.btnRecord.disabled = true;
        this.btnStop.disabled = false;
        this.btnPause.disabled = false;
    }

    /**
     * with worker
     */
    stop(){

        this.mic.disconnect();
        this.audioProcessor.disconnect();

        this.worker.postMessage({cmd: 'stop'});

        this.btnRecord.disabled = false;
        this.btnPause.disabled = true;
        this.btnStop.disabled = true;
        this.btnResume.disabled = true;
        this.flagPause = false;
    }

    pause(){
        console.log('pause');
        this.flagPause = true;
        this.btnResume.disabled = false; // on
        this.btnPause.disabled = true; // off
    }

    resume(){
        console.log('resume');
        this.flagPause = false;
        this.btnResume.disabled = true; //off
        this.btnPause.disabled = false; // on
    }

    destructor(){

    }

    prepareUI(parent){
        this.webRecoder = parent;

        this.btnRecord = DOMHelper.createButton('Record', ['btn', 'btn-danger', 'btn-sm']);
        this.btnRecord.addEventListener('click', this.record.bind(this));

        this.btnPause = DOMHelper.createButton('Pause', ['btn', 'btn-primary', 'btn-sm']);
        this.btnPause.addEventListener('click', this.pause.bind(this));

        this.btnResume = DOMHelper.createButton('Resume', ['btn', 'btn-primary', 'btn-sm']);
        this.btnResume.addEventListener('click', this.resume.bind(this));

        this.btnStop = DOMHelper.createButton('Stop', ['btn', 'btn-danger', 'btn-sm']);
        this.btnStop.addEventListener('click', this.stop.bind(this));

        let col = document.createElement('div');
        col.classList.add('mx-auto');
        col.setAttribute('style', 'width:' + this.width + 'px;');
        col.appendChild(this.btnRecord);
        col.appendChild(this.btnPause);
        col.appendChild(this.btnResume);
        col.appendChild(this.btnStop);

        DOMHelper.createWrap(this.webRecoder, col, {cssCol: ['col-12'], cssRow: ['row', 'pt-4']});

        this.btnPause.disabled = true;
        this.btnResume.disabled = true;
        this.btnStop.disabled = true;

        let row = document.createElement('div');
        row.classList.add('row');

        this.audioContainer = document.createElement('div');
        this.audioContainer.setAttribute('id', 'audiocontainer');
        this.audioContainer.classList.add('col-12');

        row.appendChild(this.audioContainer);
        this.webRecoder.appendChild(row);

        return true;
    }

    processingResponseOnStop(mp3Data){
        this.mp3Data = mp3Data;
        console.log('processingResponse');
        this.showResultToUser();
    }

    showResultToUser(){
        let audio = document.createElement('audio');
        audio.setAttribute('controls', '');
        audio.controls = true;

        let blob = new Blob(this.mp3Data, {'type' : 'audio/mp3'});
        this.mp3Data = [];
        let audioUrl = window.URL.createObjectURL(blob);
        audio.src = audioUrl;

        DOMHelper.createWrap(this.audioContainer, audio, {
            cssCol: ['pt-3', 'mx-auto'],
            cssRow: ['row'],
            attrCol: {
                'style': 'width:' + this.width + 'px;'
            }
        });

        let link = document.createElement('a');
        link.innerHTML = 'download';

        link.href = audioUrl;
        link.innerHTML = 'Download';
        link.classList.add('btn', 'btn-primary', 'btn-sm');
        link.download = 'file.mp3';
;
        let btnEdit = document.createElement('button');
        btnEdit.innerHTML = 'Edit';
        btnEdit.classList.add('btn', 'btn-primary', 'btn-sm', 'ml-1');
        btnEdit.setAttribute('id', 'edit');
        btnEdit.setAttribute('type', 'button');

        DOMHelper.createWrap(this.audioContainer, [link, btnEdit],
            {
                cssCol: ['mx-auto'],
                cssRow: ['row'],
                attrCol: {
                    'style': 'width:' + this.width + 'px;'
                }
            }
        );

    }
}