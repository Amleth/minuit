mod constants;
mod helpers;
mod pattern;
mod score;
mod symbols;

use crate::score::{ParseContext, Score};
use pest::Parser;
use pest_derive::Parser;

use crate::pattern::PatternLaneType;
use crate::symbols::replace_symbols;
use std::env;
use std::fs;

#[derive(Parser)]
#[grammar = "./minuit.pest"]
struct MinuitParser;

fn main() {
    let mut score: Score = Score::new();

    // Collect command line arguments
    let args: Vec<String> = env::args().collect();

    // Check if the user passed a filename
    if args.len() < 2 {
        eprintln!("Usage: {} <filename>", args[0]);
        std::process::exit(1);
    }

    // Display file name
    let filename = &args[1];
    println!("{}", "🌲".repeat(42));
    println!("🌲 MIDNIGHT SCORE FILE: {}", filename);
    println!("{}", "🌲".repeat(42));

    // Read the file content
    let content = fs::read_to_string(filename).expect("Failed to read file");
    println!("{}", content);
    println!("{}", "🌲".repeat(42));

    // Symbols substitution
    let new_content: String = replace_symbols(&content);
    println!("{}", new_content);
    println!("{}", "🌲".repeat(42));

    // PEST
    let pairs = MinuitParser::parse(Rule::file, &new_content).expect("parse failed");
    for pair in pairs {
        score.build(
            pair,
            &mut ParseContext {
                pattern_name: String::new(),
                pattern_lane_type: PatternLaneType::X,
            },
            0,
        );
    }

    score.print();
    score.complete();
    score.print();
}
