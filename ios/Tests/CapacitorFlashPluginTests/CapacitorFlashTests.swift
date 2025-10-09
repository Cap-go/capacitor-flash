import XCTest
@testable import CapacitorFlashPlugin

class CapacitorFlashTests: XCTestCase {
    func testEcho() {
        // Ensure the basic API wiring still works.
        let implementation = CapacitorFlash()
        let value = "Hello, World!"
        let result = implementation.echo(value)

        XCTAssertEqual(value, result)
    }
}
