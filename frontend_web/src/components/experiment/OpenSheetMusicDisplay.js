import React, { Component } from 'react';
import { OpenSheetMusicDisplay as OSMD } from 'opensheetmusicdisplay';

class OpenSheetMusicDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = { dataReady: false };
    this.osmd = undefined;
    this.divRef = React.createRef();
  }

  setupOsmd() {
    const options = {
      autoResize: false,
      drawTitle: this.props.drawTitle !== undefined ? this.props.drawTitle : true,
    };
    this.osmd = new OSMD(this.divRef.current, options);
    this.osmd.load(this.props.file).then(() => {
      this.setState({ dataReady: true }, () => {
        this.renderOsmd();
      });
    });
  }

  async renderOsmd() {
    // Ensure we are only rendering if the data is ready
    if (this.osmd.IsReadyToRender()) {
      try {
        this.osmd.render();
      } catch (error) {
        console.error('Error during OSMD render:', error);
      }
    }
  }

  // Delay for ms amount of time
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Traverse to the next measure
  nextMeasure = () => {
    if (this.osmd.cursor.iterator.EndReached) {
      return;
    }

    const targetMeasure = this.osmd.cursor.iterator.CurrentMeasureIndex + 1;

    while (
      this.osmd.cursor.iterator.CurrentMeasureIndex < targetMeasure &&
      !this.osmd.cursor.iterator.EndReached
    ) {
      this.osmd.cursor.next();
    }
  };

  // Scroll to where the cursor is on the page
  scrollToCursor() {
    if (this.osmd.cursor.cursorElement) {
      this.osmd.cursor.cursorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  async beginSong() {
    this.osmd.cursor.reset();
    let cursorsOptions = [{ type: 3, color: '#33e02f', alpha: 0.5, follow: true }];
    this.osmd.setOptions({ cursorsOptions: cursorsOptions });
    this.osmd.enableOrDisableCursors(true);

    // Update cursor height
    this.osmd.cursors[0].show();
    this.osmd.cursor.cursorElement.style.height =
      this.osmd.cursor.cursorElement.getAttribute('height') + 'px';
    this.scrollToCursor();

    const it = this.osmd.cursor.Iterator;
    while (!it.endReached) {
      // console.log(it.currentTimeStamp.realValue);
      // const cursorVoiceEntry = it.CurrentVoiceEntries[0];
      // const lowestVoiceEntryNote = cursorVoiceEntry.Notes[0];
      // console.log(lowestVoiceEntryNote.Pitch.ToString());

      // Determine bpm of the current measure
      const measure = this.osmd.Sheet.SourceMeasures[it.CurrentMeasureIndex];
      const tempoInstructions = measure.TempoExpressions;
      let currentTempo = this.osmd.Sheet.DefaultStartTempoInBpm;
      if (tempoInstructions.length > 0 && it.CurrentMeasureIndex > 0) {
        currentTempo = tempoInstructions[0].TempoInBpm;
      }

      // Calculate time taken per measure and sleep
      const timeSignature = measure.activeTimeSignature;
      const beatsPerMeasure = timeSignature.numerator;
      await this.sleep((60000 / currentTempo) * beatsPerMeasure);

      // Dynamically update cursor height and go to next measure
      this.nextMeasure();
      this.osmd.cursor.cursorElement.style.height =
        this.osmd.cursor.cursorElement.getAttribute('height') + 'px';
      this.scrollToCursor();
    }
  }

  resize = () => {
    if (this.osmd && this.state.dataReady) {
      this.renderOsmd();
      this.osmd.cursor.cursorElement.style.height =
        this.osmd.cursor.cursorElement.getAttribute('height') + 'px';
    }
  };

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  // Called after render
  componentDidMount() {
    this.setupOsmd();
    window.addEventListener('resize', this.resize);
  }

  render() {
    return <div ref={this.divRef} />;
  }
}

export default OpenSheetMusicDisplay;
