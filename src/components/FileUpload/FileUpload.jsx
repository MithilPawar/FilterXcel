const FileUpload = ({ getRootProps, getInputProps }) => {
  return (
    <div
      {...getRootProps()}
      className="mt-8 text-center border-2 border-dashed p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition"
    >
      <input {...getInputProps()} />
      <p className="text-lg">
        📂 Drag & Drop or Click here to upload an Excel file
      </p>
    </div>
  );
};

export default FileUpload;
