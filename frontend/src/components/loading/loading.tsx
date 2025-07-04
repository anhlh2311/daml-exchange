import "./loading.css"; // import file CSS riêng

const LoadingScreen = () => {
  return (
    <div className="loading-container">
      <img
        src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f504.png"
        alt="Loading"
        className="loading-icon"
      />
      <p className="loading-text">Đang tải dữ liệu...</p>
    </div>
  );
};

export default LoadingScreen;
