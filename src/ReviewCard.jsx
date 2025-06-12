import "./assets/ReviewCard.css"

export const ReviewCard = ({ logoURL, companyName, reviews = [], onRegenerate, onLeaveReview, onCopy }) => {
    return (
        <div className='parent'>
            <div className="card col-xxl-4">
                <div className="card-body ">
                    <img src={logoURL} alt="Logo" />
                    <h1 className="card-title text-primary">{companyName}</h1>

                    {reviews.map((rev, idx) => (
                        <div key={idx} className="review-block">
                            <div className="review-text">{rev}</div>
                            <button className="btn btn-sm btn-success copy-btn" onClick={() => onCopy(rev)}>
                                Copy
                            </button>
                        </div>
                    ))}
                    
                    <button className="btn btn-primary" onClick={onRegenerate}>Regenerate Review</button>
                    <button className="btn btn-primary ms-2" onClick={onLeaveReview}>Leave a Review</button>
                </div>
            </div>
        </div>
    )
}
