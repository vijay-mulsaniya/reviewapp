import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ReviewCard } from './ReviewCard';


export const GoogleReview = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const logoUrl = import.meta.env.VITE_LOGO_URL;
  const [searchParams] = useSearchParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const id = searchParams.get("id"); // ✅ This should extract `id=1`

  useEffect(() => {
    if (id) {
      fetchCompanyData(id);
    }
  }, [id]);

  const fetchCompanyData = async (id) => {
    try {
      setLoading(true); 
      const url = `${apiUrl}Review/getreview?id=${id}`;
      //const url = `https://localhost:44397/api/Review/getreview?id=${id}`;
      const response = await axios.get(url);
      const reviewData = response.data;
      setCompany(reviewData);
    } catch (error) {
      console.error("Error fetching company:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => {
    fetchCompanyData(id);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const redirectToGoogle = () => {
    window.open(company.googleReviewURL || "https://www.google.com/maps", "_blank");
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!company) return <p className="text-center mt-5">No company data found.</p>;

  return (
    <ReviewCard
      logoURL={logoUrl+company.logoURL}
      companyName={company.companyName}
      reviews={company.reviews}
      onRegenerate={handleRegenerate}
      onLeaveReview={redirectToGoogle}
      onCopy={handleCopy}
    />
  )
}
