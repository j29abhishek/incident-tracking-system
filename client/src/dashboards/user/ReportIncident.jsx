import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import "../../css/forms.css";
const ReportIncident = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    service: "",
  });

  const [message, setMessage] = useState("");

  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await api.get("/services");
      setServices(res.data.services);
    } catch (error) {
      console.log("Error in fetching services: ", error.message);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const res = await api.post("/incidents/report", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(res.data.message);

      setForm({
        title: "",
        description: "",
        service: "",
      });
    } catch (error) {
      setMessage(error.response?.data?.message);
    }
  };

  return (
    <div className="incident-form-wrapper">
      <form onSubmit={handleSubmit} className="incident-form">
        <div className="inputs">
          <div className="input">
            <label htmlFor="">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter incident title"
              required
            />
          </div>

          <div className="input">
            <label htmlFor="">Description</label>
            <textarea
              name="description"
              id="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the issue"
              rows={5}
              required
            />
          </div>

          <div className="input">
            <label htmlFor="">Select service on which you facing issue.</label>
            <select
              name="service"
              id=""
              value={form.service}
              onChange={handleChange}
            >
              <option value="">Select service</option>
              {services.map((item) => {
                return <option value={item._id}>{item.name}</option>;
              })}
            </select>
          </div>
        </div>

        <p>{message}</p>
        <button type="submit" className="incident-submit-btn">
          Report Incident
        </button>
      </form>
    </div>
  );
};

export default ReportIncident;
