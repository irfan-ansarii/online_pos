import React from "react";
import Webcam from "react-webcam";
import Quagga from "quagga";

const Scanner = ({ open, setOpen }) => {
  const webcamRef = React.useRef(null);

  React.useEffect(() => {
    Quagga.init(
      {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: webcamRef.current.video,
        },

        decoder: {
          readers: ["ean_reader"],
        },
      },

      (err: any) => {
        if (err) {
          console.log("error initializing");
          return;
        }
        Quagga.start();
      }
    );

    Quagga.onDetected((result: any) => {
      console.log("Scanned Barcode:", result.codeResult.code);
      setOpen(false);
    });
    return () => {
      Quagga.stop();
    };
  }, []);

  return (
    <div className="relative">
      <Webcam
        ref={webcamRef}
        width={800}
        height={800}
        videoConstraints={{ aspectRatio: 1.4 }}
      />
    </div>
  );
};

export default Scanner;
