import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, X } from 'lucide-react'
import { clsx } from 'clsx'
import { formatFileSize } from '../../utils/helpers'

export default function UploadZone({ onFile, disabled }) {
  const [file, setFile] = useState(null)

  const onDrop = useCallback(
    (accepted) => {
      if (accepted[0]) {
        setFile(accepted[0])
        onFile(accepted[0])
      }
    },
    [onFile]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    disabled,
  })

  const removeFile = (e) => {
    e.stopPropagation()
    setFile(null)
    onFile(null)
  }

  return (
    <div
      {...getRootProps()}
      className={clsx(
        'border-2 border-dashed rounded-xl p-10 text-center transition-all duration-200 cursor-pointer',
        isDragActive
          ? 'border-indigo-500 bg-indigo-950/30'
          : file
          ? 'border-green-600 bg-green-950/20'
          : 'border-slate-700 bg-slate-900/50 hover:border-indigo-600 hover:bg-indigo-950/10',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <input {...getInputProps()} />

      {file ? (
        <div className="flex items-center justify-center gap-3">
          <FileText className="w-10 h-10 text-green-400 flex-shrink-0" />
          <div className="text-left">
            <p className="font-medium text-slate-100 truncate max-w-xs">{file.name}</p>
            <p className="text-sm text-slate-400">{formatFileSize(file.size)}</p>
          </div>
          {!disabled && (
            <button onClick={removeFile} className="ml-2 text-slate-500 hover:text-red-400 transition-colors">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <Upload className="w-12 h-12 text-slate-500 mx-auto" />
          <div>
            <p className="text-slate-300 font-medium">
              {isDragActive ? 'Drop the PDF here' : 'Drag and drop a PDF catalog'}
            </p>
            <p className="text-slate-500 text-sm mt-1">or click to browse — PDF only, up to 50 MB</p>
          </div>
        </div>
      )}
    </div>
  )
}
