import React from "react";

export default function PostForm(props) {
  return (
    <div id="form-container">
      <form onSubmit={props.submit} id="form">
        <div id="inner-fields">
          <div>
            <h1 id="form-title">Job Details</h1>
            <h2 id="form-description">Fill in the form below</h2>
          </div>

          <input
            name="company_name"
            type="text"
            placeholder="Company Name"
            required
          />
          <input
            name="job_title"
            type="text"
            placeholder="Job Title"
            required
          />
          <input
            name="skills"
            type="text"
            placeholder="Required Skills"
            required
          />
          <input
            name="salary"
            type="number"
            min="0"
            placeholder="Salary in USD (optional)"
          />
          <select name="category">
            <option defaultValue value="Software Development">
              Software Development
            </option>
            <option value="Customer Service">Customer Service</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
            <option value="Product">Product</option>
            <option value="Business">Business</option>
            <option value="Data">Data</option>
            <option value="DevOps / Sysadmin">DevOps / Sysadmin</option>
            <option value="Finance / Legal">Finance / Legal</option>
            <option value="Human Resources">Human Resources</option>
            <option value="QA">Quality Assurance</option>
            <option value="Writing">Writing</option>
            <option value="All others">All Others</option>
          </select>

          <select name="job_type">
            <option>Full time</option>
            <option>Part time</option>
            <option>Contract</option>
          </select>
        </div>

        <div id="submit-description">
          <div id="radio">
            <input
              type="radio"
              id="Worldwide"
              value="worldwide"
              name="location"
              label="Worldwide"
            />
            <input
              type="radio"
              id="USA"
              value="usa"
              name="location"
              label="USA"
            />
            <input
              type="radio"
              id="Others"
              value="others"
              name="location"
              label="Others"
            />
          </div>
          <textarea
            name="description"
            required
            placeholder="Job Descriptions - Markdown Compatible"
          />
        </div>
        <button type="submit">Post Job</button>
      </form>
    </div>
  );
}
