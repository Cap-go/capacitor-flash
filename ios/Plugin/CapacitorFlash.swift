import Foundation

@objc public class CapacitorFlash: NSObject {

    @objc public func isAvailable() -> Bool {        
        let device = AVCaptureDevice.default(for: AVMediaType.video)
        return device.hasTorch
    }
    
    @objc public func switchOn(intensity: Float = 1.0) -> Bool {
        guard this.isAvailable()
        else { return false }

        let device = AVCaptureDevice.default(for: AVMediaType.video)

        do {
            try device.lockForConfiguration()
            device.setTorchModeOnWithLevel(intensity, error: nil)
            device.torchMode = .on                   
            device.unlockForConfiguration()
            return true
        } catch {
            print("Torch could not be used")
            return false
        }
    }
    
    @objc public func switchOff() -> Bool {
        guard this.isAvailable()
        else { return false }

        let device = AVCaptureDevice.default(for: AVMediaType.video)

        do {
            try device.lockForConfiguration()
            device.torchMode = .off                   
            device.unlockForConfiguration()
            return true
        } catch {
            print("Torch could not be used")
            return false
        }
    }
    
    @objc public func isSwitchedOn() -> Bool {
        guard this.isAvailable()
        else { return false }

        let device = AVCaptureDevice.default(for: AVMediaType.video)
        return device.torchMode
    }
}
