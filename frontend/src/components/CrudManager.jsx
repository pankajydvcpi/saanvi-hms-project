import { useEffect, useState } from "react";
import API from "../api/api";
import toast from "react-hot-toast";
import { Edit, Trash2, Search, X } from "lucide-react";

function CrudManager({ title, endpoint, fields, columns }) {
  const emptyForm = fields.reduce((acc, field) => {
    acc[field.name] = "";
    return acc;
  }, {});

  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await API.get(endpoint);
      setItems(res.data);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [endpoint]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await API.put(`${endpoint}/${editingId}`, form);
        toast.success(`${title} updated successfully`);
      } else {
        await API.post(endpoint, form);
        toast.success(`${title} added successfully`);
      }

      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
      fetchItems();
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditingId(item._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this?");

    if (!confirmDelete) return;

    try {
      await API.delete(`${endpoint}/${id}`);
      toast.success("Deleted successfully");
      fetchItems();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const filteredItems = items.filter((item) =>
    Object.values(item).join(" ").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="crud-section">
      <div className="section-header">
        <div>
          <h2>{title} Management</h2>
          <p>Manage hospital {title.toLowerCase()} records</p>
        </div>

        <button className="primary-btn" onClick={() => setShowForm(true)}>
          Add {title}
        </button>
      </div>

      <div className="search-box">
        <Search size={18} />
        <input
          type="text"
          placeholder={`Search ${title.toLowerCase()}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3>{editingId ? `Edit ${title}` : `Add ${title}`}</h3>
              <button
                className="close-btn"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setForm(emptyForm);
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="form-grid">
              {fields.map((field) => (
                <div className="form-group" key={field.name}>
                  <label>{field.label}</label>

                  {field.type === "select" ? (
                    <select
                      name={field.name}
                      value={form[field.name] || ""}
                      onChange={handleChange}
                      required={field.required}
                    >
                      <option value="">Select {field.label}</option>
                      {field.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type || "text"}
                      name={field.name}
                      value={form[field.name] || ""}
                      onChange={handleChange}
                      placeholder={field.label}
                      required={field.required}
                    />
                  )}
                </div>
              ))}

              <button className="primary-btn full-width" type="submit">
                {editingId ? "Update" : "Save"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="table-card">
        {loading ? (
          <p className="empty-text">Loading...</p>
        ) : filteredItems.length === 0 ? (
          <p className="empty-text">No records found</p>
        ) : (
          <table>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key}>{col.label}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredItems.map((item) => (
                <tr key={item._id}>
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.key === "status" ? (
                        <span className={`badge ${item[col.key]?.toLowerCase().replaceAll(" ", "-")}`}>
                          {item[col.key]}
                        </span>
                      ) : (
                        item[col.key]
                      )}
                    </td>
                  ))}

                  <td>
                    <div className="action-buttons">
                      <button className="edit-btn" onClick={() => handleEdit(item)}>
                        <Edit size={16} />
                      </button>

                      <button className="delete-btn" onClick={() => handleDelete(item._id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default CrudManager;