import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MatchCard from "./components/MatchCard";
import BookingForm from "./components/BookingForm";

function App() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  async function fetchMatches() {
    const { data, error } = await supabase
      .from("matches")
      .select("*")
      .order("id");

    if (error) {
      setError(error.message);
    } else {
      setMatches(data);
      setError("");
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchMatches();

    const channel = supabase
      .channel("matches-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "matches" },
        () => {
          fetchMatches();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  function handleBook(id) {
    setSelectedId(id);
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
  }

  const selectedMatch = matches.find((m) => m.id === selectedId) || null;

  return (
    <>
      <Navbar />
      <Hero />

      <section id="matches" className="section">
        <h2>IPL 2026 Match Schedule</h2>

        {loading && <p>Loading matches...</p>}
        {error && <p className="status error">Error: {error}</p>}

        <div className="match-grid">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} onBook={handleBook} />
          ))}
        </div>
      </section>

      <section id="booking" className="section">
        <h2>Book Your Tickets</h2>
        <BookingForm match={selectedMatch} onBooked={fetchMatches} />
      </section>
    </>
  );
}

export default App;