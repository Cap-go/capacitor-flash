import Foundation
import AVFoundation

public class CapacitorFlash: NSObject {

    public func isAvailable() -> Bool {
        let device = AVCaptureDevice.default(for: AVMediaType.video)
        return ((device?.hasTorch ?? false) && (device?.isTorchAvailable ?? false))
    }

    public func switchOn(intensity: Float = 1.0) -> Bool {
        guard self.isAvailable()
        else { return false }

        let device = AVCaptureDevice.default(for: AVMediaType.video)

        do {
            try device!.lockForConfiguration()
            try device?.setTorchModeOn(level: intensity)
            device?.torchMode = .on
            device?.unlockForConfiguration()
            return true
        } catch {
            print("Torch could not be used")
            return false
        }
    }

    public func switchOff() -> Bool {
        guard self.isAvailable()
        else { return false }

        let device = AVCaptureDevice.default(for: AVMediaType.video)

        do {
            try device?.lockForConfiguration()
            device?.torchMode = .off
            device?.unlockForConfiguration()
            return true
        } catch {
            print("Torch could not be used")
            return false
        }
    }

    public func isSwitchedOn() -> Bool {
        guard self.isAvailable()
        else { return false }

        let device = AVCaptureDevice.default(for: AVMediaType.video)
        return (device?.torchMode == AVCaptureDevice.TorchMode.on)
    }

    public func toggle() -> Bool {
        guard self.isAvailable()
        else { return false }

        let device = AVCaptureDevice.default(for: AVMediaType.video)
        if device?.torchMode == AVCaptureDevice.TorchMode.on {
            return self.switchOff()
        } else {
            return self.switchOn()
        }
    }
}
