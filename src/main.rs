fn main() {
    let x: String = String::from("Hello, world!");
    let y = &x;
    println!("{}{}", x, y);
}
