import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

const QRScanner = ({ onClose }) => {
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState(null);

  useEffect(() => {
    // Initialize Scanner
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    scanner.render(onScanSuccess, onScanFailure);

    function onScanSuccess(decodedText) {
      // Stop scanning after success
      scanner.clear();
      setScanResult(decodedText);

      // LOGIC: Handle the scanned text
      // We assume the QR code contains either:
      // 1. A full URL (e.g., https://safehp.app/app?userId=anita104)
      // 2. A simple ID string (e.g., "anita_sector104")
      
      let targetUrl = "";
      
      try {
        const url = new URL(decodedText);
        // If it's a full URL, use the pathname and search
        targetUrl = url.pathname + url.search;
      } catch (_) {
        // If it's just text (ID), construct the URL manually
        // Defaulting to a standard distributor for simple IDs
        targetUrl = `/app?userId=${encodeURIComponent(decodedText)}&distributorId=Indane_General`;
      }

      navigate(targetUrl);
    }

    function onScanFailure(error) {
      // console.warn(`Code scan error = ${error}`);
    }

    // Cleanup function
    return () => {
      scanner.clear().catch(error => console.error("Failed to clear scanner. ", error));
    };
  }, [navigate]);

  return (
    <div className="fixed inset-0 z-[70] bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl overflow-hidden relative">
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 z-10 bg-black/50 text-white p-2 rounded-full"
        >
          <X size={20} />
        </button>
        
        <div className="p-4 text-center bg-background-dark text-white">
          <h3 className="font-bold">Scan Cylinder QR</h3>
          <p className="text-xs text-text-muted">Point camera at the QR code</p>
        </div>
        
        {/* The Library will render the video stream here */}
        <div id="reader" className="w-full h-auto bg-black"></div>
      </div>
    </div>
  );
};

export default QRScanner;