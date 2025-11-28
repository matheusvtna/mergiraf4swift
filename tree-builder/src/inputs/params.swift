func method(a: Int, b: String) -> Bool {
    return true
}

func genericMethod<T: Comparable, U: Codable>(param1: T, param2: U) -> T {
    return param1
}

func test(a: Int, b: inout String, c: @escaping () -> Void) {
    // function body
}

func withUnderscoreParam(_ param: Double, other: Double) {
    print(param)
}

func withDefaultParam(param: Int = 42) {
    print(param)
}