import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';

export const Home = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const logoUrl = import.meta.env.VITE_LOGO_URL;
  const hasFetched = useRef(false); // Moved outside useEffect
  const [loading, setLoading] = useState(false);
  const [promts, setPrompts] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [logoFile, setLogoFile] = useState(null);

  const [formData, setFormData] = useState({
    companyName: '',
    companyDescription: '',
    keywords: '',
    googleReviewURL: '',
    googleMapURL: '',
    selectedPromptId: '',
    logoFile: null
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      logoFile: e.target.files[0]
    }));
  };

const handleSave = async () => {
  if (!formData.logoFile) {
    alert('Please upload a logo file first.');
    return;
  }

  const params = {
    CompanyName: formData.companyName,
    CompanyDiscription: formData.companyDescription,
    KeyWords: formData.keywords,
    GoogleMapURL: formData.googleMapURL,
    GoogleReviewURL: formData.googleReviewURL,
    ReviewCount: 3,
    PromptId: formData.selectedPromptId
  };

  const form = new FormData();
  form.append('LogoFile', formData.logoFile, formData.logoFile.name);

  try {
    const response = await axios.post(
      'https://localhost:44397/api/Review/RegisterGoogleUser',
      form,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        params,
        responseType: 'blob' // << THIS IS IMPORTANT
      }
    );

    // Create a blob from the response data
    const blob = new Blob([response.data], { type: response.headers['content-type'] });

    // Generate download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;

    // Optional: Extract filename from content-disposition header
    const contentDisposition = response.headers['content-disposition'];
    let fileName = 'downloaded_file';

    if (contentDisposition && contentDisposition.includes('filename=')) {
      fileName = contentDisposition
        .split('filename=')[1]
        .split(';')[0]
        .replace(/"/g, '')
        .trim();
    }

    link.download = fileName;
    document.body.appendChild(link);
    link.click();

    // Cleanup
    link.remove();
    window.URL.revokeObjectURL(url);

    alert('Saved and downloaded successfully!');
  } catch (error) {
    console.error(error);
    alert('Error occurred.');
  }
};

  useEffect(() => {
    if (!hasFetched.current) {
      fetchPrompt();
      hasFetched.current = true;
    }
  }, []);

  const handleSelectionChange = (e) => {
    const id = parseInt(e.target.value);
    setSelectedId(id);
    const promptData = promts.find(p => p.id === id);
    setSelectedPrompt(promptData ? promptData.prompt : '');
    setFormData((prev) => ({
      ...prev,
      selectedPromptId: id // ✅ Properly update selectedPromptId
    }));
  };

  const fetchPrompt = async () => {
    try {
      debugger;
      setLoading(true);
      const url = `${apiUrl}Account/CallSp?spName=spGetAllPrompt`;
      //const url = `https://localhost:44397/api/Account/CallSp?spName=spGetAllPrompt`;
      const response = await axios.get(url);
      const resultObject = response.data.resultObject;
      setPrompts(resultObject);
    } catch (error) {
      console.error("Error fetching company:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3">
      <h1>Google Review Auto Generate App</h1>
      <div className="card col-lg-4 offset-lg-4">
        <div className="card-body">
          <h4 className="card-title">Register New Company</h4>
          <form>
            <div className="mb-3">
              <label className="form-label" htmlFor="companyName">CompanyName</label>
              <input id="companyName" className="form-control" type="text" value={formData.companyName} onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="companyDescription">Company Discription</label>
              <textarea id="companyDescription" className="form-control" value={formData.companyDescription} onChange={handleChange}></textarea>
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="keywords">Key-words</label>
              <textarea id="keywords" className="form-control" value={formData.keywords} onChange={handleChange} ></textarea>
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="googleReviewURL">Google Review URL</label>
              <input id="googleReviewURL" className="form-control" type="text" value={formData.googleReviewURL} onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="googleMapURL">Google Map URL</label>
              <input id="googleMapURL" className="form-control" type="text" value={formData.googleMapURL} onChange={handleChange} />
            </div>

            <div className="mb-3">
              <label className="form-label" htmlFor="selectPrompt">Select Prompt</label>

              <select className="form-select" value={formData.selectedPromptId} onChange={handleSelectionChange}>
                <option value="">-- Select ID --</option>
                {promts.map(prompt => (
                  <option key={prompt.id} value={prompt.id}>
                    {prompt.id}
                  </option>
                ))}
              </select>

              {selectedPrompt && (
                <div style={{ marginTop: '20px', whiteSpace: 'pre-wrap' }}>
                  <strong>Selected Prompt:</strong>
                  <p>{selectedPrompt}</p>
                </div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="companyLogo">Company Logo</label>
              <input className="form-control" type="file" accept="image/*" onChange={handleFileChange} id="companyLogo" />
            </div>
            <button className="btn btn-primary" onClick={handleSave} type="button">Save</button>
          </form>
        </div>
      </div>
    </div>
  )
}
