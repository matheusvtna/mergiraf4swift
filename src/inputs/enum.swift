enum Number {
    case one
    case two
    case three
    case other(OtherNumber)

    enum OtherNumber {
        case four
        case five
    }

    protocol NumberProtocol {
        func display() -> String
    }

    class NumberClass: NumberProtocol {

        let number: Number
        
        func display() -> String {
            switch self {
            case .one:
                return "One"
            case .two:
                return "Two"
            case .three:
                return "Three"
            case .other(let otherNumber):
                switch otherNumber {
                case .four:
                    return "Four"
                case .five:
                    return "Five"
                }
            }
        }
    }
}

enum Direction: String, CaseIterable {
    case north
    case south
    case east
    case west
}

enum Result<T, U> where T: Equatable, U: Error {
    case success(T)
    case failure(U)
}

enum OptionalValue {
    associatedtype T
 
    case none
    case some(T)
}

enum HTTPStatus: Int {
    case ok = 200
    case notFound = 404
    case internalServerError = 500
}

enum Movement {
    typealias Dir = Direction

    case a(Dir)
    case b
}

enum MultipleParams {
    case pair(Int, String)
    case triple(Int, String, Bool)
}

enum RecursiveEnum {
    indirect case node(Int, RecursiveEnum, RecursiveEnum)
    case leaf(Int)
}

enum Computation {
    case add(Int, Int)
    case subtract(Int, Int)
    case multiply(Int, Int)
    case divide(Int, Int)

    func execute() -> Int? {
        switch self {
        case .add(let a, let b):
            return a + b
        case .subtract(let a, let b):
            return a - b
        case .multiply(let a, let b):
            return a * b
        case .divide(let a, let b):
            guard b != 0 else { return nil }
            return a / b
        }
    }
}

enum AssociatedValues {
    case point(x: Int, y: Int)
    case circle(centerX: Int, centerY: Int, radius: Int)
}

enum MultipleAssociatedTypes {
    associatedtype A
    associatedtype B

    case first(A)
    case second(B)
}