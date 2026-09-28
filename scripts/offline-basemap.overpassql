[out:json][timeout:300];
(
  // Core exhibit area: every road class the online style shows up to street zooms.
  way[highway~"^(motorway|motorway_link|trunk|trunk_link|primary|secondary|tertiary)$"](37.2,-123.15,38.75,-120.75);
  node[place~"^(suburb|village)$"](37.2,-123.15,38.75,-120.75);
  nwr[natural=bay][name](37.2,-123.15,38.75,-120.75);
  // Wider context for tall kiosk overviews: major roads, towns, rivers, lakes, coast.
  way[highway~"^(motorway|trunk|primary)$"](36.8,-123.7,39.2,-120.3);
  node[place~"^(city|town)$"](36.8,-123.7,39.2,-120.3);
  way[waterway=river][name](36.8,-123.7,39.2,-120.3);
  wr[natural=water][water~"^(lake|reservoir)$"](36.8,-123.7,39.2,-120.3);
  way[natural=coastline](36.3,-124.0,39.2,-121.5);
);
out geom;
