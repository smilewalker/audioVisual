/**
 * Visualize Audio 
 * Author: smilewalker
 * Feb 27, 2017
 */

// create environment -- audio context
// define variables

var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioCtx;
var source;
var _play = document.getElementById('play');

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;


try {
    audioCtx = new AudioContext();
    console.log('support');
} catch (e) {
    alert('Your browser does not support AudioContext!');
    console.log(e);
}

// use XHR to load an audio track, and


var getData = function() {

    // 请求
    var request = new XMLHttpRequest();
    
    //初始化 HTTP 请求参数, 配置请求类型，文件路径等
    request.open('GET', 'audio/audio1.mp3', true);

    // 配置数据返回类型,从服务器取回二进制数据
    request.responseType = 'arraybuffer';

    // 获取完成，对音频进一步操作，解码
    request.onload = function() {
        var audioData = request.response;

        // decodeAudioData to decode it and stick it in a buffer.
        // buffer = decodedData
        audioCtx.decodeAudioData(audioData, function(buffer) {

            _play.innerHTML = "播放中";

            // create audio node to play the audio in the buffer
            source = audioCtx.createBufferSource();

            // create audio node to play the audio in the buffer
            var analyser = audioCtx.createAnalyser();
 
            // Then we put the buffer into the source
            source.buffer = buffer;
            
            // connect the source to the analyser
            source.connect(analyser);

            // connect the analyser to the destination(the speaker), or we won't hear the sound
            // from audioCtx.createBuffer, or audioCtx.decodeAudioData
            analyser.connect(audioCtx.destination);
            
            //play the source
            if (!source.start) {
                source.start = source.noteOn; //in old browsers use noteOn method
                source.stop = source.noteOff; //in old browsers use noteOff method
            };


           


            source.start(0);






            // var canvas = document.getElementById('audio_canvas');
            // var ctx = canvas.getContext('2d');
            // var cWidth = canvas.width;
            // var cHeight = canvas.height;
            // var partWidth = 10; // 条形状的宽度
            // ctx.fillStyle = '#eee';
            // ctx.fillRect(0,0,cWidth,cHeight);

            // // 创建条形渐变颜色
            // // var grd=ctx.createLinearGradient(0,0,0,50);
            // // grd.addColorStop(0,"#ffc");
            // // grd.addColorStop(1,"#f99");
            // // ctx.fillStyle = grd;
            // // ctx.fillRect(0,0,50,50);


            // // var drawAudio = function() {
            //     var bufferLength = analyser.frequencyBinCount;
            //     console.log(bufferLength);
            //     // Uint8Array should be the same length as the frequencyBinCount 
            //     var dataArray = new Uint8Array(bufferLength);

            //     // fill the Uint8Array with data returned from getByteFrequencyData()
            //     analyser.getByteFrequencyData(dataArray);

            //     // ctx.clearRect(0,0,cWidth,cHeight);

            //     // function draw() {
            //         // var barHeight;
            //         // // var drawVisual =  requestAnimationFrame()
                    
            //         // for(var i = 0;i < bufferLength; i ++) {
            //         //     barHeight = dataArray[i];
            //         //     console.log(barHeight)
            //         // }
            //     // }
            //     // draw();

            //     var meterWidth = 10, //能量条的宽度
            //         gap = 2, //能量条间的间距
            //         meterNum = 800 / (10 + 2); //计算当前画布上能画多少条
            //     var step = Math.round(dataArray.length / meterNum);
            //     //计算从analyser中的采样步长
            //     ctx.clearRect(0, 0, cWidth, cHeight); //清理画布准备画画
            //     //定义一个渐变样式用于画图
            //     var gradient = ctx.createLinearGradient(0, 0, 0, 300);
            //     gradient.addColorStop(1, '#0f0');
            //     gradient.addColorStop(0.5, '#ff0');
            //     gradient.addColorStop(0, '#f00');
            //     ctx.fillStyle = gradient;
            //     //对信源数组进行抽样遍历，画出每个频谱条
            //     var drawVisual = function () {
            //         for (var i = 0; i < meterNum; i++) {
            //             var value = dataArray[i * step];
            //             // console.log(value)
            //             ctx.fillStyle = gradient; //set the filllStyle to gradient for a better look
                        
            //             ctx.fillRect(i * 12 /*频谱条的宽度+条间间距*/ , cHeight - value, meterWidth, cHeight);
            //         }
            //         requestAnimationFrame(drawVisual)

            //     };
            //     requestAnimationFrame(drawVisual)
            //     drawVisual()

                
        var canvas = document.getElementById('audio_canvas'),
            cwidth = document.body.clientWidth,
            cheight = canvas.height,
            meterWidth = 1, //width of the meters in the spectrum
            gap = 0, //gap between meters
            // capHeight = 2,
            // capStyle = '#fff',
            // meterNum = 1000 / (10 + 2), //count of the meters
            // capYPositionArray = []; ////store the vertical position of hte caps for the preivous frame
        ctx = canvas.getContext('2d');
        var _color = "#f99";
        canvas.setAttribute('width', cwidth);
        var drawMeter = function() {
            var array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);

            // var step = Math.round(array.length / meterNum); //sample limited data from the total array
            // console.log(step)
            ctx.clearRect(0, 0, cwidth, cheight);
            for (var i = 0; i < array.length; i++) {
                var value = array[i];
                console.log(value)

                ctx.fillStyle = _color; //set the filllStyle to gradient for a better look
                ctx.fillRect(i * meterWidth /*meterWidth+gap*/ , cheight - value, meterWidth, value); //the meter
            }
            requestAnimationFrame(drawMeter);
        }
        requestAnimationFrame(drawMeter);










            /* 
            source.buffer = buffer;
            source.connect(audioCtx.destination);
            source.loop = true;
            */





        },
        function(e) { console.log("Error with decoding audio data" + e.err); });
    };

    // 发送一个 HTTP 请求
    request.send();
};

// play audio
// if(audioCtx === null) { return false };
console.log(audioCtx)
// if(audioCtx === null) {
//     return false;
// }
getData();

// play.onclick = function() {
//     source.start(0);
// }

// var visualizeAudio = function() {
//     var canvas = document.getElementById('audio_canvas');
//     var ctx = canvas.getContext('2d');
//     var cWidth = canvas.width;
//     var cHeight = canvas.height;
//     ctx.fillStyle = '#eee';
//     ctx.fillRect(0,0,cWidth,cHeight);

//     // 创建条形渐变颜色
//     var grd=ctx.createLinearGradient(0,0,0,50);
//     grd.addColorStop(0,"#ffc");
//     grd.addColorStop(1,"#f99");
//     ctx.fillStyle = grd;
//     ctx.fillRect(0,0,50,50);

// };

// visualizeAudio();