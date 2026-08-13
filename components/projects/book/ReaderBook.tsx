'use client'

import { useEffect, useState } from 'react'
import ReaderBookCore from './ReaderBook.jsx'

export default function ReaderBook(props) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(Boolean(props.active))
  }, [props.active, props.project.id])

  return <ReaderBookCore {...props} active={Boolean(props.active && ready)} />
}
