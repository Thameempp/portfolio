import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ResearchLayout from '../layouts/ResearchLayout'
import ResearchHome from './research/ResearchHome'
import FileViewer from '../components/research/FileViewer'

const Research = () => {
  return (
    <Routes>
      <Route element={<ResearchLayout />}>
        <Route index element={<ResearchHome />} />
        <Route path="*" element={<FileViewer />} />
      </Route>
    </Routes>
  )
}

export default Research
