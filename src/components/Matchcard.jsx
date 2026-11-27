function MatchCard({ match, onBook }) {
  const soldOut = match.available_seats <= 0;

  return (
    <article className="match-card">
      <h3>{match.teams}</h3>
      <p>{match.match_date}</p>
      <p>{match.venue}</p>
      <p className="prices">
        General ₹{match.general_price.toLocaleString("en-IN")} | Premium ₹
        {match.premium_price.toLocaleString("en-IN")} | VIP ₹
        {match.vip_price.toLocaleString("en-IN")}
      </p>
      <p className="seats">Seats left: {match.available_seats}</p>
      <button onClick={() => onBook(match.id)} disabled={soldOut}>
        {soldOut ? "Sold out" : "Book"}
      </button>
    </article>
  );
}

export default MatchCard;