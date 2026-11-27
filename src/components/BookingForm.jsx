import { useState } from "react";
import { supabase } from "../supabase";

function BookingForm({ match, onBooked }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    stand: "general",
    quantity: 1,
  });
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  if (!match) {
    return <p className="selected">Click Book on a match to start booking.</p>;
  }

  const price = match[form.stand + "_price"];
  const quantity = Number(form.quantity) || 0;
  const total = price * quantity;

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (quantity > match.available_seats) {
      setStatus("Only " + match.available_seats + " seats left for this match.");
      return;
    }

    setSaving(true);
    setStatus("");

    // 1. Insert the booking
    const { error: insertError } = await supabase.from("bookings").insert({
      match_id: match.id,
      customer_name: form.name,
      email: form.email,
      phone: form.phone,
      stand: form.stand,
      quantity: quantity,
      total_amount: total,
    });

    if (insertError) {
      setStatus("Booking failed: " + insertError.message);
      setSaving(false);
      return;
    }

    // 2. Reduce the available seats
    const { error: updateError } = await supabase
      .from("matches")
      .update({ available_seats: match.available_seats - quantity })
      .eq("id", match.id);

    if (updateError) {
      setStatus("Booking saved, but seats were not updated: " + updateError.message);
    } else {
      setStatus(
        "Booked " + quantity + " ticket(s) for " + match.teams +
        ". Total ₹" + total.toLocaleString("en-IN")
      );
    }

    setForm({ ...form, name: "", email: "", phone: "", quantity: 1 });
    setSaving(false);
    onBooked();
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <p className="selected">Selected match: {match.teams}</p>

      <label htmlFor="stand">Stand Category</label>
      <select id="stand" name="stand" value={form.stand} onChange={handleChange}>
        <option value="general">General (₹{match.general_price})</option>
        <option value="premium">Premium (₹{match.premium_price})</option>
        <option value="vip">VIP (₹{match.vip_price})</option>
      </select>

      <label htmlFor="quantity">Number of Tickets</label>
      <input
        type="number"
        id="quantity"
        name="quantity"
        min="1"
        max="10"
        value={form.quantity}
        onChange={handleChange}
        required
      />

      <label htmlFor="name">Full Name</label>
      <input
        type="text"
        id="name"
        name="name"
        minLength="3"
        value={form.name}
        onChange={handleChange}
        required
      />

      <label htmlFor="email">Email</label>
      <input
        type="email"
        id="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        required
      />

      <label htmlFor="phone">Phone Number (10 digits)</label>
      <input
        type="tel"
        id="phone"
        name="phone"
        pattern="[0-9]{10}"
        title="Enter exactly 10 digits"
        value={form.phone}
        onChange={handleChange}
        required
      />

      <p className="total">Total: ₹{total.toLocaleString("en-IN")}</p>

      <button type="submit" disabled={saving}>
        {saving ? "Booking..." : "Confirm Booking"}
      </button>

      {status && <p className="status">{status}</p>}
    </form>
  );
}

export default BookingForm;