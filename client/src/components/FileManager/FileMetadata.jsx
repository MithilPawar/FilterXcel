import { useSelector } from "react-redux";
import { FileText, Calendar, Hash, Info, HardDrive } from "lucide-react";

const FileMetadata = () => {
  const fileMetadata = useSelector((state) => state.file.fileMetadata);

  if (!fileMetadata) return null;

  return (
    <div className="mt-4 p-4 border rounded-xl bg-white shadow-md">
      <h3 className="text-xl font-semibold flex items-center gap-2 mb-3">
        📄 File Details
      </h3>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600" />
          <span className="font-medium">Filename:</span>
          <span className="text-gray-700 truncate">{fileMetadata.filename}</span>
        </div>

        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-green-600" />
          <span className="font-medium">Content Type:</span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-green-100 text-green-800 text-xs">
            {fileMetadata.contentType}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-indigo-600" />
          <span className="font-medium">Size:</span>
          <span className="text-gray-700">{(fileMetadata.size / 1024).toFixed(2)} KB</span>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-purple-600" />
          <span className="font-medium">Uploaded:</span>
          <span className="text-gray-700">{new Date(fileMetadata.uploadedAt).toLocaleString()}</span>
        </div>

        <div className="flex items-center gap-2">
          <Hash className="w-4 h-4 text-orange-600" />
          <span className="font-medium">File ID:</span>
          <span className="text-gray-700">{fileMetadata.fileId}</span>
        </div>
      </div>
    </div>
  );
};

export default FileMetadata;
