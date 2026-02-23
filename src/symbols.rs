use regex::Regex;
use std::collections::HashMap;

pub fn replace_symbols(content: &String) -> String {
    let symbol_re = Regex::new(r"^\$(.+)=(.+)$").unwrap();
    let mut new_content = String::new();
    let mut symbols: HashMap<String, String> = HashMap::new();
    for mut line in content.lines() {
        line = line.trim();
        if line.len() > 0 {
            if let Some(caps) = symbol_re.captures(line) {
                let symbol = &caps[1];
                let value = &caps[2];
                symbols.insert(symbol.to_string(), value.to_string());
            } else {
                new_content.push_str(line);
                new_content.push('\n');
            }
        }
    }
    for (symbol, value) in &symbols {
        new_content = new_content.replace(symbol, value);
    }

    return new_content.trim_end_matches('\n').to_string();
}
