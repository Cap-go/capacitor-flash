// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "CapgoCapacitorFlash",
    platforms: [.iOS(.v15)],
    products: [
        .library(
            name: "CapgoCapacitorFlash",
            targets: ["CapacitorFlashPlugin"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", from: "8.1.0")
    ],
    targets: [
        .target(
            name: "CapacitorFlashPlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm")
            ],
            path: "ios/Sources/CapacitorFlashPlugin"),
        .testTarget(
            name: "CapacitorFlashPluginTests",
            dependencies: ["CapacitorFlashPlugin"],
            path: "ios/Tests/CapacitorFlashPluginTests")
    ]
)
