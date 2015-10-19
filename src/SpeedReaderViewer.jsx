var React = require('react')

var SpeedReader = require('./SpeedReader.jsx')

var SpeedReaderViewer = React.createClass({
  getInitialState: function() {
    return {
      inputText: 'Science, what is it all about? Techmology, what is that all about?'
    , isPlaying: false
    , resetTs: undefined
    , speed: 200
    , chunk: 1
    }
  }
, play: function() {
    this.setState({isPlaying: true})
  }
, pause: function() {
    this.setState({isPlaying: false})
  }
, reset: function() {
    this.setState({
      isPlaying: false
    , resetTs: new Date().getTime()
    })
  }
, increaseChunk: function() {
    this.alterChunk(1)
  }
, decreaseChunk: function() {
    this.alterChunk(-1)
  }
, alterChunk: function(x) {
    var chunk = this.clamp(this.state.chunk +x, 1, 4)
    this.setState({chunk: chunk}, this.reset)
  }
, clamp: function(x, min, max) {
    if(x < min) return min
    if(x > max) return max
    return x
  }
, progress: function(x) {
    this.setState({progress: x})
  }
, progressBar: function(progress) {
    var chunks = 10
    var ratio = progress ? progress.at/progress.of : 0
    var integerPart = Math.floor(ratio *chunks)
    var progressBar = new Array(integerPart +1).join('#')
    progressBar += new Array(chunks -integerPart +1).join('_')
    return '[' +progressBar +']' + (ratio*100).toFixed(0) +'%'
  }
, render: function() {
    var self = this

    var outputTextAreaStyle = {
      textAlign: 'center'
    , height: 300
    , border: 'solid'
    }

    return (
      <div style={{textAlign: 'center'}}>
        <div style={outputTextAreaStyle}>
          <SpeedReader
            inputText={this.state.inputText}
            speed={this.state.speed}
            isPlaying={this.state.isPlaying}
            hasEndedCallback={this.pause}
            progressCallback={this.progress}
            chunk={this.state.chunk}
            reset={this.state.resetTs}
            trim={{regex: /\.|,|\?|!/}}
            offset={{regex: /\.|,|\?|!/, duration: 0.5}}
            blank={{regex: /\.|\?|!/, duration: 0.5}}
            />
        </div>

        <div>{this.progressBar(this.state.progress)}</div>

        <div>
          <button onClick={this.state.isPlaying ?this.pause : this.play}>
            {this.state.isPlaying ? '||' : '>'}
          </button>
          <button onClick={this.reset}>Reset</button>
        </div>

        <div>
          <button onClick={this.decreaseChunk}>-</button>
          words per flash: {this.state.chunk}
          <button onClick={this.increaseChunk}>+</button>
        </div>

        <textarea rows={10} cols={40}
          type="text"
          value={this.state.inputText}
          onChange={function(e){self.setState({inputText: e.target.value})}}
          />


      </div>
    )
  }
})

module.exports = SpeedReaderViewer
