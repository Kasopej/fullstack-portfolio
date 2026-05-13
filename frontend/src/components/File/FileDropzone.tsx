import { useState } from 'react'

export function FileDropzone() {
  const [dropzoneActive, setDropzoneActive] = useState(false)
  return (
    <div
      className={`border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer ${dropzoneActive ? 'bg-gray-100' : ''}`}
      onDragOver={(e) => {
        e.preventDefault()
        setDropzoneActive(true)
      }}
      onDragLeave={(e) => {
        e.preventDefault()
        setDropzoneActive(false)
      }}
      onDrop={(e) => {
        e.preventDefault()
        setDropzoneActive(false)
      }}
    >
      <p className="text-gray-500">Drag and drop files here</p>
    </div>
  )
}
