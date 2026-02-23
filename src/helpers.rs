use crate::constants::DEFAULT_PITCH_CLASS_SYMBOLS_TO_MIDI_NOTES;

pub fn compute_value(s: &str) -> Option<f64> {
    if s.contains('/') {
        let parts: Vec<&str> = s.split('/').collect();
        if parts.len() != 2 {
            return None;
        }

        let numerator: f64 = parts[0].parse().ok()?;
        let denominator: f64 = parts[1].parse().ok()?;

        if denominator == 0.0 {
            return None;
        }

        Some(numerator / denominator)
    } else {
        s.parse::<f64>().ok()
    }
}

pub fn minuit_pitch_symbol_to_midi_pitch(symbol: &str) -> u8 {
    let pitch_class_char = symbol.chars().nth(0).unwrap();
    let mut pitch_class = DEFAULT_PITCH_CLASS_SYMBOLS_TO_MIDI_NOTES[&pitch_class_char];
    let mut n_plus = symbol.matches('+').count();
    let mut n_moins = symbol.matches('-').count();

    while pitch_class <= 127 && n_plus > 0 {
        pitch_class += 12;
        n_plus -= 1;
    }

    while pitch_class <= 127 && n_moins > 0 {
        pitch_class -= 12;
        n_moins -= 1;
    }

    return pitch_class;
}
