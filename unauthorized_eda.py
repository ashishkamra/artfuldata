import argparse
import json
from pathlib import Path
from typing import Dict, List, Tuple

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

DATASET_PATH = Path("Unauthorized Dataset_DHS_Modified.xlsx")
REGION_COLORS: Dict[str, str] = {
    "Africa": "#9467bd",
    "Asia": "#1f77b4",
    "Europe": "#8c564b",
    "North America": "#ff7f0e",
    "Oceania": "#17becf",
    "South America": "#2ca02c",
    "Unknown": "#7f7f7f",
    "Other/Unknown": "#7f7f7f",
}
COLOR_POSITIVE = "#b2182b"
COLOR_NEGATIVE = "#2166ac"
COLOR_NEUTRAL = "#bdbdbd"


def load_data(dataset_path: Path) -> Dict[str, pd.DataFrame]:
    if not dataset_path.exists():
        raise FileNotFoundError(f"Expected dataset at {dataset_path}")

    sheets = {
        "Unauth_Nationality": pd.read_excel(dataset_path, sheet_name="Unauth_Nationality"),
        "Country-Region(Tall)_2004-2022": pd.read_excel(
            dataset_path, sheet_name="Country-Region(Tall)_2004-2022"
        ),
    }
    return sheets


def normalize_nationality(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    if "Year" in df.columns:
        df["Year"] = pd.to_numeric(df["Year"], errors="coerce")
    elif "Year1" in df.columns:
        df["Year"] = pd.to_datetime(df["Year1"], errors="coerce").dt.year
    df.rename(columns={"Unauthorized Population": "Unauthorized_Population"}, inplace=True)
    df["Nationality"] = df["Nationality"].astype("string").str.strip()
    df = df.dropna(subset=["Year", "Nationality", "Unauthorized_Population"])
    df["Year"] = df["Year"].astype(int)
    df["Unauthorized_Population"] = pd.to_numeric(
        df["Unauthorized_Population"], errors="coerce"
    )
    df = df.dropna(subset=["Unauthorized_Population"])
    return df


def normalize_country_region(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df["Year"] = pd.to_numeric(df["Year"], errors="coerce")
    df.rename(columns={"Measure Type": "Measure_Type"}, inplace=True)
    df["Region"] = df["Region"].astype("string").str.strip()
    df["Country"] = df["Country"].astype("string").str.strip()
    df["Measure_Type"] = df["Measure_Type"].astype("string").str.strip()
    df = df.dropna(subset=["Year", "Region", "Country"])
    df["Year"] = df["Year"].astype(int)
    df["Value"] = pd.to_numeric(df["Value"], errors="coerce")
    return df


def build_region_lookup(region_df: pd.DataFrame) -> Dict[str, str]:
    if region_df.empty:
        return {}

    def choose_region(series: pd.Series) -> str:
        counts = series.value_counts()
        if not counts.empty:
            return counts.index[0]
        return series.dropna().iloc[0] if not series.dropna().empty else "Unknown"

    mapping = (
        region_df.dropna(subset=["Country", "Region"])
        .groupby("Country")["Region"]
        .apply(choose_region)
        .to_dict()
    )
    mapping["All other countries"] = "Other/Unknown"
    return mapping


def add_region_labels(nationality_df: pd.DataFrame, region_lookup: Dict[str, str]) -> pd.DataFrame:
    df = nationality_df.copy()
    df["Region"] = df["Nationality"].map(region_lookup).fillna("Other/Unknown")
    return df


def summarize_nationality(df: pd.DataFrame) -> None:
    year_range: Tuple[int, int] = (int(df["Year"].min()), int(df["Year"].max()))
    print("Unauth_Nationality:")
    print(f"  Records: {len(df):,}")
    print(f"  Year range: {year_range[0]} - {year_range[1]}")
    latest_year = year_range[1]
    latest_sample = (
        df[df["Year"] == latest_year]
        .sort_values("Unauthorized_Population", ascending=False)
        .head(10)
    )
    print(f"  Top nationalities in {latest_year}:")
    for row in latest_sample.itertuples():
        print(f"    {row.Nationality}: {int(row.Unauthorized_Population):,}")


def summarize_country_region(df: pd.DataFrame) -> None:
    year_range: Tuple[int, int] = (int(df["Year"].min()), int(df["Year"].max()))
    print("\nCountry-Region(Tall)_2004-2022:")
    print(f"  Records: {len(df):,}")
    print(f"  Year range: {year_range[0]} - {year_range[1]}")
    measure_counts = df["Measure_Type"].value_counts().to_dict()
    print("  Measure type counts:")
    for measure, count in measure_counts.items():
        label = measure if measure is not pd.NA else "(missing)"
        print(f"    {label}: {count:,}")


def plot_nationality_trends(df: pd.DataFrame, output_dir: Path) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    yearly_totals = df.groupby("Year")["Unauthorized_Population"].sum()

    plt.figure(figsize=(8, 4.5))
    yearly_totals.plot(marker="o")
    plt.title("Total Unauthorized Population by Year")
    plt.xlabel("Year")
    plt.ylabel("Population")
    plt.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig(output_dir / "unauthorized_population_trend.png", dpi=200)
    plt.close()

    latest_year = df["Year"].max()
    latest = (
        df[df["Year"] == latest_year]
        .sort_values("Unauthorized_Population", ascending=False)
        .head(10)
    )

    plt.figure(figsize=(9, 5))
    plt.barh(latest["Nationality"], latest["Unauthorized_Population"], color="#1f77b4")
    plt.title(f"Top 10 Nationalities by Unauthorized Population ({latest_year})")
    plt.xlabel("Population")
    plt.gca().invert_yaxis()
    plt.tight_layout()
    plt.savefig(output_dir / "unauthorized_top10_latest.png", dpi=200)
    plt.close()


def plot_country_region_trends(df: pd.DataFrame, output_dir: Path) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    region_totals = (
        df.groupby(["Year", "Region"])["Value"].sum().reset_index()
    )
    pivot = region_totals.pivot(index="Year", columns="Region", values="Value")

    plt.figure(figsize=(9, 5))
    pivot.plot(ax=plt.gca(), marker="o")
    plt.title("Enforcement Actions by Region")
    plt.xlabel("Year")
    plt.ylabel("Value")
    plt.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.savefig(output_dir / "country_region_enforcement_trends.png", dpi=200)
    plt.close()

    latest_year = df["Year"].max()
    latest = (
        df[df["Year"] == latest_year]
        .dropna(subset=["Value"])
        .groupby(["Region", "Measure_Type"])["Value"].sum().reset_index()
    )
    if not latest.empty:
        measures = sorted(latest["Measure_Type"].unique())
        regions = sorted(latest["Region"].unique())
        width = 0.8 / max(len(measures), 1)
        x_positions = list(range(len(regions)))

        plt.figure(figsize=(10, 5.5))
        for idx, measure in enumerate(measures):
            measure_values = latest[latest["Measure_Type"] == measure].set_index("Region")["Value"]
            offsets = [xi + (idx - (len(measures) - 1) / 2) * width for xi in x_positions]
            heights = [measure_values.get(region, 0) for region in regions]
            plt.bar(offsets, heights, width=width, label=measure)

        plt.title(f"Enforcement Actions by Region and Measure Type ({latest_year})")
        plt.xlabel("Region")
        plt.ylabel("Value")
        plt.xticks(range(len(regions)), regions, rotation=30, ha="right")
        plt.legend()
        plt.tight_layout()
        plt.savefig(output_dir / "country_region_latest_by_measure.png", dpi=200)
        plt.close()


def format_population(value: float) -> str:
    if pd.isna(value):
        return "N/A"
    if value >= 1_000_000:
        return f"{value / 1_000_000:.2f}M"
    if value >= 1_000:
        return f"{value / 1_000:.1f}K"
    return f"{value:.0f}"


def format_delta(value: float) -> str:
    if pd.isna(value):
        return "N/A"
    if value == 0:
        return "0"
    sign = "+" if value > 0 else "-"
    magnitude = abs(value)
    if magnitude >= 1_000_000:
        formatted = f"{magnitude / 1_000_000:.2f}M"
    elif magnitude >= 1_000:
        formatted = f"{magnitude / 1_000:.1f}K"
    else:
        formatted = f"{magnitude:.0f}"
    return f"{sign}{formatted}"


def arc_percent_change(previous: pd.Series, current: pd.Series) -> pd.Series:
    baseline = (previous.abs() + current.abs()) / 2
    pct_change = (current - previous) / baseline.replace(0, np.nan) * 100
    pct_change = pct_change.mask(previous.isna() | current.isna())
    pct_change = pct_change.mask((previous == 0) & (current == 0), 0.0)
    return pct_change


def _hex_to_rgb(hex_color: str) -> Tuple[int, int, int]:
    hex_color = hex_color.lstrip("#")
    return tuple(int(hex_color[i : i + 2], 16) for i in (0, 2, 4))


def _interpolate_color(start: str, end: str, t: float, alpha: float = 0.8) -> str:
    start_rgb = _hex_to_rgb(start)
    end_rgb = _hex_to_rgb(end)
    r = int(start_rgb[0] + (end_rgb[0] - start_rgb[0]) * t)
    g = int(start_rgb[1] + (end_rgb[1] - start_rgb[1]) * t)
    b = int(start_rgb[2] + (end_rgb[2] - start_rgb[2]) * t)
    return f"rgba({r}, {g}, {b}, {alpha})"


def gradient_color(pct_change: float, cap: float) -> str:
    if pd.isna(pct_change):
        return _interpolate_color(COLOR_NEUTRAL, COLOR_NEUTRAL, 0, alpha=0.4)
    clipped = max(-cap, min(cap, pct_change))
    if clipped > 0:
        ratio = clipped / cap
        return _interpolate_color(COLOR_NEUTRAL, COLOR_POSITIVE, ratio)
    if clipped < 0:
        ratio = abs(clipped) / cap
        return _interpolate_color(COLOR_NEUTRAL, COLOR_NEGATIVE, ratio)
    return _interpolate_color(COLOR_NEUTRAL, COLOR_NEUTRAL, 0, alpha=0.5)


def build_sankey_payload(nationality_df: pd.DataFrame) -> Dict[str, List[Dict]]:
    years = sorted(nationality_df["Year"].unique())
    min_year, max_year = int(min(years)), int(max(years))
    countries = (
        nationality_df[["Region", "Nationality"]]
        .drop_duplicates()
        .sort_values(["Region", "Nationality"])
        .reset_index(drop=True)
    )
    country_rank = {
        row.Nationality: idx for idx, row in enumerate(countries.itertuples(index=False))
    }
    total_countries = max(len(country_rank), 1)
    year_positions = {
        year: (idx / (len(years) - 1)) if len(years) > 1 else 0.5
        for idx, year in enumerate(years)
    }

    df = nationality_df.sort_values(["Nationality", "Year"]).copy()
    df["Prev_Year"] = df.groupby("Nationality")["Year"].shift(1)
    df["Prev_Pop"] = df.groupby("Nationality")["Unauthorized_Population"].shift(1)
    df["Pct_Change"] = arc_percent_change(df["Prev_Pop"], df["Unauthorized_Population"])
    df["Delta"] = df["Unauthorized_Population"] - df["Prev_Pop"]
    df["Pct_Change"] = df["Pct_Change"].replace([np.inf, -np.inf], np.nan)

    pct_abs = df["Pct_Change"].abs()
    pct_cap = float(np.nanpercentile(pct_abs.dropna(), 95)) if pct_abs.dropna().size else 100.0
    pct_cap = max(pct_cap, 50.0)
    effective_pct = pct_abs.clip(upper=pct_cap).fillna(0.0)
    base_span = 0.6
    offset_scale = 0.25 / pct_cap if pct_cap > 0 else 0.0

    nodes = []
    links = []
    node_keys = set()

    for row in df.itertuples():
        key = f"{row.Nationality}|{row.Year}"
        if key not in node_keys:
            node_keys.add(key)
            pct_change = row.Pct_Change if not pd.isna(row.Pct_Change) else 0.0
            effective = effective_pct.loc[row.Index] if row.Index in effective_pct.index else 0.0
            offset = effective * offset_scale
            base_x = 0.05 + year_positions[row.Year] * base_span
            x_position = float(min(0.95, base_x + offset))
            country_position = country_rank.get(row.Nationality, 0)
            y_position = float((country_position + 0.5) / total_countries)
            region = row.Region if row.Region in REGION_COLORS else "Other/Unknown"
            is_baseline = int(row.Year) == min_year
            absolute_display = format_population(row.Unauthorized_Population)
            delta_display = "Baseline" if is_baseline else format_delta(row.Delta)
            pct_display = "—" if is_baseline or pd.isna(row.Pct_Change) else f"{row.Pct_Change:+.1f}%"
            nodes.append(
                {
                    "key": key,
                    "country": row.Nationality,
                    "region": region,
                    "year": int(row.Year),
                    "population": float(row.Unauthorized_Population),
                    "population_display": format_population(row.Unauthorized_Population),
                    "delta_display": delta_display,
                    "pct_display": pct_display,
                    "label": row.Nationality if is_baseline else " ",
                    "x": x_position,
                    "y": y_position,
                    "color": REGION_COLORS.get(region, "#7f7f7f"),
                }
            )

        if not pd.isna(row.Prev_Year) and not pd.isna(row.Pct_Change):
            source_key = f"{row.Nationality}|{int(row.Prev_Year)}"
            target_key = key
            pct_change = float(row.Pct_Change)
            links.append(
                {
                    "source": source_key,
                    "target": target_key,
                    "value": 1.0,
                    "color": gradient_color(pct_change, pct_cap),
                    "pct_change": pct_change,
                    "year_start": int(row.Prev_Year),
                    "year_end": int(row.Year),
                    "region": row.Region,
                    "country": row.Nationality,
                    "population_start": float(row.Prev_Pop) if not pd.isna(row.Prev_Pop) else np.nan,
                    "population_end": float(row.Unauthorized_Population),
                    "population_start_display": format_population(row.Prev_Pop),
                    "population_end_display": format_population(row.Unauthorized_Population),
                    "delta_display": format_delta(row.Delta),
                }
            )

    sankey_payload = {
        "nodes": nodes,
        "links": links,
        "meta": {
            "regions": sorted({node["region"] for node in nodes}),
            "year_bounds": [min_year, max_year],
            "color_scale": {
                "positive": COLOR_POSITIVE,
                "negative": COLOR_NEGATIVE,
                "neutral": COLOR_NEUTRAL,
            },
            "region_colors": REGION_COLORS,
            "title": "Unauthorized Immigration Flow toward the United States",
            "pct_cap": pct_cap,
        },
    }
    return sankey_payload


def export_sankey_html(payload: Dict, output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    embedded_data = json.dumps(payload, ensure_ascii=False)
    html_template = f"""<!DOCTYPE html>
<html lang=\"en\">
<head>
  <meta charset=\"utf-8\" />
  <title>{payload['meta']['title']}</title>
  <script src=\"https://cdn.plot.ly/plotly-2.32.0.min.js\"></script>
  <style>
    body {{ font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 1.5rem; background: #f7f7f7; color: #222; }}
    h1 {{ margin-top: 0; font-size: 1.8rem; }}
    .container {{ max-width: 1200px; margin: 0 auto; }}
    .controls {{ display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem; padding: 1rem; background: #fff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.12); }}
    .control-block {{ flex: 1 1 200px; min-width: 180px; }}
    .control-block label {{ display: block; font-weight: 600; margin-bottom: 0.3rem; }}
    .checkbox-grid {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 0.25rem 1rem; }}
    .story {{ background: #fff; padding: 1rem; margin-bottom: 1rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.12); }}
    #chart {{ height: 600px; background: #fff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.12); padding: 0.5rem; }}
    .metadata {{ font-size: 0.85rem; color: #555; margin-top: 0.75rem; }}
    .badge {{ display: inline-block; padding: 0.2rem 0.5rem; border-radius: 999px; font-size: 0.75rem; margin-right: 0.5rem; }}
  </style>
</head>
<body>
  <div class=\"container\">
    <h1>{payload['meta']['title']}</h1>
    <section class=\"story\">
      <p>This Sankey diagram shows how the estimated unauthorized population from each country evolves relative to the prior year. Year 2000 anchors the absolute counts, while subsequent nodes capture annual deltas. Link length reflects the magnitude of change and color runs from deep red (largest increases) through neutral gray to deep blue (largest decreases). Use the filters to isolate regions or focus on specific periods.</p>
      <div class=\"metadata\">
        <span class=\"badge\" style=\"background:{COLOR_POSITIVE};color:#fff;\">Increase</span>
        <span class=\"badge\" style=\"background:{COLOR_NEUTRAL};color:#fff;\">Minimal change</span>
        <span class=\"badge\" style=\"background:{COLOR_NEGATIVE};color:#fff;\">Decrease</span>
      </div>
    </section>
    <div class=\"controls\">
      <div class=\"control-block\">
        <label>Regions</label>
        <div class=\"checkbox-grid\" id=\"regionControls\"></div>
      </div>
      <div class=\"control-block\">
        <label>Year Range</label>
        <div>
          <input type=\"number\" id=\"yearMin\" step=\"1\" />
          <span>to</span>
          <input type=\"number\" id=\"yearMax\" step=\"1\" />
        </div>
      </div>
    </div>
    <div id=\"chart\"></div>
  </div>
  <script id=\"sankey-data\" type=\"application/json\">{embedded_data}</script>
  <script>
    const payload = JSON.parse(document.getElementById('sankey-data').textContent);
    const regions = payload.meta.regions;
    const yearBounds = payload.meta.year_bounds;
    const regionColors = payload.meta.region_colors;

    const regionContainer = document.getElementById('regionControls');
    regions.forEach(region => {{
      const wrapper = document.createElement('label');
      wrapper.style.display = 'flex';
      wrapper.style.alignItems = 'center';
      wrapper.style.gap = '0.35rem';
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = region;
      checkbox.checked = true;
      const swatch = document.createElement('span');
      swatch.style.display = 'inline-block';
      swatch.style.width = '12px';
      swatch.style.height = '12px';
      swatch.style.borderRadius = '2px';
      swatch.style.backgroundColor = regionColors[region] || '#7f7f7f';
      const text = document.createElement('span');
      text.textContent = region;
      wrapper.appendChild(checkbox);
      wrapper.appendChild(swatch);
      wrapper.appendChild(text);
      regionContainer.appendChild(wrapper);
    }});

    const yearMinInput = document.getElementById('yearMin');
    const yearMaxInput = document.getElementById('yearMax');
    yearMinInput.min = yearBounds[0];
    yearMinInput.max = yearBounds[1];
    yearMaxInput.min = yearBounds[0];
    yearMaxInput.max = yearBounds[1];
    yearMinInput.value = yearBounds[0];
    yearMaxInput.value = yearBounds[1];

    function getSelectedRegions() {{
      return Array.from(regionContainer.querySelectorAll('input:checked')).map(cb => cb.value);
    }}

    function filterData() {{
      const selectedRegions = new Set(getSelectedRegions());
      const minYear = parseInt(yearMinInput.value, 10);
      const maxYear = parseInt(yearMaxInput.value, 10);

      const nodes = payload.nodes.filter(node => (
        selectedRegions.has(node.region) && node.year >= minYear && node.year <= maxYear
      ))
      .sort((a, b) => (a.year - b.year) || a.country.localeCompare(b.country));

      const nodeIndex = new Map();
      nodes.forEach((node, idx) => nodeIndex.set(node.key, idx));

      const links = payload.links.filter(link => (
        selectedRegions.has(link.region) &&
        link.year_start >= minYear && link.year_end <= maxYear &&
        nodeIndex.has(link.source) && nodeIndex.has(link.target)
      ));

      return {{ nodes, links, nodeIndex }};
    }}

    function render() {{
      const {{ nodes, links, nodeIndex }} = filterData();
      const nodeLabels = nodes.map(node => node.label);
      const nodeColors = nodes.map(node => node.color || '#7f7f7f');
      const nodeX = nodes.map(node => node.x);
      const nodeY = nodes.map(node => node.y);
      const nodeCustom = nodes.map(node => [
        node.country,
        node.region,
        node.year,
        node.population_display,
        node.delta_display,
        node.pct_display
      ]);

      const linkSources = links.map(link => nodeIndex.get(link.source));
      const linkTargets = links.map(link => nodeIndex.get(link.target));
      const linkValues = links.map(link => link.value);
      const linkColors = links.map(link => link.color);
      const linkCustom = links.map(link => [
        link.country,
        link.year_start,
        link.year_end,
        link.delta_display,
        link.population_start_display,
        link.population_end_display,
        link.pct_change
      ]);

      const sankeyData = {{
        type: 'sankey',
        orientation: 'h',
        arrangement: 'snap',
        node: {{
          pad: 12,
          thickness: 20,
          label: nodeLabels,
          color: nodeColors,
          x: nodeX,
          y: nodeY,
          customdata: nodeCustom,
          hovertemplate:
            '<b>%{{customdata[0]}}</b>' +
            '<br>Region: %{{customdata[1]}}' +
            '<br>Year: %{{customdata[2]}}' +
            '<br>Total: %{{customdata[3]}}' +
            '<br>Change vs prior: %{{customdata[4]}}' +
            '<br>Percent change: %{{customdata[5]}}' +
            '<extra></extra>'
        }},
        link: {{
          source: linkSources,
          target: linkTargets,
          value: linkValues,
          color: linkColors,
          customdata: linkCustom,
          hovertemplate:
            '<b>%{{customdata[0]}}</b>' +
            '<br>%{{customdata[1]}} → %{{customdata[2]}}' +
            '<br>Δ Population: %{{customdata[4]}} → %{{customdata[5]}}' +
            '<br>Change: %{{customdata[3]}}' +
            '<br>Δ %: %{{customdata[6]:+.1f}}%' +
            '<extra></extra>'
        }}
      }};

      const layout = {{
        font: {{ size: 12 }},
        margin: {{ t: 20, l: 10, r: 10, b: 10 }},
        paper_bgcolor: '#fff',
        plot_bgcolor: '#fff'
      }};

      Plotly.react('chart', [sankeyData], layout, {{ responsive: true }});
    }}

    regionContainer.addEventListener('change', render);
    yearMinInput.addEventListener('change', () => {{
      if (parseInt(yearMinInput.value, 10) > parseInt(yearMaxInput.value, 10)) {{
        yearMaxInput.value = yearMinInput.value;
      }}
      render();
    }});
    yearMaxInput.addEventListener('change', () => {{
      if (parseInt(yearMaxInput.value, 10) < parseInt(yearMinInput.value, 10)) {{
        yearMinInput.value = yearMaxInput.value;
      }}
      render();
    }});

    render();
  </script>
</body>
</html>"""

    output_path.write_text(html_template, encoding="utf-8")


def run_eda(dataset_path: Path, output_dir: Path, sankey_html: Path) -> None:
    sheets = load_data(dataset_path)
    nationality_df = normalize_nationality(sheets["Unauth_Nationality"])
    country_region_df = normalize_country_region(sheets["Country-Region(Tall)_2004-2022"])
    nationality_df = add_region_labels(
        nationality_df, build_region_lookup(country_region_df)
    )

    summarize_nationality(nationality_df)
    summarize_country_region(country_region_df)

    plot_nationality_trends(nationality_df, output_dir)
    plot_country_region_trends(country_region_df, output_dir)

    sankey_payload = build_sankey_payload(nationality_df)
    export_sankey_html(sankey_payload, sankey_html)
    print(f"\nInteractive Sankey saved to {sankey_html}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Basic EDA and Sankey story for unauthorized migration dataset")
    parser.add_argument(
        "--dataset",
        type=Path,
        default=DATASET_PATH,
        help="Path to the Excel dataset (default: Unauthorized Dataset_DHS_Modified.xlsx)",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("plots"),
        help="Directory where static plots will be saved (default: plots/)",
    )
    parser.add_argument(
        "--sankey-html",
        type=Path,
        default=Path("plots/unauthorized_sankey.html"),
        help="Path where the interactive Sankey HTML will be written",
    )
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    run_eda(args.dataset, args.output, args.sankey_html)
