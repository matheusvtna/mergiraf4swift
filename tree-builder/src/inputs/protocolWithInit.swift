protocol Identifiable {
    associatedtype ID: Hashable
    var id: ID { get }

    init(id: ID)
}