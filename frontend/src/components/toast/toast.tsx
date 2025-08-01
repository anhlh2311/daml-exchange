import { useToast } from "context/toastStore";
import React from "react";
import "./toast.css";

const ToastNotification: React.FC = () => {
  const { message, show, hideError } = useToast();
  const isError = message.startsWith("Error:");
  const isSuccess = message.startsWith("Success:");

  const bgClass = isError ? "bg-danger" : isSuccess ? "bg-success" : "bg-info";
  const headerText = isError ? "Error" : isSuccess ? "Success" : "Info";

  return (
    <div className="toast-container">
      <div
        className={`toast ${bgClass} ${show ? "show" : ""}`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div className="toast-header">
          <strong>{headerText}</strong>
          <button
            type="button"
            className="btn-close"
            onClick={hideError}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="toast-body">{message}</div>
      </div>
    </div>
  );
};

export default ToastNotification;
