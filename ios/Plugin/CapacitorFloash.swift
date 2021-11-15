import Foundation

@objc public class CapacitorFloash: NSObject {
    @objc public func echo(_ value: String) -> String {
        print(value)
        return value
    }
}
