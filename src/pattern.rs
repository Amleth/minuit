#[derive(Debug)]
pub struct Pattern {
    pub name: String,
    pub pitch_lane: Vec<u8>,
    pub rhythm_lane: Vec<f64>,
}

#[derive(Debug)]
pub enum PatternLaneType {
    P,
    R,
    X,
}

impl Pattern {
    pub fn new(name: &str) -> Self {
        Self {
            name: name.to_owned(),
            pitch_lane: vec![],
            rhythm_lane: vec![],
        }
    }

    pub fn complete(&self) {
        if self.pitch_lane.len() < self.rhythm_lane.len() {
            while self.pitch_lane.len() < self.rhythm_lane.len() {}
        }
        if self.rhythm_lane.len() < self.pitch_lane.len() {
            while self.rhythm_lane.len() < self.pitch_lane.len() {}
        }
    }
}
