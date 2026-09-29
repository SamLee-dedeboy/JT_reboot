[out:json][timeout:300];
(
  // Core exhibit area: every road class the online style shows up to street zooms.
  way[highway~"^(motorway|motorway_link|trunk|trunk_link|primary|secondary|tertiary)$"](37.2,-123.15,38.75,-120.75);
  node[place~"^(suburb|village)$"](37.2,-123.15,38.75,-120.75);
  nwr[natural=bay][name](37.2,-123.15,38.75,-120.75);
  // Shasta Dam and Redding, where the Calling on Reserves guide zooms in.
  way[highway~"^(motorway_link|trunk_link|secondary|tertiary)$"](40.3,-122.9,41.2,-121.8);
  node[place~"^(suburb|village)$"](40.3,-122.9,41.2,-121.8);
  // Wider context for tall kiosk overviews and the flight to Shasta: major roads,
  // towns, rivers, lakes, and the coast.
  way[highway~"^(motorway|trunk|primary)$"](36.8,-125.0,41.9,-119.8);
  node[place~"^(city|town)$"](36.8,-125.0,41.9,-119.8);
  way[waterway=river][name](36.8,-125.0,41.9,-119.8);
  wr[natural=water][water~"^(lake|reservoir)$"](36.8,-125.0,41.9,-119.8);
  way[natural=coastline](36.3,-125.0,41.9,-121.5);
);
out geom;
