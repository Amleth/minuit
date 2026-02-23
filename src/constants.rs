use std::collections::HashMap;
use std::sync::LazyLock;

// pub const PPQ: u16 = 480;
pub const DEFAULT_MIDI_NOTE: u8 = 60;
// pub const DEFAULT_RHYTHM_VALUE: u8 = 4;
// pub const DEFAULT_VELOCITY_VALUE: u8 = 63;
//
pub static DEFAULT_PITCH_CLASS_SYMBOLS_TO_MIDI_NOTES: LazyLock<HashMap<char, u8>> =
    LazyLock::new(|| {
        let mut m = HashMap::new();
        m.insert('0', DEFAULT_MIDI_NOTE);
        m.insert('1', DEFAULT_MIDI_NOTE + 1);
        m.insert('2', DEFAULT_MIDI_NOTE + 2);
        m.insert('3', DEFAULT_MIDI_NOTE + 3);
        m.insert('4', DEFAULT_MIDI_NOTE + 4);
        m.insert('5', DEFAULT_MIDI_NOTE + 5);
        m.insert('6', DEFAULT_MIDI_NOTE + 6);
        m.insert('7', DEFAULT_MIDI_NOTE + 7);
        m.insert('8', DEFAULT_MIDI_NOTE + 8);
        m.insert('9', DEFAULT_MIDI_NOTE + 9);
        m.insert('x', DEFAULT_MIDI_NOTE + 10);
        m.insert('X', DEFAULT_MIDI_NOTE + 10);
        m.insert('y', DEFAULT_MIDI_NOTE + 11);
        m.insert('Y', DEFAULT_MIDI_NOTE + 11);
        m.insert('c', DEFAULT_MIDI_NOTE);
        m.insert('C', DEFAULT_MIDI_NOTE + 1);
        m.insert('d', DEFAULT_MIDI_NOTE + 2);
        m.insert('D', DEFAULT_MIDI_NOTE + 3);
        m.insert('e', DEFAULT_MIDI_NOTE + 4);
        m.insert('E', DEFAULT_MIDI_NOTE + 5);
        m.insert('f', DEFAULT_MIDI_NOTE + 5);
        m.insert('F', DEFAULT_MIDI_NOTE + 6);
        m.insert('g', DEFAULT_MIDI_NOTE + 7);
        m.insert('G', DEFAULT_MIDI_NOTE + 8);
        m.insert('a', DEFAULT_MIDI_NOTE + 9);
        m.insert('A', DEFAULT_MIDI_NOTE + 10);
        m.insert('b', DEFAULT_MIDI_NOTE + 11);
        m.insert('B', DEFAULT_MIDI_NOTE + 12);
        m
    });
