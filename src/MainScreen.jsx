import React from 'react';

const MainScreen = () => {
  // 轉場動畫
  const handleStart = (e) => {
    e.preventDefault();
    const overlay = document.getElementById('transition-overlay');
    if (overlay) {
      overlay.style.pointerEvents = 'auto';
      overlay.style.opacity = '1';
      setTimeout(() => {
        window.location.href = 'blank.jsx';
      }, 700);
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(120deg, rgb(186, 219, 152), rgb(155, 208, 176))',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: 0,
      boxShadow: '0 0 20px rgba(0,0,0,0.5)',
      borderRadius: '10px',
    }}>
      <div className="container py-5" style={{
        background: 'linear-gradient(90deg, rgb(186, 219, 152), rgb(155, 208, 176))',
        boxShadow: '0 0 30px rgba(0,0,0,0.3)',
        borderRadius: '80px',
      }}>
        <div className="row justify-content-center">
          <div className="col-md-7">
            <div className="cover-container" style={{
              position: 'relative',
              height: '600px',
              overflow: 'hidden',
              borderRadius: '1rem',
            }}>
              <img src="images/1/container1.png" alt="背景圖" style={{width: '100%', height: '100%', objectFit: 'contain'}} />
              <div className="overlay-content" style={{
                position: 'absolute',
                top: '50%',
                left: 150,
                transform: 'translateY(-50%)',
                minWidth: 220,
                textAlign: 'left',
              }}>
                <div className="row align-items-center">
                  <div className="col-md-5 d-flex align-items-center justify-content-start">
                    <div className="cat-container" style={{
                      backgroundColor: '#fef2cc',
                      border: '12px solid #6bac65',
                      borderRadius: '50px',
                      overflow: 'hidden',
                      maxWidth: 200,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'left',
                      marginLeft: -60,
                    }}>
                      <img src="images/1/Cat1.png" alt="標題圖" style={{maxWidth: '100%', maxHeight: 400}} />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <img src="images/1/破繭而出！.png" alt="破繭而出！" style={{maxWidth: '100%', height: 'auto', marginLeft: -40}} />
                    <img src="images/1/Vector.png" alt="Vector" style={{maxWidth: '100%', height: 'auto', marginLeft: -40}} />
                    <img src="images/1/你的職業教育平台.png" alt="你的職業教育平台" style={{maxWidth: '100%', height: 'auto', marginLeft: -40}} className="mb-3" />
                    <a href="#" id="start-btn" className="btn btn-lg fw-bold px-5 custom-btn" onClick={handleStart} style={{
                      backgroundColor: 'rgb(107, 172, 101)',
                      color: 'white',
                      boxShadow: '0 2px 0 rgba(0,0,0,0.4)',
                      border: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0,
                      marginLeft: -18,
                      height: 60,
                    }}>
                      <img src="images/1/開始.png" alt="開始" style={{maxWidth: '60%', height: 'auto'}} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 轉場特效遮罩 */}
      <div id="transition-overlay" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'radial-gradient(circle at 50% 50%, #b6db98 0%, #9bd0b0 100%)',
        opacity: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        transition: 'opacity 0.7s',
      }}>
        <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)'}}>
          <svg width="80" height="80" viewBox="0 0 50 50">
            <circle cx="25" cy="25" r="20" stroke="#6bac65" strokeWidth="5" fill="none" strokeLinecap="round">
              <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default MainScreen;
