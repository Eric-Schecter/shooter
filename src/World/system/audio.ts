export class AudioHandler {
  private bufferArr: Array<AudioBufferSourceNode> = [];
  private context = new AudioContext();
  private map = new Map();
  private store = (buffer: any, volume: number, replayTime: number, endTime: number) => {
    const gainNode = this.context.createGain();
    gainNode.gain.value = volume;
    gainNode.connect(this.context.destination);
    const source = this.context.createBufferSource();
    source.buffer = buffer;
    source.connect(gainNode);

    if (replayTime) {
      source.loop = true;
      source.loopStart = replayTime;
      source.loopEnd = endTime || buffer.duration;
    }
    const i = this.bufferArr.length;
    this.bufferArr.push(source);

    source.start(0);
    source.onended = () => {
      this.bufferArr.splice(i, 1);
    }
  }
  play = (url: string, volume = 1, replayTime = 0, endTime = 0) => {
    if (this.map.has(url)) {
      this.store(this.map.get(url), volume, replayTime, endTime);
    }else{
      const request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.responseType = 'arraybuffer';
      request.onload = (evt) => {
        this.context.decodeAudioData(request.response, buffer => {
          this.map.set(url, buffer);
          this.store(buffer, volume, replayTime, endTime);
        });
      };
      request.send();
    }
  }
  clear = () => {
    this.bufferArr.forEach(d => d.disconnect());
    this.bufferArr.length = 0;
  }
}
const audioHandler = new AudioHandler();
export { audioHandler };