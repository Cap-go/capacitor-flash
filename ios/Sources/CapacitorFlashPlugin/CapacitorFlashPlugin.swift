import Foundation
import Capacitor

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitorjs.com/docs/plugins/ios
 */
@objc(CapacitorFlashPlugin)
public class CapacitorFlashPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "CapacitorFlashPlugin"
    public let jsName = "CapacitorFlash"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "isAvailable", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "switchOn", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "switchOff", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "isSwitchedOn", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "toggle", returnType: CAPPluginReturnPromise)
    ]

    private let implementation = CapacitorFlash()

    @objc func isAvailable(_ call: CAPPluginCall) {
        call.resolve([
            "value": implementation.isAvailable()
        ])
    }

    @objc func switchOn(_ call: CAPPluginCall) {
        let intensity = call.getFloat("intensity") ?? 1.0
        call.resolve([
            "value": implementation.switchOn(intensity: intensity)
        ])
    }

    @objc func switchOff(_ call: CAPPluginCall) {
        call.resolve([
            "value": implementation.switchOff()
        ])
    }

    @objc func isSwitchedOn(_ call: CAPPluginCall) {
        call.resolve([
            "value": implementation.isSwitchedOn()
        ])
    }

    @objc func toggle(_ call: CAPPluginCall) {
        call.resolve([
            "value": implementation.toggle()
        ])
    }
}
