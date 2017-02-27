/**
 * Visualize Audio 
 * Author: smilewalker
 * Feb 27, 2017
 */

var AudioVisual = function (musicurl) {
  this.musicUrl = musicurl;
  this.init();
};

AudioVisual.prototype = {

  changeTxt: function(txt) {
    var hint_txt = document.getElementById('hint-txt');
    hint_txt.innerHTML = txt;
  },

  drawAudio: function (analyser) {
    // define variable params -- canvas
    var canvas = document.getElementById('audio_canvas'),
        ctx = canvas.getContext("2d"),
        c_width = canvas.width,
        c_height = canvas.height;

    // 条形的参数
    var bar_width = 10,
        bar_gap = 2,
        bar_part = bar_width + bar_gap,
        bar_num = Math.round(c_width / bar_part); 

    // 线条高度
    var cap_height = 2;

    // 获取的音频数据
    var bufferLength = analyser.frequencyBinCount,
        dataArray = new Uint8Array(bufferLength);

    // 每段包含的频谱宽
    var array_width = Math.round(bufferLength / bar_num);

    // 变量提前,i 表示变量, value表示音频值, isStop表示上方线条的结束
    var i, value, isStop;

    var that = this;

    // 创建数组，线条数组，判断动画结束
    var array = [];

    that.animation_id = null;

    var drawVisual = function () {
      that.analyser.getByteFrequencyData(dataArray);

      if (that.isEnd) {
        isStop = true;
        console.log(that.isEnd)
        for (i = dataArray.length - 1; i >= 0; i--) {
          dataArray[i] = 0;
        }

        // 使其静止时图为空
        for (i = array.length - 1; i >= 0; i--) {
          isStop = isStop && (array[i] == 0);
        };
        
        if (isStop) {
          cancelAnimationFrame(that.animation_id);
          that.changeTxt('播放结束');
          return;
        }
      }

      ctx.clearRect(0,0,c_width,c_height)

      for(i = 0; i < bar_num; i++) {
        value = dataArray[i * array_width];
        if (array.length < bar_num) {
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

      that.animation_id = requestAnimationFrame(drawVisual);
    }

    that.animation_id = requestAnimationFrame(drawVisual);
  },

  playAudio: function(buffer) {
    console.log(typeof this.source)
    if (typeof this.source !== 'undefined') {
      this.source.stop(0);
    }

    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }

    // create audio node to play the audio in the buffer
    this.analyser = this.audioCtx.createAnalyser();
    this.source = this.audioCtx.createBufferSource();

    // set the buffer in the AudioBufferSourceNode
    this.source.buffer = buffer;

    // isEnd indicates if the audio is finished
    this.isEnd = false;

    // connect the analyser to the destination(the speaker), or we won't hear the sound
    // from audioCtx.createBuffer, or audioCtx.decodeAudioData
    this.source.connect(this.analyser);
    this.analyser.connect(this.audioCtx.destination);

    // start the source playing
    this.source.start(0);

    this.changeTxt('音频播放中……');

    var that = this;
    
    this.source.onended = function() {
      if(!that.isForceStop) {
        that.isEnd = true;
      }
    };

    // draw the audio
    this.drawAudio(this.analyser);

  },

  loadMusic: function (file) {
    var that = this;
    var fr = new FileReader();

    fr.onload = function (e) {
      var fileResult = e.target.result;

      // decodeAudioData to decode it and stick it in a buffer.buffer = decodedData
      that.audioCtx.decodeAudioData(fileResult, function(buffer) {
        that.playAudio(buffer);
      },
      function(e) { console.log("Error with decoding audio data" + e.err); });
    };

    fr.onerror = function(e) {
      console.error(e);
    };

    fr.readAsArrayBuffer(file);
  },

  init: function () {
    //fix browser vender for AudioContext and requestAnimationFrame
    // Webkit/blink browser require a prefix, and it needs the window object specifically declared to work in Safari
    window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
    window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
    window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame;

    // declare new audio context
    try {
      this.audioCtx = new AudioContext();

      // Get an AudioBufferSourceNode.
      // This is the AudioNode to use when we want to play an AudioBuffer
      var $file = document.getElementById('uploadedFile');

      var that = this;

      $file.onchange = function () {
        if($file.files !== 0) {
          var _file = $file.files[0],
              _filename = _file.name;
          if (that.isEnd === false) {
            that.isForceStop = true;
            console.log(that.isForceStop)
          }
          that.loadMusic(_file);
        }
      };
    } catch (e) {
      alert('Your browser does not support AudioContext!');
      console.log(e);
    }
  }
};

new AudioVisual('audio/audio.mp3')





