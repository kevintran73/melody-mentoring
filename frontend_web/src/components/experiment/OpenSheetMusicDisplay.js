import React, { Component } from 'react';
import { OpenSheetMusicDisplay as OSMD } from 'opensheetmusicdisplay';

// Class provided by OSMD GitHub page
// https://github.com/opensheetmusicdisplay/react-opensheetmusicdisplay/blob/master/src/lib/OpenSheetMusicDisplay.jsx
class OpenSheetMusicDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = { dataReady: false };
    this.osmd = undefined;
    this.divRef = React.createRef();
  }

  setupOsmd() {
    const options = {
      autoResize: this.props.autoResize !== undefined ? this.props.autoResize : true,
      drawTitle: this.props.drawTitle !== undefined ? this.props.drawTitle : true,
    };
    this.osmd = new OSMD(this.divRef.current, options);

    this.osmd
      .load(this.props.file)
      .then(() => {
        this.setState({ dataReady: true });
        this.osmd.render();
      })
      .catch((error) => {
        console.error('Error loading MusicXML file:', error);
      });
  }

  resize = () => {
    if (this.state.dataReady) {
      this.osmd.render();
    }
  };

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  componentDidUpdate(prevProps) {
    if (this.props.file !== prevProps.file || this.props.drawTitle !== prevProps.drawTitle) {
      this.setState({ dataReady: false });
      this.setupOsmd();
    }
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
