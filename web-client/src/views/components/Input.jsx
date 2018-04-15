import React from "react";

const input = ({
  input,
  label,
  placeholder,
  type,
  meta: { touched, error }
}) => (
  <div className="form-group">
    {label && <label>{label}</label>}
    {type === "textarea" ? (
      <textarea
        {...input}
        type="text"
        className="form-control"
        placeholder={placeholder}
        rows={7}
      />
    ) : (
      <input {...input} type={type} className="form-control" placeholder={placeholder} />
    )}
  </div>
);

export default input;
