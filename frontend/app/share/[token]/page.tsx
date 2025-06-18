"use client"

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function SharedFilePage() {
  const { token } = useParams();
  const [fileInfo, setFileInfo] = useState<any>(null);

  useEffect(() => {
    const fetchFile = async () => {
      const res = await fetch(`/api/files/share/${token}`);
      if (res.ok) {
        setFileInfo(await res.blob());
        // OR: set metadata if your API sends it
      }
    };
    fetchFile();
  }, [token]);

  return (
    <div className="p-6 text-center">
      {fileInfo ? (
        <a
          href={`/api/files/share/${token}`}
          className="bg-green-500 text-white px-4 py-2 rounded"
          download
        >
          Download File
        </a>
      ) : (
        <p>Loading file info...</p>
      )}
    </div>
  );
}
