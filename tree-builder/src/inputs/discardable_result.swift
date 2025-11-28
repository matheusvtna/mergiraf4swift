class Calculadora {
 
    var acc: Int
 
    init() {
        self.acc = 0
    }

    @discardableResult
    func add(x: Int) -> Int {
        self.acc += x
        return self.acc
    }    
}