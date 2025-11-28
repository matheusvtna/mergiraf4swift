protocol Number {
    var value: Int { get }
}

protocol Printable {
    func printValue()
}

enum NumberEnum: Number, Printable {
    case even(Int)
    case odd(Int)

    var value: Int {
        switch self {
        case .even(let num), .odd(let num):
            return num
        }
    }

    func printValue() {
        print("Value is \(self.value)")
    }
}

enum FloatNumber: Number & Printable {
    case floatValue(Double)

    var value: Int {
        switch self {
        case .floatValue(let num):
            return Int(num)
        }
    }

    func printValue() {
        print("Float value is \(self.value)")
    }
}

class Calc<T> where T: Number & Printable {
    var number: T

    init(number: T) {
        self.number = number
    }

    func display() {
        number.printValue()
    }
}

enum Test {
    case a
    case b

    func check() {
        switch self {
        case .a:
            print("It's A")
        case .b:
            print("It's B")
        }
    }
}