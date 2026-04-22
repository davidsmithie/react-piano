import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import MidiNumbers from './MidiNumbers';

class Key extends React.Component {
  static propTypes = {
    midiNumber: PropTypes.number.isRequired,
    naturalKeyWidth: PropTypes.number.isRequired, // Width as a ratio between 0 and 1
    gliss: PropTypes.bool.isRequired,
    useTouchEvents: PropTypes.bool.isRequired,
    accidental: PropTypes.bool.isRequired,
    active: PropTypes.bool.isRequired,
    disabled: PropTypes.bool.isRequired,
    onPlayNoteInput: PropTypes.func.isRequired,
    onStopNoteInput: PropTypes.func.isRequired,
    accidentalWidthRatio: PropTypes.number.isRequired,
    pitchPositions: PropTypes.object.isRequired,
    children: PropTypes.node,
    isRoot: PropTypes.bool,
    isLowlight: PropTypes.bool,
    isHighlight: PropTypes.bool,
    isSpecial: PropTypes.bool,
    isSpecialRoot: PropTypes.bool,
    isChord: PropTypes.bool, 
    scaleSelectMode: PropTypes.string,
    isHovered: PropTypes.number
  };

  static defaultProps = {
    accidentalWidthRatio: 0.65,
    pitchPositions: {
      C: 0,
      Db: 0.55,
      D: 1,
      Eb: 1.8,
      E: 2,
      F: 3,
      Gb: 3.5,
      G: 4,
      Ab: 4.7,
      A: 5,
      Bb: 5.85,
      B: 6,
    },
  };

  onPlayNoteInput = () => {
    this.props.onPlayNoteInput(this.props.midiNumber);
  };

  onStopNoteInput = () => {
    this.props.onStopNoteInput(this.props.midiNumber);
  };

  // Key position is represented by the number of natural key widths from the left
  getAbsoluteKeyPosition(midiNumber) {
    const OCTAVE_WIDTH = 7;
    const { octave, pitchName } = MidiNumbers.getAttributes(midiNumber);
    const pitchPosition = this.props.pitchPositions[pitchName];
    const octavePosition = OCTAVE_WIDTH * octave;
    return pitchPosition + octavePosition;
  }

  getRelativeKeyPosition(midiNumber) {
    return (
      this.getAbsoluteKeyPosition(midiNumber) -
      this.getAbsoluteKeyPosition(this.props.noteRange.first)
    );
  }

  render() {
    const {
      naturalKeyWidth,
      accidentalWidthRatio,
      midiNumber,
      gliss,
      useTouchEvents,
      accidental,
      active,
      disabled,
      children,
      isRoot,
      isHighlight,
      isSpecial,
      isSpecialRoot,
      isChord,
      isHovered
    } = this.props;

    let classNameString = "ReactPiano__Key ";
    if (accidental) {
      classNameString += "ReactPiano__Key--accidental ";
    } else {
      classNameString += "ReactPiano__Key--natural ";
    }
    if (isSpecial) {
      classNameString += "ReactPiano__Key--special ";
    }
    if (isSpecialRoot) {
      classNameString += "ReactPiano__Key--special-root ";
    }
    if (disabled) {
      classNameString += "ReactPiano__Key--disabled ";
    }
    if (active || isChord || isHovered) {
      classNameString += "ReactPiano__Key--active ";
    }

    // Need to conditionally include/exclude handlers based on useTouchEvents,
    // because otherwise mobile taps double fire events.
    return (
      <div
        className={classNameString}
        // className={classNames('ReactPiano__Key', {          
        //   'ReactPiano__Key--accidental': accidental,
        //   'ReactPiano__Key--natural': !accidental,
        //   'ReactPiano__Key--special': isSpecial,
        //   'ReactPiano__Key--special-root': isSpecialRoot,
        //   'ReactPiano__Key--disabled': disabled,  
        //   'ReactPiano__Key--active': (active || isChord || isHovered),
          //// 'ReactPiano__Key--accidental-lowlight': (accidental && !isChord && isLowlight && !isRoot),
          //// 'ReactPiano__Key--natural-lowlight': (!accidental && !isChord && isLowlight && !isRoot),
          //// 'ReactPiano__Key--root': (!isChord && isRoot),
          //// 'ReactPiano__Key--highlight': (!isChord && isHighlight),                 
        // })}
        style={{
          left: ratioToPercentage(this.getRelativeKeyPosition(midiNumber) * naturalKeyWidth),
          width: ratioToPercentage(
            accidental ? accidentalWidthRatio * naturalKeyWidth : naturalKeyWidth,
          ),
        }}
        onMouseDown={useTouchEvents ? null : this.onPlayNoteInput}
        onMouseUp={useTouchEvents ? null : this.onStopNoteInput}
        onMouseEnter={gliss ? this.onPlayNoteInput : null}
        onMouseLeave={this.onStopNoteInput}
        onTouchStart={useTouchEvents ? this.onPlayNoteInput : null}
        onTouchCancel={useTouchEvents ? this.onStopNoteInput : null}
        onTouchEnd={useTouchEvents ? this.onStopNoteInput : null}
      >
        { isRoot && !accidental ? 
        (<div style={{ backgroundColor: "rgba(67, 138, 139, 0.5)", borderRadius: "25%", height: ".4rem", width: "1.25rem", marginLeft: "13px", marginTop: "115px" }}>
        </div>) : 
        null
        }
        { isRoot && accidental ? 
        (<div style={{ backgroundColor: "rgba(67, 138, 139, 0.5)", borderRadius: "25%", height: ".4rem", width: "1rem", marginLeft: "7px", marginTop: "65px" }}>
        </div>) : 
        null
        }
        { isHighlight && !accidental ? 
        (<div style={{ backgroundColor: "rgba(214, 188, 188, .6)", borderRadius: "25%", height: ".4rem", width: "1.25rem", marginLeft: "13px", marginTop: "115px" }}>
        </div>) : 
        null
        }
        { isHighlight && accidental ? 
        (<div style={{ backgroundColor: "rgba(214, 188, 188, .6)", borderRadius: "25%", height: ".4rem", width: "1rem", marginLeft: "7px", marginTop: "65px" }}>
        </div>) : 
        null
        }
        <div className="ReactPiano__NoteLabelContaner">{children}</div>
      </div>
    );
  }
}

function ratioToPercentage(ratio) {
  return `${ratio * 100}%`;
}

export default Key;
