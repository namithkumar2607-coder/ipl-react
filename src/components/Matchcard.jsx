function MatchCard({ match, onBook }) {
  return (
    <article className="match-card">
      <h3>{match.teams}</h3>
      <p>{match.date}</p>
      <p>{match.venue}</p>
      <p className="prices">
        General ₹{match.prices.general.toLocaleString("en-IN")} | Premium ₹
        {match.prices.premium.toLocaleString("en-IN")} | VIP ₹
        {match.prices.vip.toLocaleString("en-IN")}
      </p>
      <button onClick={() => onBook(match)}>Book</button>
    </article>
  );
}

export default MatchCard;