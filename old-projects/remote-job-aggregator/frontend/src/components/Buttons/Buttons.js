import React from "react";
import "./Buttons.css";

function Buttons({ prev, next, prevPage, nextPage, maxRange }) {
  return (
    <div id="navigation">
      {prevPage > 0 ? (
        <button className="prev" onClick={prev}>
          ‹
        </button>
      ) : (
        <button disabled className="prev">
          ‹
        </button>
      )}

      {nextPage <= maxRange ? (
        <button className="next" onClick={next}>
          ›
        </button>
      ) : (
        <button disabled className="next">
          ›
        </button>
      )}
    </div>
  );
}

export default Buttons;
