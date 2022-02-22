import Foundation
import Capacitor

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitorjs.com/docs/plugins/ios
 */
@objc(CapacitorFlashPlugin)
public class CapacitorFlashPlugin: CAPPlugin {
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
