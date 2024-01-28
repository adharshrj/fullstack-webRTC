import React, { useEffect, useRef } from "react";

const VideoPlayer: React.FC<{ stream?: MediaStream }> = ({ stream }) => {
  const vidRef = useRef<HTMLVideoElement>(null);

  console.log({ stream });

  useEffect(() => {
    if (vidRef.current && stream) {
      vidRef.current.srcObject = stream;
    }
  }, [stream]);
  return stream ? (
    <video className="rounded-md" ref={vidRef} autoPlay muted />
  ) : (
    <div>Loading...</div>
  );
};

export default VideoPlayer;
