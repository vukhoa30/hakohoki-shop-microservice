import React from "react";

const input = ({
  input,
  label,
  placeholder,
  required,
  showError,
  showErrorIf,
  type,
  meta: { touched, error }
}) => (
  <div className="form-group">
    {label && <label>{label}</label>}
    {type === "textarea" ? (
      <textarea
        {...input}
        type="text"
        className="form-control border-input"
        placeholder={placeholder}
        rows={7}
        required={required}
      />
    ) : (
      <input
        {...input}
        type={type}
        className="form-control border-input"
        placeholder={placeholder}
        required={required}
      />
    )}
    {showError &&
      (showErrorIf ? showErrorIf(error) : true) && (
        <small style={{ color: "red" }}>{error}</small>
      )}
  </div>
);

export default input;
