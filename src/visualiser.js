

export default class Visualiser{
    constructor(stream, width, height){

        this.audioCtx = new (window.AudioContext || webkitAudioContext)();

        this.canvas = document.createElement('canvas');
        this.canvas.width = width || 300;
        this.canvas.height = height || 70;
        this.canvas.setAttribute('id', 'canvas');
        this.canvas.setAttribute('style', 'border-bottom: 1px solid black; border-top: 2px solid darkgray;');
        document.getElementById('webrecorder').insertAdjacentElement('afterbegin', this.canvas);
        this.canvasCtx = this.canvas.getContext('2d');

        this.peakFactor = this.canvas.height / 140;

        //this.gain = this.ctx.createGain();
        this.analyserNode = this.audioCtx.createAnalyser();
        //fft - fast Fourier Transform
        this.analyserNode.fftSize = 2048;
        this.analyserNode.maxDecibels = 30;
        //Is an unsigned long value half that of the FFT size.
        // This generally equates to the number of data values
        // you will have to play with for the visualization
        this.bufferLength = this.analyserNode.frequencyBinCount; // bufferLenght in const but no this.bufferLength
        console.log(this.bufferLength);
        this.dataArray = new Uint8Array(this.bufferLength);
        this.frequencyDataArray = new Uint8Array(this.analyserNode.frequencyBinCount);
        //Copies the current waveform, or time-domain,
        // data into a Uint8Array (unsigned byte array) passed into it.
        this.analyserNode.getByteTimeDomainData(this.dataArray);

        this.mic = this.audioCtx.createMediaStreamSource(stream);
        if(!this.mic){
            throw new Error("not created media stream source");
        }

        this.mic.connect(this.analyserNode);
    }

    /**
     * draw waves
     */
    draw(time){
        window.requestAnimationFrame(this.draw.bind(this));
        this.analyserNode.getByteTimeDomainData(this.dataArray);


        let height = this.canvas.height;
        let width = this.canvas.width;
        let x = 0, y = 0, v;
        const sliceWidth = width / this.bufferLength;

        this.canvasCtx.fillStyle = "rgb(200, 200, 200)";
        this.canvasCtx.fillRect(0, 0, width, height );
        this.canvasCtx.lineWidth = 2;
        this.canvasCtx.strokeStyle = "rgb(0, 0, 0)";

        this.canvasCtx.beginPath();

        for( let i = 0; i < this.bufferLength; i++){
            v = this.dataArray[i] / 128.0;
            y = v * height / 2;

            if(i === 0){
                this.canvasCtx.moveTo(x, y);
            }else{
                this.canvasCtx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        this.canvasCtx.lineTo(width, height / 2);
        this.canvasCtx.stroke();
    }

    drawFrequency(time){

        const CANVAS_HEIGHT = this.canvas.height;
        const CANVAS_WIDTH = this.canvas.width;
        const CELL_WIDTH = 3;
        const BAR_WIDTH = 1;

        let numbersCell = Math.round(CANVAS_WIDTH / CELL_WIDTH);
        let byteFrequencyDataArray = new Uint8Array(this.bufferLength);
        //arithmetic mean of ...
        let numberItemToAverage = this.analyserNode.frequencyBinCount / numbersCell;

        this.analyserNode.getByteFrequencyData(byteFrequencyDataArray);
        this.canvasCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        let gradient = this.canvasCtx.createLinearGradient(0,0,0,CANVAS_HEIGHT);
        gradient.addColorStop(0,"red");
        gradient.addColorStop(1,"black");
        this.canvasCtx.fillStyle = gradient;

        for (let cell = 3; cell < numbersCell; ++cell) {

            let averageAmplitude = 0;
            let offset = Math.floor( cell * numberItemToAverage );
            for (let sample = 0; sample < numberItemToAverage; sample++){
                averageAmplitude += byteFrequencyDataArray[offset + sample];
            }
            averageAmplitude = averageAmplitude / numberItemToAverage;
            //this.canvasCtx.fillStyle = "rgb(0, 0, 0)";
            this.canvasCtx.fillRect(cell * CELL_WIDTH, CANVAS_HEIGHT, BAR_WIDTH, -averageAmplitude * this.peakFactor);
        }

        window.requestAnimationFrame(this.drawFrequency.bind(this));
    }

}