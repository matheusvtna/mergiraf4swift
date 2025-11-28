struct A {
    var id: Int

    private nonmutating func reportNewID(to newId: Int) {
        print("Updating id from \(id) to \(newId)")
        self.id = newId
    }

    public mutating func updateId(to newId: Int) {
        self.id = newId
    }

    internal func fetchId() -> Int {
        return self.id
    }

    fileprivate func resetId() {
        self.id = 0
    }

    private static func staticMethodExample() {
        print("This is a static method.")
    }

    static private func anotherStaticMethod() {
        print("This is another static method.")
    }

    public static mutating func publicStaticMethod() {
        print("This is a public static mutating method and should show an error.")
    }

    static private nonmutating func staticNonMutatingMethod() {
        print("This is a private static nonmutating method.")
    }

    open func openMethodExample() {
        print("This is an open method.")
    }

    public init(id: Int) {
        self.id = id
    }
}

final class B {
    private var value: String

    private func privateMethod() {
        print("This is a private method in class B.")
    }

    public func publicMethod() {
        print("This is a public method in class B.")
    }

    init(value: String) {
        self.value = value
    }
}

open class C {
    public var name: String

    public init(name: String) {
        self.name = name
    }

    open func openMethod() {
        print("This is an open method in class C.")
    }
}

class D {
    convenience init() {
        self.init(value: 0)
    }

    required init(a: Int) {
        print("Required initializer with value: \(a)")
    }
}