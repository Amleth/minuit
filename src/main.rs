// use regex::Regex;
use std::collections::HashMap;
use std::env;
use std::fs;
use std::path::Path;

////////////////////////////////////////////////////////////////////////////////
// CONSTANTS
////////////////////////////////////////////////////////////////////////////////

enum PatternLength {
    Content,
    Measure,
}

const GLOBAL_BPM: u16 = 120;
const GLOBAL_PPQ: u16 = 480;
const DEFAULT_MIDI_NOTE: u8 = 50;
const DEFAULT_TIME_SIGNATURE: TimeSignature = TimeSignature { upper: 4, lower: 4 };
const DEFAULT_GRID_RESOLUTION: u8 = 4;
const DEFAULT_NOTE_LENGTH: u8 = 4;
const DEFAULT_PATTERN_LENGTH: PatternLength = PatternLength::Content;

////////////////////////////////////////////////////////////////////////////////
// STRUCTS
////////////////////////////////////////////////////////////////////////////////

struct TimeSignature {
    upper: u8,
    lower: u8,
}

struct Pattern {
    name: String,
    time_signature: TimeSignature,
    grid_resolution: u8,
}

impl Pattern {
    fn new(name: &str) -> Self {
        Self {
            grid_resolution: DEFAULT_GRID_RESOLUTION,
            name: name.to_string(),
            time_signature: DEFAULT_TIME_SIGNATURE,
        }
    }
}

////////////////////////////////////////////////////////////////////////////////
// HELPERS
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// MAIN
////////////////////////////////////////////////////////////////////////////////

fn main() {
    let args: Vec<String> = env::args().collect();

    if args.len() < 2 {
        eprintln!("Usage: {} <file_path>", args[0]);
        std::process::exit(1);
    }
    let file_path = &args[1];
    let path = Path::new(file_path);

    match fs::read_to_string(path) {
        Ok(content) => {
            println!("{}", '🌲'.to_string().repeat(33));
            process_mn_file(content);
            println!("{}", '🌲'.to_string().repeat(33));
        }
        Err(e) => eprintln!("Error reading file: {}", e),
    }
}

fn process_mn_file(content: String) {
    let patterns: HashMap<String, String> = HashMap::new();

    for line in content.lines() {
        let line = line.trim();
        if line.starts_with('#') {
            continue;
        } else if line.is_empty() {
            continue;
        } else {
            println!("{}", line);
            let a_pattern: Pattern = Pattern::new("coucou");
        }
    }

    // let mut variables_map: HashMap<String, String> = HashMap::new();

    //     let re_variable_declaration = Regex::new(r"([^=]+)=([^=]+)").unwrap();
    //     if let Some(caps) = re_variable_declaration.captures(line) {
    //         let key = &caps[1];
    //         let value = &caps[2];
    //         variables_map.insert(key.to_owned(), value.to_owned());
    //     }
    // }

    // println!("{:#?}", variables_map);

    // ////////////////////////////////////////////////////////////////////////////////
    // // SECOND PASS
    // ////////////////////////////////////////////////////////////////////////////////

    // // for line in content.lines() {
    // //     let line = line.trim();
    // // }

    // // for (key, value) in &variables_map {
    // //     let emoji_characters_count = count_class_occurrences(value, r"\p{Extended_Pictographic}");
    // //     let digit_chracters_count = count_class_occurrences(value, r"\d+");
    // //     let void_characters_count = count_class_occurrences(value, r"[\._-]");
    // //     let separators_characters_count = count_class_occurrences(value, r"[ ]");
    // //
    // //     println!("{} => {}", key, value);
    // //     println!("    DIGI: {}", digit_chracters_count);
    // //     println!("    EMJI: {}", emoji_characters_count);
    // //     println!("    VOID: {}", void_characters_count);
    // //     println!("    SEPR: {}", separators_characters_count);
    // //
    // //     println!("    {:#?}", segment_pattern_value(&value));
    // // }
}
