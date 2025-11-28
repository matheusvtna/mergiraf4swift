class Calculadora {

    protocol Somable {
        func add(x: Int) -> Int
    }
}

extension Int: Calculadora.Somable {
    func add(x: Int) -> Int {
        return self + x
    }
}