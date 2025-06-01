import { useSelector,useDispatch } from "react-redux";
import { RotateCcw, X } from "lucide-react";
import { useEffect, useState,useRef } from "react";
import { Scanner, useDevices } from "@yudiel/react-qr-scanner";
import Cookies from "js-cookie";
export default function QRCodeScanner({setScanResult}) {
  const [isScanning, setIsScanning] = useState(true);
  const defaultDeviceId = Cookies.get('deviceId');
  const [selectedDeviceId, setSelectedDeviceId] = useState(defaultDeviceId || null);
  const devices = useDevices();


  useEffect(() => {
    if (devices.length > 0) {
      setSelectedDeviceId(defaultDeviceId || null);
      if (!selectedDeviceId) {
        setSelectedDeviceId(devices[0].deviceId);
      }
    }
  }, [devices]);


  const handleScan = (result) => {
    if (!result?.[0]?.rawValue) return;
    setScanResult(result[0].rawValue);

    setIsScanning(false);
    Cookies.set('deviceId', selectedDeviceId, { expires: 30 });
  };

  const handleError = (error) => {
    console.error("QR Scanner error:", error);
  };

  const resetScanner = () => {
    setScanResult(null);
    setIsScanning(true);
  };

  const handleDeviceChange = (e) => {
    setSelectedDeviceId(e.target.value);
  };
  
  
  return (
    <div className="flex justify-center items-center gap-3 flex-col bg-base-300">
      <Scanner
        constraints={{ deviceId: selectedDeviceId }}
        onScan={handleScan}
        paused={!isScanning}
        formats={["aztec", "code_128", "code_39", "code_93", "codabar", "databar", "databar_expanded", "data_matrix", "dx_film_edge", "ean_13", "ean_8", "itf", "maxi_code", "micro_qr_code", "pdf417", "qr_code", "rm_qr_code", "upc_a", "upc_e", "linear_codes", "matrix_codes"]}
        onError={handleError}
      />
      {devices.length > 1 && (
        <select
          value={selectedDeviceId || ""}
          onChange={handleDeviceChange}
          className="select w-full"
        >
          {devices.map((device, index) => (
            <option key={index} value={device.deviceId}>
              Selected:&nbsp;
              {device.label || `Camera ${index + 1}`}
            </option>
          ))}
        </select>
      )}

      {isScanning ? (
        <p className="text-center text-gray-600">
          Position a QR code in front of your camera to scan it
        </p>
      ) : (
        <button onClick={resetScanner} className="btn btn-accent min-w-36">
          <RotateCcw size={18} />
          Scan Again
        </button>
      )}
    </div>
  );
  
}