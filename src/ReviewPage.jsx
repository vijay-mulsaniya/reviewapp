// src/ReviewPage.js
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const ReviewPage = () => {
  const [searchParams] = useSearchParams();

  const [company, setCompany] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  //const id = searchParams.get("inputParameterValues");
  const id = searchParams.get("id"); // ✅ This should extract `id=1`

  useEffect(() => {
    debugger;
    console.log('TEST...TEST>>>');
    if (id) {
      fetchCompanyData(id);
    }
  }, [id]);

  const fetchCompanyData = async (id) => {
    try {
      const url = `http://api.vijaytutor.com/api/Account/CallSp?spName=spGetGoogleUsers&parameters=Id&inputParameterValues=${id}`;
      const response = await axios.get(url);
      const companyData = response.data.resultObject[0];
      setCompany(companyData);
      generatePromptAndFetchReviews(companyData);
    } catch (error) {
      console.error("Error fetching company:", error);
    }
  };

  const generatePromptAndFetchReviews = async (data) => {
    const prompt = `Generate 3 positive Google review suggestions for the following business:
        Company Name: ${data.companyName}
        Description: ${data.companyDiscription}
        Keywords: ${data.keyWords} 
        Output the reviews as a JSON array of strings.`;

    try {
      setLoading(true);
      const res = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyB1kBEMncvu1Oxyo06yVJihMABxFFOobDA`,
        {
          contents: [{ parts: [{ text: prompt }] }]
        }
      );

      const text = res.data.candidates[0].content.parts[0].text;
      const jsonText = text.match(/\[([\s\S]*)\]/)?.[0]; // Extract JSON part
      setReviews(JSON.parse(jsonText));
    } catch (error) {
      console.error("Error generating reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => {
    console.log('Clicked....');
    if (company) generatePromptAndFetchReviews(company);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const redirectToGoogle = () => {
    window.open(company.googleReviewURL || "https://www.google.com/maps", "_blank");
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      {company && (
        <>
          <img src={company.logoURL} alt="Logo" width="100" />
          <h2>{company.companyName}</h2>
        </>
      )}
      {loading ? (
        <p>Loading reviews...</p>
      ) : (
        reviews.map((rev, idx) => (
          <div key={idx} style={{ margin: "10px 0", padding: 10, border: "1px solid #ccc", borderRadius: 5 }}>
            <p>{rev}</p>
            <button onClick={() => handleCopy(rev)}>Copy</button>
          </div>
        ))
      )}
      <div style={{ marginTop: 20 }}>
        <button onClick={handleRegenerate}>Regenerate</button>
        <button onClick={redirectToGoogle} style={{ marginLeft: 10 }}>Leave a Review</button>
      </div>
    </div>
  );
};

export default ReviewPage;
