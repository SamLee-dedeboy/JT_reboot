"""Snapshot the JT_dashboard FastAPI responses into static JSON for the site.

The co-design dashboard ships without a backend: every endpoint the Svelte
frontend used is a deterministic read over static data files, so this script
calls the original router functions once and writes their responses to
public/data/co-design/.

Usage (from the repo root):
    python3 scripts/co-design/snapshot_api.py /path/to/JT_dashboard/server
"""

import json
import os
import sys

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "public", "data", "co-design")


def write(name, data):
    path = os.path.join(OUT_DIR, name)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, separators=(",", ":"))
    print(f"{name}: {os.path.getsize(path) / 1024:.0f} KB")


def main(server_dir):
    sys.path.insert(0, os.path.abspath(server_dir))
    from routers import flow, linking, mental_model, sunburst
    import asyncio

    run = asyncio.run

    # Flow: GET /api/flow/data/
    write("flow/data.json", run(flow.get_data()))

    # Mental model: GET codebook, parent_tsne, interview, exhibition
    write("mental-model/codebook.json", mental_model.get_codebook())
    write("mental-model/parent-tsne.json", mental_model.get_codebook_parent_tsne())
    write("mental-model/interview.json", mental_model.get_interview_Mm())
    write("mental-model/exhibition.json", mental_model.get_exhibition_MM())

    # Sunburst: GET /data/ plus POST /code/ lookups, keyed by code name
    write("sunburst/data.json", run(sunburst.get_all_sunburst_data()))
    codes_path = os.path.join(server_dir, "sunburst_data", "sunburst", "all_codes.json")
    with open(codes_path, encoding="utf-8") as f:
        write("sunburst/codes.json", {code["name"]: code for code in json.load(f)})

    # Linking: GET /scenarios/ plus POST /scenarios/codes_manual/ for every scenario.
    write("linking/scenarios.json", linking.get_scenarios())
    with open(os.path.join(server_dir, "linking_data", "scenario_codes_manual.json"), encoding="utf-8") as f:
        scenario_names = list(json.load(f).keys())
    scenario_codes = {}
    original_filter = linking.filter_node_dict
    for name in scenario_names:
        # The router's filter_node_dict uses a mutable default dict, so repeated
        # requests leak nodes across scenarios. Pass a fresh dict per scenario.
        linking.filter_node_dict = lambda root, node_dict: original_filter(root, node_dict, {})
        scenario_codes[name] = linking.get_scenario_codes_manual(
            linking.ScenarioRequest(scenario=name)
        ).model_dump()
    linking.filter_node_dict = original_filter
    write("linking/scenario-codes.json", scenario_codes)

    # POST /codes/summarize/ — keep only summaries for codes reachable from a scenario.
    reachable = {
        node["name"] for response in scenario_codes.values() for node in response["participants"]
    }
    with open(os.path.join(server_dir, "linking_data", "code_summaries.json"), encoding="utf-8") as f:
        summaries = {item["name"]: item["summary"] for item in json.load(f) if item["name"] in reachable}
    write("linking/code-summaries.json", summaries)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    # The routers build several responses from Python sets, whose iteration
    # order (and so the JSON key order that drives the force layouts) changes
    # with the per-process hash seed. Pin it so snapshots are reproducible.
    if os.environ.get("PYTHONHASHSEED") != "0":
        os.execve(sys.executable, [sys.executable, *sys.argv], {**os.environ, "PYTHONHASHSEED": "0"})
    main(sys.argv[1])
