import Foundation

// MARK: - Typealiases and Protocols
typealias StringIntTuple = (String, Int)

protocol Identifiable {
    associatedtype ID: Hashable
    var id: ID { get }
}

protocol Serializable: Codable {
    func serialize() throws -> Data
}

extension Serializable {
    func serialize() throws -> Data {
        return try JSONEncoder().encode(self)
    }
}

// MARK: - Enums
enum ResultState<Value, Failure: Error> {
    case success(Value)
    case failure(Failure)

    var isSuccess: Bool {
        if case .success = self { return true }
        return false
    }
}

enum HTTPMethod: String {
    case get = "GET"
    case post = "POST"
    case put = "PUT"
    case delete = "DELETE"
}

enum TreeNode {
    case leaf(String)
    case node(String, [TreeNode])
}

// MARK: - Errors
enum DemoError: Error {
    case invalidInput(reason: String)
    case operationFailed(code: Int)
}

// MARK: - Generics and Constraints
struct GenericBox<T: Comparable & Codable>: Identifiable, Serializable {
    typealias ID = UUID
    let id: UUID = UUID()
    var value: T
    lazy var description: String = {
        "GenericBox<\(T.self)>: \(value)"
    }()
}

// Generic function with where clause
func swapIfGreater<T: Comparable>(_ a: inout T, _ b: inout T) where T: ExpressibleByIntegerLiteral {
    if a > b { (a, b) = (b, a) }
}

// MARK: - Struct with property observers, computed, subscripts
public struct Person: Codable, Identifiable {
    public typealias ID = String
    public let id: ID
    public var firstName: String {
        willSet { print("Will set firstName to \(newValue)") }
        didSet { print("Did set firstName from \(oldValue)") }
    }
    public var lastName: String
    public var age: Int

    public var fullName: String { "\(firstName) \(lastName)" }

    private var _nicknames: [String] = []
    public var nicknames: [String] {
        get { _nicknames }
        set { _nicknames = newValue.map { $0.trimmingCharacters(in: .whitespaces) } }
    }

    subscript(n: Int) -> String? {
        guard n >= 0 && n < nicknames.count else { return nil }
        return nicknames[n]
    }

    public init(id: ID, firstName: String, lastName: String, age: Int) {
        self.id = id
        self.firstName = firstName
        self.lastName = lastName
        self.age = age
    }
}

// MARK: - Classes, inheritance, deinit, methods
class Animal {
    var name: String
    init(name: String) { self.name = name }
    func speak() -> String { "..." }
}

final class Dog: Animal {
    var breed: String
    init(name: String, breed: String) {
        self.breed = breed
        super.init(name: name)
    }
    deinit { print("Dog \(name) deinitialized") }
    override func speak() -> String { "Woof" }
}

// MARK: - Nested types and extensions
struct Outer {
    struct Inner {
        var value: Int
        func doubled() -> Int { value * 2 }
    }
}

extension Array where Element == Int {
    func sum() -> Int { reduce(0, +) }
}

extension Person {
    mutating func celebrateBirthday() {
        age += 1
    }
}

// MARK: - Protocol with associated type and conforming types
protocol Repository {
    associatedtype Model: Codable
    func fetchAll() async throws -> [Model]
}

struct InMemoryRepo<M: Codable>: Repository {
    typealias Model = M
    private var store: [M] = []
    func fetchAll() async throws -> [M] { store }
}

// MARK: - Operator Overloading
infix operator **: MultiplicationPrecedence
func ** (lhs: Int, rhs: Int) -> Int {
    guard rhs >= 0 else { return 0 }
    return (0..<rhs).reduce(1) { $0 * lhs }
}

// MARK: - Async / Throwing / Pattern Matching
func performOperation(_ x: Int) throws -> Int {
    guard x >= 0 else { throw DemoError.invalidInput(reason: "negative") }
    return x * x
}

func doWork() async {
    do {
        let result = try performOperation(3)
        print("result: \(result)")
    } catch DemoError.invalidInput(let reason) {
        print("Invalid input: \(reason)")
    } catch {
        print("Other error: \(error)")
    }
}

// MARK: - Closures, higher-order
let numbers = [1, 2, 3, 4, 5]
let doubled = numbers.map { (n: Int) -> Int in n * 2 }
let filtered = numbers.filter { $0 % 2 == 0 }

// Tuple destructuring
let pair: StringIntTuple = ("age", 42)
let (label, value) = pair

// Using switch with enums and where
func describe(node: TreeNode) -> String {
    switch node {
    case .leaf(let s):
        return "leaf(\(s))"
    case .node(let s, let children) where children.isEmpty:
        return "node(\(s)) empty"
    case .node(let s, let children):
        return "node(\(s)) with \(children.count) children"
    }
}

// MARK: - Subscripts on custom type
struct Matrix {
    private var grid: [Double]
    let rows: Int, cols: Int
    init(rows: Int, cols: Int) {
        self.rows = rows; self.cols = cols
        self.grid = Array(repeating: 0.0, count: rows * cols)
    }
    subscript(row: Int, col: Int) -> Double {
        get { grid[row * cols + col] }
        set { grid[row * cols + col] = newValue }
    }
}

// MARK: - Main usage sample (not executed in tests, just to ensure variety)
func buildSample() async {
    var p = Person(id: "p1", firstName: "Ada", lastName: "Lovelace", age: 36)
    p.nicknames = ["Advocate", "Ada"]
    p.celebrateBirthday()

    let box = GenericBox(value: 10)
    _ = try? box.serialize()

    let dog = Dog(name: "Rex", breed: "Shepherd")
    print(dog.speak())

    let m = Matrix(rows: 2, cols: 2)
    _ = m[0, 1]

    let node = TreeNode.node("root", [.leaf("a"), .leaf("b")])
    _ = describe(node: node)

    await doWork()
}
