import React, { useState } from 'react';

const Dashboard = () => {
  // State to simulate some interactive data
  const [footprint, setFootprint] = useState({ carbon: 4.2, water: 1200, waste: 15 });
  const [posts, setPosts] = useState([
    { id: 1, user: 'EcoWarrior99', text: 'Just planted 3 trees today! 🌱' },
    { id: 2, user: 'GreenSustain', text: 'Any tips for reducing plastic waste in apartments?' }
  ]);
  const [newPost, setNewPost] = useState('');

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    setPosts([{ id: Date.now(), user: 'You', text: newPost }, ...posts]);
    setNewPost('');
  };

  return (
    <div className="container-fluid min-vh-100 bg-light">
      <div className="row">
        
        {/* SIDEBAR NAVIGATION */}
        <nav className="col-md-3 col-lg-2 d-md-block bg-dark sidebar collapse p-3 text-white">
          <div className="position-sticky pt-3">
            <h3 className="h4 text-success mb-4 fw-bold">🍃 Ecoberg</h3>
            <ul className="nav flex-column gap-2">
              <li className="nav-item">
                <a className="nav-link text-white active bg-success rounded px-3 py-2" href="#overview">Overview</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white-50 px-3 py-2" href="#footprint">Footprint</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white-50 px-3 py-2" href="#analysis">Analysis</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white-50 px-3 py-2" href="#community">Community</a>
              </li>
            </ul>
          </div>
        </nav>

        {/* MAIN CONTENT AREA */}
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
          
          {/* Header */}
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2 text-secondary">Welcome back, Eco-Citizen</h1>
            <div className="btn-toolbar mb-2 mb-md-0">
              <button type="button" className="btn btn-sm btn-outline-success">Download Report</button>
            </div>
          </div>

          <div className="row g-4">
            
            {/* 1. FOOTPRINT SECTION */}
            <div className="col-12" id="footprint">
              <div className="card shadow-sm border-0">
                <div className="card-header bg-white border-0 pt-3">
                  <h5 className="card-title text-success fw-bold m-0">Your Environmental Footprint</h5>
                </div>
                <div className="card-body">
                  <div className="row g-3 text-center">
                    <div className="col-md-4">
                      <div className="p-3 bg-danger bg-opacity-10 border border-danger border-opacity-25 rounded">
                        <h6 className="text-danger">Carbon Footprint</h6>
                        <p className="h3 mb-0 fw-bold">{footprint.carbon} <span className="fs-6 fw-normal">tons/yr</span></p>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="p-3 bg-primary bg-opacity-10 border border-primary border-opacity-25 rounded">
                        <h6 className="text-primary">Water Usage</h6>
                        <p className="h3 mb-0 fw-bold">{footprint.water} <span className="fs-6 fw-normal">gal/mo</span></p>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="p-3 bg-warning bg-opacity-10 border border-warning border-opacity-25 rounded">
                        <h6 className="text-warning text-dark">Waste Generated</h6>
                        <p className="h3 mb-0 fw-bold text-dark">{footprint.waste} <span className="fs-6 fw-normal">lbs/mo</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. ANALYSIS SECTION */}
            <div className="col-lg-8" id="analysis">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-header bg-white border-0 pt-3">
                  <h5 className="card-title fw-bold text-secondary m-0">Sustainability Analysis</h5>
                </div>
                <div className="card-body">
                  <p className="text-muted">Here is a breakdown of your progress this month compared to global targets.</p>
                  
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="small fw-semibold">Renewable Energy Adoption</span>
                      <span className="small text-muted">75%</span>
                    </div>
                    <div className="progress" style={{ height: '10px' }}>
                      <div className="progress-bar bg-success" role="progressbar" style={{ width: '75%' }} aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="small fw-semibold">Eco-Friendly Commutes</span>
                      <span className="small text-muted">40%</span>
                    </div>
                    <div className="progress" style={{ height: '10px' }}>
                      <div className="progress-bar bg-info" role="progressbar" style={{ width: '40%' }} aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                  </div>

                  <div className="p-3 bg-light rounded mt-4">
                    <h6>💡 Ecoberg Recommendation</h6>
                    <small className="text-muted">Your water consumption spiked by 5% this week. Consider checking for leaks or shortening your showers by 2 minutes to get back on track!</small>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. NEWS SECTION */}
            <div className="col-lg-4">
              <div className="card h-100 shadow-sm border-0">
                <div className="card-header bg-white border-0 pt-3">
                  <h5 className="card-title fw-bold text-secondary m-0">Eco News</h5>
                </div>
                <div className="card-body d-flex flex-column gap-3">
                  <div className="border-bottom pb-2">
                    <span className="badge bg-success mb-1">Global</span>
                    <h6 className="mb-1"><a href="#" className="text-decoration-none text-dark fw-bold">New Solar Grid Technology Breaks Records</a></h6>
                    <small className="text-muted">2 hours ago</small>
                  </div>
                  <div className="border-bottom pb-2">
                    <span className="badge bg-info mb-1">Policy</span>
                    <h6 className="mb-1"><a href="#" className="text-decoration-none text-dark fw-bold">City Council Approves 500 New Bike Lanes</a></h6>
                    <small className="text-muted">5 hours ago</small>
                  </div>
                  <div>
                    <span className="badge bg-warning text-dark mb-1">Climate</span>
                    <h6 className="mb-1"><a href="#" className="text-decoration-none text-dark fw-bold">Ocean Cleanup Initiative Reaches New Milestone</a></h6>
                    <small className="text-muted">1 day ago</small>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. DISCUSSION & FORMS SECTION */}
            <div className="col-12" id="community">
              <div className="card shadow-sm border-0">
                <div className="card-header bg-white border-0 pt-3">
                  <h5 className="card-title fw-bold text-secondary m-0">Community Discussion</h5>
                </div>
                <div className="card-body">
                  <div className="row g-4">
                    
                    {/* The Form */}
                    <div className="col-md-5 border-end-md">
                      <form onSubmit={handlePostSubmit}>
                        <div className="mb-3">
                          <label htmlFor="forumPost" className="form-label fw-semibold">Share an eco-update or question</label>
                          <textarea 
                            className="form-control" 
                            id="forumPost" 
                            rows="3" 
                            placeholder="What's on your mind?..."
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                          ></textarea>
                        </div>
                        <button type="submit" className="btn btn-success w-100">Post to Feed</button>
                      </form>
                    </div>

                    {/* The Feed */}
                    <div className="col-md-7">
                      <div className="d-flex flex-column gap-3" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                        {posts.map((post) => (
                          <div key={post.id} className="p-3 bg-light rounded border-start border-success border-3">
                            <div className="d-flex justify-content-between mb-1">
                              <span className="fw-bold small">@{post.user}</span>
                              <span className="text-muted small">Just now</span>
                            </div>
                            <p className="mb-0 small">{post.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;