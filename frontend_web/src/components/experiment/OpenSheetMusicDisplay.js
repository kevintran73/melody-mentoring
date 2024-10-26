import React, { Component } from 'react';
import { OpenSheetMusicDisplay as OSMD } from 'opensheetmusicdisplay';

import * as Tone from 'tone';

class OpenSheetMusicDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = { dataReady: false };
    this.osmd = undefined;
    this.divRef = React.createRef();
    this.playing = false;
    this.synth = new Tone.PolySynth(Tone.Synth).toDestination();
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
        if (this.props.onLoad) {
          this.props.onLoad();
        }
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

  // Returns a list of notes from the given measure sorted by their timestamp
  getNotesFromMeasure(measure) {
    const musicEvents = [];

    measure.VerticalSourceStaffEntryContainers.forEach((vsec) => {
      vsec.StaffEntries.forEach((staffEntry) => {
        const simultaneousNotes = [];
        let maxDuration = 0;

        staffEntry.VoiceEntries.forEach((voiceEntry) => {
          voiceEntry.Notes.forEach((note) => {
            const pitch = note.halfTone;
            // Convert note lengths to quarter note units
            const duration = note.Length.RealValue;
            simultaneousNotes.push(pitch);
            maxDuration = Math.max(maxDuration, duration);
          });
        });

        // If there is a chord or notes played at the same timestamp
        if (simultaneousNotes.length > 0) {
          musicEvents.push({
            notes: simultaneousNotes,
            duration: maxDuration,
            timestamp: staffEntry.Timestamp.RealValue,
          });
        }
      });
    });

    return musicEvents.sort((a, b) => a.timestamp - b.timestamp);
  }

  // Prompts Tone.js to play the specified sequence of notes
  async playMeasure(musicEvents, tempo, beatsPerMeasure) {
    let startTime = Tone.now();

    musicEvents.forEach((event) => {
      const { notes, duration, timestamp } = event;

      const durationInSeconds = (duration * 60) / tempo;
      const eventStartTime = startTime + timestamp * ((60 / tempo) * beatsPerMeasure);
      const frequencies = notes.map((pitch) => Tone.Frequency(pitch, 'midi').toFrequency());

      // Prompt note to play in a specific timeframe
      this.synth.triggerAttackRelease(frequencies, durationInSeconds, eventStartTime);
    });
  }

  // Begins playing the song with cursor
  async beginSong() {
    this.playing = true;

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
    while (!it.endReached && this.playing === true) {
      // Determine bpm of the current measure
      const measure = this.osmd.Sheet.SourceMeasures[it.CurrentMeasureIndex];
      const tempoInstructions = measure.TempoExpressions;
      let currentTempo = this.osmd.Sheet.DefaultStartTempoInBpm;
      if (tempoInstructions.length > 0 && it.CurrentMeasureIndex > 0) {
        currentTempo = tempoInstructions[0].sourceMeasure.tempoInBPM;
      }

      // Get and play all notes/chords in the measure
      const timeSignature = measure.activeTimeSignature;
      const beatsPerMeasure = timeSignature.numerator;
      const musicEvents = this.getNotesFromMeasure(measure);
      await this.playMeasure(musicEvents, currentTempo, beatsPerMeasure);
      await this.sleep((60000 / currentTempo) * beatsPerMeasure);

      // Dynamically update cursor height and go to next measure
      this.nextMeasure();
      this.osmd.cursor.cursorElement.style.height =
        this.osmd.cursor.cursorElement.getAttribute('height') + 'px';
      this.scrollToCursor();
    }
  }

  endSong() {
    this.osmd.cursor.hide();
    this.playing = false;
  }

  isLoading() {
    return !this.state.dataReady;
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
