import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MatchCard from "./components/MatchCard";
import { matches } from "./data/matches";

function App() {
  const [selectedMatch, setSelectedMatch] = useState(null);

  return (
    <>
      <Navbar />
      <Hero />

      <section id="matches" className="section">
        <h2>IPL 2026 Match Schedule</h2>

        {selectedMatch && (
          <p className="selected">Selected match: {selectedMatch.teams}</p>
        )}

        <div className="match-grid">
          {matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              onBook={setSelectedMatch}
            />
          ))}
        </div>
      </section>
    </>
  );
}

export default App;