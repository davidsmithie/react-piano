import React from 'react';
import PropTypes from 'prop-types';
import range from 'just-range';
import classNames from 'classnames';

import Key from './Key';
import MidiNumbers from './MidiNumbers';

class Keyboard extends React.Component {
  static propTypes = {
    noteRange: noteRangePropType,
    activeNotes: PropTypes.arrayOf(PropTypes.number),
    onPlayNoteInput: PropTypes.func.isRequired,
    onStopNoteInput: PropTypes.func.isRequired,
    renderNoteLabel: PropTypes.func.isRequired,
    keyWidthToHeight: PropTypes.number.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    gliss: PropTypes.bool,
    useTouchEvents: PropTypes.bool,
    // If width is not provided, must have fixed width and height in parent container
    width: PropTypes.number,
    selectedRootNums: PropTypes.array,
    highlightNoteNums: PropTypes.array,
    specialNoteNums: PropTypes.array,
    specialRootNums: PropTypes.array,
    chordNoteNums: PropTypes.array,
    scaleSelectMode: PropTypes.string,
    hoveredNote: PropTypes.number
  };

  static defaultProps = {
    disabled: false,
    gliss: false,
    useTouchEvents: false,
    keyWidthToHeight: 0.33,
    renderNoteLabel: () => { },
  };

  // Range of midi numbers on keyboard
  getMidiNumbers() {
    return range(this.props.noteRange.first, this.props.noteRange.last + 1);
  }

  getNaturalKeyCount() {
    return this.getMidiNumbers().filter((number) => {
      const { isAccidental } = MidiNumbers.getAttributes(number);
      return !isAccidental;
    }).length;
  }

  // Returns a ratio between 0 and 1
  getNaturalKeyWidth() {
    return 1 / this.getNaturalKeyCount();
  }

  getWidth() {
    return this.props.width ? this.props.width : '100%';
  }

  getHeight() {
    if (!this.props.width) {
      return '100%';
    }
    const keyWidth = this.props.width * this.getNaturalKeyWidth();
    return `${keyWidth / this.props.keyWidthToHeight}px`;
  }

  render() {
    const naturalKeyWidth = this.getNaturalKeyWidth();
    return (
      <div
        className={classNames('ReactPiano__Keyboard', this.props.className)}
        style={{ width: this.getWidth(), height: this.getHeight() }}
      >
        {this.getMidiNumbers().map((midiNumber) => {
          const { note, isAccidental } = MidiNumbers.getAttributes(midiNumber);
          const isActive = !this.props.disabled && this.props.activeNotes.includes(midiNumber);
          const isRoot = (this.props.selectedRootNums && this.props.selectedRootNums.length > 0) ?
            this.props.selectedRootNums.includes(midiNumber) : false;
          const isHighlight = (this.props.highlightNoteNums && this.props.highlightNoteNums.length > 0) ?
            this.props.highlightNoteNums.includes(midiNumber) : false;
          const isSpecial = (this.props.specialNoteNums && this.props.specialNoteNums.length > 0) ?
            this.props.specialNoteNums.includes(midiNumber) : false;
          const isSpecialRoot = (this.props.specialRootNums && this.props.specialRootNums.length > 0) ?
            this.props.specialRootNums.includes(midiNumber) : false;
          const isChord = (this.props.chordNoteNums && this.props.chordNoteNums.length > 0) ?
            this.props.chordNoteNums.includes(midiNumber) : false;
          const isHovered = this.props.hoveredNote && this.props.hoveredNote >= 0 && this.props.hoveredNote === midiNumber;
          return (
            <Key
              naturalKeyWidth={naturalKeyWidth}
              midiNumber={midiNumber}
              noteRange={this.props.noteRange}
              active={isActive}
              accidental={isAccidental}
              disabled={this.props.disabled}
              onPlayNoteInput={this.props.onPlayNoteInput}
              onStopNoteInput={this.props.onStopNoteInput}
              gliss={this.props.gliss}
              useTouchEvents={this.props.useTouchEvents}
              key={midiNumber}
              isRoot={isRoot}
              isHighlight={isHighlight}
              isSpecial={isSpecial}
              isSpecialRoot={isSpecialRoot}
              isChord={isChord}
              scaleSelectMode={this.props.scaleSelectMode}
              isHovered={isHovered}
            >
              {this.props.disabled
                ? null
                : this.props.renderNoteLabel({
                  isActive,
                  isAccidental,
                  isChord,
                  midiNumber,
                })}
            </Key>
          );
        })}
      </div>
    );
  }
}

function isNaturalMidiNumber(value) {
  if (typeof value !== 'number') {
    return false;
  }
  return MidiNumbers.NATURAL_MIDI_NUMBERS.includes(value);
}

function noteRangePropType(props, propName, componentName) {
  const { first, last } = props[propName];
  if (!first || !last) {
    return new Error(
      `Invalid prop ${propName} supplied to ${componentName}. ${propName} must be an object with .first and .last values.`,
    );
  }
  if (!isNaturalMidiNumber(first) || !isNaturalMidiNumber(last)) {
    return new Error(
      `Invalid prop ${propName} supplied to ${componentName}. ${propName} values must be valid MIDI numbers, and should not be accidentals (sharp or flat notes).`,
    );
  }
  if (first >= last) {
    return new Error(
      `Invalid prop ${propName} supplied to ${componentName}. ${propName}.first must be smaller than ${propName}.last.`,
    );
  }
}

export default Keyboard;
