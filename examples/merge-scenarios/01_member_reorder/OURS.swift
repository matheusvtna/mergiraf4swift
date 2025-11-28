// OURS.swift — we add a new method and keep original order
class Calculator {
    func add(_ a: Int, _ b: Int) -> Int {
        return a + b
    }

    // New method added in OURS
    func subtract(_ a: Int, _ b: Int) -> Int {
        return a - b
    }

    func multiply(_ a: Int, _ b: Int) -> Int {
        return a * b
    }
}
