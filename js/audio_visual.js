//fix browser vender for AudioContext and requestAnimationFrame
// Webkit/blink browser require a prefix, and it needs the window object specifically declared to work in Safari
window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame;

// declare new audio context
try {
    var audioCtx = new AudioContext();
} catch (e) {
    alert('Your browser does not support AudioContext!');
    console.log(e);
}

// Get an AudioBufferSourceNode.
// This is the AudioNode to use when we want to play an AudioBuffer
var source = audioCtx.createBufferSource();

// define variable params
var canvas = document.getElementById('audio_canvas'),
    ctx = canvas.getContext("2d"),
    c_width = canvas.width,
    c_height = canvas.height;

// 条形的宽度
var bar_width = 10,
    bar_gap = 2,
    bar_part = bar_width + bar_gap,
    bar_num = Math.round(c_width / bar_part);

var cap_height = 2;

var array = [];
var status = false;
var animation_id = null;



// use XHR to load an audio track, and
// decodeAudioData to decode it and stick it in a buffer.
// Then we put the buffer into the source
var xhr = new XMLHttpRequest();

// 初始化 HTTP 请求参数, 配置请求类型，文件路径等
xhr.open('GET', 'audio/music.mp3');

// 将responseType设为arraybuffer,二进制数据
xhr.responseType = "arraybuffer";

// 获取完成，对音频进一步操作，解码
xhr.onload = function() {
    var audioData = xhr.response;

    // decodeAudioData to decode it and stick it in a buffer.buffer = decodedData
    audioCtx.decodeAudioData(audioData, function(buffer) {

        // create audio node to play the audio in the buffer
        var analyser = audioCtx.createAnalyser(),
            bufferLength = analyser.frequencyBinCount,
            dataArray = new Uint8Array(bufferLength);

        // 每段包含的频谱宽
        var array_width = Math.round(bufferLength / bar_num);

        status = 1;
        // set the buffer in the AudioBufferSourceNode
        source.buffer = buffer;

        // connect the analyser to the destination(the speaker), or we won't hear the sound
        // from audioCtx.createBuffer, or audioCtx.decodeAudioData
        source.connect(analyser);
        analyser.connect(audioCtx.destination);

        // start the source playing
        source.start(0);

        source.onended = function() {
            // alert(2)
            status = 0;
            // console.log(source.duration)
            // cancelAnimationFrame(animation_id);
        };

        function drawVisual() {
            var i = 0, value;
            analyser.getByteFrequencyData(dataArray);
            console.log(status==0)

            if(status == 0) {
                console.log(array)

                for (var i = dataArray.length - 1; i >= 0; i--) {
                    dataArray[i] = 0;
                };
                var isStop = true;

                // 使其静止时图为空
                for (var i = array.length - 1; i >= 0; i--) {
                    isStop = isStop && (array[i] == 0);
                };
                
                if(isStop) {
                    // console.log(isStop)
                    cancelAnimationFrame(animation_id);
                    return;
                }
            }

            ctx.clearRect(0,0,c_width,c_height)

            for(i; i < bar_num; i++) {
                value = dataArray[i * array_width];
                // console.log(value)
                if(array.length < bar_num) {
                    array.push(value)
                }
                if (value < array[i]) {
                    --array[i];
                    ctx.fillRect(i * bar_part, c_height - array[i], bar_width, cap_height);
                } else {
                    ctx.fillRect(i * 12, c_height - value, bar_width, cap_height);
                    array[i] = value;
                };
                ctx.fillStyle = '#f99';
                ctx.fillRect(bar_part * i, c_height - value, bar_width, value);
            }

            animation_id = requestAnimationFrame(drawVisual);
            // console.log(animation_id)

        }
        animation_id = requestAnimationFrame(drawVisual);
        // cancelAnimationFrame(drawVisual)
        
    },

    function(e) { console.log("Error with decoding audio data" + e.err); });

};

xhr.send();




