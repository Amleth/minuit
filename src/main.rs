use regex::Regex;
use std::collections::HashMap;
use std::env;
use std::fs;
use std::path::Path;

fn main() {
    println!("🕛");
    let args: Vec<String> = env::args().collect();

    if args.len() < 2 {
        eprintln!("Usage: {} <file_path>", args[0]);
        std::process::exit(1);
    }
    let file_path = &args[1];
    let path = Path::new(file_path);

    match fs::read_to_string(path) {
        Ok(content) => {
            println!("{}", '='.to_string().repeat(80));
            process_mn_file(content);
            println!("{}", '='.to_string().repeat(80));
        }
        Err(e) => eprintln!("Error reading file: {}", e),
    }
}

fn process_mn_file(content: String) {
    let mut variables_map: HashMap<String, String> = HashMap::new();

    ////////////////////////////////////////////////////////////////////////////////
    // FIRST PASS
    ////////////////////////////////////////////////////////////////////////////////

    for line in content.lines() {
        let line = line.trim();
        if line.starts_with('#') {
            continue;
        }

        let re_variable_declaration = Regex::new(r"([^=]+)=([^=]+)").unwrap();
        if let Some(caps) = re_variable_declaration.captures(line) {
            let key = &caps[1];
            let value = &caps[2];
            variables_map.insert(key.to_string(), value.to_string());
        }
    }

    println!("{:#?}", variables_map);

    ////////////////////////////////////////////////////////////////////////////////
    // SECOND PASS
    ////////////////////////////////////////////////////////////////////////////////
    
    // for line in content.lines() {
    //     let line = line.trim();
    // }
}
