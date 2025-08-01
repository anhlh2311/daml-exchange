import "./empty.css";

const Empty = () => {
  return (
    <div className="empty-wrapper">
      <img
        src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
        alt="Empty"
        className="w-40 h-40 mb-6 opacity-80"
      />
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Empty data</h2>
    </div>
  );
};

export default Empty;
