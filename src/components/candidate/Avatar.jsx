import React, { useState, useEffect } from 'react'
import { supabase } from '../../services/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { toast } from 'react-toastify'
import { UploadCloud, Loader2 } from 'lucide-react'

export default function Avatar({ url, onUpload }) {
  const { user } = useAuth()
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (url) {
      downloadImage(url)
    }
  }, [url])

  const downloadImage = async (path) => {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path)
      if (error) {
        throw error
      }
      const url = URL.createObjectURL(data)
      setAvatarUrl(url)
    } catch (error) {
      console.log('Error downloading image: ', error.message)
    }
  }

  const uploadAvatar = async (event) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}.${fileExt}`
      const filePath = `${fileName}`

      let { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) {
        throw uploadError
      }

      onUpload(filePath)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="w-40 h-40 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex items-center justify-center">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-500">No photo</span>
        )}
      </div>
      <div>
        <label
          htmlFor="avatar-upload"
          className="cursor-pointer bg-gray-100 dark:bg-gray-600 dark:hover:bg-gray-500 hover:bg-gray-200 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-md inline-flex items-center transition-colors"
        >
          {uploading ? <Loader2 className="animate-spin mr-2" /> : <UploadCloud className="mr-2" />}
          <span>{uploading ? 'Uploading...' : 'Upload Photo'}</span>
        </label>
        <input
          id="avatar-upload"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  )
} 