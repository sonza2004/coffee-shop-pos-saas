import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { post } from "../services/api";

interface UploadResponse {
  id: string;
  status: string;
}

const PaymentUpload: React.FC = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const uploadSlip = async () => {
    if (!file || !orderId) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("orderId", orderId);
      formData.append("slip", file);

      await post<UploadResponse>("/payments/slip", formData);

      navigate(`/order/${orderId}`);
    } catch (err) {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Upload Payment Slip</h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        onClick={uploadSlip}
        disabled={!file || loading}
        className="mt-4 bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload Slip"}
      </button>
    </div>
  );
};

export default PaymentUpload;
