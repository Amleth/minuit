use crate::helpers::{compute_value, minuit_pitch_symbol_to_midi_pitch};
use crate::pattern::{Pattern, PatternLaneType};
use crate::Rule;
use std::collections::HashMap;

#[derive(Debug)]
pub struct ParseContext {
    pub(crate) pattern_name: String,
    pub(crate) pattern_lane_type: PatternLaneType,
}

#[derive(Debug)]
pub struct Score {
    patterns: HashMap<String, Pattern>,
}

impl Score {
    pub fn build(
        &mut self,
        pair: pest::iterators::Pair<Rule>,
        context: &mut ParseContext,
        depth: usize,
    ) {
        let rule_name = format!("{:?}", pair.as_rule());
        let value = pair.as_str();

        println!(
            "{:depth$}{:?}: {:?} [{:?}.{:?}]",
            "",
            pair.as_rule(),
            value,
            context.pattern_name,
            context.pattern_lane_type,
            depth = depth * 4
        );

        if "pattern_name" == rule_name {
            if !self.patterns().contains_key(value) {
                let pattern: Pattern = Pattern::new(&*value);
                self.patterns.insert(value.to_string(), pattern);
            }
            context.pattern_name = value.parse().unwrap();
        }

        if "pitch_lane" == rule_name {
            context.pattern_lane_type = PatternLaneType::P;
        }

        if "rhythm_lane" == rule_name {
            context.pattern_lane_type = PatternLaneType::R;
        }

        if "pitch" == rule_name {
            let v: u8 = minuit_pitch_symbol_to_midi_pitch(value);
            let pattern = self.patterns.get_mut(&context.pattern_name).unwrap();
            pattern.pitch_lane.push(v);
        }

        if "rhythm_value" == rule_name {
            let v: f64 = compute_value(value).unwrap();
            let pattern = self.patterns.get_mut(&context.pattern_name).unwrap();
            pattern.rhythm_lane.push(v);
        }

        for inner in pair.into_inner() {
            self.build(inner, context, depth + 1);
        }
    }

    pub fn new() -> Self {
        Self {
            patterns: HashMap::new(),
        }
    }

    pub fn patterns(&self) -> &HashMap<String, Pattern> {
        &self.patterns
    }

    pub fn complete(&self) {
        for p in self.patterns.values() {
            p.complete();
        }
    }

    pub fn print(&self) {
        println!("{}", "👾".repeat(42));
        for p in self.patterns.values() {
            println!("{}", p.name);
            println!("    P : {:?}", p.pitch_lane);
            println!("    R : {:?}", p.rhythm_lane);
        }
    }
}
