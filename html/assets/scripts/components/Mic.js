class Mic {
    constructor(_fft) {
        this.FFT_SIZE = _fft || 1024;
        this.spectrum = [];
        this.volume = this.vol = 0;
        this.peak_volume = 0;
        this.spectrum = 0;

        this.audioContext = new AudioContext();
        this.SAMPLE_RATE = this.audioContext.sampleRate;
        // this is just a browser check to see
        // if it supports AudioContext and getUserMedia
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;

        window.addEventListener('load', this.init.bind(this), false);

    }

    init() {
        try {
            this.startMic(new AudioContext());
        }
        catch (e) {
            console.error(e);
            alert('Web Audio API is not supported in this browser');
        }
    }

    startMic(context) {
        let self = this;
        navigator.getUserMedia({ audio: true }, processSound.bind(this), error);

        function processSound(stream) {
            // analyser extracts frequency, waveform, etc.
            let analyser = context.createAnalyser();
            analyser.smoothingTimeConstant = 0.2;
            analyser.fftSize = this.FFT_SIZE;

            let node = context.createScriptProcessor(this.FFT_SIZE * 2, 1, 1);
            node.onaudioprocess = function () {
                // bitcount returns array which is half the FFT_SIZE
                self.spectrum = new Uint8Array(analyser.frequencyBinCount);
                this.spectrum = self.spectrum;
                // getByteFrequencyData returns amplitude for each bin
                // analyser.getByteFrequencyData(self.spectrum);
                // getByteTimeDomainData gets volumes over the sample time
                analyser.getByteTimeDomainData(self.spectrum);

                self.vol = self.getRMS(self.spectrum);
                // get peak - a hack when our volumes are low
                if (self.vol > self.peak_volume) self.peak_volume = self.vol;
                self.volume = self.vol;
            }.bind(this);

            let input = context.createMediaStreamSource(stream);
            input.connect(analyser);
            analyser.connect(node);
            node.connect(context.destination);
        }
        function error() {
            console.log(arguments);
        }
    }

    getRMS(spectrum) {
        let rms = 0;
        for (let i = 0; i < spectrum.length; i++) {
            rms += spectrum[i] * spectrum[i];
        }
        rms /= spectrum.length;
        rms = Math.sqrt(rms);
        return rms;
    }
};


export default Mic;